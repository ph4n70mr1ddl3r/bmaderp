---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - product-brief-bmaderp-2025-12-02.md
  - user-personas-apac-retail-erp-2025.md
  - research/market-retail-erp-research-2025-12-02.md
  - customer-insights-apac-retail-2025.md
workflowType: 'architecture'
lastStep: 7
project_name: 'bmaderp'
user_name: 'Riddler'
date: '2025-12-03'
partyModeCompleted: true
partyModeValidation: complete
enhancements: ['conflict-notifications', 'database-schema', 'sync-testing']
architectureStatus: 'READY_FOR_IMPLEMENTATION'
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

---

## Project Structure & Boundaries ✓

### Complete Project Directory Structure

Based on architectural decisions (React 19 + Vite 5 + Node.js + PostgreSQL + Redis), here is the comprehensive project structure:

```
bmaderp/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # GitHub Actions: Build, test, lint
│       ├── deploy.yml                # AWS CodeDeploy trigger
│       └── security-scan.yml         # Vulnerability scanning
│
├── docs/
│   ├── analysis/
│   │   ├── architecture.md           # This document
│   │   ├── product-brief-bmaderp-2025-12-02.md
│   │   ├── user-personas-apac-retail-erp-2025.md
│   │   └── customer-insights-apac-retail-2025.md
│   ├── api/
│   │   ├── inventory.md              # Inventory API specification
│   │   ├── orders.md                 # Order API specification
│   │   ├── dashboard.md              # Dashboard API specification
│   │   ├── scheduling.md             # Scheduling API specification
│   │   └── authentication.md         # Auth API specification
│   ├── deployment/
│   │   ├── aws-multi-region.md       # AWS deployment architecture
│   │   ├── local-development.md      # Local setup instructions
│   │   └── database-migrations.md    # Schema version history
│   └── operations/
│       ├── monitoring.md             # CloudWatch dashboards, alerts
│       ├── runbooks.md               # Production incident response
│       └── capacity-planning.md      # Scaling decisions
│
├── packages/
│   ├── frontend/                     # React 19 + Vite 5 application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Layout/
│   │   │   │   │   ├── MainLayout.tsx       # App shell
│   │   │   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   │   │   ├── Header.tsx           # Top header with user menu
│   │   │   │   │   └── Footer.tsx           # Footer
│   │   │   │   │
│   │   │   │   ├── Inventory/               # Inventory feature components
│   │   │   │   │   ├── InventoryList.tsx           # Root component
│   │   │   │   │   ├── InventoryList.Item.tsx      # Item row
│   │   │   │   │   ├── InventoryList.Header.tsx    # Table header
│   │   │   │   │   ├── InventoryLookup.tsx         # Fast search/lookup
│   │   │   │   │   ├── StockUpdate.tsx             # Manual stock adjustment
│   │   │   │   │   ├── InventoryFilter.tsx         # Category/status filter
│   │   │   │   │   └── BarcodeScanner.tsx          # Barcode input
│   │   │   │   │
│   │   │   │   ├── Orders/                  # Order fulfillment components
│   │   │   │   │   ├── FulfillmentQueue.tsx        # Order queue view
│   │   │   │   │   ├── OrderCard.tsx               # Order summary
│   │   │   │   │   ├── OrderDetails.tsx            # Full order details
│   │   │   │   │   ├── ItemPicker.tsx              # Pick items for fulfillment
│   │   │   │   │   ├── ReturnFlow.tsx              # Return/exchange process
│   │   │   │   │   └── OrderNotification.tsx       # New order alert
│   │   │   │   │
│   │   │   │   ├── Dashboard/               # Analytics & KPIs
│   │   │   │   │   ├── DashboardPage.tsx           # Main dashboard
│   │   │   │   │   ├── RevenueCard.tsx             # Revenue vs target
│   │   │   │   │   ├── SalesByCategory.tsx         # Category breakdown
│   │   │   │   │   ├── TopPerformers.tsx           # Leaderboard
│   │   │   │   │   ├── CommissionTracker.tsx       # Associate commission
│   │   │   │   │   └── PerformanceAlerts.tsx       # Milestone notifications
│   │   │   │   │
│   │   │   │   ├── Scheduling/              # Staff scheduling
│   │   │   │   │   ├── ScheduleView.tsx            # Weekly schedule grid
│   │   │   │   │   ├── ShiftCard.tsx               # Individual shift
│   │   │   │   │   ├── SwapRequest.tsx             # Shift swap UI
│   │   │   │   │   ├── LeaveRequest.tsx            # Leave application
│   │   │   │   │   ├── Attendance.tsx              # Check-in/check-out
│   │   │   │   │   └── ScheduleNotifications.tsx   # Approval alerts
│   │   │   │   │
│   │   │   │   ├── Auth/                   # Authentication components
│   │   │   │   │   ├── LoginForm.tsx               # Store/associate login
│   │   │   │   │   ├── PasswordReset.tsx           # Password reset flow
│   │   │   │   │   └── SessionExpiry.tsx           # Token refresh warning
│   │   │   │   │
│   │   │   │   ├── Admin/                  # Admin-only features
│   │   │   │   │   ├── UserManagement.tsx          # Create/update users
│   │   │   │   │   ├── StoreConfiguration.tsx      # Store settings
│   │   │   │   │   ├── RolePermissions.tsx         # RBAC management
│   │   │   │   │   └── AuditLog.tsx                # System audit trail
│   │   │   │   │
│   │   │   │   ├── Common/                 # Shared UI components
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Table.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Dropdown.tsx
│   │   │   │   │   ├── Toast.tsx                   # Notifications
│   │   │   │   │   ├── Spinner.tsx                 # Loading state
│   │   │   │   │   ├── EmptyState.tsx              # Empty content
│   │   │   │   │   └── ErrorBoundary.tsx           # Error handling
│   │   │   │   │
│   │   │   │   └── Offline/                # Offline indicators
│   │   │   │       ├── OfflineBanner.tsx           # Sync status indicator
│   │   │   │       ├── SyncQueue.tsx               # Pending changes display
│   │   │   │       └── ConflictResolver.tsx        # Sync conflict UI
│   │   │   │
│   │   │   ├── pages/                      # Page-level components (by route)
│   │   │   │   ├── InventoryPage.tsx
│   │   │   │   ├── OrdersPage.tsx
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── SchedulingPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── AdminPage.tsx
│   │   │   │   └── NotFoundPage.tsx
│   │   │   │
│   │   │   ├── hooks/                      # Custom React hooks
│   │   │   │   ├── useAuth.ts              # Auth state, login/logout
│   │   │   │   ├── useInventory.ts         # Inventory query + offline sync
│   │   │   │   ├── useOrders.ts            # Orders query and mutations
│   │   │   │   ├── useDashboard.ts         # Dashboard metrics
│   │   │   │   ├── useScheduling.ts        # Schedule queries
│   │   │   │   ├── useLocalStorage.ts      # Persistent local state
│   │   │   │   ├── useSync.ts              # Sync status management
│   │   │   │   ├── usePageVisibility.ts    # Detect tab visibility
│   │   │   │   └── useUIStore.ts           # Local UI state (Zustand)
│   │   │   │
│   │   │   ├── services/                   # API client services
│   │   │   │   ├── api.ts                  # Axios instance with interceptors
│   │   │   │   ├── auth.service.ts         # Auth endpoints
│   │   │   │   ├── inventory.service.ts    # Inventory endpoints
│   │   │   │   ├── orders.service.ts       # Order endpoints
│   │   │   │   ├── dashboard.service.ts    # Dashboard/analytics
│   │   │   │   ├── scheduling.service.ts   # Schedule endpoints
│   │   │   │   └── sync.service.ts         # Local↔server sync
│   │   │   │
│   │   │   ├── stores/                     # Zustand stores (local UI state)
│   │   │   │   ├── uiStore.ts              # Sidebar, filters, modals
│   │   │   │   ├── authStore.ts            # Current user, token, roles
│   │   │   │   ├── syncStore.ts            # Sync queue, conflicts
│   │   │   │   └── cacheStore.ts           # SQLite cache invalidation
│   │   │   │
│   │   │   ├── lib/                        # Utilities and helpers
│   │   │   │   ├── db/
│   │   │   │   │   ├── sqlite.ts           # SQLite initialization
│   │   │   │   │   ├── queries.ts          # Common SQL queries
│   │   │   │   │   └── sync.ts             # Offline sync logic
│   │   │   │   ├── errors.ts               # Error handling utilities
│   │   │   │   ├── validation.ts           # Form validation helpers
│   │   │   │   ├── formatting.ts           # Number, date formatting
│   │   │   │   ├── auth.ts                 # Token management
│   │   │   │   ├── logger.ts               # Client-side logging
│   │   │   │   ├── retry.ts                # Retry logic
│   │   │   │   ├── constants.ts            # App constants, timeouts
│   │   │   │   └── env.ts                  # Environment config
│   │   │   │
│   │   │   ├── types/                      # TypeScript type definitions
│   │   │   │   ├── index.ts                # Shared types export
│   │   │   │   ├── api.ts                  # API request/response types
│   │   │   │   ├── domain.ts               # Business domain types
│   │   │   │   ├── store.ts                # Store/inventory types
│   │   │   │   ├── order.ts                # Order types
│   │   │   │   ├── user.ts                 # User/auth types
│   │   │   │   └── sync.ts                 # Sync-related types
│   │   │   │
│   │   │   ├── App.tsx                     # Root component
│   │   │   ├── App.css
│   │   │   └── main.tsx                    # Entry point
│   │   │
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   ├── logo.png
│   │   │   └── assets/
│   │   │       ├── icons/
│   │   │       └── images/
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   │   ├── components/             # Component unit tests
│   │   │   │   ├── hooks/                  # Hook unit tests
│   │   │   │   ├── services/               # Service unit tests
│   │   │   │   └── lib/                    # Utility tests
│   │   │   ├── integration/
│   │   │   │   ├── auth.test.ts            # Login flow integration
│   │   │   │   ├── inventory.test.ts       # Inventory flow
│   │   │   │   └── sync.test.ts            # Sync flow
│   │   │   ├── e2e/
│   │   │   │   ├── inventory.spec.ts       # E2E with Playwright
│   │   │   │   ├── orders.spec.ts
│   │   │   │   └── offline.spec.ts         # Offline functionality
│   │   │   └── fixtures/                   # Mock data, test utilities
│   │   │
│   │   ├── vite.config.ts                  # Vite build configuration
│   │   ├── vitest.config.ts                # Vitest testing configuration
│   │   ├── tsconfig.json                   # TypeScript configuration
│   │   ├── tailwind.config.js              # Tailwind CSS setup
│   │   ├── postcss.config.js               # PostCSS setup
│   │   ├── .eslintrc.json                  # ESLint rules
│   │   ├── .prettierrc.json                # Code formatting
│   │   ├── index.html                      # HTML entry point
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── backend/                           # Node.js + Express API
│   │   ├── src/
│   │   │   ├── index.ts                    # Server entry point
│   │   │   ├── app.ts                      # Express app setup
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts      # JWT verification
│   │   │   │   ├── errorHandler.ts         # Global error handling
│   │   │   │   ├── logging.ts              # Request/response logging
│   │   │   │   ├── rateLimit.ts            # Rate limiting
│   │   │   │   └── corsConfig.ts           # CORS setup
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── index.ts                # Route mounting
│   │   │   │   ├── auth.routes.ts          # Login, refresh token
│   │   │   │   ├── inventory.routes.ts     # Inventory endpoints
│   │   │   │   ├── orders.routes.ts        # Order endpoints
│   │   │   │   ├── dashboard.routes.ts     # Analytics endpoints
│   │   │   │   ├── scheduling.routes.ts    # Schedule endpoints
│   │   │   │   ├── admin.routes.ts         # Admin endpoints
│   │   │   │   └── sync.routes.ts          # Sync endpoint
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts      # Login/logout logic
│   │   │   │   ├── inventory.controller.ts # Inventory operations
│   │   │   │   ├── orders.controller.ts    # Order fulfillment
│   │   │   │   ├── dashboard.controller.ts # Analytics queries
│   │   │   │   ├── scheduling.controller.ts
│   │   │   │   ├── admin.controller.ts
│   │   │   │   └── sync.controller.ts      # Sync logic
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts         # JWT generation, validation
│   │   │   │   ├── inventory.service.ts    # Stock operations
│   │   │   │   ├── orders.service.ts       # Order processing
│   │   │   │   ├── dashboard.service.ts    # Metrics calculation
│   │   │   │   ├── scheduling.service.ts   # Schedule management
│   │   │   │   ├── sync.service.ts         # Conflict resolution
│   │   │   │   ├── notification.service.ts # Order, alert notifications
│   │   │   │   └── admin.service.ts        # User, role management
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   ├── base.repository.ts      # Base CRUD methods
│   │   │   │   ├── user.repository.ts
│   │   │   │   ├── inventory.repository.ts
│   │   │   │   ├── order.repository.ts
│   │   │   │   ├── schedule.repository.ts
│   │   │   │   └── auditLog.repository.ts
│   │   │   │
│   │   │   ├── db/
│   │   │   │   ├── prisma.ts               # Prisma client setup
│   │   │   │   ├── connection.ts           # DB connection pooling
│   │   │   │   └── redis.ts                # Redis client + pub/sub
│   │   │   │
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   │   │   ├── api.ts                  # Request/response types
│   │   │   │   ├── domain.ts               # Business logic types
│   │   │   │   ├── jwt.ts                  # JWT payload shape
│   │   │   │   └── errors.ts               # Custom error types
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── logger.ts               # Structured logging
│   │   │   │   ├── errors.ts               # Error classes
│   │   │   │   ├── retry.ts                # Retry mechanisms
│   │   │   │   ├── validator.ts            # Input validation
│   │   │   │   ├── constants.ts
│   │   │   │   └── env.ts                  # Environment validation
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   ├── syncBroadcast.job.ts    # Redis broadcast job
│   │   │   │   ├── metricsAggregation.job.ts # Dashboard metrics
│   │   │   │   └── cleanupOldLogs.job.ts   # Log retention
│   │   │   │
│   │   │   └── config/
│   │   │       ├── index.ts                # App configuration
│   │   │       ├── jwt.config.ts
│   │   │       ├── db.config.ts
│   │   │       └── redis.config.ts
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma               # Database schema (ORM)
│   │   │   ├── seed.ts                     # Seed initial data
│   │   │   └── migrations/
│   │   │       ├── migration_lock.toml
│   │   │       └── [timestamp]_init/
│   │   │           └── migration.sql       # SQL migration files
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   │   ├── services/
│   │   │   │   ├── repositories/
│   │   │   │   └── lib/
│   │   │   ├── integration/
│   │   │   │   ├── auth.test.ts
│   │   │   │   ├── inventory.test.ts
│   │   │   │   ├── sync.test.ts
│   │   │   │   └── db.setup.ts             # Test DB helpers
│   │   │   └── fixtures/                   # Mock data
│   │   │
│   │   ├── tsconfig.json
│   │   ├── .eslintrc.json
│   │   ├── .prettierrc.json
│   │   ├── nodemon.json                    # Development reload config
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── shared/                            # Shared types across packages
│       ├── types/
│       │   ├── api.ts                     # API types shared frontend/backend
│       │   ├── domain.ts                  # Business domain types
│       │   └── index.ts
│       ├── constants/
│       │   ├── roles.ts                   # User roles enum
│       │   ├── endpoints.ts               # API route paths
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── .github/
│   ├── pull_request_template.md
│   └── CODEOWNERS
│
├── .gitignore
├── .env.example                           # Template for environment variables
├── docker-compose.yml                     # Local development (PostgreSQL, Redis)
├── docker-compose.prod.yml                # Production deployment config
├── Dockerfile                             # Multi-stage build for backend/frontend
├── tsconfig.base.json                     # Root TypeScript configuration
├── pnpm-workspace.yaml                    # Monorepo workspace config
├── package.json                           # Root package (scripts, dependencies)
├── pnpm-lock.yaml                         # Lockfile for reproducible installs
├── README.md                              # Project overview and setup
└── CONTRIBUTING.md                        # Development guidelines
```

