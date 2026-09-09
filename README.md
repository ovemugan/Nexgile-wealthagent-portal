# 🏦 Nexgile WealthAgent

Nexgile WealthAgent is a professional-grade wealth management platform designed to streamline the interaction between financial advisors and their clients. The platform consists of a centralized **Core Platform** for data management and an **Advisor Workstation** for strategic portfolio planning and client management.

## 🌟 Key Features

- **Advisor Workstation**: A dedicated suite of tools for financial advisors to manage client portfolios, create investment plans, and track performance.
- **Core Platform**: The central engine handling account data, security, and core wealth management logic.
- **Unified Infrastructure**: Shared authentication, database schema, and a strictly typed `CalculationResult<T>` contract ensuring consistency across services.
- **Automated Tooling**: Full Docker integration for rapid deployment of the entire environment.

---

## 🛠️ Tech Stack

### Backend
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Caching/Queue**: [Redis](https://redis.io/)
- **Monorepo Management**: [pnpm Workspaces](https://pnpm.io/workspaces) & [Turbo](https://turbo.build/)
- **Containerization**: [Docker](https://www.docker.com/)

### Frontend
- **Library**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/installation)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/)

### Backend Setup
1. **Navigate to backend**:
   ```bash
   cd backend
   ```
2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
3. **Install & Initialize**:
   ```bash
   pnpm install
   pnpm db:generate
   pnpm --filter @nexgile/db migrate -- --name init
   pnpm db:seed
   ```
4. **Run in Development**:
   ```bash
   pnpm --filter @nexgile/core-api dev
   pnpm --filter @nexgile/advisor-api dev
   ```

### Frontend Setup
1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```
2. **Install & Run**:
   ```bash
   pnpm install
   pnpm dev
   ```

### 🐳 Quick Start (Docker)
To launch the entire backend infrastructure (Postgres, Redis, Core API, Advisor API) in one command:
```bash
cd backend
docker compose up --build
```
*Note: Remember to run the seed command once the database is healthy.*

---

## 📖 API Documentation

Both backend services provide interactive Swagger documentation for testing and integration:

- **Core API**: `http://localhost:3001/docs`
- **Advisor API**: `http://localhost:3002/docs`

### Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| Advisor | `advisor@nexgile.demo` | `DemoPassword123!` |

---

## 📂 Project Structure

```text
nexgile/
├── backend/                # Monorepo for server-side logic
│   ├── apps/
│   │   ├── core-api/       # Central data & logic hub
│   │   └── advisor-api/    # Advisor-specific workstation services
│   ├── packages/
│   │   ├── auth/           # Shared authentication logic
│   │   ├── db/             # Prisma schema & database client
│   │   ├── config/         # Global configuration
│   │   └── shared-types/   # Common TS interfaces (e.g., CalculationResult)
│   └── docker-compose.yml   # Infrastructure orchestration
└── frontend/               # React-based user interface
```

---

## 📝 License
*Proprietary - Nexgile*
