# Project Initialization Checklist

## ✅ Completed Setup

### Repository Structure
- [x] Root `package.json` with pnpm workspaces
- [x] `pnpm-workspace.yaml` for monorepo configuration
- [x] TypeScript base configuration
- [x] ESLint and Prettier configuration
- [x] `.gitignore` for all Node.js/TypeScript patterns
- [x] Environment template (`.env.example`)

### Shared Package (@bmaderp/shared)
- [x] Type definitions (User, Order, Inventory, etc.)
- [x] Error classes (ApiError, ValidationError, ConflictError)
- [x] Constants (USER_ROLES, ORDER_STATUS, API_ENDPOINTS, etc.)
- [x] Build configuration (TypeScript compilation)

### Backend Package (@bmaderp/backend)
- [x] Express server setup with security (helmet, CORS)
- [x] Request middleware (ID, rate limiting)
- [x] Error handler middleware
- [x] Logger utility (structured JSON)
- [x] Prisma ORM setup with PostgreSQL
- [x] Database schema (Users, Stores, InventoryItems, Orders, AuditLog)
- [x] Route scaffolding
- [x] Development server ready (node + tsx)

### Frontend Package (@bmaderp/frontend)
- [x] React 19 + Vite 5 setup
- [x] TanStack Query configuration ready
- [x] Tailwind CSS + PostCSS
- [x] Basic App component
- [x] TypeScript strict mode
- [x] Development server ready (Vite)

### Documentation
- [x] Comprehensive README with quick start
- [x] Architecture specification at `/docs/analysis/architecture.md`
- [x] Environment configuration template
- [x] Git workflow guidelines
- [x] Development scripts documented

---

## 🚀 Next Steps

### 1. Install Dependencies
```bash
cd /home/riddler/bmaderp
pnpm install
```

This will:
- Install root dependencies (prettier, typescript)
- Install frontend dependencies (React, Vite, TanStack Query, Zustand, Tailwind)
- Install backend dependencies (Express, Prisma, Redis, JWT)
- Link shared package (@bmaderp/shared)
- Create pnpm-lock.yaml

**Estimated time:** 5-10 minutes

### 2. Setup Local Database
```bash
docker-compose up -d
```

Verifications:
```bash
# Check PostgreSQL
docker exec bmaderp-postgres pg_isready -U bmaderp_user

# Check Redis
docker exec bmaderp-redis redis-cli ping
```

**Should see:** "accepting connections" and "PONG"

### 3. Initialize Database Schema
```bash
cd packages/backend
npx prisma migrate dev --name init
```

This will:
- Create the initial Prisma migration
- Apply schema to PostgreSQL
- Generate Prisma client
- Optionally seed test data

### 4. Start Development Servers

**Terminal 1 - Frontend:**
```bash
cd packages/frontend
pnpm dev
# Open http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd packages/backend
pnpm dev
# Opens http://localhost:3000
# Health check: curl http://localhost:3000/health
```

**Terminal 3 - Database UI (optional):**
```bash
cd packages/backend
npx prisma studio
# Opens Prisma Studio at http://localhost:5555
```

---

## 📋 First Implementation Sprint

### Sprint 1: Authentication Foundation (Week 1)

**Backend tasks:**
1. Create auth service with JWT generation
2. Create login endpoint (`POST /api/v1/auth/login`)
3. Create refresh token endpoint (`POST /api/v1/auth/refresh`)
4. Create JWT verification middleware
5. Create User repository for database access

**Frontend tasks:**
1. Create login page component
2. Create API client with axios interceptors
3. Create auth store (Zustand) for user state
4. Create useAuth hook
5. Setup token persistence (memory for access, httpOnly for refresh)

**Database:**
1. Seed test user: `email: manager@store1.com, password: TestPassword123`
2. Create audit log records for login events

### Sprint 2: Inventory Management (Week 2-3)