---

### Architectural Boundaries

#### API Boundaries

**Authentication Boundary:**
- All routes except `/auth/login` require valid JWT token in `Authorization: Bearer {token}` header
- Token validation middleware (`auth.middleware.ts`) runs before all protected endpoints
- Refresh token rotation on every token refresh to prevent token reuse

**Role-Based Access Boundaries:**
```
/api/inventory/*
  ├─ GET /inventory (all authenticated users)
  ├─ GET /inventory/{sku} (all authenticated users)
  └─ PATCH /inventory/{sku} (Store Manager only)

/api/orders/*
  ├─ GET /orders (Manager + Associate - filtered to relevant)
  ├─ POST /orders (Auto-generated by system)
  ├─ PATCH /orders/{id}/fulfill (Associate + Manager)
  └─ PATCH /orders/{id}/return (Manager approval)

/api/dashboard/*
  ├─ GET /dashboard/kpis (Manager only - store-level)
  └─ GET /dashboard/personal (Associate only - personal stats)

/api/scheduling/*
  ├─ GET /schedule (All users - read own)
  ├─ POST /schedule/swap (Associate request)
  ├─ PATCH /schedule/swap/{id}/approve (Manager approval)
  └─ PATCH /schedule/attendance (Check-in/out)

/api/admin/*
  └─ All endpoints (Admin only)
```

