# Feature Flags System Design

**Project:** BMAD ERP
**Author:** Riddler
**Date:** 2026-03-01
**Status:** Draft Design

---

## 1. Overview

### 1.1 Purpose

The Feature Flags system is the **architectural foundation** of the ERP, enabling:

- **Completeness:** All features exist in codebase, but only enabled ones are visible
- **Customizability:** Granular control over what's available at every level
- **Ease of Use:** Users see only what they need, complexity reveals progressively

### 1.2 Design Principles

| Principle | Description |
|-----------|-------------|
| **Zero Overhead** | Disabled features add no runtime cost |
| **Deep Hierarchy** | Core → Modules → Sub-features → Capabilities |
| **Multi-Scope** | System, Tenant, Role, User levels |
| **Dependency-Aware** | Features can require other features |
| **Audit-Ready** | Every change tracked and reversible |
| **Developer-Friendly** | Simple API, type-safe, compile-time checks where possible |

---

## 2. Feature Flag Hierarchy

### 2.1 Four-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          LEVEL 1: CORE                              │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  auth | navigation | search | users | tenants | settings   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
├─────────────────────────────────────────────────────────────────────┤
│                         LEVEL 2: MODULES                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  SALES   │ │INVENTORY │ │ACCOUNTING│ │    HR    │ │PURCHASING│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│        │           │           │           │           │            │
│        ▼           ▼           ▼           ▼           ▼            │
├─────────────────────────────────────────────────────────────────────┤
│                      LEVEL 3: SUB-FEATURES                           │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ quotes | orders | invoices | returns | credit-memos | ...   │    │
│  │ warehouses | transfers | adjustments | serial-tracking | ... │    │
│  │ journal-entries | reconciliations | budgets | taxes | ...   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
├─────────────────────────────────────────────────────────────────────┤
│                    LEVEL 4: CAPABILITIES                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ batch-operations | api-access | webhooks | exports | ...    │    │
│  │ multi-currency | multi-warehouse | multi-company | ...      │    │
│  │ approval-workflows | custom-fields | templates | ...        │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Feature Definition Schema

```rust
/// Feature flag definition
pub struct Feature {
    /// Unique identifier (e.g., "sales.invoices.batch")
    pub id: FeatureId,
    
    /// Human-readable name
    pub name: String,
    
    /// Description for admins
    pub description: String,
    
    /// Level in hierarchy
    pub level: FeatureLevel,
    
    /// Parent feature (None for Core, Some for others)
    pub parent: Option<FeatureId>,
    
    /// Features that must be enabled for this to work
    pub dependencies: Vec<FeatureId>,
    
    /// Default state for new tenants
    pub default_enabled: bool,
    
    /// Whether this can be disabled once enabled
    pub can_disable: bool,
    
    /// Impact on pricing tier (if applicable)
    pub tier_requirement: Option<Tier>,
    
    /// Feature group for UI organization
    pub group: FeatureGroup,
    
    /// Tags for search/filtering
    pub tags: Vec<String>,
}

pub enum FeatureLevel {
    Core,        // Always enabled, cannot disable
    Module,      // Major functional area
    SubFeature,  // Specific capability within module
    Capability,  // Enhancement to sub-feature
}

pub enum FeatureGroup {
    Core,
    Sales,
    Inventory,
    Accounting,
    Purchasing,
    HR,
    Integrations,
    Administration,
    // ...
}
```

---

## 3. Scope Levels

### 3.1 Four Scopes of Feature Control

| Scope | Level | Use Case |
|-------|-------|----------|
| **System** | Global | Platform-wide defaults, system admin controls |
| **Tenant** | Per-customer | Each business has their own feature set |
| **Role** | Per-role within tenant | Managers see more than clerks |
| **User** | Per-user | Individual customization |

### 3.2 Evaluation Order (Most Specific Wins)

```
User Setting → Role Setting → Tenant Setting → System Default
     ↓              ↓              ↓               ↓
   [set?]  ────→  [set?]  ────→  [set?]  ────→  [default]
     
     └────────────── First defined value wins ──────────────┘
```

### 3.3 Scope Data Model

