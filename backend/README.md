# Nexgile WealthAgent backend

One combined monorepo for the Core Platform and Advisor Workstation. Both services share one PostgreSQL database, Prisma schema, JWT secret, auth package, and `CalculationResult<T>` contract.

## Run locally

1. Copy `.env.example` to `.env`.
2. Run `pnpm install`, `pnpm db:generate`, `pnpm --filter @nexgile/db migrate -- --name init`, and `pnpm db:seed`.
3. Run `pnpm --filter @nexgile/core-api dev` and `pnpm --filter @nexgile/advisor-api dev`.

Core API Swagger: `http://localhost:3001/docs`. Advisor API Swagger: `http://localhost:3002/docs`.

Alternatively, `docker compose up --build` starts PostgreSQL, Redis, Core API, and Advisor API. Run the seed command once the database is ready.

Demo credentials: `advisor@nexgile.demo` / `DemoPassword123!`. The seed writes stable IDs, the advisor team, plan IDs, and the wash-sale scenario to `seed-output.json`.

Real custodian/CRM/payroll integrations, production trade execution, native mobile apps, and full regulatory workflows remain future work.
