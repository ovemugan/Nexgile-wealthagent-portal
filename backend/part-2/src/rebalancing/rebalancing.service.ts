import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../common/audit.service';
import { CalculationResult } from '../common/calculation-result.interface';

export interface AssetAllocation {
  equity: number;
  bond: number;
  cash: number;
  alternative: number;
}

export interface ProposedTrade {
  securityId: string;
  ticker: string;
  name: string;
  assetClass: string;
  action: 'buy' | 'sell';
  quantity: number;
  estimatedAmount: number;
}

export interface RebalanceProposalData {
  proposalId: string;
  accountId: string;
  totalValue: number;
  currentAllocation: AssetAllocation;
  targetAllocation: AssetAllocation;
  drift: AssetAllocation;
  proposedTrades: ProposedTrade[];
  status: string;
}

@Injectable()
export class RebalancingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async generateProposal(accountId: string): Promise<CalculationResult<RebalanceProposalData>> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        household: true,
        holdings: {
          include: {
            security: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found`);
    }

    // Determine target allocation from household's latest risk profile
    let targetAllocation: AssetAllocation = { equity: 60, bond: 30, cash: 5, alternative: 5 };

    const latestProfile = await this.prisma.riskProfile.findFirst({
      where: { householdId: account.householdId },
      orderBy: { createdAt: 'desc' },
    });

    if (latestProfile?.result) {
      const riskVal = (latestProfile.result as any).value;
      if (riskVal?.targetAllocation) {
        targetAllocation = riskVal.targetAllocation;
      }
    }

    // Compute current allocation by asset class
    let totalValue = 0;
    const classValues: Record<string, number> = {
      equity: 0,
      bond: 0,
      cash: 0,
      alternative: 0,
    };

    const holdingsByClass: Record<string, typeof account.holdings> = {
      equity: [],
      bond: [],
      cash: [],
      alternative: [],
    };

    for (const h of account.holdings) {
      const assetClass = (h.security.assetClass || 'equity').toLowerCase();
      const val = Number(h.quantity) * Number(h.costBasis);
      totalValue += val;
      if (classValues[assetClass] !== undefined) {
        classValues[assetClass] += val;
        holdingsByClass[assetClass].push(h);
      } else {
        classValues.equity += val;
        holdingsByClass.equity.push(h);
      }
    }

    if (totalValue === 0) totalValue = 1; // avoid division by zero

    const currentAllocation: AssetAllocation = {
      equity: Number(((classValues.equity / totalValue) * 100).toFixed(1)),
      bond: Number(((classValues.bond / totalValue) * 100).toFixed(1)),
      cash: Number(((classValues.cash / totalValue) * 100).toFixed(1)),
      alternative: Number(((classValues.alternative / totalValue) * 100).toFixed(1)),
    };

    const drift: AssetAllocation = {
      equity: Number((currentAllocation.equity - targetAllocation.equity).toFixed(1)),
      bond: Number((currentAllocation.bond - targetAllocation.bond).toFixed(1)),
      cash: Number((currentAllocation.cash - targetAllocation.cash).toFixed(1)),
      alternative: Number((currentAllocation.alternative - targetAllocation.alternative).toFixed(1)),
    };

    // Generate specific buy/sell trade list to close drift gaps
    const proposedTrades: ProposedTrade[] = [];

    for (const assetClass of ['equity', 'bond', 'cash', 'alternative'] as const) {
      const classDrift = drift[assetClass];
      // If drift is significant (> 1% or < -1%)
      if (Math.abs(classDrift) >= 1.0) {
        const action: 'buy' | 'sell' = classDrift > 0 ? 'sell' : 'buy';
        const tradeAmount = Math.abs(classDrift / 100) * totalValue;

        // Pick security to trade
        let candidateHolding = holdingsByClass[assetClass][0];
        let securityId = candidateHolding?.securityId;
        let ticker = candidateHolding?.security.ticker;
        let name = candidateHolding?.security.name;
        let unitPrice = candidateHolding ? Number(candidateHolding.costBasis) : 100;

        if (!candidateHolding) {
          // Find any security of this class
          const fallbackSec = await this.prisma.security.findFirst({
            where: { assetClass },
          });
          if (fallbackSec) {
            securityId = fallbackSec.id;
            ticker = fallbackSec.ticker;
            name = fallbackSec.name;
            unitPrice = 100;
          }
        }

        if (securityId && ticker) {
          const quantity = Math.max(1, Math.round(tradeAmount / (unitPrice || 100)));
          proposedTrades.push({
            securityId,
            ticker,
            name: name || ticker,
            assetClass,
            action,
            quantity,
            estimatedAmount: Number((quantity * unitPrice).toFixed(2)),
          });
        }
      }
    }

    // Save as RebalancingProposal with status: "draft"
    const proposal = await this.prisma.rebalancingProposal.create({
      data: {
        accountId,
        currentAllocation: currentAllocation as any,
        targetAllocation: targetAllocation as any,
        proposedTrades: proposedTrades as any,
        status: 'draft',
      },
    });

    const proposalData: RebalanceProposalData = {
      proposalId: proposal.id,
      accountId,
      totalValue: Number(totalValue.toFixed(2)),
      currentAllocation,
      targetAllocation,
      drift,
      proposedTrades,
      status: 'draft',
    };

    return {
      value: proposalData,
      asOf: new Date().toISOString().split('T')[0],
      method: 'mean_variance_target_drift_v1',
      assumptions: {
        rebalanceBandThreshold: 1.0, // 1% drift tolerance band
        pricingBasis: 'latest_cost_basis',
      },
      limitations: [
        'Trades are modeled proposals and do not account for market impact or bid/ask spread',
        'Tax consequences of realized capital gains are evaluated separately in Tax module',
      ],
      computedAt: new Date().toISOString(),
    };
  }

  async approveProposal(proposalId: string, approverId: string, notes?: string) {
    const proposal = await this.prisma.rebalancingProposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw new NotFoundException(`Rebalancing proposal ${proposalId} not found`);
    }

    // Update status to "approved"
    const updatedProposal = await this.prisma.rebalancingProposal.update({
      where: { id: proposalId },
      data: { status: 'approved' },
    });

    // Create an Approval row
    const approval = await this.prisma.approval.create({
      data: {
        entityType: 'RebalancingProposal',
        entityId: proposalId,
        approverId,
        status: 'approved',
        notes: notes || 'Proposal approved by advisor',
      },
    });

    // Write an AuditEvent row
    await this.audit.log({
      actorId: approverId,
      entityType: 'RebalancingProposal',
      entityId: proposalId,
      action: 'approve',
      before: { status: proposal.status },
      after: { status: 'approved' },
    });

    return {
      success: true,
      proposal: updatedProposal,
      approval,
      message: 'Rebalancing proposal successfully approved. Trades are queued for execution.',
    };
  }
}
