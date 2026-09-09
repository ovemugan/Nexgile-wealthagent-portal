import { Module } from '@nestjs/common';
import { ApprovalsController } from './approvals.controller';
import { ApprovalsService } from './approvals.service';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../common/audit.service';

@Module({
  controllers: [ApprovalsController],
  providers: [ApprovalsService, PrismaService, AuditService],
  exports: [ApprovalsService],
})
export class ApprovalsModule {}
