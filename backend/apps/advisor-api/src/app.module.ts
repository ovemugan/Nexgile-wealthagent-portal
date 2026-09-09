import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard, RolesGuard } from '@nexgile/auth';
import { AdvisorModule } from './advisor/advisor.module';
import { RiskModule } from './risk/risk.module';
import { MonteCarloModule } from './monte-carlo/monte-carlo.module';
import { RebalancingModule } from './rebalancing/rebalancing.module';
import { TaxModule } from './tax/tax.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { ReportingModule } from './reporting/reporting.module';
import { PlansModule } from './plans/plans.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/prisma.service';
import { AuditService } from './common/audit.service';

@Module({
  imports: [
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET || 'development-only-secret', signOptions: { expiresIn: '8h' } }),
    AdvisorModule,
    RiskModule,
    MonteCarloModule,
    RebalancingModule,
    TaxModule,
    ApprovalsModule,
    ReportingModule,
    PlansModule,
    AuthModule,
  ],
  providers: [PrismaService, AuditService, JwtAuthGuard, RolesGuard],
  exports: [PrismaService, AuditService],
})
export class AppModule {}
