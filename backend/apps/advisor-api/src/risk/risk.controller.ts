import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RiskService, QuestionnaireAnswers } from './risk.service';
import { JwtAuthGuard } from '@nexgile/auth';

export class RiskQuestionnaireDto implements QuestionnaireAnswers {
  timeHorizon!: number;
  lossTolerance!: number;
  incomeStability!: number;
  liquidityNeeds!: number;
  investmentKnowledge!: number;
  marketDropReaction!: number;
  riskVsReturn!: number;
  emergencyFund!: number;
}

@ApiTags('Risk Profiling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('households')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Post(':id/risk-profile')
  @ApiOperation({ summary: 'Submit questionnaire and calculate household risk score' })
  @ApiResponse({ status: 201, description: 'Risk profile created successfully' })
  async submitRiskProfile(
    @Param('id') householdId: string,
    @Body() answers: RiskQuestionnaireDto,
  ) {
    return this.riskService.submitQuestionnaire(householdId, answers);
  }

  @Get(':id/efficient-frontier')
  @ApiOperation({ summary: 'Get efficient frontier points tailored to risk category' })
  @ApiResponse({ status: 200, description: 'Efficient frontier data returned' })
  async getEfficientFrontier(@Param('id') householdId: string) {
    return this.riskService.getEfficientFrontier(householdId);
  }
}
