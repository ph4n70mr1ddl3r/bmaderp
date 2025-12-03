---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - product-brief-bmaderp-2025-12-02.md
  - user-personas-apac-retail-erp-2025.md
  - research/market-retail-erp-research-2025-12-02.md
  - customer-insights-apac-retail-2025.md
workflowType: 'architecture'
lastStep: 2
project_name: 'bmaderp'
user_name: 'Riddler'
date: '2025-12-03'
partyModeCompleted: true
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Architectural decisions are appended as we work through each system component together._

---

## Project Context Analysis ✓

**Input Documents Loaded:**
- ✅ Product Brief: Comprehensive vision, MVP scope, success metrics
- ✅ User Personas: Store managers (Priya) and associates (Ravi) with workflows
- ✅ Market Research: APAC retail landscape, competitive analysis, market opportunity
- ✅ Customer Insights: Regional requirements and behavioral patterns

**Project Context:**
- **Project:** bmaderp (Cloud-based retail ERP for APAC mid-market retail chains)
- **Target Users:** Store managers (3-6 month adoption curve) and sales associates (4-8 week adoption curve)
- **MVP Scope:** 5 core features over 12-16 weeks with 25-35 person team
- **Core Principle:** "Store Floor First, IT Second" - Designed for users, not IT departments
- **Technology Constraints:** Browser-based responsive web (no native apps), mobile-first, offline-first

---

## Functional Requirements Analysis

**5 Core MVP Features:**

1. **Real-Time Inventory Management** 
   - 60-second data synchronization across all locations
   - Barcode scanning, stock lookup, multi-store visibility
   - Offline capability with seamless sync when connected

2. **Mobile-First Order Management**
   - Real-time fulfillment queue for online/omnichannel orders
   - One-tap fulfillment workflows with barcode validation
   - Returns/exchanges processing with notifications

3. **Real-Time Sales Dashboard**
   - Store-level: Revenue vs. target, sales by category/salesperson
   - Associate-level: Personal sales tracking, leaderboards, commission visibility
   - Real-time performance alerts and milestones

4. **Staff Scheduling & Attendance**
   - Schedule management, shift swaps, leave requests
   - Automated check-in/check-out
   - Manager approval workflows

5. **Mobile-First User Interface Foundation**
   - Responsive web design (mobile-first, works on phones/tablets/desktop)
   - Offline-first architecture with conflict-free sync
   - Multilingual support (English + 4 APAC languages)
   - WhatsApp integration for notifications

---

## Non-Functional Requirements (Critical)

| NFR | Specification | Architectural Impact |
|-----|--------------|----------------------|
| **Adoption** | 85% user adoption within 8 weeks | UX-first design, minimal training friction |
| **Performance** | <2 second response for inventory lookups | Real-time caching, optimized queries, edge computing |
| **Availability** | No peak-hour performance degradation | Auto-scaling, load balancing, failover |
| **Connectivity** | Offline-first for spotty 4G | Client-side caching, CRDT sync, conflict resolution |
| **Compliance** | APAC data residency (India DPDP, Singapore APP) | Multi-region deployment, encryption at rest |
| **Browser-based** | No app installation friction | Pure responsive web, no native apps in MVP |
| **Scalability** | 10 pilot stores → 500+ stores in 12 months | Horizontal scaling, modular architecture, API-first |

---

## Technical Complexity Assessment

**Project Scale:** MEDIUM-HIGH
- Real-time data synchronization across distributed locations
- Complex offline-first architecture with conflict resolution
- Multi-tenancy across 100+ stores
- Stateful fulfillment workflows
- Multi-region deployment with compliance requirements

**Primary Technical Challenges:**

1. **Real-time Inventory Sync** - Reliable 60-second synchronization across 100+ stores with conflict resolution for simultaneous edits
2. **Mobile Performance** - <2 second response times over spotty 4G with large inventory datasets
3. **APAC Compliance** - Multi-region data residency while maintaining real-time sync latency
4. **Adoption-First Design** - Engineering UX that drives intuitive adoption without training
5. **Scalability Foundation** - Architecture supporting 10x store growth over 12 months

---

## Cross-Cutting Architectural Concerns

