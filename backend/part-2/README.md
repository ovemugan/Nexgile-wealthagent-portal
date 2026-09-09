# Nexgile-WealthAgent — Backend Part-2: Advisor Workstation, Tax/Estate & Reporting API

This directory (`part-2/`) contains the complete, production-grade implementation of **Part 2** of the Nexgile WealthAgent backend. It provides the analytical, computational, and advisor layers that operate alongside the core platform.

## Key Capabilities Implemented

1. **Advisor Workstation & Client-360**:
   - `GET /advisor/:advisorId/households`: Resolves advisor team assignments via role scoping, rolls up household net worth, and lists active client households.
   - `GET /advisor/:advisorId/households/:id/summary`: Comprehensive Client-360 view including net worth, account breakdown, 10 most recent transactions, open tax opportunities count, and pending rebalancing proposals.

2. **Standardized Calculation Envelope (`CalculationResult<T>`)**:
   - Every financial computation (risk score, efficient frontier, Monte Carlo, rebalancing drift, tax loss) is encapsulated in the shared contract:
     - `value`: Computed output
     - `asOf`: ISO snapshot date
     - `method`: Algorithm identifier (e.g. `weighted_questionnaire_v1`, `monte_carlo_random_walk`, `mean_variance_target_drift_v1`, `fifo_lot_level_harvest_v1`)
     - `assumptions`: Key calculation parameters
     - `limitations`: Regulatory caveats and modeling constraints
     - `computedAt`: Timestamp

3. **Standardized Risk Questionnaire & Efficient Frontier**:
   - `POST /households/:id/risk-profile`: Standardized 8-question weighted risk model scoring clients from 0 to 100 into Conservative, Moderate, or Aggressive bands with recommended asset class weights.
   - `GET /households/:id/efficient-frontier`: Markowitz risk/return coordinate pairs aligned with the household's profile for charting.

4. **Stochastic Monte Carlo Goal Simulation Engine (Async Queue)**:
   - `POST /goals/:id/simulate`: Reads goals and scenario assumptions, enqueuing a 2,000-trial simulation job returning `{ jobId }` immediately.
   - Worker simulates 2,000 random walk paths using Box-Muller Gaussian distribution, compounding year-over-year with contribution schedules.
   - Computes success probability (% reaching goal) and 10th, 50th, and 90th percentile ending balances.
   - `GET /simulations/:jobId`: Non-blocking status polling returning final calculation results.

5. **Portfolio Rebalancing Engine**:
   - `GET /accounts/:id/rebalancing-proposal`: Computes current vs. target asset allocation drift (equity, bond, cash, alternative), generating executable buy/sell orders.
   - `POST /rebalancing-proposals/:id/approve`: Formal proposal approval workflow generating an immutable audit trail entry (`AuditEvent`).

6. **Tax-Loss Harvesting & Wash-Sale Detection**:
   - `GET /accounts/:id/tax-opportunities`: Scans tax lots for unrealized losses exceeding threshold (-$500 or -5%), cross-referencing transaction history within a ±30-day window to identify wash-sale risks under IRS Section 1091.
   - Verified against the deliberately seeded wash-sale scenario.
   - `POST /tax-opportunities/:id/action`: Actioning workflow logging state changes to `AuditEvent`.

7. **Generic Polymorphic Approvals**:
   - `POST /approvals` & `GET /approvals?entityType=&status=`: Reusable approval pipeline for proposals and compliance actions.

8. **Branded PDF Report Generation**:
   - `POST /households/:id/reports`: Async queue rendering executive-level wealth reports.
   - `GET /reports/:id`: Status polling.
   - `GET /reports/:id/download`: Serves publication-grade vector PDF reports.

9. **Retirement Plan Stubs**:
   - `GET /plans/:id`: Plan overview and participant statistics.
   - `GET /plans/:id/participants`: Participant rosters and contribution totals (`// TODO: full compliance/fiduciary workflow out of scope for this build`).

10. **Documentation & Tests**:
    - Interactive Swagger OpenAPI UI at `/docs`.
    - End-to-end integration tests in `test/part2.e2e-spec.ts`.

---

## How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Push Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Realistic Test Data (Including Wash-Sale Scenario)
```bash
npm run db:seed
```

### 4. Start the Application
```bash
npm run start:dev
```
- API server listens on: `http://localhost:3002`
- Swagger UI available at: `http://localhost:3002/docs`

### 5. Run Integration Tests
```bash
npm test
```
