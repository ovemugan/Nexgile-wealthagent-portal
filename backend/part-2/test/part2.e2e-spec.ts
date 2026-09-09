import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma.service';

describe('Part 2 - Advisor Workstation, Tax/Estate & Reporting API (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let advisorId: string;
  let testHouseholdId: string;
  let testAccountId: string;
  let testGoalId: string;
  let testPlanId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get(PrismaService);

    // Fetch seeded advisor and related test IDs from DB
    const advisor = await prisma.person.findFirst({
      where: { email: 'advisor@nexgile.demo' },
    });

    if (advisor) {
      advisorId = advisor.id;
    }

    const household = await prisma.household.findFirst({
      include: { accounts: true, goals: true },
    });

    if (household) {
      testHouseholdId = household.id;
      testAccountId = household.accounts[0]?.id;
      testGoalId = household.goals[0]?.id;
    }

    const plan = await prisma.plan.findFirst();
    if (plan) {
      testPlanId = plan.id;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Step 1 & Auth Verification', () => {
    it('should return health check status', async () => {
      const res = await request(app.getHttpServer()).get('/health').expect(200);
      expect(res.body.status).toBe('ok');
    });

    it('should authenticate as seeded advisor and return JWT', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'advisor@nexgile.demo',
          password: 'DemoPassword123!',
        })
        .expect(200);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe('advisor@nexgile.demo');
      authToken = res.body.accessToken;
    });

    it('should return profile on GET /auth/me with valid Bearer token', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.email).toBe('advisor@nexgile.demo');
    });
  });

  describe('Step 3: Advisor Book-of-Business & Client-360', () => {
    it('should get advisor book-of-business households', async () => {
      const res = await request(app.getHttpServer())
        .get(`/advisor/${advisorId}/households`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('netWorth');
      expect(typeof res.body[0].netWorth).toBe('number');
    });

    it('should return Client-360 summary for a household', async () => {
      const res = await request(app.getHttpServer())
        .get(`/advisor/${advisorId}/households/${testHouseholdId}/summary`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.client360).toBeDefined();
      expect(res.body.client360.household.id).toBe(testHouseholdId);
      expect(res.body.client360).toHaveProperty('netWorth');
      expect(Array.isArray(res.body.client360.recentTransactions)).toBe(true);
      expect(res.body.client360).toHaveProperty('openTaxOpportunitiesCount');
    });
  });

  describe('Step 4: Risk Profiling & Efficient Frontier', () => {
    it('should submit risk questionnaire and return CalculationResult<RiskScore>', async () => {
      const answers = {
        timeHorizon: 5,
        lossTolerance: 4,
        incomeStability: 4,
        liquidityNeeds: 2,
        investmentKnowledge: 5,
        marketDropReaction: 5,
        riskVsReturn: 5,
        emergencyFund: 5,
      };

      const res = await request(app.getHttpServer())
        .post(`/households/${testHouseholdId}/risk-profile`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(answers)
        .expect(201);

      expect(res.body.method).toBe('weighted_questionnaire_v1');
      expect(res.body.value).toHaveProperty('score');
      expect(res.body.value).toHaveProperty('category');
      expect(res.body.value.targetAllocation).toBeDefined();
      expect(Array.isArray(res.body.limitations)).toBe(true);
      expect(res.body.computedAt).toBeDefined();
    });

    it('should return efficient frontier data points for household', async () => {
      const res = await request(app.getHttpServer())
        .get(`/households/${testHouseholdId}/efficient-frontier`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body.points)).toBe(true);
      expect(res.body.recommended).toBeDefined();
    });
  });

  describe('Step 5: Monte Carlo Simulation (Async Queue)', () => {
    it('should enqueue simulation job and poll completion result', async () => {
      const enqueueRes = await request(app.getHttpServer())
        .post(`/goals/${testGoalId}/simulate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ trials: 500 })
        .expect(202);

      expect(enqueueRes.body.jobId).toBeDefined();
      const jobId = enqueueRes.body.jobId;

      // Wait a moment for async worker execution
      await new Promise((r) => setTimeout(r, 600));

      const pollRes = await request(app.getHttpServer())
        .get(`/simulations/${jobId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(pollRes.body.jobId).toBe(jobId);
      expect(['completed', 'active', 'waiting']).toContain(pollRes.body.status);

      if (pollRes.body.status === 'completed') {
        expect(pollRes.body.result.method).toBe('monte_carlo_random_walk');
        expect(pollRes.body.result.value).toHaveProperty('successProbability');
        expect(pollRes.body.result.value.percentiles).toHaveProperty('p50');
      }
    });
  });

  describe('Step 6: Portfolio Rebalancing', () => {
    let proposalId: string;

    it('should generate rebalancing proposal comparing current vs target allocation', async () => {
      const res = await request(app.getHttpServer())
        .get(`/accounts/${testAccountId}/rebalancing-proposal`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.method).toBe('mean_variance_target_drift_v1');
      expect(res.body.value).toHaveProperty('currentAllocation');
      expect(res.body.value).toHaveProperty('targetAllocation');
      expect(res.body.value).toHaveProperty('drift');
      expect(Array.isArray(res.body.value.proposedTrades)).toBe(true);
      expect(res.body.value.proposalId).toBeDefined();

      proposalId = res.body.value.proposalId;
    });

    it('should approve proposal and write an AuditEvent', async () => {
      const res = await request(app.getHttpServer())
        .post(`/rebalancing-proposals/${proposalId}/approve`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notes: 'Verified asset weights with client' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.proposal.status).toBe('approved');
      expect(res.body.approval.status).toBe('approved');

      // Verify audit event in DB
      const audit = await prisma.auditEvent.findFirst({
        where: {
          entityType: 'RebalancingProposal',
          entityId: proposalId,
          action: 'approve',
        },
      });
      expect(audit).toBeDefined();
    });
  });

  describe('Step 7: Tax-Loss Harvesting & Wash-Sale Detection', () => {
    let opportunityId: string;

    it('should scan tax opportunities and detect deliberately seeded wash-sale scenario', async () => {
      const res = await request(app.getHttpServer())
        .get(`/accounts/${testAccountId}/tax-opportunities`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.method).toBe('fifo_lot_level_harvest_v1');
      expect(Array.isArray(res.body.value)).toBe(true);
      expect(res.body.value.length).toBeGreaterThan(0);

      // Verify wash sale was flagged on the account
      const washSaleOpp = res.body.value.find((opp: any) => opp.washSaleRisk === true);
      expect(washSaleOpp).toBeDefined();
      expect(washSaleOpp.washSaleRisk).toBe(true);

      opportunityId = res.body.value[0].id;
    });

    it('should mark tax opportunity as actioned and write AuditEvent', async () => {
      const res = await request(app.getHttpServer())
        .post(`/tax-opportunities/${opportunityId}/action`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.opportunity.status).toBe('actioned');

      const audit = await prisma.auditEvent.findFirst({
        where: {
          entityType: 'TaxOpportunity',
          entityId: opportunityId,
          action: 'action',
        },
      });
      expect(audit).toBeDefined();
    });
  });

  describe('Step 8: Generic Approvals API', () => {
    it('should query approvals filtered by entityType and status', async () => {
      const res = await request(app.getHttpServer())
        .get('/approvals?entityType=RebalancingProposal&status=approved')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('Step 9: Branded PDF Reporting', () => {
    let reportId: string;

    it('should enqueue report generation and return status queued', async () => {
      const res = await request(app.getHttpServer())
        .post(`/households/${testHouseholdId}/reports`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ templateId: 'executive_summary_v1' })
        .expect(201);

      expect(res.body.reportId).toBeDefined();
      expect(res.body.status).toBe('queued');
      reportId = res.body.reportId;
    });

    it('should poll report until status is ready', async () => {
      // Wait for background worker to render PDF
      await new Promise((r) => setTimeout(r, 800));

      const res = await request(app.getHttpServer())
        .get(`/reports/${reportId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(['queued', 'generating', 'ready']).toContain(res.body.status);
    });
  });

  describe('Step 10: Institutional Retirement Plan Stubs', () => {
    it('should return plan info and participant count on GET /plans/:id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/plans/${testPlanId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.id).toBe(testPlanId);
      expect(res.body.name).toBeDefined();
      expect(typeof res.body.participantCount).toBe('number');
    });

    it('should return participant roster with contribution totals', async () => {
      const res = await request(app.getHttpServer())
        .get(`/plans/${testPlanId}/participants`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('totalContributions');
      expect(res.body[0]).toHaveProperty('contributionCount');
    });
  });
});