1. **Authentication & Authorization** - Role-based access (manager/associate/regional manager) with device verification
2. **Real-Time Data Consistency** - Inventory accuracy across simultaneous transactions at multiple locations
3. **Offline Capability** - Core features must work without connectivity; transparent sync when restored
4. **Observability & Monitoring** - Real-time insights into system health affecting store operations
5. **Audit & Compliance** - Complete transaction history for regulatory requirements and dispute resolution
6. **Multi-language Support** - UI/data formatting/error messages in local languages (Hindi, Thai, Vietnamese, Tagalog)

---

## Party Mode: Multi-Expert Architectural Evaluation ✓

**Experts Consulted:** Backend Architect (Rajesh), Frontend Architect (Maya), Infrastructure Architect (Chen)

### Key Architectural Recommendations

**Data Consistency Model:**
- **Inventory Module:** Strong consistency (critical for accuracy)
- **Dashboard Module:** Eventual consistency (acceptable 60-90 sec delay)
- **Scheduling Module:** Offline-first CRDT (conflict-free local edits)

**Recommended Technology Stack:**

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React with TanStack Query | Offline-first queries, real-time caching, adoption-friendly |
| **Mobile** | Responsive Web (no native) | Instant deployment, no app store friction, future-proof |
| **State Mgmt** | TanStack Query + local SQLite | Offline capability, <2 sec lookup response times |
| **Backend** | Node.js + Express | MVP speed, JavaScript ecosystem, rapid iteration |
| **Database** | PostgreSQL (primary) + Redis | ACID transactions for inventory, cache layer for speed |
| **Sync Engine** | Redis Streams + optimistic sync | MVP simplicity, scales to Kafka in Year 2 |
| **Infrastructure** | AWS (multi-region) | APAC regions (India, Singapore, Sydney), managed services |
| **Caching** | Redis + SQLite (client-side) | <2 sec lookups via local DB + cache validation |

**Real-Time Sync Architecture:**

```
MVP Approach (Months 1-3):
┌─────────────────────────────────────────┐
│ Store 1/2/N (Offline-First Capable)     │
│ ├─ SQLite (local cache)                  │
│ ├─ TanStack Query (state management)     │
│ └─ Sync queue (pending changes)          │
└────────────┬────────────────────────────┘
             │ (Optimistic sync - best effort)
             ↓
┌─────────────────────────────────────────┐
│ API Gateway (AWS)                       │
│ ├─ Rate limiting (prevent overload)     │
│ └─ Request deduplication                │
└────────────┬────────────────────────────┘
             │ (60-second batch sync)
             ↓
┌─────────────────────────────────────────┐
│ Backend Service Cluster                 │
│ ├─ PostgreSQL (inventory source of truth) │
│ ├─ Redis (cache layer)                   │
│ └─ Business logic (conflicts, approvals) │
└────────────┬────────────────────────────┘
             │ (Broadcast to Redis Streams)
             ↓
┌─────────────────────────────────────────┐
│ Redis Streams (event bus)               │
│ └─ Distribute updates to all stores      │
└─────────────────────────────────────────┘
```

**Conflict Resolution Strategy:**

For offline edits with simultaneous changes:
1. **Optimistic Updates:** Store clients apply changes immediately
2. **Server Authority:** Backend validates against source of truth
3. **Conflict Detection:** If conflict exists, server wins (inventory accuracy > responsiveness)
4. **User Notification:** Gentle notification if their change was overridden
5. **CRDT for Scheduling:** Use Last-Write-Wins for non-critical scheduling data

**MVP Implementation Approach:**

**Phase 1 (Weeks 1-4): Foundation**
- PostgreSQL + Redis deployment in APAC region
- React + TanStack Query frontend setup
- Basic authentication & role-based access
- Single-store sync working reliably

**Phase 2 (Weeks 5-8): Core Features**
- Inventory management (lookup, sync, offline)
- Order fulfillment (queue, barcode scanning)
- Dashboard (revenue, sales, leaderboards)
- Staff scheduling

**Phase 3 (Weeks 9-10): Multi-Store Sync**
- Real-time sync across 10+ stores
- Conflict resolution testing
- Performance optimization for <2 sec response

