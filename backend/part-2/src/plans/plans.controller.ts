import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Institutional Retirement Plans (Stubs)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get basic retirement plan metadata and participant count' })
  @ApiResponse({ status: 200, description: 'Plan information retrieved' })
  async getPlan(@Param('id') planId: string) {
    return this.plansService.getPlanInfo(planId);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get plan participants with contribution totals' })
  @ApiResponse({ status: 200, description: 'List of participants and total contributions' })
  async getPlanParticipants(@Param('id') planId: string) {
    // TODO: full compliance/fiduciary workflow out of scope for this build
    return this.plansService.getPlanParticipants(planId);
  }
}
