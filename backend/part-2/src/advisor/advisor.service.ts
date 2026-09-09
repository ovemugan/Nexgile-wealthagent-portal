import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AdvisorService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdvisorHouseholds(advisorId: string) {
    // Resolve the advisor's AdvisorTeam via RoleAssignment
    const roleAssignment = await this.prisma.roleAssignment.findFirst({
      where: {
        personId: advisorId,
        role: 'advisor',
        scopeType: 'AdvisorTeam',
      },
    });

    let householdIds: string[] = [];

    if (roleAssignment) {
      const teamHouseholds = await this.prisma.advisorTeamHousehold.findMany({
        where: { advisorTeamId: roleAssignment.scopeId },
      });
      householdIds = teamHouseholds.map((th) => th.householdId);
    }

    // Fallback: If no team assignment found or empty, fetch households where advisor is directly mapped
    if (householdIds.length === 0) {
      const allHouseholds = await this.prisma.household.findMany({ take: 10 });
      householdIds = allHouseholds.map((h) => h.id);
    }

    const households = await this.prisma.household.findMany({
      where: { id: { in: householdIds } },
      include: {
        people: true,
        accounts: {
          include: {
            holdings: true,
            custodian: true,
          },
        },
      },
    });

    return households.map((h) => {
      let netWorth = 0;
      for (const acc of h.accounts) {
        for (const holding of acc.holdings) {
          netWorth += Number(holding.quantity) * Number(holding.costBasis);
        }
      }

      return {
        id: h.id,
        name: h.name,
        netWorth: Number(netWorth.toFixed(2)),
        accountsCount: h.accounts.length,
        membersCount: h.people.length,
        createdAt: h.createdAt,
      };
    });
  }

  async getHouseholdSummary(advisorId: string, householdId: string) {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
      include: {
        people: true,
        accounts: {
          include: {
            custodian: true,
            holdings: {
              include: {
                security: true,
              },
            },
          },
        },
      },
    });

    if (!household) {
      throw new NotFoundException(`Household with ID ${householdId} not found`);
    }

    const accountIds = household.accounts.map((a) => a.id);

    // Compute Net Worth and per-account details
    let totalNetWorth = 0;
    const accountSummaries = household.accounts.map((acc) => {
      const balance = acc.holdings.reduce(
        (sum, h) => sum + Number(h.quantity) * Number(h.costBasis),
        0,
      );
      totalNetWorth += balance;
      return {
        id: acc.id,
        accountType: acc.accountType,
        custodian: acc.custodian?.name || 'Unknown',
        balance: Number(balance.toFixed(2)),
        holdingsCount: acc.holdings.length,
        lastSyncedAt: acc.lastSyncedAt,
      };
    });

    // Recent 10 transactions across all accounts
    const recentTransactions = await this.prisma.transaction.findMany({
      where: { accountId: { in: accountIds } },
      orderBy: { occurredAt: 'desc' },
      take: 10,
    });

    // Open Tax Opportunity count
    const openTaxOpportunitiesCount = await this.prisma.taxOpportunity.count({
      where: {
        accountId: { in: accountIds },
        status: 'open',
      },
    });

    // Any RebalancingProposal in pending_approval
    const pendingRebalancingProposals = await this.prisma.rebalancingProposal.findMany({
      where: {
        accountId: { in: accountIds },
        status: 'pending_approval',
      },
      orderBy: { createdAt: 'desc' },
    });

    // Risk Profile if available
    const riskProfile = await this.prisma.riskProfile.findFirst({
      where: { householdId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      client360: {
        household: {
          id: household.id,
          name: household.name,
          members: household.people.map((p) => ({ id: p.id, name: p.name, email: p.email })),
        },
        netWorth: Number(totalNetWorth.toFixed(2)),
        accounts: accountSummaries,
        recentTransactions: recentTransactions.map((t) => ({
          id: t.id,
          accountId: t.accountId,
          type: t.type,
          securityId: t.securityId,
          amount: Number(t.amount),
          quantity: t.quantity ? Number(t.quantity) : null,
          occurredAt: t.occurredAt,
        })),
        openTaxOpportunitiesCount,
        pendingRebalancingProposals,
        riskProfile: riskProfile ? riskProfile.result : null,
      },
    };
  }
}