**Phase 4 (Weeks 11-12): Testing & Pilot**
- Comprehensive testing (performance, offline, compliance)
- Pilot deployment (10-15 stores in India/Thailand)
- Live support & rapid iteration

**APAC Multi-Region Deployment:**

```
Infrastructure Strategy:
┌─────────────────────────────────────┐
│ AWS India (Mumbai)                  │ ← Primary: India customers
│ ├─ PostgreSQL Primary               │
│ ├─ Redis Cluster                    │
│ └─ API Gateway                      │
└────────────┬────────────────────────┘
             │ (Async replication)
             ↓
┌─────────────────────────────────────┐
│ AWS Singapore                       │ ← APAC failover/cross-region
│ ├─ PostgreSQL Replica               │
│ ├─ Read-only operations             │
│ └─ Geo-distributed cache            │
└─────────────────────────────────────┘

Data Residency Compliance:
✓ India DPDP Act: Customer data stays in Mumbai
✓ Singapore APP: Cross-border data adequately protected
✓ Encryption: AES-256 at rest, TLS 1.3 in transit
✓ Access Logs: Complete audit trail for compliance
```

**Scaling Strategy (Year 1):**

| Phase | Stores | Infrastructure | Changes |
|-------|--------|-----------------|---------|
| MVP Launch (M1-3) | 10-15 | Single primary + replicas | Optimistic sync |
| Early Expansion (M4-6) | 100-200 | Add Kafka, sharding | Event sourcing intro |
| Mid-Year Scale (M7-9) | 300-400 | Multi-shard DB, CDN | Read replicas in SG/AU |
| Year-End Scale (M10-12) | 500+ | Full distributed system | CRDT-everywhere patterns |

### Architectural Philosophy: "Start Boring, Stay Boring"

The recommendation prioritizes **MVP speed and adoption** over architectural perfection:

✅ **MVP (Months 1-3):** Simple, proven patterns (optimistic sync, single database, Redis cache)  
✅ **Early Growth (Months 4-6):** Add complexity only when metrics prove need (Kafka, sharding)  
✅ **Scale Phase (Months 7-12):** Advanced patterns (event sourcing, CRDT, polyglot persistence)

This approach: Delivers MVP in 12-16 weeks, supports 85% adoption through simplicity, scales reliably to 500+ stores.

### Key Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Offline sync conflicts | Medium | CRDT for scheduling, server-wins for inventory |
| 4G latency causing >2 sec lookups | Medium | Client-side SQLite cache, delta sync |
| Peak-hour performance degradation | Medium | Auto-scaling groups, load testing at 2x capacity |
| Data residency compliance gaps | Low | Multi-region from Day 1, audit logging |
| Adoption blocked by UX friction | Low | Extensive user testing in Week 8-9, rapid iteration |

---

**Consensus:** Multi-expert review validates adoption-first design, polyglot consistency model, and MVP-focused technology choices. Ready to proceed with architectural decisions.

---

## Starter Template Evaluation ✓

**Primary Technology Domain:** Full-stack web application (React frontend + Node.js backend)

### Recommended Starter: React + Vite + TanStack Query

After evaluating current starter options, I recommend a custom baseline using modern, production-proven components rather than a rigid template:

**Why This Approach:**
- Maximum flexibility for bmaderp's unique requirements (offline-first, multi-region)
- Uses latest versions of all tools (Vite 5+, React 19, TanStack Query v5)
- Proven by teams building real production systems
- Better control over AWS integration and APAC deployment

**Technology Stack Initialization:**

```bash
# Frontend: Vite + React + TypeScript
npm create vite@latest bmaderp-frontend -- --template react-ts

# Install core dependencies
npm install \
  react@latest \
  react-dom@latest \
  @tanstack/react-query@latest \
  @tanstack/react-router@latest \
  tailwindcss \
  postcss \
  autoprefixer \
  axios

# Development tools
npm install --save-dev \
  typescript \
  @types/react \
  @types/react-dom \
  vite \
  @vitejs/plugin-react-swc \
  tailwindcss \
  postcss \
  prettier \
  eslint \
  eslint-config-prettier \
  vitest \
  @vitest/ui \
  playwright

# Backend: Node.js + Express + TypeScript
npm install express cors helmet dotenv
npm install --save-dev typescript @types/node ts-node nodemon
```

