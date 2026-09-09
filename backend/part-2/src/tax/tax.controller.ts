import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TaxService } from './tax.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthUser, RequireRole } from '../auth/decorators';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Tax & Estate Tools')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get('accounts/:id/tax-opportunities')
  @RequireRole('advisor', 'owner')
  @ApiOperation({ summary: 'Scan account tax lots for loss harvesting and wash-sale violations' })
  @ApiQuery({ name: 'minLossAmount', required: false, type: Number })
  @ApiQuery({ name: 'minLossPercent', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'CalculationResult containing tax-loss harvesting candidates' })
  async getTaxOpportunities(
    @Param('id') accountId: string,
    @Query('minLossAmount') minLossAmount?: string,
    @Query('minLossPercent') minLossPercent?: string,
  ) {
    const minLoss = minLossAmount ? Number(minLossAmount) : 500;
    const minPct = minLossPercent ? Number(minLossPercent) : 5;
    return this.taxService.scanTaxOpportunities(accountId, minLoss, minPct);
  }

  @Post('tax-opportunities/:id/action')
  @RequireRole('advisor')
  @ApiOperation({ summary: 'Mark tax opportunity as actioned and record in audit trail' })
  @ApiResponse({ status: 200, description: 'Tax opportunity status changed to actioned' })
  async actionTaxOpportunity(
    @Param('id') opportunityId: string,
    @CurrentUser() user: AuthUser,
  ) {
    const actorId = user?.sub || 'advisor-system';
    return this.taxService.actionOpportunity(opportunityId, actorId);
  }
}