**External Integration Boundaries:**
- WhatsApp notifications via third-party API (order alerts, schedule changes)
- SMS notifications for critical alerts (stock critical, overstock conditions)
- Payment gateway for refunds (via webhook validation)

#### Component Boundaries

**Frontend Component Communication:**

```
Main Flow (top-level → child):
MainLayout
  ├─ useAuth() hook fetches user/roles
  ├─ Routes child components based on role
  │
  ├─ InventoryPage
  │   ├─ useInventory() → TanStack Query (server state)
  │   ├─ useUIStore() → Zustand (local filters)
  │   └─ InventoryList (displays data)
  │       ├─ InventoryList.Header (column sort)
  │       ├─ InventoryList.Item (row click → detail view)
  │       └─ InventoryLookup (barcode scanner)
  │
  └─ OrdersPage
      ├─ useOrders() → TanStack Query (queue)
      ├─ FulfillmentQueue (card-based queue)
      │   ├─ OrderCard (summary)
      │   ├─ ItemPicker (pick items)
      │   └─ OrderNotification (toast alerts)
      └─ ReturnFlow (return modal)
```

**State Management Boundaries:**

```
TanStack Query (Server State):
  ├─ Inventory data (source: /api/inventory)
  ├─ Orders (source: /api/orders)
  ├─ Dashboard metrics (source: /api/dashboard)
  └─ Auto-refetch on window focus + 60s polling

Zustand (Local UI State):
  ├─ Sidebar expanded/collapsed
  ├─ Current filter selections
  ├─ Modal open/closed states
  └─ Current tab/view (no server sync)

SQLite (Client-side Cache):
  ├─ Full inventory copy (for offline lookup)
  ├─ Last known orders (for offline queue)
  └─ Sync status/conflict tracking
```

#### Service Boundaries

**Backend Service Integration:**

```
Auth Service (Entry Point):
  ├─ JWT generation/verification
  ├─ Refresh token rotation
  └─ Role permission checking

Inventory Service (Core Logic):
  ├─ Stock query (from PostgreSQL)
  ├─ Stock update with conflict detection
  ├─ Redis cache invalidation
  └─ Broadcast to Redis for all stores

Order Service (Fulfillment):
  ├─ Order queue management
  ├─ Item fulfillment processing
  ├─ Return/exchange workflows
  └─ Notification service calls

Dashboard Service (Analytics):
  ├─ KPI calculation (caching results)
  ├─ Trend analysis (from audit logs)
  └─ Leaderboard computation (hourly cache)

Scheduling Service (Staff):
  ├─ Schedule CRUD
  ├─ Swap request workflows
  ├─ Leave management
  └─ Auto check-in logic

Admin Service (Management):
  ├─ User creation/role assignment
  ├─ Store configuration
  ├─ Permission management
  └─ Audit log queries

Sync Service (Offline-First):
  ├─ Conflict detection (client vs. server)
  ├─ Merge resolution (server-wins for inventory)
  ├─ Delta sync (only changed records)
  └─ Queue persistence (survive crashes)
```

#### Data Boundaries

**Database Schema Boundaries:**

```
Users Table (auth.ts service)
  ├─ User credentials + roles
  └─ Password hashed (bcrypt)

Inventory Table (inventory.ts service)
  ├─ SKU, quantity, location (store_id)
  ├─ Indexed by: store_id, sku (for fast lookup)
  └─ Updated by: stock adjustments, fulfillment

Orders Table (orders.ts service)
  ├─ Order details, status, items
  ├─ Fulfillment workflow tracking
  └─ Indexed by: store_id, status, date

Schedules Table (scheduling.ts service)
  ├─ Shift assignments, swap requests
  ├─ Attendance records (check-in/out)
  └─ Indexed by: store_id, user_id, date

Audit Log Table (all services write)
  ├─ Change history (who, what, when)
  ├─ Partitioned by: date, store_id
  └─ Used for compliance + analytics

Cache Layer (Redis):
  ├─ Inventory by SKU (expires 5 minutes)
  ├─ Dashboard KPIs (expires 15 minutes)
  ├─ Active sessions (refresh on activity)
  └─ Sync queue for clients (persisted)
```

**Client-Side Cache (SQLite):**
```
Inventory Cache Table:
  ├─ store_id, sku, quantity, updated_at
  ├─ Synced every 60 seconds from server
  └─ Used for <100ms lookups (offline support)

Sync Queue Table:
  ├─ Pending operations (INSERT, UPDATE)
  ├─ Retry count + timestamp
  └─ Cleared when sync succeeds

Conflict Table:
  ├─ Detected conflicts (server vs. local)
  ├─ Resolution (accepted/rejected)
  └─ Audit of sync failures
```

---

### Requirements to Structure Mapping

#### Feature/Epic Mapping

**Epic 1: Real-Time Inventory Management**
```
Components:  packages/frontend/src/components/Inventory/
Routes:      packages/frontend/src/pages/InventoryPage.tsx
API:         packages/backend/src/routes/inventory.routes.ts
Services:    packages/backend/src/services/inventory.service.ts
Database:    prisma/schema.prisma (InventoryItem, Store)
Tests:       packages/frontend/tests/integration/inventory.test.ts
             packages/backend/tests/integration/inventory.test.ts
```

**Epic 2: Mobile-First Order Management**
```
Components:  packages/frontend/src/components/Orders/
Routes:      packages/frontend/src/pages/OrdersPage.tsx
API:         packages/backend/src/routes/orders.routes.ts
Services:    packages/backend/src/services/orders.service.ts
Database:    prisma/schema.prisma (Order, OrderItem)
Tests:       packages/frontend/tests/integration/orders.test.ts
             packages/backend/tests/integration/orders.test.ts
```

**Epic 3: Real-Time Sales Dashboard**
```
Components:  packages/frontend/src/components/Dashboard/
Routes:      packages/frontend/src/pages/DashboardPage.tsx
API:         packages/backend/src/routes/dashboard.routes.ts
Services:    packages/backend/src/services/dashboard.service.ts
Database:    prisma/schema.prisma (aggregation queries)
Cache:       Redis KPIs (15-minute expiry)
Tests:       packages/frontend/tests/integration/dashboard.test.ts
```

**Epic 4: Staff Scheduling & Attendance**
```
Components:  packages/frontend/src/components/Scheduling/
Routes:      packages/frontend/src/pages/SchedulingPage.tsx
API:         packages/backend/src/routes/scheduling.routes.ts
Services:    packages/backend/src/services/scheduling.service.ts
Database:    prisma/schema.prisma (Schedule, Attendance, SwapRequest)
Tests:       packages/frontend/tests/integration/scheduling.test.ts
```

**Epic 5: Mobile-First User Interface Foundation**
```
Components:  packages/frontend/src/components/Layout/
             packages/frontend/src/components/Common/
Styling:     Tailwind CSS (responsive, mobile-first)
Mobile:      Responsive breakpoints in Tailwind config
Offline:     packages/frontend/src/lib/db/sqlite.ts
Sync:        packages/frontend/src/components/Offline/
```

#### Cross-Cutting Concerns Mapping

**Authentication System**
```
Components:  packages/frontend/src/components/Auth/
Services:    packages/backend/src/services/auth.service.ts
Middleware:  packages/backend/src/middleware/auth.middleware.ts
Hooks:       packages/frontend/src/hooks/useAuth.ts
Storage:     httpOnly cookies (backend set), token in memory (frontend)
Tests:       packages/backend/tests/integration/auth.test.ts
```

**Offline-First Capability**
```
SQLite:      packages/frontend/src/lib/db/sqlite.ts
Components:  packages/frontend/src/components/Offline/
Hooks:       packages/frontend/src/hooks/useSync.ts
Store:       packages/frontend/src/stores/syncStore.ts
Service:     packages/backend/src/services/sync.service.ts
Tests:       packages/frontend/tests/e2e/offline.spec.ts
```

**Real-Time Sync**
```
Frontend:    packages/frontend/src/hooks/useInventory.ts (polling)
Service:     packages/backend/src/services/sync.service.ts
Redis:       packages/backend/src/db/redis.ts (pub/sub)
Jobs:        packages/backend/src/jobs/syncBroadcast.job.ts
Tests:       packages/backend/tests/integration/sync.test.ts
```

**Monitoring & Observability**
```
Logging:     packages/backend/src/lib/logger.ts (structured JSON)
Middleware:  packages/backend/src/middleware/logging.ts
Database:    Audit log table (all changes)
Docs:        docs/operations/monitoring.md (CloudWatch setup)
```

---

### Integration Points

#### Internal Communication

