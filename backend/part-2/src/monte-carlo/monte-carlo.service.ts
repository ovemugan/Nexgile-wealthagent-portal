import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CalculationResult } from '../common/calculation-result.interface';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

export interface MonteCarloResult {
  successProbability: number;
  percentiles: {
    p10: number;
    p50: number;
    p90: number;
  };
  trials: number;
  years: number;
  targetAmount: number;
  initialBalance: number;
}

export interface JobState {
  jobId: string;
  goalId: string;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  result?: CalculationResult<MonteCarloResult>;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

@Injectable()
export class MonteCarloService {
  private queue: Queue | null = null;
  private worker: Worker | null = null;
  private inMemoryJobs: Map<string, JobState> = new Map();
  private redisClient: Redis | null = null;

  constructor(private readonly prisma: PrismaService) {
    this.initBullMQ();
  }

  private initBullMQ() {
    try {
      const host = process.env.REDIS_HOST || 'localhost';
      const port = Number(process.env.REDIS_PORT) || 6379;
      const redis = new Redis({
        host,
        port,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // don't infinite retry if offline
        lazyConnect: true,
      });

      redis.connect()
        .then(() => {
          this.redisClient = redis;
          this.queue = new Queue('monte-carlo-simulation', { connection: redis });
          this.worker = new Worker(
            'monte-carlo-simulation',
            async (job) => {
              const res = await this.runSimulation(job.data.goalId, job.data.trials || 2000);
              return res;
            },
            { connection: redis },
          );
        })
        .catch(() => {
          // Redis not available; fallback to asynchronous in-memory processor
          this.queue = null;
        });
    } catch {
      this.queue = null;
    }
  }

  async enqueueSimulation(goalId: string, trials = 2000): Promise<{ jobId: string }> {
    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
      include: { scenarios: true },
    });

    if (!goal) {
      throw new NotFoundException(`Goal ${goalId} not found`);
    }

    const jobId = `mc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const jobState: JobState = {
      jobId,
      goalId,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    this.inMemoryJobs.set(jobId, jobState);

    // If BullMQ queue is active, enqueue to Redis queue
    if (this.queue) {
      try {
        await this.queue.add('simulate', { goalId, trials }, { jobId });
      } catch {
        // Run via async setImmediate fallback
        this.processAsync(jobId, goalId, trials);
      }
    } else {
      // Async execution without blocking the HTTP request
      this.processAsync(jobId, goalId, trials);
    }

    return { jobId };
  }

  private processAsync(jobId: string, goalId: string, trials: number) {
    setImmediate(async () => {
      const state = this.inMemoryJobs.get(jobId);
      if (state) state.status = 'active';
      try {
        const result = await this.runSimulation(goalId, trials);
        if (state) {
          state.status = 'completed';
          state.result = result;
          state.completedAt = new Date().toISOString();
        }
      } catch (err: any) {
        if (state) {
          state.status = 'failed';
          state.error = err.message;
        }
      }
    });
  }

  async runSimulation(
    goalId: string,
    trials = 2000,
  ): Promise<CalculationResult<MonteCarloResult>> {
    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        household: {
          include: {
            accounts: {
              include: { holdings: true },
            },
          },
        },
        scenarios: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!goal) {
      throw new NotFoundException(`Goal ${goalId} not found`);
    }

    // Determine initial balance from household accounts
    let householdNetWorth = 0;
    if (goal.household?.accounts) {
      for (const acc of goal.household.accounts) {
        for (const h of acc.holdings) {
          householdNetWorth += Number(h.quantity) * Number(h.costBasis);
        }
      }
    }

    const latestScenario = goal.scenarios[0];
    const assumptions = (latestScenario?.assumptions as Record<string, any>) || {};

    const initialBalance = assumptions.initialBalance || (householdNetWorth > 0 ? householdNetWorth : 50000);
    const annualContribution = assumptions.contributionAmount || 12000;
    const meanReturn = assumptions.rateOfReturn ?? 0.07; // 7% annual
    const stdDev = assumptions.stdDev ?? 0.15; // 15% volatility
    const targetAmount = Number(goal.targetAmount) || 1000000;

    const currentYear = new Date().getFullYear();
    const targetYear = goal.targetDate ? new Date(goal.targetDate).getFullYear() : currentYear + 20;
    const years = Math.max(1, targetYear - currentYear);

    // Box-Muller standard normal generator
    const randomNormal = () => {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    const endingBalances: number[] = [];
    let successCount = 0;

    for (let t = 0; t < trials; t++) {
      let balance = initialBalance;
      for (let y = 0; y < years; y++) {
        const annualReturn = meanReturn + randomNormal() * stdDev;
        balance = balance * (1 + annualReturn) + annualContribution;
      }
      endingBalances.push(balance);
      if (balance >= targetAmount) {
        successCount++;
      }
    }

    endingBalances.sort((a, b) => a - b);

    const p10 = Number(endingBalances[Math.floor(trials * 0.10)].toFixed(2));
    const p50 = Number(endingBalances[Math.floor(trials * 0.50)].toFixed(2));
    const p90 = Number(endingBalances[Math.floor(trials * 0.90)].toFixed(2));
    const successProbability = Number(((successCount / trials) * 100).toFixed(1));

    const resultValue: MonteCarloResult = {
      successProbability,
      percentiles: { p10, p50, p90 },
      trials,
      years,
      targetAmount,
      initialBalance: Number(initialBalance.toFixed(2)),
    };

    const calculationResult: CalculationResult<MonteCarloResult> = {
      value: resultValue,
      asOf: new Date().toISOString().split('T')[0],
      method: 'monte_carlo_random_walk',
      assumptions: {
        trials,
        years,
        meanReturn,
        stdDev,
        annualContribution,
        targetAmount,
      },
      limitations: [
        'Assumes independent annual returns and does not model sequence-of-returns risk precisely',
        'Market distributions in reality exhibit fat tails (kurtosis) not captured by a standard normal model',
        'Inflation and fee drag are modeled deterministically rather than stochastically',
      ],
      computedAt: new Date().toISOString(),
    };

    // Store the result on a Scenario row (update existing or create new)
    if (latestScenario) {
      await this.prisma.scenario.update({
        where: { id: latestScenario.id },
        data: { result: calculationResult as any },
      });
    } else {
      await this.prisma.scenario.create({
        data: {
          goalId,
          assumptions: { rateOfReturn: meanReturn, contributionAmount: annualContribution, stdDev },
          result: calculationResult as any,
        },
      });
    }

    return calculationResult;
  }

  async getJobStatus(jobId: string) {
    // Check in-memory store
    const memJob = this.inMemoryJobs.get(jobId);
    if (memJob) {
      return {
        jobId: memJob.jobId,
        status: memJob.status,
        result: memJob.result || null,
        error: memJob.error || null,
        completedAt: memJob.completedAt,
      };
    }

    // Check BullMQ if active
    if (this.queue) {
      const bullJob = await this.queue.getJob(jobId);
      if (bullJob) {
        const state = await bullJob.getState();
        return {
          jobId,
          status: state,
          result: bullJob.returnvalue || null,
          error: bullJob.failedReason || null,
        };
      }
    }

    throw new NotFoundException(`Simulation job ${jobId} not found`);
  }
}
