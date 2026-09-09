import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ApprovalsService } from './approvals.service';
import { JwtAuthGuard, RolesGuard, CurrentUser, AuthUser, RequireRole } from '@nexgile/auth';

export class CreateApprovalDto {
  entityType!: 'RebalancingProposal' | 'TaxOpportunity';
  entityId!: string;
  status!: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

@ApiTags('Approvals & Compliance Workflow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Post()
  @RequireRole('advisor', 'compliance')
  @ApiOperation({ summary: 'Submit generic approval or rejection for proposal or tax action' })
  @ApiResponse({ status: 201, description: 'Approval record created' })
  async createApproval(
    @Body() body: CreateApprovalDto,
    @CurrentUser() user: AuthUser,
  ) {
    const approverId = user?.sub || 'compliance-officer';
    return this.approvalsService.createApproval({
      ...body,
      approverId,
    });
  }

  @Get()
  @RequireRole('advisor', 'compliance')
  @ApiOperation({ summary: 'Query approvals filtered by entityType and status' })
  @ApiQuery({ name: 'entityType', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'List of matching approvals' })
  async getApprovals(
    @Query('entityType') entityType?: string,
    @Query('status') status?: string,
  ) {
    return this.approvalsService.getApprovals(entityType, status);
  }
}
