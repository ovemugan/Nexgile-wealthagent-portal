import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../common/audit.service';

export interface CreateApprovalInput {
  entityType: 'RebalancingProposal' | 'TaxOpportunity' | string;
  entityId: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

@Injectable()
export class ApprovalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createApproval(input: CreateApprovalInput) {
    const approval = await this.prisma.approval.create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        approverId: input.approverId,
        status: input.status,
        notes: input.notes,
      },
    });

    // Cascade status update to the underlying entity if relevant
    if (input.entityType === 'RebalancingProposal') {
      const proposal = await this.prisma.rebalancingProposal.findUnique({
        where: { id: input.entityId },
      });
      if (proposal) {
        await this.prisma.rebalancingProposal.update({
          where: { id: input.entityId },
          data: { status: input.status },
        });
      }
    } else if (input.entityType === 'TaxOpportunity') {
      const opp = await this.prisma.taxOpportunity.findUnique({
        where: { id: input.entityId },
      });
      if (opp) {
        await this.prisma.taxOpportunity.update({
          where: { id: input.entityId },
          data: { status: input.status === 'approved' ? 'actioned' : input.status },
        });
      }
    }

    // Write audit event
    await this.audit.log({
      actorId: input.approverId,
      entityType: input.entityType,
      entityId: input.entityId,
      action: `approval_${input.status}`,
      before: undefined,
      after: { approvalId: approval.id, status: input.status, notes: input.notes },
    });

    return approval;
  }

  async getApprovals(entityType?: string, status?: string) {
    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (status) where.status = status;

    return this.prisma.approval.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
