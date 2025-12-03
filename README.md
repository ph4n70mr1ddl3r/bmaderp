# bmaderp - Cloud-based Retail ERP for APAC

Complete monorepo implementation of architecture specification for retail ERP system serving mid-market retail chains across APAC region.

## 🎯 Project Status

✅ **Architecture Complete** - See `/docs/analysis/architecture.md`  
🚀 **Ready for Implementation** - Full monorepo initialized and ready for development

## 📁 Project Structure

```
bmaderp/
├── packages/
│   ├── frontend/          # React 19 + Vite 5 SPA
│   ├── backend/           # Node.js + Express API
│   └── shared/            # TypeScript types & constants
├── docs/
│   ├── analysis/
│   │   └── architecture.md # Complete architecture specification
│   └── deployment/        # AWS deployment guides
├── docker-compose.yml      # PostgreSQL + Redis local dev
├── .env.example           # Environment template
├── .eslintrc.json         # ESLint configuration
├── .prettierrc.json       # Code formatting rules
├── tsconfig.json          # Shared TypeScript config
└── package.json           # Monorepo root
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (LTS)
- pnpm 8+
- Docker & Docker Compose

### Setup

1. **Install dependencies:**
   ```bash
   cd /home/riddler/bmaderp
   cp .env.example .env
   pnpm install
   ```

2. **Start PostgreSQL + Redis:**
   ```bash
   docker-compose up -d
   ```

3. **Initialize database:**
   ```bash
   cd packages/backend
   npx prisma migrate dev --name init
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1: Frontend (http://localhost:5173)
   cd packages/frontend
   pnpm dev

   # Terminal 2: Backend (http://localhost:3000)
   cd packages/backend
   pnpm dev
   ```

## 🛠 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19 |
| **Build Tool** | Vite | 5 |
| **Server State** | TanStack Query | v5 |
| **UI State** | Zustand | Latest |
| **Styling** | Tailwind CSS | 3.4+ |
| **Backend** | Node.js | 20 LTS |
| **Framework** | Express.js | 4.18+ |
| **ORM** | Prisma | 5.7+ |
| **Database** | PostgreSQL | 16 |
| **Cache** | Redis | 7 |
| **Infrastructure** | AWS | Multi-region |

## 📋 Development Scripts

**All packages:**
```bash
pnpm dev              # Start all dev servers
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint all code
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript check
```

**Frontend:**
```bash
cd packages/frontend
pnpm dev              # Vite dev server
pnpm build            # Production build
pnpm test             # Run unit tests
pnpm test:e2e         # Playwright E2E tests
```

**Backend:**
```bash
cd packages/backend
pnpm dev              # Express dev server
pnpm build            # TypeScript build
pnpm db:migrate       # Database migrations
pnpm db:studio        # Prisma Studio UI
pnpm db:seed          # Seed test data
```

**Shared package:**
```bash
cd packages/shared
pnpm build            # TypeScript compilation
pnpm type-check       # Type checking
```

## 🏗 Architecture Overview

The complete architecture specification includes:

### 5 Core Architectural Decisions
1. **Data Architecture** - Hybrid (PostgreSQL + Redis + SQLite client cache)
2. **Authentication** - JWT + 4-role RBAC
3. **API Design** - REST with standardized response format
4. **Real-time Sync** - 60-second polling + Redis Pub/Sub
5. **Infrastructure** - AWS multi-region (India/Singapore/Sydney)

### 10 Implementation Patterns
1. Naming conventions (snake_case DB, camelCase API, PascalCase components)
2. File structure (feature-based organization)
3. API response format ({success, data/error, meta})
4. Error handling (structured JSON, retryable flag)
5. State management (TanStack Query + Zustand split)
6. Loading states (never local useState)
7. Authentication (JWT in httpOnly cookies)
8. Data formats (standardized JSON structures)
9. Logging (structured JSON for CloudWatch)
10. Timestamps & IDs (ISO-8601, string IDs)

See `/docs/analysis/architecture.md` for complete details.

## 📦 Shared Types & Constants

Import from `@bmaderp/shared`:
```typescript
// Types
import { 
  User, 
  Order, 
  InventoryItem,
  ApiResponse,
  JwtPayload
} from '@bmaderp/shared';

// Constants
import {
  USER_ROLES,
  ORDER_STATUS,
  API_ENDPOINTS,
  SYNC_CONFIG
} from '@bmaderp/shared';

// Error Classes
import {
  ApiError,
  ValidationError,
  ConflictError,
  UnauthorizedError
} from '@bmaderp/shared';
```

## 🗄 Database

PostgreSQL with Prisma ORM. Schema includes:

- **Users** - Authentication, multi-store access
- **Stores** - Multi-tenancy, regional organization
- **InventoryItems** - SKU-based stock, prices
- **Orders** - Fulfillment workflows, status tracking
- **AuditLog** - All changes for compliance

Run migrations:
```bash
cd packages/backend
npx prisma migrate dev --name descriptive_name
```

View schema interactively:
```bash
npx prisma studio
```

## ✅ Testing

**Unit & Integration Tests:**
```bash
pnpm test              # Run all tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # Coverage report
```

**E2E Tests (Frontend):**
```bash
cd packages/frontend
pnpm test:e2e         # Playwright tests
```

Test files:
- Frontend: `packages/frontend/tests/`
- Backend: `packages/backend/tests/`

## 🔐 Environment Variables

Copy `.env.example` to `.env`:

```bash
# Database
DATABASE_URL="postgresql://bmaderp_user:password@localhost:5432/bmaderp_dev"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRY="15m"

# Servers
NODE_ENV="development"
BACKEND_PORT="3000"
FRONTEND_URL="http://localhost:5173"
VITE_API_URL="http://localhost:3000/api"

# AWS (production)
AWS_REGION="ap-south-1"
AWS_RDS_ENDPOINT=""
AWS_ELASTICACHE_ENDPOINT=""
```

## 🔄 Git Workflow

1. Create branch: `git checkout -b feature/inventory-lookup`
2. Follow patterns from architecture doc
3. Run tests: `pnpm test`
4. Lint: `pnpm lint:fix`
5. Commit: `git commit -m "feat(inventory): add SKU lookup"`
6. Push: `git push origin feature/inventory-lookup`
7. Create PR with architecture mapping

**Conventional commit format:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring
- `test:` Test additions
- `docs:` Documentation updates

## 📖 Documentation

- **Architecture** - `/docs/analysis/architecture.md` (4,500+ lines comprehensive spec)
- **Database Schema** - `packages/backend/prisma/schema.prisma`
- **API Endpoints** - To be generated from OpenAPI spec
- **Deployment** - `/docs/deployment/aws-multi-region.md`

## 👥 Team Structure

25-35 person engineering team organized by feature:
- **Inventory Team** - Stock management, sync, conflict resolution
- **Orders Team** - Fulfillment workflows, returns, approvals
- **Dashboard Team** - Analytics, KPIs, real-time metrics
- **Scheduling Team** - Staff management, shifts, swaps
- **Platform Team** - Auth, database, infrastructure, deployment

Clear architectural boundaries prevent conflicts and enable parallel development.

## 🎯 Implementation Phases

**Phase 1 (Weeks 1-4): Foundation**
- PostgreSQL + Redis setup
- JWT authentication
- REST API infrastructure
- Core models

**Phase 2 (Weeks 5-8): Core Features**
- Inventory management
- Order fulfillment
- Dashboard scaffolding
- Real-time sync

**Phase 3 (Weeks 9-12): Testing & Launch**
- Comprehensive testing
- Performance optimization
- Multi-region deployment
- Pilot launch (10-15 stores)

## 🚀 Deployment

### Local Development
```bash
docker-compose up -d    # PostgreSQL + Redis
pnpm install            # Install dependencies
pnpm dev               # Frontend + Backend
```

### Production (AWS)
See `/docs/deployment/aws-multi-region.md` for:
- ECS Fargate setup
- RDS PostgreSQL
- ElastiCache Redis
- CloudFront CDN
- Multi-region failover

## 📝 Code Standards

### Before Submitting PR

- [ ] Code follows all 10 implementation patterns
- [ ] Types from @bmaderp/shared used correctly
- [ ] Errors include retryable flag
- [ ] Tests cover happy path + errors
- [ ] Database changes include Prisma migrations
- [ ] No console.log (use logger)
- [ ] Naming conventions followed
- [ ] File in correct directory
- [ ] No TypeScript errors
- [ ] Lints without warnings

### Repository contents
- `.bmad/` - Agent workflows, task manifests
- `.github/` - GitHub guidance files
- `docs/analysis/` - Product brief, market research, customer insights
- `docs/deployment/` - Deployment architecture
- `packages/frontend/` - React application
- `packages/backend/` - Express API server
- `packages/shared/` - Shared types and constants

## 📚 References

- **Product Brief** - `/docs/analysis/product-brief-bmaderp-2025-12-02.md`
- **User Personas** - `/docs/analysis/user-personas-apac-retail-erp-2025.md`
- **Market Research** - `/docs/analysis/research/market-retail-erp-research-2025-12-02.md`
- **Customer Insights** - `/docs/analysis/customer-insights-apac-retail-2025.md`
- **Architecture** - `/docs/analysis/architecture.md` ⭐ **START HERE**

## 🤝 Support

For questions about architecture, refer to `/docs/analysis/architecture.md` sections:
- Project Context (requirements, epics, NFRs)
- Architectural Decisions (tech choices with rationale)
- Implementation Patterns (10 mandatory patterns)
- Project Structure (file organization)
- Database Schema (Prisma definitions)
- Testing Strategy (unit, integration, E2E)

## 📄 License

Internal - Riddler Innovations

---

**Architecture completed:** 2025-12-03  
**Project initialized:** 2025-12-03  
**Status:** ✅ Ready for implementation

1) Clone: `git clone https://github.com/ph4n70mr1ddl3r/bmaderp.git`
2) Explore the product brief at `docs/analysis/product-brief-bmaderp-2025-12-02.md` for the vision and business context.
3) Review the workflow and agent configs in `.bmad/` if you want to use or extend the BMAD playbooks.