```rust
pub struct FeatureState {
    /// Feature being configured
    pub feature_id: FeatureId,
    
    /// Scope of this configuration
    pub scope: FeatureScope,
    
    /// Whether feature is enabled
    pub enabled: bool,
    
    /// When this was set
    pub set_at: DateTime<Utc>,
    
    /// Who set it
    pub set_by: UserId,
    
    /// Optional reason for audit trail
    pub reason: Option<String>,
}

pub enum FeatureScope {
    System,
    Tenant(TenantId),
    Role(TenantId, RoleId),
    User(TenantId, UserId),
}
```

---

## 4. Dependency System

### 4.1 Dependency Types

```rust
pub enum DependencyType {
    /// Parent must be enabled (inherited from hierarchy)
    ParentRequired,
    
    /// All listed features must be enabled
    AllRequired(Vec<FeatureId>),
    
    /// At least one listed feature must be enabled
    AnyRequired(Vec<FeatureId>),
    
    /// Feature is incompatible with these (mutually exclusive)
    Incompatible(Vec<FeatureId>),
}
```

### 4.2 Dependency Examples

```
┌─────────────────────────────────────────────────────────────────┐
│  FEATURE                          DEPENDENCIES                  │
├─────────────────────────────────────────────────────────────────┤
│  multi-currency                  ← [base-currency]              │
│  batch-invoicing                 ← [invoices]                   │
│  serial-tracking                 ← [inventory]                  │
│  multi-warehouse                 ← [inventory, warehouses]      │
│  inter-warehouse-transfers       ← [multi-warehouse]            │
│  approval-workflows              ← [users, roles]               │
│  api-access                      ← [] (standalone)              │
│  sso                             ← [auth-advanced]              │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Dependency Resolution Algorithm

```rust
impl FeatureFlagService {
    /// Check if a feature can be enabled (dependencies satisfied)
    pub fn can_enable(&self, feature_id: FeatureId, scope: FeatureScope) -> Result<bool, DependencyError> {
        let feature = self.get_feature(feature_id)?;
        
        // Check parent
        if let Some(parent_id) = &feature.parent {
            if !self.is_enabled(parent_id, scope.clone())? {
                return Err(DependencyError::ParentNotEnabled(parent_id.clone()));
            }
        }
        
        // Check all required dependencies
        for dep_id in &feature.dependencies {
            if !self.is_enabled(dep_id, scope.clone())? {
                return Err(DependencyError::DependencyNotEnabled(dep_id.clone()));
            }
        }
        
        Ok(true)
    }
    
    /// Enable a feature and auto-enable dependencies
    pub fn enable_with_dependencies(&self, feature_id: FeatureId, scope: FeatureScope) -> Result<Vec<FeatureId>, Error> {
        let mut enabled = Vec::new();
        
        // Collect all dependencies that need enabling
        let to_enable = self.collect_missing_dependencies(feature_id, scope.clone())?;
        
        // Enable in dependency order (parents first)
        for id in &to_enable {
            self.set_enabled(id.clone(), scope.clone(), true)?;
            enabled.push(id.clone());
        }
        
        // Enable the requested feature
        self.set_enabled(feature_id, scope, true)?;
        enabled.push(feature_id);
        
        Ok(enabled)
    }
}
```

---

## 5. API Design

### 5.1 Core API

```rust
/// Main feature flag service interface
#[async_trait]
pub trait FeatureFlagService: Send + Sync {
    /// Check if a feature is enabled for a given context
    async fn is_enabled(&self, feature_id: FeatureId, context: &FeatureContext) -> Result<bool>;
    
    /// Check multiple features at once (batch)
    async fn are_enabled(&self, feature_ids: &[FeatureId], context: &FeatureContext) -> Result<HashMap<FeatureId, bool>>;
    
    /// Get all enabled features for a context
    async fn get_enabled_features(&self, context: &FeatureContext) -> Result<Vec<FeatureId>>;
    
    /// Get all available features (for admin UI)
    async fn list_features(&self, filter: FeatureFilter) -> Result<Vec<Feature>>;
    
    /// Enable/disable a feature at a scope
    async fn set_feature_state(&self, feature_id: FeatureId, scope: FeatureScope, enabled: bool) -> Result<()>;
    
