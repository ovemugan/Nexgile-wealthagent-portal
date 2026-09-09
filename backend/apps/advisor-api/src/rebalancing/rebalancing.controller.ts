import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RebalancingService } from './rebalancing.service';
import { JwtAuthGuard, CurrentUser, AuthUser, RequireRole, RolesGuard } from '@nexgile/auth';

export class ApproveProposalDto {
  notes?: string;
}

@ApiTags('Portfolio Rebalancing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class RebalancingController {
  constructor(private readonly rebalancingService: RebalancingService) {}

  @Get('accounts/:id/rebalancing-proposal')
  @RequireRole('advisor', 'owner')
  @ApiOperation({ summary: 'Generate rebalancing proposal comparing current vs target allocation' })
  @ApiResponse({ status: 200, description: 'CalculationResult containing proposal and proposed trade list' })
  async getRebalancingProposal(@Param('id') accountId: string) {
    return this.rebalancingService.generateProposal(accountId);
  }

  @Post('rebalancing-proposals/:id/approve')
  @RequireRole('advisor')
  @ApiOperation({ summary: 'Approve rebalancing proposal and write to audit trail' })
  @ApiResponse({ status: 200, description: 'Proposal marked approved and Approval record created' })
  async approveProposal(
    @Param('id') proposalId: string,
    @CurrentUser() user: AuthUser,
    @Body() body?: ApproveProposalDto,
  ) {
    const approverId = user?.sub || 'advisor-system';
    return this.rebalancingService.approveProposal(proposalId, approverId, body?.notes);
  }
}