**Frontend → Backend Communication:**
```
HTTP/REST over TLS:
- Axios instance with interceptors (packages/frontend/src/services/api.ts)
- Auto-retry with exponential backoff
- Token refresh on 401 response
- Error normalization to standard format
```

**Backend → Database Communication:**
```
PostgreSQL via Prisma ORM:
- Connection pooling (managed by Prisma)
- Parameterized queries (SQL injection prevention)
- Transactions for complex operations
```

**Backend → Cache Communication:**
```
Redis via redis-client:
- Pub/Sub for inventory broadcasts
- Key-value cache for KPIs
- Session storage for active users
```

**Backend → Client Communication (Real-time):**
```
Redis Streams (event queue):
- 60-second polling from clients
- Urgent alerts via Pub/Sub
- Queue persistence (survives restarts)
```

#### External Integrations

**WhatsApp Notifications:**
```
Trigger:     Order created, schedule change
Service:     packages/backend/src/services/notification.service.ts
API:         WhatsApp Business API (webhook-validated)
Response:    Delivery status tracked in audit log
```

**Payment Gateway (Refunds):**
```
Trigger:     Return processing
Webhook:     packages/backend/src/routes/webhooks.ts (future)
Validation:  HMAC signature verification
Error:       Failed refunds logged + manual review queue
```

#### Data Flow

```
Store Manager (Priya) Inventory Lookup:
1. Login → Auth service → JWT generated
2. Browse Inventory Page → TanStack Query fetches /api/inventory
3. Lookup by barcode → useInventoryLookup() → SQL cache query (SQLite)
4. If not cached, fetch from server
5. Update cached (every 60 seconds)
6. Offline? Use latest cache; online? Sync with server

Stock Update Flow:
1. Manager updates quantity (manual or barcode scan)
2. Optimistic update: SQLite + UI updated immediately
3. Background: POST /api/inventory/{sku} with new quantity
4. Server validates against current state
5. If conflict: Server wins, notification sent to user
6. Success: Redis broadcasts to all stores, cache invalidated
7. All connected clients refetch inventory

Order Fulfillment Flow:
1. Order arrives → Redis Pub/Sub → OrderNotification component
2. Toast alert "New Order #123"
3. Manager clicks → FulfillmentQueue component shows order
4. Associate scans barcode → ItemPicker validates stock
5. Item picked → PATCH /api/orders/{id}/items/{sku}
6. All items picked → PATCH /api/orders/{id}/fulfill
7. Success → Order marked complete, audit logged
8. Failed? Retry with client-side queue (offline support)
```

---

### File Organization Patterns

#### Configuration Files

**Root Level:**
- `.env.example` - Template for environment variables
- `docker-compose.yml` - Local development setup (PostgreSQL, Redis)
- `tsconfig.base.json` - Shared TypeScript configuration
- `package.json` - Root scripts (build, test, deploy)
- `pnpm-workspace.yaml` - Monorepo package linking

**Per-Package:**
- `packages/frontend/vite.config.ts` - Vite build configuration
- `packages/backend/prisma/schema.prisma` - Database schema
- `packages/backend/tsconfig.json` - Backend TypeScript rules

#### Source Organization

**Frontend (by feature):**
```
Naming:      PascalCase for components, camelCase for utilities
Structure:   feature-based (Inventory/, Orders/) not type-based
Exports:     Default export for components, named exports for utilities
Testing:     Collocated with source (*.test.ts next to *.ts)
```

**Backend (by responsibility):**
```
Routes:      /api/{resource}/{action} (REST conventions)
Controllers: One per route file, delegates to services
Services:    One per domain concept (Inventory, Order, etc.)
Repositories: Database access layer, parameterized queries
```

#### Test Organization

**Frontend:**
```
Unit:        packages/frontend/tests/unit/ (isolated component tests)
Integration: packages/frontend/tests/integration/ (features with API mocks)
E2E:         packages/frontend/tests/e2e/ (full workflows with Playwright)
Fixtures:    packages/frontend/tests/fixtures/ (mock data)
```

**Backend:**
```
Unit:        packages/backend/tests/unit/ (service logic)
Integration: packages/backend/tests/integration/ (services + database)
E2E:         packages/backend/tests/e2e/ (full API workflows)
Fixtures:    packages/backend/tests/fixtures/ (seed data)
```

#### Asset Organization

**Frontend Assets:**
```
public/favicon.ico             - Browser tab icon
public/assets/icons/           - SVG/PNG icons
public/assets/images/          - Product images
src/assets/                     - CSS, fonts (imported in code)
```

**Deployment Assets:**
```
dist/                          - Build output (production-ready)
.github/workflows/             - CI/CD pipeline files
docs/deployment/               - Deployment runbooks
```

---

### Development Workflow Integration

#### Development Server Structure

**Frontend Development:**
```bash
# Start Vite dev server (hot reload enabled)
npm run dev

# Server at http://localhost:5173
# With mock API responses during dev
```

**Backend Development:**
```bash
# Start Express with nodemon (auto-restart on file change)
npm run dev

# Server at http://localhost:3000
# With test database (via Docker)
```

**Local Database Setup:**
```bash
# Spin up PostgreSQL + Redis
docker-compose up

# Prisma migrations
npx prisma migrate dev

# Seed test data
npm run seed
```

#### Development Workflow

**Code Changes:**
1. Create feature branch: `git checkout -b feature/inventory-lookup`
2. Make changes (frontend, backend, or both)
3. Tests run automatically on save (Vitest watch)
4. Linting: `npm run lint` (ESLint + Prettier)
5. Commit: `git commit -m "feat(inventory): add barcode lookup"` (conventional)
6. Push: `git push origin feature/inventory-lookup`
7. Open PR: GitHub PR template auto-fills

**CI/CD Pipeline (GitHub Actions):**
```
On PR:
  ├─ Run linting (ESLint, Prettier)
  ├─ Run tests (all packages)
  ├─ Build Docker image
  └─ Publish to ECR

On merge to main:
  ├─ Run full test suite
  ├─ Deploy to staging AWS (ECS)
  └─ Smoke tests + manual verification

On tag (v*.*.* ):
  ├─ Deploy to production
  ├─ Blue-green deployment (zero downtime)
  └─ CloudWatch monitoring activated
```

---

### Project Structure Summary

**Monorepo Organization (pnpm workspaces):**
- Root: Configuration + shared scripts
- `packages/frontend`: React 19 + Vite 5 SPA
- `packages/backend`: Node.js + Express API
- `packages/shared`: TypeScript types + constants shared between packages

**Key Structural Decisions:**
1. **Feature-Based Directories:** Inventory/, Orders/ instead of Controllers/, Services/
2. **Collocated Tests:** `.test.ts` files next to source files
3. **Configuration Centralization:** Environment config, database schema in single locations
4. **Clear Boundaries:** Frontend/Backend/Shared packages with minimal cross-dependencies
5. **Scalability Path:** Monorepo supports splitting into separate repos as team grows

This structure enables rapid development while maintaining consistency across 25-35 person team through clear architectural boundaries and file organization patterns established above.

---

---

## Step 6 Complete ✓

Project structure fully defined with:
- ✅ Complete directory tree (frontend/backend/shared packages)
- ✅ Architectural boundaries (API, components, services, data)
- ✅ Requirements mapping (features → directories)
- ✅ Integration points and data flow
- ✅ Development workflow patterns
- ✅ File organization standards

**Structure validated through Advanced Elicitation** - Reverse Engineering, What If Scenarios, Red Team analysis applied to verify scalability to 500+ stores and 100+ engineers.

---

## Step 7: Architecture Validation & Party Mode Review ✓

### Party Mode Expert Panel Findings

**Expert Review:** Winston (Architect), Amelia (Developer), John (PM), Murat (Test Architect), Sally (UX Designer)

**Overall Assessment:** ✅ ARCHITECTURE READY FOR IMPLEMENTATION

**Three Critical Enhancements Addressed:**

---

### Enhancement 1: Sync Conflict Handling & User Notifications

**Current State:** Server-wins conflict resolution documented

**Enhanced Specification:**

#### Conflict Detection & Resolution Strategy

**Conflict Scenarios:**

1. **Inventory Conflict** (Server-Wins)
   ```
   Scenario: Store A and Store B both adjust same SKU simultaneously
   
   Timeline:
   - T0: Server state: Widget SKU = 100 units
   - T0: Store A (offline) adjusts to 95 units (5 sold)
   - T0: Store B adjusts to 90 units (10 sold) → Server updates to 90
   - T60: Store A reconnects, syncs its 95 units
   - T60: Server detects conflict (95 vs current 90)
   
   Resolution:
   - Server-wins: Final state = 90 (Store B's edit preserved)
   - Store A's edit rejected silently (server is authoritative)
   - Action: Notify Store A user of override
   ```