    /// Get feature state history (audit trail)
    async fn get_feature_history(&self, feature_id: FeatureId, scope: FeatureScope) -> Result<Vec<FeatureStateChange>>;
}

/// Context for feature evaluation
pub struct FeatureContext {
    pub tenant_id: TenantId,
    pub user_id: Option<UserId>,
    pub role_id: Option<RoleId>,
}
```

### 5.2 Middleware/Guard Pattern

```rust
/// Axum middleware for feature checking
pub async fn require_feature(
    feature_id: FeatureId,
) -> impl Filter<Extract = (), Error = Rejection> + Clone {
    warp::any()
        .and(with_feature_context())
        .and_then(move |ctx: FeatureContext| {
            let feature = feature_id.clone();
            async move {
                let service = get_feature_service();
                if service.is_enabled(feature, &ctx).await? {
                    Ok(())
                } else {
                    Err(Rejection::from(FeatureDisabledError(feature)))
                }
            }
        })
}

/// Usage in routes
#[get("/api/invoices/batch")]
async fn batch_invoices() -> Result<Json<BatchResult>> {
    // Feature check handled by middleware
    // ...
}
```

### 5.3 Frontend Hook (Rust WASM)

```rust
/// Leptos hook for feature flags
pub fn use_feature(feature_id: FeatureId) -> Signal<bool> {
    let ctx = use_feature_context();
    let service = use_feature_service();
    
    create_signal_from_future(move || {
        let service = service.clone();
        let ctx = ctx.clone();
        let feature = feature_id.clone();
        async move {
            service.is_enabled(feature, &ctx).await.unwrap_or(false)
        }
    })
}

/// Usage in components
#[component]
pub fn InvoiceActions(cx: Scope, invoice: Invoice) -> impl IntoView {
    let batch_enabled = use_feature(FeatureId::from("sales.invoices.batch"));
    
    view! { cx,
        <div>
            <button>"Create Invoice"</button>
            {if batch_enabled.get() {
                view! { cx, <button>"Batch Invoice"</button> }.into()
            } else {
                ().into()
            }}
        </div>
    }
}
```

---

## 6. Database Schema

### 6.1 PostgreSQL Schema

```sql
-- Feature definitions (system-wide, seeded by migrations)
CREATE TABLE feature_definitions (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50) NOT NULL, -- 'core', 'module', 'sub_feature', 'capability'
    parent_id VARCHAR(255) REFERENCES feature_definitions(id),
    dependencies JSONB DEFAULT '[]',
    default_enabled BOOLEAN DEFAULT false,
    can_disable BOOLEAN DEFAULT true,
    tier_requirement VARCHAR(50),
    feature_group VARCHAR(50) NOT NULL,
    tags JSONB DEFAULT '[]',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feature_definitions_parent ON feature_definitions(parent_id);
CREATE INDEX idx_feature_definitions_group ON feature_definitions(feature_group);
CREATE INDEX idx_feature_definitions_level ON feature_definitions(level);

-- Feature states (per tenant/role/user)
CREATE TABLE feature_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_id VARCHAR(255) NOT NULL REFERENCES feature_definitions(id),
    scope_type VARCHAR(50) NOT NULL, -- 'system', 'tenant', 'role', 'user'
    tenant_id UUID,
    role_id UUID,
    user_id UUID,
    enabled BOOLEAN NOT NULL,
    set_at TIMESTAMPTZ DEFAULT NOW(),
    set_by UUID REFERENCES users(id),
    reason TEXT,
    
    CONSTRAINT valid_scope CHECK (
        (scope_type = 'system' AND tenant_id IS NULL AND role_id IS NULL AND user_id IS NULL) OR
        (scope_type = 'tenant' AND tenant_id IS NOT NULL AND role_id IS NULL AND user_id IS NULL) OR
        (scope_type = 'role' AND tenant_id IS NOT NULL AND role_id IS NOT NULL AND user_id IS NULL) OR
        (scope_type = 'user' AND tenant_id IS NOT NULL AND user_id IS NOT NULL)
    )
);

CREATE INDEX idx_feature_states_feature ON feature_states(feature_id);
CREATE INDEX idx_feature_states_tenant ON feature_states(tenant_id);
CREATE INDEX idx_feature_states_unique ON feature_states(feature_id, scope_type, tenant_id, role_id, user_id);

