import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdvisorModule } from './advisor/advisor.module';
import { RiskModule } from './risk/risk.module';
import { MonteCarloModule } from './monte-carlo/monte-carlo.module';
import { RebalancingModule } from './rebalancing/rebalancing.module';
import { TaxModule } from './tax/tax.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { ReportingModule } from './reporting/reporting.module';
import { PlansModule } from './plans/plans.module';
import { PrismaService } from './common/prisma.service';
import { AuditService } from './common/audit.service';

@Module({
  imports: [
    AuthModule,
    AdvisorModule,
    RiskModule,
    MonteCarloModule,
    RebalancingModule,
    TaxModule,
    ApprovalsModule,
    ReportingModule,
    PlansModule,
  ],
  providers: [PrismaService, AuditService],
  exports: [PrismaService, AuditService],
})
export class AppModule {}