2. **Order Conflict** (Last-Write-Wins + Notification)
   ```
   Scenario: Order status changed by both manager and system
   
   Timeline:
   - Manager marks order as "fulfilled"
   - System detects issue, rolls back to "pending"
   - Conflict detected
   
   Resolution:
   - Last write wins (later timestamp)
   - Notify both parties of conflict
   - Audit log records both versions
   ```

3. **Schedule Conflict** (CRDT - No Conflicts)
   ```
   Scenario: Multiple staff members request shift swaps
   
   Timeline:
   - Employee A requests swap for Mon/Tue
   - Employee B requests swap for Mon/Tue
   - Both offline, both sync locally
   
   Resolution:
   - CRDT algorithm merges both requests (no conflict)
   - Manager sees both pending approvals
   - System resolved through approval workflow (not technical conflict)
   ```

#### User Notification for Conflicts

**Conflict Notification UI Component:**

```typescript
// Frontend: packages/frontend/src/components/Offline/ConflictResolver.tsx

interface ConflictNotification {
  type: 'inventory' | 'order' | 'schedule';
  severity: 'warning' | 'error';
  resource: {
    type: string;      // 'SKU', 'Order#', 'Schedule'
    id: string;
    name: string;
  };
  yourValue: any;
  serverValue: any;
  resolution: 'server-wins' | 'user-wins' | 'pending-approval';
  timestamp: ISO8601;
  action?: {
    label: string;
    handler: () => void;
  };
}

// Example notification shown to user:
{
  type: 'inventory',
  severity: 'warning',
  resource: {
    type: 'SKU',
    id: 'ABC-123',
    name: 'Widget Premium'
  },
  yourValue: 95,           // What you submitted (5 sold)
  serverValue: 90,         // What server has (10 sold)
  resolution: 'server-wins',
  timestamp: '2025-12-03T10:30:00Z',
  action: {
    label: 'Review Details',
    handler: () => showConflictDetail()
  }
}

// UI Display:
// ⚠️ INVENTORY SYNC CONFLICT
// Widget Premium (ABC-123)
// You submitted: 95 units
// Server has: 90 units
// Resolution: Server value applied (inventory accuracy priority)
// [Review Details] [Dismiss]
```

**Conflict Notification Placement:**

- **Toast (5 seconds):** Initial alert for user awareness
- **Sync Status Panel:** Persistent list of all recent conflicts (expandable)
- **Audit View:** Historical record of all conflicts and resolutions

**Implementation in Sync Service:**

```typescript
// packages/backend/src/services/sync.service.ts

async handleInventorySync(storeId: string, updates: InventoryUpdate[]) {
  const conflicts: ConflictRecord[] = [];
  
  for (const update of updates) {
    const currentServer = await db.inventory.findUnique({
      where: { sku: update.sku, storeId }
    });
    
    if (currentServer.quantity !== update.baselineQuantity) {
      // Conflict detected
      const conflict = {
        type: 'inventory',
        sku: update.sku,
        clientValue: update.quantity,
        serverValue: currentServer.quantity,
        resolution: 'server-wins',
        timestamp: new Date()
      };
      
      conflicts.push(conflict);
      
      // Log to audit
      await auditLog.create({
        action: 'SYNC_CONFLICT_RESOLVED',
        resource: `inventory:${update.sku}`,
        storeId,
        context: conflict
      });
      
      // Notify client
      await redis.publish(`conflicts:${storeId}`, JSON.stringify(conflict));
    } else {
      // No conflict, apply update
      await db.inventory.update({
        where: { sku: update.sku, storeId },
        data: { quantity: update.quantity, updatedAt: new Date() }
      });
    }
  }
  
  return { applied: updates.length - conflicts.length, conflicts };
}
```

**Frontend Sync Queue Visibility:**

```typescript
// packages/frontend/src/components/Offline/SyncQueue.tsx

interface SyncQueueDisplay {
  pending: number;        // Changes waiting to sync
  synced: number;         // Successfully applied
  conflicts: number;      // Conflicts detected
  lastSync: ISO8601;
  status: 'synced' | 'pending' | 'error';
}

// UI Display in sidebar:
// SYNC STATUS
// ✅ 23 synced (changes applied)
// ⏳ 2 pending (waiting for connection)
// ⚠️ 1 conflict (server overrode your change)
// Last sync: 10:30 AM
```

---

### Enhancement 2: Database Schema Definition (Prisma)

**Schema File:** `packages/backend/prisma/schema.prisma`

```prisma
// Prisma Schema for bmaderp
// Data types, relationships, and indexes for retail ERP

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User Management
model User {
  id            String    @id @default(cuid())
  storeId       String    @db.VarChar(255)
  email         String    @unique @db.VarChar(255)
  passwordHash  String    @db.VarChar(255)
  firstName     String    @db.VarChar(100)
  lastName      String    @db.VarChar(100)
  role          UserRole  @default(ASSOCIATE)
  phone         String?   @db.VarChar(20)
  
  // Relations
  store         Store     @relation(fields: [storeId], references: [id])
  schedules     Schedule[]
  orders        Order[]   @relation("CreatedBy")
  salesRecords  SalesRecord[]
  
  // Metadata
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([storeId])
  @@index([email])
}

enum UserRole {
  ASSOCIATE       // Sales associate (Ravi)
  STORE_MANAGER   // Store manager (Priya)
  REGIONAL_MANAGER
  ADMIN
}

// Store Management
model Store {
  id              String    @id @default(cuid())
  name            String    @db.VarChar(255)
  region          String    @db.VarChar(100)  // India, Singapore, Thailand, etc.
  city            String    @db.VarChar(100)
  country         String    @db.VarChar(100)
  address         String    @db.Text
  phone           String?   @db.VarChar(20)
  
  // Relations
  users           User[]
  inventory       InventoryItem[]
  orders          Order[]
  schedules       Schedule[]
  salesRecords    SalesRecord[]
  auditLogs       AuditLog[]
  
  // Metadata
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([region])
  @@index([country])
}

// Inventory Management
model InventoryItem {
  id              String    @id @default(cuid())
  storeId         String    @db.VarChar(255)
  sku             String    @db.VarChar(100)
  productName     String    @db.VarChar(255)
  category        String    @db.VarChar(100)
  quantity        Int       @default(0)
  reorderLevel    Int       @default(10)
  reorderQuantity Int       @default(50)
  price           Decimal   @db.Decimal(10, 2)
  cost            Decimal   @db.Decimal(10, 2)
  
  // Relations
  store           Store     @relation(fields: [storeId], references: [id])
  syncRecords     InventorySyncRecord[]
  
  // Metadata
  lastSyncAt      DateTime  @default(now())
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([storeId, sku])
  @@index([storeId])
  @@index([sku])
  @@index([category])
}

// Inventory Sync Tracking (for conflict detection)
model InventorySyncRecord {
  id              String    @id @default(cuid())
  inventoryItemId String
  storeId         String    @db.VarChar(255)
  clientQuantity  Int
  serverQuantity  Int
  conflictDetected Boolean  @default(false)
  resolution      String    @db.VarChar(50) // 'server-wins', 'client-wins', 'merged'
  
  // Relations
  inventoryItem   InventoryItem @relation(fields: [inventoryItemId], references: [id])
  
  createdAt       DateTime  @default(now())
  
  @@index([storeId])
  @@index([inventoryItemId])
}

// Order Management
model Order {
  id              String    @id @default(cuid())
  storeId         String    @db.VarChar(255)
  orderNumber     String    @unique @db.VarChar(50)
  status          OrderStatus @default(PENDING)
  orderType       OrderType @default(ONLINE)  // Online, Omnichannel, etc.
  totalAmount     Decimal   @db.Decimal(10, 2)
  
  // Relations
  store           Store     @relation(fields: [storeId], references: [id])
  createdBy       User      @relation("CreatedBy", fields: [createdById], references: [id])
  items           OrderItem[]
  
  createdById     String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  fulfilledAt     DateTime?
  
  @@index([storeId])
  @@index([status])
  @@index([createdAt])
}

enum OrderStatus {
  PENDING
  FULFILLED
  RETURNED
  CANCELLED
}

enum OrderType {
  ONLINE
  OMNICHANNEL
  IN_STORE
}

model OrderItem {
  id              String    @id @default(cuid())
  orderId         String
  sku             String    @db.VarChar(100)
  quantity        Int
  price           Decimal   @db.Decimal(10, 2)
  
  order           Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@index([orderId])
  @@index([sku])
}

// Staff Scheduling
model Schedule {
  id              String    @id @default(cuid())
  storeId         String    @db.VarChar(255)
  userId          String
  shiftDate       DateTime  @db.Date
  shiftStart      String    @db.VarChar(5)   // "09:00"
  shiftEnd        String    @db.VarChar(5)   // "17:00"
  isPublished     Boolean   @default(false)
  
  // Relations
  store           Store     @relation(fields: [storeId], references: [id])
  user            User      @relation(fields: [userId], references: [id])
  swapRequests    SwapRequest[]
  attendance      Attendance?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([storeId, userId, shiftDate])
  @@index([storeId])
  @@index([userId])
  @@index([shiftDate])
}

model SwapRequest {
  id              String    @id @default(cuid())
  scheduleId      String
  requestedFromUserId String
  status          SwapStatus @default(PENDING)
  reason          String?   @db.Text
  
  schedule        Schedule  @relation(fields: [scheduleId], references: [id])
  
  createdAt       DateTime  @default(now())
  reviewedAt      DateTime?
  
  @@index([scheduleId])
  @@index([status])
}

enum SwapStatus {
  PENDING
  APPROVED
  REJECTED
}

model Attendance {
  id              String    @id @default(cuid())
  scheduleId      String    @unique
  checkInTime     DateTime?
  checkOutTime    DateTime?
  
  schedule        Schedule  @relation(fields: [scheduleId], references: [id])
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// Sales Records (for dashboard & analytics)
model SalesRecord {
  id              String    @id @default(cuid())
  storeId         String    @db.VarChar(255)
  userId          String
  amount          Decimal   @db.Decimal(10, 2)
  category        String    @db.VarChar(100)
  recordDate      DateTime  @db.Date
  
  store           Store     @relation(fields: [storeId], references: [id])
  user            User      @relation(fields: [userId], references: [id])
  
  createdAt       DateTime  @default(now())
  
  @@index([storeId])
  @@index([userId])
  @@index([recordDate])
  @@index([category])
}

// Audit Logging (compliance & troubleshooting)
model AuditLog {
  id              String    @id @default(cuid())
  storeId         String    @db.VarChar(255)
  action          String    @db.VarChar(100)
  resource        String    @db.VarChar(255)
  resourceId      String    @db.VarChar(255)
  userId          String?   @db.VarChar(255)
  changes         Json?     // JSON diff of what changed
  
  store           Store     @relation(fields: [storeId], references: [id])
  
  createdAt       DateTime  @default(now())
  
  @@index([storeId])
  @@index([action])
  @@index([createdAt])
  @@index([resourceId])
}

// Sync Queue (for offline-first operations)
model SyncQueue {
  id              String    @id @default(cuid())
  storeId         String    @db.VarChar(255)
  operation       String    @db.VarChar(50)  // 'CREATE', 'UPDATE', 'DELETE'
  resource        String    @db.VarChar(100) // 'inventory', 'order', etc.
  resourceId      String    @db.VarChar(255)
  payload         Json      // The change data
  clientTimestamp DateTime
  status          SyncStatus @default(PENDING)
  retryCount      Int       @default(0)
  
  createdAt       DateTime  @default(now())
  syncedAt        DateTime?
  
  @@index([storeId])
  @@index([status])
  @@index([createdAt])
}

enum SyncStatus {
  PENDING
  SYNCED
  CONFLICT
  ERROR
}
```

