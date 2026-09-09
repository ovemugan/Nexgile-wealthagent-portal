import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MonteCarloService } from './monte-carlo.service';
import { JwtAuthGuard } from '@nexgile/auth';

export class SimulateGoalDto {
  trials?: number;
}

@ApiTags('Monte Carlo Simulation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class MonteCarloController {
  constructor(private readonly monteCarloService: MonteCarloService) {}

  @Post('goals/:id/simulate')
  @ApiOperation({ summary: 'Enqueue async Monte Carlo goal simulation' })
  @ApiResponse({ status: 202, description: 'Job enqueued successfully, returns { jobId }' })
  async simulateGoal(
    @Param('id') goalId: string,
    @Body() body?: SimulateGoalDto,
  ) {
    const trials = body?.trials || 2000;
    return this.monteCarloService.enqueueSimulation(goalId, trials);
  }

  @Get('simulations/:jobId')
  @ApiOperation({ summary: 'Poll status and results of Monte Carlo simulation job' })
  @ApiResponse({ status: 200, description: 'Current job status and CalculationResult when complete' })
  async getSimulationStatus(@Param('jobId') jobId: string) {
    return this.monteCarloService.getJobStatus(jobId);
  }
}