### Architectural Decisions Made by Stack

**Frontend Architecture:**
- **Build Tool:** Vite 5 (Lightning-fast, 100x faster than Webpack for dev)
- **React Version:** React 19 with concurrent features
- **State Management:** TanStack Query (optimized for server state, offline support)
- **Client-side Caching:** SQLite (via sql.js) for offline inventory lookups
- **Routing:** TanStack Router (file-based routing, type-safe)
- **Styling:** Tailwind CSS (utility-first, production-optimized)
- **Type Safety:** Full TypeScript with strict mode
- **Testing:** Vitest (Vite-native, 5x faster than Jest)
- **E2E Testing:** Playwright (multi-browser, real conditions)

**Backend Architecture:**
- **Runtime:** Node.js 20+ (LTS stable)
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Cache:** Redis (inventory sync, session management)
- **API Pattern:** REST with optional GraphQL layer for complex queries
- **Async Jobs:** Bull/BullMQ for async queue processing (inventory sync)
- **Authentication:** JWT + refresh tokens (stateless, scalable)

**Development Experience:**
- **Package Manager:** pnpm (faster, more efficient than npm/yarn)
- **Linting:** ESLint + Prettier (consistent code style)
- **Pre-commit Hooks:** Husky + lint-staged (catch issues before commit)
- **Git Workflow:** Conventional commits (structured changelog generation)
- **Environment Config:** dotenv for secrets, schema validation for env vars
- **Monorepo Structure:** Root packages for shared types/utilities

### Project Structure

```
bmaderp/
├── packages/
│   ├── frontend/                    # React app
│   │   ├── src/
│   │   │   ├── components/          # Reusable UI components
│   │   │   ├── pages/               # Page components
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   ├── services/            # API clients (axios instances)
│   │   │   ├── stores/              # Query state management
│   │   │   ├── lib/                 # Utilities, helpers
│   │   │   ├── types/               # TypeScript types
│   │   │   └── main.tsx
│   │   ├── vite.config.ts           # Vite configuration
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── backend/                     # Express API
│   │   ├── src/
│   │   │   ├── routes/              # API endpoints
│   │   │   ├── controllers/         # Route handlers
│   │   │   ├── services/            # Business logic
│   │   │   ├── db/                  # Database (Prisma models)
│   │   │   ├── middleware/          # Auth, logging, errors
│   │   │   ├── types/               # TypeScript types
│   │   │   └── index.ts             # Server entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Database schema
│   │   │   └── migrations/          # Schema versions
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── shared/                      # Shared types/utilities
│       ├── types/                   # Common TypeScript interfaces
│       └── constants/               # Shared constants
│
├── docker-compose.yml               # Local development (PostgreSQL, Redis)
├── tsconfig.base.json               # Root TypeScript config
├── package.json                     # Monorepo root
└── pnpm-workspace.yaml              # Monorepo configuration
```

### Implementation Timeline

**Week 1-2: Foundation & Setup**
```bash
# Step 1: Create monorepo
pnpm init
# Configure workspace (pnpm-workspace.yaml)

# Step 2: Frontend
npm create vite@latest packages/frontend -- --template react-ts
cd packages/frontend && npm install [dependencies]
# Setup Tailwind, ESLint, Prettier, TypeScript strict mode

# Step 3: Backend
cd packages/backend
npm init -y
npm install express cors helmet dotenv
npm install --save-dev typescript @types/node ts-node nodemon
# Setup Docker Compose for PostgreSQL + Redis

# Step 4: Database
npm install @prisma/client
npx prisma init
# Define initial schema (users, inventory, orders)
```