**Key Schema Decisions:**

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| **IDs** | CUID (sequential-friendly UUIDs) | Better indexing than random UUIDs, still globally unique |
| **Timestamps** | UTC DateTime + createdAt/updatedAt | Audit trail, conflict detection, compliance |
| **Inventory Sync** | Separate InventorySyncRecord table | Track conflicts without denormalizing InventoryItem |
| **Audit Log** | JSON changes column | Flexible storage for any resource type changes |
| **Store Partitioning** | storeId on every table | Multi-tenancy, data isolation, compliance |
| **Indexes** | Composite on frequent queries | Performance for store lookups, date ranges |

---

### Enhancement 3: Sync Testing Strategy

**Test File Structure:**

```
packages/backend/tests/integration/
├── sync.test.ts                 # Core sync service tests
├── conflict-resolution.test.ts  # Conflict handling
└── performance.test.ts          # Load testing

packages/frontend/tests/e2e/
└── offline-sync.spec.ts         # End-to-end offline flow
```

**Comprehensive Test Specifications:**

#### Backend Sync Tests

```typescript
// packages/backend/tests/integration/conflict-resolution.test.ts

describe('Inventory Sync Conflict Resolution', () => {
  
  test('Server-wins: Store submits conflicting quantity', async () => {
    // Setup
    const store = await createStore('Mumbai-Store-1');
    const sku = 'ABC-123';
    
    // Baseline: Server has 100 units
    await db.inventory.create({
      data: { storeId: store.id, sku, quantity: 100 }
    });
    
    // Client offline edits to 95 (5 sold)
    const clientUpdate = {
      sku,
      baselineQuantity: 100,  // What client saw
      quantity: 95,           // What client is submitting
    };
    
    // Meanwhile, server updates to 90 (10 sold from another store)
    await db.inventory.update({
      where: { sku },
      data: { quantity: 90 }
    });
    
    // Client reconnects and syncs
    const result = await syncService.handleInventorySync(store.id, [clientUpdate]);
    
    // Verify: Server-wins (90 preserved)
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].resolution).toBe('server-wins');
    
    const final = await db.inventory.findUnique({ where: { sku } });
    expect(final.quantity).toBe(90);  // Server value preserved
  });
  
  test('Conflict notification sent to client', async () => {
    // ... setup as above ...
    
    const result = await syncService.handleInventorySync(store.id, [clientUpdate]);
    
    // Verify notification queued to Redis
    const notification = await redis.get(`conflicts:${store.id}`);
    expect(notification).toContain('server-wins');
    expect(notification).toContain('clientValue: 95');
    expect(notification).toContain('serverValue: 90');
  });
  
  test('Conflict audit logged for compliance', async () => {
    // ... setup as above ...
    
    await syncService.handleInventorySync(store.id, [clientUpdate]);
    
    // Verify audit record
    const audit = await db.auditLog.findFirst({
      where: {
        action: 'SYNC_CONFLICT_RESOLVED',
        resource: `inventory:${sku}`
      }
    });
    
    expect(audit).toBeDefined();
    expect(audit.changes).toEqual({
      type: 'inventory',
      clientValue: 95,
      serverValue: 90,
      resolution: 'server-wins'
    });
  });
  
  test('Multiple conflicts: 3 updates, 1 conflict, 2 applied', async () => {
    // Simulate batch sync with mixed results
    const updates = [
      { sku: 'SKU-1', baselineQuantity: 100, quantity: 95 }, // No conflict
      { sku: 'SKU-2', baselineQuantity: 50, quantity: 45 },  // CONFLICT
      { sku: 'SKU-3', baselineQuantity: 25, quantity: 20 },  // No conflict
    ];
    
    // Setup: Only SKU-2 has changed server-side
    await db.inventory.updateMany({
      data: [
        { sku: 'SKU-1', quantity: 95 },  // Match client
        { sku: 'SKU-2', quantity: 40 },  // Conflict!
        { sku: 'SKU-3', quantity: 20 },  // Match client
      ]
    });
    
    const result = await syncService.handleInventorySync(store.id, updates);
    
    expect(result.applied).toBe(2);
    expect(result.conflicts).toHaveLength(1);
  });
});

describe('Order Status Sync (Last-Write-Wins)', () => {
  
  test('Latest timestamp wins on conflict', async () => {
    const order = await createOrder('Store-1', 'ORDER-001');
    
    // T1: Manager sets to "fulfilled"
    const managerUpdate = {
      id: order.id,
      status: 'fulfilled',
      timestamp: new Date('2025-12-03T10:30:00Z')
    };
    
    // T2: System rolls back to "pending" (later)
    const systemUpdate = {
      id: order.id,
      status: 'pending',
      timestamp: new Date('2025-12-03T10:31:00Z')
    };
    
    // Apply both (simulating concurrent updates)
    await syncService.handleOrderSync(store.id, [managerUpdate]);
    await syncService.handleOrderSync(store.id, [systemUpdate]);
    
    // Verify: Latest timestamp (system) wins
    const final = await db.order.findUnique({ where: { id: order.id } });
    expect(final.status).toBe('pending');
    
    // Verify: Conflict recorded, both parties notified
    const notification = await redis.get(`conflicts:ORDER-001`);
    expect(notification).toContain('last-write-wins');
  });
});

describe('Schedule Sync (CRDT - No Conflicts)', () => {
  
  test('Multiple swap requests merge without conflict', async () => {
    const schedule = await createSchedule('2025-12-04', 'Store-1');
    
    // Employee A requests swap (offline)
    const swapA = {
      scheduleId: schedule.id,
      requestedFromUser: 'emp-2',
      timestamp: new Date('2025-12-03T09:00:00Z')
    };
    
    // Employee B requests swap (offline)
    const swapB = {
      scheduleId: schedule.id,
      requestedFromUser: 'emp-3',
      timestamp: new Date('2025-12-03T09:05:00Z')
    };
    
    // Both sync
    await syncService.handleScheduleSync(store.id, [swapA]);
    await syncService.handleScheduleSync(store.id, [swapB]);
    
    // Verify: Both recorded (CRDT merge, no conflict)
    const swaps = await db.swapRequest.findMany({
      where: { scheduleId: schedule.id }
    });
    
    expect(swaps).toHaveLength(2);
    expect(swaps[0].status).toBe('PENDING');
    expect(swaps[1].status).toBe('PENDING');
    
    // No conflict notification (this is expected CRDT behavior)
    const conflicts = await redis.get(`conflicts:${schedule.id}`);
    expect(conflicts).toBeNull();
  });
});

describe('Sync Performance Under Load', () => {
  
  test('60-second polling interval: 500 stores, 1000 inventory updates/min', async () => {
    // Simulate peak load
    const stores = await createStores(500);
    const updates = generateInventoryUpdates(1000);
    
    const startTime = performance.now();
    
    // Process all syncs
    for (const store of stores) {
      await syncService.handleInventorySync(store.id, updates);
    }
    
    const elapsed = performance.now() - startTime;
    
    // Verify: All syncs complete within budget
    // Target: <5 seconds for 500k operations (1000 updates × 500 stores)
    expect(elapsed).toBeLessThan(5000);
    
    // Verify: Database query performance (indexed)
    const dbMetrics = await getQueryMetrics();
    expect(dbMetrics.avgQueryTime).toBeLessThan(100); // <100ms per query
  });
  
  test('Sync queue persistence: Retain pending ops after crash', async () => {
    // Insert 50 pending sync operations
    const pending = await db.syncQueue.createMany({
      data: Array(50).fill(0).map((_, i) => ({
        storeId: 'store-1',
        operation: 'UPDATE',
        resource: 'inventory',
        resourceId: `SKU-${i}`,
        payload: { quantity: 10 },
        status: 'PENDING'
      }))
    });
    
    // Simulate server crash/restart
    await restartServer();
    
    // Verify: Pending ops still there
    const recovered = await db.syncQueue.findMany({
      where: { status: 'PENDING' }
    });
    
    expect(recovered).toHaveLength(50);
  });
});
```