-- Audit trail for feature changes
CREATE TABLE feature_state_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_id VARCHAR(255) NOT NULL,
    scope_type VARCHAR(50) NOT NULL,
    tenant_id UUID,
    role_id UUID,
    user_id UUID,
    old_enabled BOOLEAN,
    new_enabled BOOLEAN NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    changed_by UUID REFERENCES users(id),
    reason TEXT
);

CREATE INDEX idx_feature_history_feature ON feature_state_history(feature_id);
CREATE INDEX idx_feature_history_tenant ON feature_state_history(tenant_id);
CREATE INDEX idx_feature_history_when ON feature_state_history(changed_at DESC);
```

---

## 7. Performance Optimizations

### 7.1 Caching Strategy

```rust
/// Cached feature flag resolver
pub struct CachedFeatureService {
    inner: Arc<dyn FeatureFlagService>,
    cache: Arc<RwLock<LruCache<CacheKey, CachedFeatures>>>,
}

#[derive(Hash, Eq, PartialEq)]
struct CacheKey {
    tenant_id: TenantId,
    role_id: Option<RoleId>,
    user_id: Option<UserId>,
}

struct CachedFeatures {
    features: HashMap<FeatureId, bool>,
    cached_at: Instant,
    ttl: Duration,
}

impl CachedFeatureService {
    pub fn new(inner: Arc<dyn FeatureFlagService>) -> Self {
        Self {
            inner,
            cache: Arc::new(RwLock::new(LruCache::new(10000))),
        }
    }
    
    pub async fn is_enabled(&self, feature_id: FeatureId, context: &FeatureContext) -> Result<bool> {
        let key = CacheKey::from(context);
        
        // Try cache first
        {
            let cache = self.cache.read().await;
            if let Some(cached) = cache.get(&key) {
                if cached.is_valid() {
                    return Ok(cached.features.get(&feature_id).copied().unwrap_or(false));
                }
            }
        }
        
        // Cache miss - load all features for this context
        let features = self.inner.get_enabled_features(context).await?;
        let cached = CachedFeatures::from_features(features);
        
        {
            let mut cache = self.cache.write().await;
            cache.put(key, cached.clone());
        }
        
        Ok(cached.features.get(&feature_id).copied().unwrap_or(false))
    }
}
```

### 7.2 Database Query Optimization

```sql
-- Efficient query to get all enabled features for a context
-- Returns features enabled at any scope level, ordered by specificity
WITH RECURSIVE feature_hierarchy AS (
    -- Get all features with their full path
    SELECT id, parent_id, ARRAY[id] AS path
    FROM feature_definitions
    WHERE parent_id IS NULL
    
    UNION ALL
    
    SELECT f.id, f.parent_id, h.path || f.id
    FROM feature_definitions f
    JOIN feature_hierarchy h ON f.parent_id = h.id
)
SELECT DISTINCT ON (fd.id)
    fd.id,
    fd.name,
    fd.parent_id,
    COALESCE(fs.enabled, fd.default_enabled) AS enabled,
    fs.scope_type AS effective_scope
FROM feature_definitions fd
LEFT JOIN feature_hierarchy fh ON fd.id = fh.id
LEFT JOIN feature_states fs ON fs.feature_id = fd.id
    AND (
        (fs.scope_type = 'system')
        OR (fs.scope_type = 'tenant' AND fs.tenant_id = $1)
        OR (fs.scope_type = 'role' AND fs.tenant_id = $1 AND fs.role_id = $2)
        OR (fs.scope_type = 'user' AND fs.tenant_id = $1 AND fs.user_id = $3)
    )
ORDER BY fd.id,
    CASE fs.scope_type
        WHEN 'user' THEN 1
        WHEN 'role' THEN 2
        WHEN 'tenant' THEN 3
        WHEN 'system' THEN 4
        ELSE 5
    END;