**Week 3-4: Core Features (using this foundation)**
- Inventory API endpoints (/api/inventory/*)
- React components for inventory lookup
- TanStack Query setup with offline sync
- Authentication middleware

**Weeks 5-8: Full feature implementation** with this solid foundation

### Why This Works for bmaderp

✅ **MVP Speed:** All tooling pre-configured, focus on business logic not setup  
✅ **Adoption-First:** React 19 concurrent features for smooth UX  
✅ **Offline Capability:** TanStack Query + SQLite built-in support  
✅ **Type Safety:** Full TypeScript prevents runtime errors  
✅ **Performance:** Vite + SWC = 100x faster development  
✅ **Scalability:** Monorepo structure supports team scaling  
✅ **AWS Ready:** Express backend deploys easily to Lambda/ECS  

---

---

## Core Architectural Decisions ✓

### Decision 1: Data Architecture - Hybrid with Local Caches ✓

**Decision:** Distributed architecture with local SQLite caches on clients, PostgreSQL as source of truth

**Why This Choice:**
- Enables <100ms local inventory lookups (critical for adoption)
- Supports offline-first capability (handles 4G connectivity gaps)
- Achievable within 12-16 week MVP timeline
- Proven pattern used by Shopify, Square, and other retail SaaS

**Implementation:**

```
Architecture Layers:

┌─────────────────────────────────────────┐
│ Store 1-500 (Web Browsers)              │
│ ├─ SQLite Local Cache (inventory)       │
│ ├─ Sync Queue (pending changes)         │
│ └─ TanStack Query (automatic sync)      │
└────────────┬────────────────────────────┘
             │ (60-second sync cycle)
             ↓
┌─────────────────────────────────────────┐
│ Redis Pub/Sub (Event Bus)               │
│ ├─ Inventory updates                    │
│ ├─ Order changes                        │
│ └─ Broadcast to all connected stores    │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│ Express API Gateway                     │
│ ├─ Request validation                   │
│ ├─ Conflict detection                   │
│ └─ Write to PostgreSQL                  │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│ PostgreSQL (Source of Truth)            │
│ ├─ Inventory (current state)            │
│ ├─ Orders (transactional)               │
│ ├─ Audit log (change history)           │
│ └─ Located in Mumbai (APAC compliance)  │
└─────────────────────────────────────────┘
```

**Conflict Resolution Strategy:**
- Inventory: Server wins (accuracy critical)
- Orders: Last-write-wins with notification
- Scheduling: CRDT (conflict-free local edits)

**Scalability:**
- 100 stores: Single Redis instance
- 500+ stores: Redis cluster with sharding

**Phase 2 Enhancement:** Add event sourcing layer for complete audit trail and advanced analytics

---

### Decision 2: Authentication & Security

**Sub-Decision 2A: Authentication Method**

**Options:**
- **JWT Tokens:** Stateless, scales well, standard for SaaS
- **Session-based:** Traditional, requires sticky sessions at scale
- **OAuth2:** Adds complexity, good for third-party integrations

**Choice: JWT Tokens with Refresh Rotation**

**Why:**
- Stateless = scales to 500+ stores without session replication
- Refresh token rotation = enhanced security
- Mobile-friendly = key for APAC retail
- Works offline (JWT cached locally)

**Implementation:**
```typescript
// Token strategy
- Access token: 15 minutes (short-lived)
- Refresh token: 7 days (stored securely)
- Token rotation on each refresh
- Rate limiting: 5 failed attempts = 15 min lockout
```

**Sub-Decision 2B: Role-Based Access Control (RBAC)**

**Roles needed:**
1. **Store Manager** (Priya) - Full store visibility, approvals
2. **Sales Associate** (Ravi) - Own sales, inventory lookup
3. **Regional Manager** - Multi-store dashboards
4. **Admin** - System configuration, user management

**Implementation:**
```
Permissions mapped to API routes:
- /inventory/* → Store Manager + Sales Associate
- /orders/* → Depends on order status (manager approval)
- /reports/* → Store Manager + Regional Manager
- /settings/* → Admin only
```

**Sub-Decision 2C: Data Encryption**

- **In Transit:** TLS 1.3 for all API calls
- **At Rest:** AES-256 for sensitive data (passwords, payment info)
- **Key Management:** AWS Secrets Manager for prod, dotenv for dev

**Multi-region Security for APAC Compliance:**
```
- India primary DB: Encrypted with AWS India KMS
- Singapore replica: Encrypted with AWS Singapore KMS
- Cross-region keys: Regional key rotation policy
```

**Your input needed:**

Do you have any concerns about JWT tokens or RBAC approach, or shall we move to API design decisions?

**[C] Continue to API & Communication decisions**

---

### Decision 3: API & Communication Patterns

**Sub-Decision 3A: API Design Style**

**Options:**
- **REST:** Simple, stateless, perfect for CRUD operations
- **GraphQL:** Powerful for complex queries, steeper learning curve
- **gRPC:** High performance, requires schema versioning

**Choice: REST with JSON:API specification**

**Why:**
- Simpler learning curve for team
- Perfect for retail CRUD operations (inventory, orders, etc.)
- Easier client code generation
- Better caching semantics than GraphQL

**API Structure:**
```
GET /api/stores/{storeId}/inventory
  - List all inventory
  
GET /api/stores/{storeId}/inventory/{sku}
  - Get specific item (fast lookup for Ravi)
  
POST /api/orders
  - Create fulfillment order
  
PATCH /api/stores/{storeId}/inventory/{sku}
  - Update stock (sync from store client)
```

**Sub-Decision 3B: Real-Time Communication**

**Options:**
- **WebSockets:** Real-time, stateful, requires scaling infrastructure
- **Server-Sent Events (SSE):** One-way, simpler than WebSockets
- **Polling + Redis Pub/Sub:** Stateless, proven at scale

**Choice: Polling (every 60 seconds) + Redis Pub/Sub for urgent updates**

**Why:**
- Stateless infrastructure (easier to scale)
- Reduced complexity vs WebSockets
- Aligns with 60-second sync interval
- Polling is reliable on unstable 4G connections
- Redis Pub/Sub for high-priority alerts (stock critical, order urgent)

**Implementation:**
```typescript
// Client-side: TanStack Query polling
useQuery({
  queryKey: ['inventory', storeId],
  queryFn: fetchInventory,
  refetchInterval: 60000,  // 60 seconds
  staleTime: 50000,        // Refresh before stale
})

// Server: Redis broadcast for urgent updates
await redis.publish(`inventory:update`, {
  storeId: '123',
  items: [{ sku: 'ABC', quantity: 5 }]
})
```

**Sub-Decision 3C: Error Handling & Resilience**

**Standardized Error Responses:**
```json
{
  "code": "INVENTORY_SYNC_FAILED",
  "message": "Unable to sync inventory with server",
  "statusCode": 503,
  "retryAfter": 30,
  "context": {
    "lastSyncTime": "2025-12-03T10:30:00Z",
    "itemsQueued": 5
  }
}
```

**Retry Strategy:**
- Exponential backoff: 1s → 2s → 4s → 8s (max)
- Max retries: 5 attempts over ~15 seconds
- Circuit breaker: Fail fast after threshold, retry after cooldown
- Local fallback: Use cached data if API unavailable

**Sub-Decision 3D: API Versioning**

**Choice: Header-based versioning (v1, v2, etc.)**

**Why:**
- Cleaner URLs than path-based versioning
- Easier testing and debugging
- Explicit version management

```
GET /api/inventory/lookup
  Accept: application/vnd.bmaderp.v1+json
```

---

### Decision 4: Frontend Architecture

**Sub-Decision 4A: State Management**

**Choice: TanStack Query (React Query) + Zustand for local UI state**

**Why:**
- TanStack Query: Optimized for server state + offline
- Zustand: Minimal local state (UI preferences, filters)
- Together: Perfect for retail adoption (simple mental model)

**Implementation:**
```typescript
// Server state (inventory, orders) - TanStack Query
const { data: inventory } = useQuery(['inventory', storeId])

// Local UI state (sidebar open, filter selection) - Zustand
const { sidebarOpen, toggleSidebar } = useUIStore()
```

**Sub-Decision 4B: Component Architecture**

**Pattern: Compound Components + Hooks**

```
components/
├── Inventory/
│   ├── InventoryList.tsx      (compound root)
│   ├── InventoryList.Item.tsx (child component)
│   ├── InventoryList.Header.tsx
│   └── useInventoryList.ts    (custom hook with logic)
├── Order/
│   ├── OrderForm.tsx
│   └── useOrderForm.ts
└── common/
    ├── Button.tsx
    └── Modal.tsx
```

**Sub-Decision 4C: Performance Optimization**

**Key Tactics:**
1. **Code Splitting:** Lazy load by route (Inventory, Orders, Dashboard)
2. **Image Optimization:** WebP with fallback, responsive sizing
3. **Bundle Analysis:** Monthly reviews, target <100KB gzipped initial load
4. **Memoization:** React.memo for expensive components, useMemo for computations
5. **Infinite Scroll:** For order/transaction lists (better than pagination on mobile)

**Target Metrics:**
- Initial load: <3 seconds on 4G
- Time to interactive: <5 seconds
- Lighthouse score: >80

---

### Decision 5: Infrastructure & Deployment

**Sub-Decision 5A: Hosting Platform**

**Choice: AWS (multi-region for APAC)**

**Regions:**
- Primary: Mumbai (India customers)
- Secondary: Singapore (Southeast Asia)
- Tertiary: Sydney (Australia)

**Services:**
- **Frontend:** CloudFront (CDN) + S3 (static hosting)
- **Backend:** ECS Fargate (containers, auto-scaling)
- **Database:** RDS PostgreSQL with Multi-AZ
- **Cache:** ElastiCache Redis
- **Storage:** S3 for documents, images

**Sub-Decision 5B: CI/CD Pipeline**

**Choice: GitHub Actions + AWS CodeDeploy**

```yaml
Workflow:
1. Developer pushes to GitHub
2. GitHub Actions: Run tests, lint, build
3. If passed: Build Docker image → ECR registry
4. Trigger: CodeDeploy to ECS (rolling update)
5. Smoke tests: Verify health endpoints
6. Rollback: Automatic if health checks fail
```

**Deployment Frequency:** Multiple times daily (trunk-based development)

**Sub-Decision 5C: Monitoring & Logging**

**Choice: CloudWatch + X-Ray for tracing**

**Key Metrics Monitored:**
- API response times (p50, p95, p99)
- Database query performance
- Cache hit/miss ratios
- Sync lag (60-second target)
- Error rates by endpoint
- User engagement (daily active stores)

**Alerting Thresholds:**
- P95 response time > 2 seconds
- Error rate > 1%
- Sync lag > 120 seconds
- Database CPU > 80%

**Sub-Decision 5D: Scaling Strategy**

**Horizontal Scaling:**
- ECS auto-scaling: 2 baseline → 10 during peak (lunch hours 12-1 PM, 5-7 PM)
- Redis cluster: Sharding by store region when > 200 stores
- Database: Read replicas in Singapore/Sydney for regional queries

**Vertical Scaling Limits:**
- Don't scale single instance beyond 32GB RAM
- Split into microservices if needed (Phase 2)

---

## Architecture Decision Summary

| Decision | Choice | Rationale | Impact |
|----------|--------|-----------|--------|
| Data | Hybrid (local caches + server) | Adoption + offline support | Core enabler for MVP |
| Auth | JWT with refresh rotation | Scalable, mobile-friendly | Security foundation |
| RBAC | 4-role model | Store/Associate/Manager/Admin | Access control layer |
| API | REST + JSON:API | Simple, proven, retail-focused | Development velocity |
| Real-time | Polling (60s) + pub/sub for alerts | Stateless, reliable on 4G | Operational simplicity |
| Frontend State | TanStack Query + Zustand | Server state + UI state separation | User adoption experience |
| Deployment | AWS multi-region | APAC compliance, proven SaaS platform | Reliability + compliance |
| Monitoring | CloudWatch + alerts | Operational visibility | Production readiness |

---

## Cascading Implementation Dependencies

**Must Build First (Week 1-2):**
1. Authentication & JWT tokens → Required for all other APIs
2. PostgreSQL schema + migrations → Foundation for all data operations
3. Redis connection + pub/sub setup → Sync infrastructure

**Build Next (Week 3-4):**
4. Inventory API endpoints (RESTful)
5. React components (with TanStack Query)
6. Local cache (SQLite via sql.js)

**Build After (Week 5-8):**
7. Real-time sync (polling + Redis)
8. Order fulfillment workflows
9. Dashboard and analytics

---

All critical architectural decisions are now locked in. Ready to proceed to implementation patterns?

**[C] Continue - Save decisions and move to implementation patterns**





