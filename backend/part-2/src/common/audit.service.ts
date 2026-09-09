import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    actorId: string;
    entityType: string;
    entityId: string;
    action: string;
    before?: any;
    after?: any;
  }) {
    return this.prisma.auditEvent.create({
      data: {
        actorId: params.actorId,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        before: params.before ? (params.before as any) : undefined,
        after: params.after ? (params.after as any) : undefined,
      },
    });
  }
}