```

---

## 8. Admin UI Design

### 8.1 Feature Store Interface

```
┌─────────────────────────────────────────────────────────────────────┐
│  FEATURE STORE                                          [Search...🔍] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ 📦 All      │ │ ✅ Enabled  │ │ 🔒 Locked   │ │ ⭐ Popular  │   │
│  │    (47)     │ │    (23)     │ │    (24)     │ │    (12)     │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📁 SALES MODULE                                            5/8 ✓  │
│  ├─ ✅ Quotes                      Always on              CORE     │
│  ├─ ✅ Orders                      Enabled                        │
│  ├─ ✅ Invoices                    Enabled                        │
│  ├─ ⬜ Returns                     Enable feature →      [Try]    │
│  ├─ ⬜ Credit Memos                Enable feature →      [Try]    │
│  ├─ ⬜ Batch Operations            🔒 Growth tier        [Upgrade]│
│  └─ ⬜ Recurring Invoices          🔒 Growth tier        [Upgrade]│
│                                                                     │
│  📁 INVENTORY MODULE                                        3/6 ✓  │
│  ├─ ✅ Stock Management            Enabled                        │
│  ├─ ✅ Warehouses                  Enabled                        │
│  ├─ ⬜ Serial/Lot Tracking         Enable feature →      [Try]    │
│  ├─ ⬜ Inter-Warehouse Transfers   Requires: Multi-Warehouse      │
│  └─ ⬜ Multi-Warehouse             🔒 Growth tier        [Upgrade]│
│                                                                     │
│  📁 ACCOUNTING MODULE                                       4/7 ✓  │
│  ├─ ✅ Chart of Accounts           Always on              CORE     │
│  ├─ ✅ Journal Entries             Enabled                        │
│  ├─ ✅ Bank Reconciliation         Enabled                        │
│  └─ ⬜ Multi-Currency              🔒 Enterprise tier    [Upgrade]│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Feature Detail Modal

```
┌─────────────────────────────────────────────────────────────────────┐
│  ✕  BATCH OPERATIONS                                        [Try]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📦 sales.invoices.batch                                           │
│                                                                     │
│  Create and process multiple invoices at once. Perfect for         │
│  businesses with high invoice volume.                              │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  WHAT THIS ENABLES:                                                 │
│  ✓ Select multiple invoices for bulk actions                       │
│  ✓ Batch email invoices to customers                               │
│  ✓ Bulk status changes (approve, send, mark paid)                  │
│  ✓ Export selected invoices to PDF/CSV                             │
│  ✓ Print multiple invoices at once                                 │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  REQUIREMENTS:                                                      │
│  ✅ Invoices (already enabled)                                      │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  TIER: Growth ($49/mo)                                              │
│                                                                     │
│  [Cancel]                        [Enable for 14 days free]          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Security Considerations

### 9.1 Access Control

| Action | Who Can Do It |
|--------|---------------|
| View features | Any authenticated user (sees only enabled) |
| Enable/disable tenant features | Tenant admins |
| Enable/disable role features | Tenant admins |
| Enable/disable user features | Tenant admins, user themselves (limited) |
| Modify system defaults | System admins only |
| View audit history | Tenant admins, system admins |

### 9.2 Security Rules

```rust
/// Authorization rules for feature flag operations
impl FeatureFlagAuthorization {
    pub fn can_modify(&self, actor: &User, scope: &FeatureScope) -> bool {
        match scope {
            FeatureScope::System => actor.is_system_admin(),
            FeatureScope::Tenant(tenant_id) => {
                actor.is_system_admin() || 
                actor.is_tenant_admin(tenant_id)
            }
            FeatureScope::Role(tenant_id, role_id) => {
                actor.is_system_admin() || 
                actor.is_tenant_admin(tenant_id)
            }
            FeatureScope::User(tenant_id, user_id) => {
                actor.is_system_admin() || 
                actor.is_tenant_admin(tenant_id) ||
                actor.id == *user_id
            }
        }
    }
    
