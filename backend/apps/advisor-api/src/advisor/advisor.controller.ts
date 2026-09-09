import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdvisorService } from './advisor.service';
import { JwtAuthGuard, RolesGuard, RequireRole } from '@nexgile/auth';

@ApiTags('Advisor Workstation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('advisor')
export class AdvisorController {
  constructor(private readonly advisorService: AdvisorService) {}

  @Get(':advisorId/households')
  @RequireRole('advisor')
  @ApiOperation({ summary: "Get advisor's book-of-business households with net worth" })
  @ApiResponse({ status: 200, description: 'Households listed successfully' })
  async getHouseholds(@Param('advisorId') advisorId: string) {
    return this.advisorService.getAdvisorHouseholds(advisorId);
  }

  @Get(':advisorId/households/:id/summary')
  @RequireRole('advisor')
  @ApiOperation({ summary: 'Get Client-360 summary for a household' })
  @ApiResponse({ status: 200, description: 'Client-360 summary retrieved' })
  async getHouseholdSummary(
    @Param('advisorId') advisorId: string,
    @Param('id') householdId: string,
  ) {
    return this.advisorService.getHouseholdSummary(advisorId, householdId);
  }
}