#### Frontend E2E Sync Tests

```typescript
// packages/frontend/tests/e2e/offline-sync.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Offline-First Sync Workflow', () => {
  
  test('Store manager goes offline, updates inventory, comes back online', async ({ page }) => {
    // Navigate to inventory page
    await page.goto('/inventory');
    await page.fill('[data-testid=search-sku]', 'ABC-123');
    const itemBefore = await page.locator('[data-testid=qty-display]').textContent();
    
    // Simulate going offline
    await page.context().setOffline(true);
    
    // Update inventory (should work offline)
    await page.click('[data-testid=qty-ABC-123-decrease]');
    
    // Verify: Optimistic update appears immediately
    const itemOffline = await page.locator('[data-testid=qty-display]').textContent();
    expect(itemOffline).not.toBe(itemBefore);
    
    // Verify: Sync badge shows "pending"
    const syncBadge = await page.locator('[data-testid=sync-status]').textContent();
    expect(syncBadge).toContain('Pending');
    
    // Restore online
    await page.context().setOffline(false);
    
    // Wait for sync to complete
    await page.waitForFunction(() => {
      const badge = document.querySelector('[data-testid=sync-status]');
      return badge?.textContent?.includes('Synced');
    }, { timeout: 10000 });
    
    // Verify: Sync badge shows "synced"
    const syncBadgeAfter = await page.locator('[data-testid=sync-status]').textContent();
    expect(syncBadgeAfter).toContain('Synced');
  });
  
  test('Conflict resolution: User sees notification when server overrides', async ({ page }) => {
    // Setup: Item quantity on server = 100
    await mockServer.setInventory('ABC-123', 100);
    
    // Go offline
    await page.context().setOffline(true);
    await page.goto('/inventory');
    
    // User decreases to 95 (thinking they sold 5)
    await page.click('[data-testid=qty-decrease]');
    
    // Meanwhile (offline), server is updated to 90 (different store sold 10)
    await mockServer.setInventory('ABC-123', 90);
    
    // Go back online
    await page.context().setOffline(false);
    
    // Wait for sync and conflict notification
    const conflictNotif = page.locator('[data-testid=conflict-notification]');
    await conflictNotif.waitFor({ state: 'visible', timeout: 5000 });
    
    // Verify: Notification shows what happened
    const notifText = await conflictNotif.textContent();
    expect(notifText).toContain('Widget Premium');
    expect(notifText).toContain('Your value: 95');
    expect(notifText).toContain('Server value: 90');
    expect(notifText).toContain('Server value applied');
  });
  
  test('Sync queue visibility: User can see pending changes', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);
    
    // Make 3 inventory updates
    await page.click('[data-testid=qty-decrease-SKU1]');
    await page.click('[data-testid=qty-decrease-SKU2]');
    await page.click('[data-testid=qty-decrease-SKU3]');
    
    // Open sync status panel
    await page.click('[data-testid=sync-status-btn]');
    
    // Verify: Shows 3 pending changes
    const pendingCount = await page.locator('[data-testid=pending-count]').textContent();
    expect(pendingCount).toContain('3');
    
    // Verify: List shows each pending change
    const changes = await page.locator('[data-testid=pending-change]').all();
    expect(changes).toHaveLength(3);
  });
});
```

**Test Execution & Coverage:**

```bash
# Run sync conflict tests
npm run test:sync-conflicts

# Run performance tests (load simulation)
npm run test:sync-performance

# Run E2E offline workflows
npm run test:e2e:offline

# Coverage target: >85% for sync-related code
npm run test:coverage --include="**/sync**"
```

**Quality Gates:**

| Test Category | Target | Action if Failed |
|---------------|--------|------------------|
| Conflict Resolution Tests | 100% pass | Block merge |
| Performance Tests | <5s for 500k ops | Investigate DB indexing |
| E2E Offline Tests | 100% pass | Block release |
| Coverage (Sync) | >85% | Require new tests |

---

## Step 7 Complete ✓

**Party Mode Expert Panel Review:** ✅ COMPLETE

**Three Critical Enhancements Added:**
1. ✅ **Sync Conflict Handling** - User notifications, audit logging, conflict visibility
2. ✅ **Database Schema** - Complete Prisma schema with relationships, indexes, audit trail
3. ✅ **Sync Testing Strategy** - Comprehensive test specs for conflict resolution, performance, E2E

**Architecture Status:** ✅ **READY FOR IMPLEMENTATION**

All party mode concerns addressed and documented. Proceeding to Step 8: Completion & Implementation Handoff.

---

## Step 8: Architecture Completion & Implementation Handoff ✓

### 🎯 Architecture Workflow Complete

**Workflow Summary:**

| Step | Phase | Status | Deliverable |
|------|-------|--------|------------|
| 1 | Initialization | ✅ | Project context discovered, 4 input documents loaded |
| 2 | Context Analysis | ✅ | Requirements analyzed, 5 epics defined, party mode validation |
| 3 | Technology Stack | ✅ | Modern starter selected (React 19 + Vite 5 + Node.js) |
| 4 | Decisions | ✅ | 5 core architectural decisions locked, sequencing defined |
| 5 | Patterns | ✅ | 10 implementation patterns with enforcement rules |
| 6 | Structure | ✅ | Complete project tree, boundaries, integration mapped |
| 7 | Validation | ✅ | Party mode expert review, 3 critical enhancements added |
| 8 | Completion | ✅ | **Final architecture document ready for implementation** |

---

### 📊 Architecture by the Numbers

**Architectural Decisions:** 5 major decisions with sub-decisions documented
- Data Architecture (hybrid caching strategy)
- Authentication & Security (JWT + RBAC)
- API Design (REST + standardized responses)
- Real-time Sync (polling + Redis Pub/Sub)
- Infrastructure (AWS multi-region)

**Implementation Patterns:** 10 comprehensive categories with examples
- Naming conventions, file structure, API formats, error handling, state management, auth flows, logging, data formats, timestamps, IDs

**Project Structure:** Complete monorepo with 180+ file locations
- Frontend: 50+ components, 20+ hooks, 10+ services
- Backend: 30+ routes/controllers, 15+ services, 10+ repositories
- Shared: 5+ type modules, 3+ constant modules

**Technology Stack:** 25+ specific versions locked
- Frontend: React 19, Vite 5, TanStack Query v5, Zustand, Tailwind CSS
- Backend: Node.js 20 LTS, Express, Prisma, TypeScript
- Database: PostgreSQL, Redis, SQLite (client)
- Infrastructure: AWS (ECS, RDS, ElastiCache, CloudFront)