    pub fn can_view(&self, actor: &User, scope: &FeatureScope) -> bool {
        // Users can always view their own effective features
        // Admins can view their tenant's features
        // System admins can view everything
        match scope {
            FeatureScope::System => actor.is_system_admin(),
            FeatureScope::Tenant(tenant_id) => {
                actor.tenant_id == Some(*tenant_id)
            }
            FeatureScope::Role(tenant_id, _) => {
                actor.tenant_id == Some(*tenant_id)
            }
            FeatureScope::User(tenant_id, user_id) => {
                actor.tenant_id == Some(*tenant_id) ||
                actor.id == *user_id
            }
        }
    }
}
```

---

## 10. Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1-2)

| Task | Description |
|------|-------------|
| Database schema | Create tables, indexes, migrations |
| Core types | FeatureId, FeatureLevel, FeatureScope |
| Basic service | is_enabled, set_enabled |
| Seed features | Core features definitions |

### Phase 2: API & Integration (Week 2-3)

| Task | Description |
|------|-------------|
| REST API | CRUD endpoints for feature management |
| Middleware | Request-level feature checking |
| Frontend hooks | Leptos/Yew integration |
| Caching | Redis/in-memory cache layer |

### Phase 3: UI & UX (Week 3-4)

| Task | Description |
|------|-------------|
| Admin UI | Feature store interface |
| Feature cards | Individual feature display |
| Dependency visualization | Show feature relationships |
| Audit log viewer | History display |

### Phase 4: Advanced Features (Week 4-5)

| Task | Description |
|------|-------------|
| Dependency resolution | Auto-enable parents |
| Trial periods | Time-limited feature access |
| Tier integration | Connect to billing/subscription |
| Analytics | Track feature usage

---

## 11. File Structure

```
src/
├── features/
│   ├── mod.rs                 # Feature flag module exports
│   ├── types.rs               # FeatureId, FeatureLevel, FeatureScope
│   ├── definition.rs          # Feature struct and loader
│   ├── service.rs             # FeatureFlagService trait and impl
│   ├── cache.rs               # Caching layer
│   ├── dependencies.rs        # Dependency resolution
│   ├── authorization.rs       # Access control rules
│   ├── middleware.rs          # Axum middleware
│   └── migrations/
│       └── 001_initial_features.sql
│
├── api/
│   └── features/
│       ├── list.rs            # GET /api/features
│       ├── get.rs             # GET /api/features/:id
│       ├── enable.rs          # POST /api/features/:id/enable
│       ├── disable.rs         # POST /api/features/:id/disable
│       └── history.rs         # GET /api/features/:id/history
│
└── frontend/
    └── features/
        ├── store.rs           # Feature store component
        ├── card.rs            # Feature card component
        ├── detail.rs          # Feature detail modal
        └── hooks.rs           # use_feature() hook
```

---

## 12. Initial Feature Seeds

### Core Features (Always Enabled)

| ID | Name | Description |
|----|------|-------------|
| `core.auth` | Authentication | User login and session management |
| `core.users` | User Management | Create and manage users |
| `core.tenants` | Tenant Management | Multi-tenant organization |
| `core.navigation` | Navigation | Menu and routing |
| `core.search` | Search | Global search functionality |
| `core.settings` | Settings | System configuration |

### Module Features (Default Disabled)

| ID | Name | Description |
|----|------|-------------|
| `sales` | Sales Module | Quotes, orders, invoices |
| `inventory` | Inventory Module | Stock management |
| `accounting` | Accounting Module | Financial management |
| `purchasing` | Purchasing Module | POs and receiving |
| `hr` | HR Module | Employee management |

### Sub-Features (Examples)

| ID | Name | Parent |
|----|------|--------|
| `sales.quotes` | Quotes | sales |
| `sales.orders` | Orders | sales |
| `sales.invoices` | Invoices | sales |
| `inventory.stock` | Stock Management | inventory |
| `inventory.warehouses` | Warehouses | inventory |
| `accounting.journals` | Journal Entries | accounting |

### Capabilities (Examples)

| ID | Name | Parent |
|----|------|--------|
| `sales.invoices.batch` | Batch Invoicing | sales.invoices |
| `sales.invoices.recurring` | Recurring Invoices | sales.invoices |
| `inventory.serial` | Serial Tracking | inventory |
| `accounting.multicurrency` | Multi-Currency | accounting |

---

## 13. Next Steps

1. **Review this design** — Does it match your vision?
2. **Refine scope** — Any areas to simplify or expand?
3. **Start implementation** — Begin with Phase 1 tasks
4. **Create feature seeds** — Define your initial feature tree

---

*Document generated by BMAD Brainstorming Workflow*
*Session: 2026-03-01*
