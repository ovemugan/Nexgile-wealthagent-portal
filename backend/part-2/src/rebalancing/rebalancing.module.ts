import { Module } from '@nestjs/common';
import { RebalancingController } from './rebalancing.controller';
import { RebalancingService } from './rebalancing.service';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../common/audit.service';

@Module({
  controllers: [RebalancingController],
  providers: [RebalancingService, PrismaService, AuditService],
  exports: [RebalancingService],
})
export class RebalancingModule {}