**Backend tasks:**
1. Create inventory service for CRUD operations
2. Create sync service for conflict resolution
3. Create inventory endpoints:
   - `GET /api/v1/inventory` - List all
   - `GET /api/v1/inventory/:sku` - Get one (fast lookup)
   - `PATCH /api/v1/inventory/:sku` - Update quantity
   - `POST /api/v1/inventory/sync` - Sync from offline
4. Implement conflict detection

**Frontend tasks:**
1. Create inventory list component with TanStack Query
2. Create SKU lookup component (barcode scanner)
3. Create inventory update form
4. Implement SQLite local cache
5. Create sync status indicator

---

## 🔍 Verification Steps

After initial setup, verify everything is working:

### 1. Check Project Structure
```bash
ls -la packages/
# Should see: frontend, backend, shared
```

### 2. Verify TypeScript Compilation
```bash
pnpm type-check
# Should complete with no errors
```

### 3. Test Backend Server
```bash
# Terminal already running backend
curl http://localhost:3000/health
# Response: {"status":"ok","timestamp":"2025-12-03T..."}
```

### 4. Test Frontend Load
```bash
# Navigate to http://localhost:5173 in browser
# Should see: "bmaderp" title and architecture initialized message
```

### 5. Test Database Connection
```bash
npx prisma migrate status
# Should show: Migrations validated (should be 0 pending migrations)
```

### 6. Test Shared Package
```bash
cd packages/backend
node -e "import('@bmaderp/shared').then(m => console.log(Object.keys(m).slice(0, 5)))"
# Should list exported types/constants
```

---

## 📝 Code Structure Verification

After first feature implementation, verify patterns:

### Naming Conventions
- [ ] Database fields are `snake_case` (e.g., `created_at`, `order_number`)
- [ ] API request/response params are `camelCase` (e.g., `userId`, `orderNumber`)
- [ ] React components are `PascalCase` (e.g., `InventoryList`, `OrderForm`)
- [ ] React hooks are `camelCase` with `use` prefix (e.g., `useInventory`, `useAuth`)
- [ ] Utility functions are `camelCase` (e.g., `formatDate`, `calculateTotal`)

### File Organization
- [ ] Components in `packages/frontend/src/components/` (e.g., `components/Inventory/`)
- [ ] Services in `packages/frontend/src/services/` (e.g., `services/inventory.service.ts`)
- [ ] Hooks in `packages/frontend/src/hooks/` (e.g., `hooks/useInventory.ts`)
- [ ] Types exported from `@bmaderp/shared`
- [ ] Constants imported from `@bmaderp/shared`

### API Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-12-03T10:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT_DETECTED",
    "message": "Server value differs from client",
    "statusCode": 409,
    "retryable": true
  }
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### Docker Issues
```bash
# Remove containers and try again
docker-compose down -v
docker-compose up -d
```

### Prisma Migration Conflicts
```bash
# Reset database (warning: deletes all data)
cd packages/backend
npx prisma migrate reset
```

### pnpm Link Issues
```bash
# Rebuild workspace links
pnpm install
pnpm store prune
```

### TypeScript Errors
```bash
# Regenerate types
npx prisma generate
pnpm type-check
```

---

## 📞 Reference Documentation

- **Architecture Specification** - `/docs/analysis/architecture.md`
  - Complete decisions, patterns, structure
- **Database Schema** - `packages/backend/prisma/schema.prisma`
- **Development Scripts** - `README.md` Development Scripts section
- **Git Workflow** - `README.md` Git Workflow section
- **Code Standards** - `README.md` Code Standards section

---

## ✨ You're Ready!

The project is now initialized and ready for implementation. The architecture document in `/docs/analysis/architecture.md` is your guide for:

1. Technology choices (why React 19, why PostgreSQL, etc.)
2. Implementation patterns (naming, structure, error handling)
3. Project structure (where files belong)
4. Architectural decisions (authentication, data sync, etc.)
5. Database schema (Prisma definitions)
6. Testing strategy (unit, integration, E2E)

**Next action:** Begin Sprint 1 with authentication foundation, following the patterns and decisions in the architecture document.

Good luck! 🚀