**Requirements Coverage:** 100% compliance
- ✅ 5 core MVP features architecturally supported
- ✅ All 6 critical NFRs addressed
- ✅ 5 cross-cutting concerns implemented
- ✅ APAC compliance and data residency enforced

**Validation:** Expert panel review complete
- Coherence validated (all decisions work together)
- Requirements coverage verified (nothing missed)
- Implementation readiness confirmed (AI agents can execute consistently)
- Gap analysis completed (3 enhancements added for adoption and quality)

---

### 📋 Complete Architecture Document Contents

**Total Document Size:** ~4,500 lines of comprehensive specification

**Sections Included:**

1. **Project Context Analysis** (2 sections)
   - Core vision, success metrics, user personas
   - Functional requirements (5 epics), NFRs, complexity assessment
   - Cross-cutting concerns and party mode recommendations

2. **Technology Stack** (2 sections)
   - Starter template selection with rationale
   - Implementation timeline and project structure
   - Technology justification for each choice

3. **Architectural Decisions** (5 sections)
   - Data Architecture: Hybrid (PostgreSQL + Redis + SQLite)
   - Authentication: JWT + 4-role RBAC
   - API Design: REST with standardized response format
   - Frontend State: TanStack Query + Zustand
   - Infrastructure: AWS multi-region with auto-scaling

4. **Implementation Patterns** (10 sections)
   - Naming conventions, file structure, API responses
   - Error handling, state management, authentication
   - Logging, data formats, timestamp standards
   - With concrete code examples for each pattern

5. **Project Structure** (4 sections)
   - Complete directory tree for all packages
   - Component, service, and data boundaries
   - Requirements to structure mapping
   - Integration points and data flow

6. **Validation & Enhancements** (3 sections)
   - Sync conflict handling with user notifications
   - Complete database schema (Prisma definition)
   - Comprehensive testing strategy with test specs

---

### 🚀 Implementation Handoff

**Your Architecture is Ready For:**

✅ **AI Agent Implementation** - All decisions documented, patterns enforced, structure defined
✅ **25-35 Person Team Onboarding** - Clear boundaries prevent conflicts, patterns ensure consistency
✅ **Rapid MVP Development** - 12-16 week timeline with phased approach documented
✅ **Scaling to 500+ Stores** - Architecture foundation supports growth without rewrites

---

### 📚 Next Steps for Implementation Phase

**Immediate Actions (This Week):**

1. **Project Initialization**
   ```bash
   # Create monorepo structure
   pnpm init
   
   # Initialize packages
   pnpm create vite packages/frontend --template react-ts
   npm init -y packages/backend
   
   # Setup database
   docker-compose up
   npx prisma migrate dev --name init
   ```

2. **Repository Structure**
   - Copy this architecture document to `docs/analysis/architecture.md`
   - Initialize `.env.example` with required variables
   - Create `docker-compose.yml` for local development
   - Setup GitHub Actions CI/CD pipeline

3. **Team Distribution**
   - Distribute architecture document to all 25-35 engineers
   - Conduct architecture walkthrough (1 hour)
   - Answer questions on decisions and patterns
   - Assign first stories based on recommended sequence

**Week 1-2: Foundation (Auth, Database, APIs)**

From architecture sequence:
1. Setup PostgreSQL + Prisma migrations
2. Implement JWT authentication service
3. Create REST API endpoints structure
4. Setup Redis + Pub/Sub

**Week 3-4: Core Features (Inventory, Orders)**

1. Build Inventory management (lookup, updates, sync)
2. Implement Order fulfillment workflows
3. Add TanStack Query integration for sync
4. Implement conflict resolution

**Week 5-8: Features & Scale (Dashboard, Scheduling, Offline)**

1. Dashboard with KPI aggregation
2. Staff scheduling with approval workflows
3. SQLite offline caching
4. Full sync with conflict resolution

**Week 9-12: Testing & Deployment**

1. Comprehensive testing (unit, integration, E2E)
2. Performance optimization
3. Multi-region AWS deployment
4. Live pilot with 10-15 stores

---

### ✅ Validation Checklist for Implementation

Before starting implementation, verify:

**Architecture Artifacts:**
- [ ] Architecture document complete at `docs/analysis/architecture.md`
- [ ] All 5 architectural decisions documented
- [ ] 10 implementation patterns with examples
- [ ] Complete project structure defined
- [ ] Database schema (Prisma) included

**Team Readiness:**
- [ ] Architecture reviewed by team leads
- [ ] Technology stack understood by team
- [ ] Project structure explained to developers
- [ ] Implementation patterns enforced in code reviews
- [ ] Conflict resolution process documented

**Development Environment:**
- [ ] Docker Compose setup working locally
- [ ] PostgreSQL + Redis running
- [ ] Prisma migrations working
- [ ] Frontend dev server (Vite) tested
- [ ] Backend dev server (Express) tested

**First Sprint Prepared:**
- [ ] First stories created aligned to architecture sequence
- [ ] Acceptance criteria reference architectural patterns
- [ ] Team knows where to find documentation
- [ ] Code review checklist includes pattern enforcement

---

### 🎓 Architecture Document Usage

**For AI Agents (During Implementation):**
"Before implementing any story, read the relevant sections:
- Technology Stack: Know what versions to use
- Architectural Decisions: Understand the why
- Implementation Patterns: Follow naming, structure, communication
- Project Structure: Know where files belong
- Database Schema: Use exact table/field names
- Testing Strategy: Write tests matching specifications"

**For Team Leads (During Code Reviews):**
"Verify every PR against:
- Technology constraints (versions, dependencies)
- Implementation patterns (naming, structure, error handling)
- Project structure (files in correct locations)
- Architectural boundaries (API, data, state management)
- Testing requirements (unit, integration, E2E coverage)"

**For Product Manager (During Planning):**
"Each feature story should map to architecture:
- Epic → which services/components (from structure)
- Requirements → which architectural decision supports it
- Success metric → which test validates it
- Timeline → which phase (foundation → core → features → testing)"

---

### 🎯 Success Criteria for Implementation

Your implementation will be successful if:

1. **Coherence** - All code follows architectural patterns consistently
2. **Completeness** - All 5 core features fully implemented per specifications
3. **Performance** - <2 second inventory lookups, <100ms local SQLite queries
4. **Reliability** - <1% error rate, conflict resolution working flawlessly
5. **Adoption** - 85% user adoption within 8 weeks of pilot launch
6. **Scalability** - Successfully scales from 10 pilot stores → 500+ stores without rewrites

---

### 🔄 Architecture Evolution

**Phase 1 (MVP - Weeks 1-12):** Current architecture
- Optimistic sync, server-wins conflicts, simple patterns
- Single PostgreSQL primary, Redis cache layer
- REST API with polling (60s)

**Phase 2 (Months 4-6):** Architecture enhancements
- Event sourcing for complete audit trail
- Advanced CRDT patterns for all data types
- Kafka for true event streaming (beyond Redis)

**Phase 3 (Months 7-12):** Distributed systems
- Multi-shard database with read replicas
- GraphQL federation layer
- Microservices separation if needed for team scaling

---

## 🎉 Architecture Complete & Ready for Implementation

**Document Status:** ✅ FINAL
**Validation Status:** ✅ COMPLETE (Expert panel reviewed)
**Implementation Status:** ✅ READY

**You now have:**
✅ Complete architectural vision for bmaderp
✅ Specific technology choices with versions
✅ Clear implementation patterns preventing conflicts
✅ Complete project structure with all files
✅ Database schema and API specifications
✅ Testing strategy for quality assurance
✅ Deployment architecture for APAC compliance
✅ Clear next steps for 25-35 person team

**The architecture document is your single source of truth for the next 12-16 weeks.**

---

### 📖 Document Locations

**Main Architecture Document:**
```
/home/riddler/bmaderp/docs/analysis/architecture.md
```

**Referenced Input Documents:**
```
docs/analysis/product-brief-bmaderp-2025-12-02.md
docs/analysis/user-personas-apac-retail-erp-2025.md
docs/analysis/research/market-retail-erp-research-2025-12-02.md
docs/analysis/customer-insights-apac-retail-2025.md
```

**Next Phase Documentation (to be created during implementation):**
```
docs/api/inventory.md          (REST endpoint specs)
docs/api/orders.md             (Order workflow specs)
docs/api/dashboard.md          (Analytics API specs)
docs/deployment/aws-multi-region.md
docs/operations/monitoring.md
```

---

**Thank you for this comprehensive architecture exercise. Your bmaderp ERP is architected for success, adoption, and scale.**

**Go build! 🚀**





