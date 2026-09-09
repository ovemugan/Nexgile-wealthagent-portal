import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CalculationResult } from '../common/calculation-result.interface';

export interface QuestionnaireAnswers {
  timeHorizon: number; // 1-5
  lossTolerance: number; // 1-5
  incomeStability: number; // 1-5
  liquidityNeeds: number; // 1-5
  investmentKnowledge: number; // 1-5
  marketDropReaction: number; // 1-5
  riskVsReturn: number; // 1-5
  emergencyFund: number; // 1-5
}

export interface RiskScore {
  score: number;
  category: 'conservative' | 'moderate' | 'aggressive';
  targetAllocation: {
    equity: number;
    bond: number;
    cash: number;
    alternative: number;
  };
}

@Injectable()
export class RiskService {
  constructor(private readonly prisma: PrismaService) {}

  async submitQuestionnaire(
    householdId: string,
    answers: QuestionnaireAnswers,
  ): Promise<CalculationResult<RiskScore>> {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
    });
    if (!household) {
      throw new NotFoundException(`Household ${householdId} not found`);
    }

    // Question weights sum to 100%
    const weights: Record<keyof QuestionnaireAnswers, number> = {
      timeHorizon: 0.15,
      lossTolerance: 0.20,
      incomeStability: 0.10,
      liquidityNeeds: 0.10,
      investmentKnowledge: 0.10,
      marketDropReaction: 0.15,
      riskVsReturn: 0.10,
      emergencyFund: 0.10,
    };

    let rawScore = 0;
    for (const [k, weight] of Object.entries(weights)) {
      const val = Math.max(1, Math.min(5, Number(answers[k as keyof QuestionnaireAnswers]) || 3));
      // Normalize 1..5 to 0..100: (val - 1) / 4 * 100
      rawScore += ((val - 1) / 4) * 100 * weight;
    }

    const score = Number(rawScore.toFixed(1));
    let category: 'conservative' | 'moderate' | 'aggressive';
    let targetAllocation: { equity: number; bond: number; cash: number; alternative: number };

    if (score < 40) {
      category = 'conservative';
      targetAllocation = { equity: 20, bond: 70, cash: 10, alternative: 0 };
    } else if (score <= 70) {
      category = 'moderate';
      targetAllocation = { equity: 60, bond: 30, cash: 5, alternative: 5 };
    } else {
      category = 'aggressive';
      targetAllocation = { equity: 80, bond: 10, cash: 5, alternative: 5 };
    }

    const value: RiskScore = {
      score,
      category,
      targetAllocation,
    };

    const calcResult: CalculationResult<RiskScore> = {
      value,
      asOf: new Date().toISOString().split('T')[0],
      method: 'weighted_questionnaire_v1',
      assumptions: {
        totalQuestions: 8,
        minScore: 0,
        maxScore: 100,
        conservativeThreshold: 40,
        aggressiveThreshold: 70,
      },
      limitations: [
        'Subject to investor self-assessment bias',
        'Does not model external assets, liabilities, or illiquid holdings',
        'Market drawdown behavior may diverge from questionnaire answers during actual crises',
      ],
      computedAt: new Date().toISOString(),
    };

    // Store in database
    await this.prisma.riskProfile.create({
      data: {
        householdId,
        answers: answers as any,
        result: calcResult as any,
      },
    });

    return calcResult;
  }

  async getEfficientFrontier(householdId: string) {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
    });
    if (!household) {
      throw new NotFoundException(`Household ${householdId} not found`);
    }

    const latestProfile = await this.prisma.riskProfile.findFirst({
      where: { householdId },
      orderBy: { createdAt: 'desc' },
    });

    const category = (latestProfile?.result as any)?.value?.category || 'moderate';

    const curvePoints = [
      { risk: 4.0, expectedReturn: 4.5, label: 'Capital Preservation' },
      { risk: 7.0, expectedReturn: 6.0, label: 'Conservative' },
      { risk: 10.5, expectedReturn: 7.8, label: 'Balanced' },
      { risk: 13.0, expectedReturn: 9.0, label: 'Moderate' },
      { risk: 16.5, expectedReturn: 10.5, label: 'Growth' },
      { risk: 19.5, expectedReturn: 12.0, label: 'Aggressive' },
    ];

    let recommendedIndex = 3;
    if (category === 'conservative') recommendedIndex = 1;
    if (category === 'aggressive') recommendedIndex = 5;

    return {
      householdId,
      category,
      points: curvePoints,
      recommended: curvePoints[recommendedIndex],
      asOf: new Date().toISOString().split('T')[0],
    };
  }
}
