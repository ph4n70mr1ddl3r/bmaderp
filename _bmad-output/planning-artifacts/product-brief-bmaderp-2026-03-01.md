---
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: complete
inputDocuments:
  - _bmad-output/brainstorming/brainstorming-session-2026-03-01-1255.md
  - _bmad-output/planning-artifacts/research/market-erp-unique-differentiating-features-retail-distribution-manufacturing-service-research-2026-03-02.md
date: 2026-03-01
author: Riddler
---

# Product Brief: bmaderp

## Executive Summary

**bmaderp** is an open-source ERP system that eliminates the false choice between power and simplicity. Built on a revolutionary **feature flag architecture**, it delivers enterprise-grade capabilities across service, retail, distribution, and manufacturing — while remaining genuinely free and accessible to businesses of any size.

Unlike traditional ERPs that generate revenue through complexity (consulting, training, support contracts), bmaderp is designed to be so intuitive that users never need third-party help. Every feature is available from day one, but hidden behind progressive disclosure — simple by default, complex only when needed. Business users configure the system themselves through no-code settings, eliminating the customization trap that plagues every other ERP on the market.

**The result:** A truly free ERP that scales from SME to enterprise, across any industry, without hidden costs, without vendor lock-in, without compromise.

---

## Core Vision

### Problem Statement

Businesses today are trapped between unacceptable ERP options:

1. **Enterprise ERPs** (SAP, Oracle, Microsoft) offer comprehensive features but at exorbitant cost — not just licensing, but implementation partners, training programs, and ongoing support contracts that make true total cost of ownership opaque and unsustainable.

2. **Open source ERPs** (Odoo, ERPNext, Dolibarr) advertise "free" but hide costs behind crippled community editions, paid enterprise upgrades, and complexity that forces users into paid consulting relationships.

3. **Both options share a fatal flaw:** They're designed to be complex. Complexity creates dependency. Dependency generates revenue. The uglier the user experience, the more money vendors and implementation partners make.

The result is a market where:
- 55-75% of ERP implementations fail to meet objectives
- Average implementation takes 12-18 months
- Businesses pay 3-5x the license cost in services
- "Free" software ends up costing more than paid alternatives

### Problem Impact

This broken market creates real damage:

- **SMEs and mid-market businesses** are priced out of capable ERP systems, forcing them to use fragmented tools that don't integrate
- **Growing companies** hit walls with limited systems and face painful, expensive migrations
- **Enterprises** waste millions on implementation projects that fail to deliver value
- **Open source adoption** stalls because "free" becomes expensive once you need help
- **Innovation suffers** as businesses adapt their processes to rigid software instead of software adapting to business needs

### Why Existing Solutions Fall Short

| Solution Type | Why It Fails |
|---------------|--------------|
| **Enterprise ERPs** | Complexity by design — revenue depends on consulting ecosystem |
| **Open Source ERPs** | "Community" editions are crippled; enterprise features locked behind paywalls |
| **Both** | Customization requires developers → technical debt → broken upgrades |
| **Both** | Configuration is limited; real changes need code modification |
| **Both** | Industry templates are shallow; real vertical depth requires expensive customization |

**The fundamental flaw:** Every existing ERP treats configuration as an afterthought and customization as the primary path to fit. This creates the consulting industrial complex that makes ERP expensive and risky.

### Proposed Solution

**bmaderp** reimagines ERP architecture around a single principle: **Configuration over customization.**

Built on **feature flags as first-class architectural citizens**, bmaderp delivers:

1. **All Features Available** — Every capability exists in one unified codebase. Nothing is locked behind editions, tiers, or paywalls.

2. **Progressive Disclosure** — The system starts simple. Features unlock as users need them. Complexity is opt-in, not forced.

3. **No-Code Configuration** — Business users shape the system through settings, not code. No developers required. No technical debt created.

4. **Universal Industry Support** — Service, retail, distribution, and manufacturing workflows are all supported. Industry "templates" are simply pre-configured feature flag bundles.

5. **True Open Source Freedom** — No crippled community edition. No enterprise paywall. The full system is free — genuinely free — because intuitive design eliminates the need for paid support.

6. **Scales With Your Business** — Start as an SME, grow to enterprise. Same system. Same configuration. No migrations. No reimplementation.

### Key Differentiators

| Differentiator | Why It Matters | Competitive Gap |
|----------------|----------------|-----------------|
| **Feature Flags as Architecture** | Every capability is a toggle — progressive disclosure, granular control, tenant-specific configurations | No ERP uses feature flags as foundational architecture |
| **Configuration Over Customization** | 100% no-code adaptation — business users configure, developers never needed | All competitors require customization for real fit |
| **True Free Tier** | All features available at no cost — no enterprise edition crippleware | Every "free" ERP hides key features behind paywalls |
| **Zero Hidden Costs** | Intuitive UX eliminates need for consultants, training, support | Competitors profit from complexity; their UX is a revenue source |
| **Universal Industry Support** | One system handles service, retail, distribution, manufacturing | Competitors specialize or require heavy customization |
| **Rust + PWA Performance** | Sub-100ms responses, offline-capable, mobile-first | Legacy architectures can't match this performance profile |

**Unfair Advantage:** Feature flags as architecture, enabled by Rust's near-zero overhead, makes progressive disclosure and configuration-over-customization technically and economically viable for the first time in ERP history.

---

## Target Users

### Primary User: Operations Manager (The Hero)

#### Persona: Sarah Chen

| Attribute | Details |
|-----------|---------|
| **Name** | Sarah Chen |
| **Age** | 38 |
| **Role** | Operations Manager |
| **Company** | Meridian Distribution Co. |
| **Industry** | Distribution (wholesale industrial supplies) |
| **Company Size** | 120 employees, $18M annual revenue |
| **Team** | 35 people across warehouse, logistics, and inventory |

#### Her Story

Sarah started in the warehouse 12 years ago, pulling orders and driving forklifts. She worked her way up because she had a knack for seeing what was broken and fixing it. The previous ops manager retired 3 years ago, and Sarah got promoted into the role.

She's not an IT person. She's not a finance person. She's a **"make things work"** person.

#### Her Current Pain

| Pain Point | Sarah's Reality |
|------------|-----------------|
| **Configuration** | Every change requires a support ticket. Takes 2-3 weeks. Costs $200/hr in consulting fees. |
| **Workflow Mismatch** | The ERP thinks they pick orders one way. They actually pick them a completely different way. Neither will budge. |
| **User Complaints** | Her team hates it. "Sarah, why can't we just use the old system?" is a weekly question. |
| **Reporting** | She needs a report showing inventory turns by category. Been waiting 6 weeks. Told it's "a customization." |
| **Hidden Costs** | They've spent $47K on "implementation support" in the last 8 months. The CFO is asking questions. |
| **Upgrade Anxiety** | Terrified of upgrades. Last one broke their custom workflows. Took 3 weeks to recover. |

#### What She Secretly Wants

> *"I just want a system that works the way WE work. I don't want to hire consultants every time I need to change a workflow. I don't want my team to hate me for forcing this on them. I want to see what's happening in my operation without begging for reports. Is that too much to ask?"*

#### Her "Aha!" Moment with bmaderp

1. **5 minutes in:** "Wait, I can just... turn on warehouse management? No sales call? No enterprise license?"
2. **15 minutes in:** "I can change the picking workflow MYSELF? Without a developer?"
3. **30 minutes in:** "This is actually... simple? Where's the catch?"
4. **1 hour in:** She's configured a workflow that matches how her team actually works. No ticket. No consultant. No waiting.

#### Why She Becomes a Champion

| What bmaderp Gives Sarah | Why She Loves It |
|--------------------------|------------------|
| **Self-service configuration** | She's not dependent on IT or consultants |
| **Progressive disclosure** | Her team starts simple, unlocks features as needed |
| **Actually free** | No hidden costs, no budget battles |
| **Offline-capable PWA** | Works in the warehouse, even when WiFi doesn't |
| **Real-time visibility** | Dashboards that answer her questions without custom reports |
| **No upgrade anxiety** | Configuration survives upgrades — no custom code to break |

### Secondary Users

#### Decision Makers

| Role | What They Care About | Their "Buy" Moment |
|------|---------------------|-------------------|
| **CFO / Finance Director** | Cost, compliance, reporting accuracy | "This gives me control without the enterprise price tag" |
| **CEO / Business Owner** | Growth enablement, no operational disruption | "I can actually understand what's happening in my business" |
| **IT Director / CTO** | Integration, security, maintainability | "No vendor lock-in, I control my data, modern architecture" |

#### Power Users (Configurers)

| Role | What They Need | Their Pain Today |
|------|---------------|------------------|
| **Finance Lead / Controller** | Chart of accounts, tax rules, reporting templates | Has to hire consultants for every change |
| **HR Manager** | Payroll rules, benefits, compliance settings | Manual workarounds for everything |
| **Warehouse Manager** | Inventory rules, picking strategies, location configs | System doesn't match how they actually work |

#### Daily Users (End Users)

| Role | What They Do All Day | What They Need |
|------|---------------------|----------------|
| **Accountant / Bookkeeper** | Invoices, reconciliations, journal entries | Fast data entry, no clicks wasted |
| **Sales Rep** | Quotes, orders, customer history | Mobile access, instant info |
| **Warehouse Worker** | Receiving, picking, shipping | Barcode scanning, offline capability |
| **Project Manager** (Service) | Time tracking, resource allocation, billing | Easy time entry, project visibility |
| **Retail Staff** | POS, inventory checks, customer lookup | Touch-friendly, lightning fast |

#### Occasional Users

| Role | What They Need | Their Experience |
|------|---------------|------------------|
| **Executive** | Dashboards, KPIs, approvals | One-glance understanding, mobile-friendly |
| **Vendor / Supplier** | Submit invoices, check payment status | Self-service portal, no training needed |
| **Customer** | View invoices, track orders, pay bills | Branded portal, consumer-grade UX |

### User Journey

#### The Hero's Journey: Sarah's bmaderp Experience

| Stage | What Happens | Sarah's Experience |
|-------|--------------|-------------------|
| **Discovery** | Finds bmaderp through Reddit/community | "Finally, an ERP that doesn't require a second mortgage" |
| **First Try** | Spins up demo, explores on her own | 5 min: "Wait, all features are free?" 30 min: "I just configured a workflow myself?" |
| **Aha! Moment** | Realizes she can configure without consultants | "Holy sh*t. This is what I've been fighting for." |
| **Team Rollout** | Gets team on board with simple interface first | Her team doesn't hate it. Progressively unlocks features as they're ready. |
| **Success** | Operations running smoothly, visibility achieved | CFO asks "How did you do this without consultants?" Sarah looks like a genius. |
| **Advocacy** | Becomes a champion in her network | Tells LinkedIn, joins community, helps other ops managers |

---

## Success Metrics

### North Star Metric

**Active Production Installations**

The ultimate measure of success: How many businesses are running bmaderp in production? All other metrics are leading indicators pointing toward this goal.

### User Success Metrics

| Metric | What It Measures | Target Signal |
|--------|------------------|---------------|
| **Self-Service Configuration** | Users configure workflows without help | No support requests for basic changes |
| **Time to First Value** | How fast users get something working | Productive in under 1 hour |
| **Spreadsheet Elimination** | Users stop maintaining shadow systems | No parallel spreadsheets for core operations |
| **Team Adoption Rate** | Daily users actually using it | 80%+ of intended users active weekly |
| **Zero Consultant Dependency** | Users solve problems themselves | Community answers > paid support |

### Community Adoption Metrics

| Metric | Category | Why It Matters |
|--------|----------|----------------|
| **GitHub Stars** | Awareness | Interest and bookmarking |
| **GitHub Forks** | Engagement | Active exploration and contribution potential |
| **Downloads/Clones** | Usage | Actual installations happening |
| **Docker Pulls** | Deployment | Production-ready usage |
| **Return Visitors** | Engagement | Users returning to docs, releases, community |

### Community Health Metrics

| Metric | What It Shows |
|--------|---------------|
| **Contributors** | People actively improving the project |
| **Pull Requests Merged** | Quality of community engagement |
| **Issue Resolution Time** | Community responsiveness |
| **Documentation Contributions** | Users helping users |
| **Community Answers** | Questions answered by community vs maintainers |
| **Translations** | Global adoption signal |

### Quality Metrics (Adoption Enablers)

| Metric | Target |
|--------|--------|
| **Performance** | Sub-100ms response times |
| **Uptime** | 99.9%+ for hosted demo |
| **Test Coverage** | 80%+ on core modules |
| **Security Vulnerabilities** | Zero critical/high |
| **Documentation Completeness** | Every feature documented |
| **Onboarding Time** | New user productive in < 1 hour |

### Impact Metrics (Qualitative)

| Signal | What It Proves |
|--------|----------------|
| **"I saved $X" testimonials** | Real value delivered |
| **Case studies** | Detailed success narratives |
| **"Switched from [competitor]"** | Competitive displacement |
| **"Deployed in production"** | Enterprise trust |
| **"My team loves it"** | User satisfaction |

### Milestone Targets

| Timeframe | Target |
|-----------|--------|
| **3 Months** | 100 GitHub stars, 10 forks, 5 contributors, working demo |
| **6 Months** | 500 stars, 50 forks, 20 contributors, first production deployment story |
| **12 Months** | 2,000 stars, 200 forks, 50 contributors, 10+ production case studies |
| **24 Months** | 10,000 stars, 500+ contributors, recognized open source ERP alternative |

---

## MVP Scope

### Core Features

#### Primary Business Cycles

**Quote to Cash (Q2C)**

Complete revenue cycle from customer quote to cash receipt:

| Stage | Capabilities |
|-------|--------------|
| **Quote** | Customer quotes, templates, terms, pricing |
| **Order** | Sales orders, line items, delivery scheduling |
| **Fulfill** | Pick, pack, ship, inventory deduction |
| **Invoice** | AR invoices, automated GL entries, revenue recognition |
| **Payment** | Cash receipts, bank deposits, AR clearing |

**Procure to Pay (P2P)**

Complete expense cycle from requisition to vendor payment:

| Stage | Capabilities |
|-------|--------------|
| **Requisition** | Purchase requisitions, approval workflows |
| **PO** | Purchase orders, vendor selection, terms |
| **Receive** | Goods receipt, inventory addition, quality check |
| **Invoice** | AP invoices, 3-way match, automated GL entries |
| **Payment** | Vendor payments, bank withdrawals, AP clearing |

#### Core Modules

| Module | Capabilities |
|--------|--------------|
| **Contacts** | Customers, Vendors, basic CRM fields, addresses, contacts |
| **Items/Catalog** | Products, Services, pricing, units of measure, categories |
| **Inventory** | Stock tracking, locations, basic movements, valuation |
| **Sales** | Quotes, Orders, Fulfillment, delivery management |
| **Purchasing** | Requisitions, POs, Receiving, vendor management |
| **Invoicing (AR)** | Customer invoices, aging, statements |
| **Invoicing (AP)** | Vendor invoices, 3-way match, aging |
| **Payments** | Cash receipts, vendor payments, bank transactions |
| **Accounting (GL)** | Chart of accounts, journals, automated entries, trial balance |
| **Workflows** | Approval chains, basic automation triggers, status transitions |

#### Foundational Architecture

| Feature | MVP Implementation |
|---------|-------------------|
| **Feature Flags** | Every module/workflow toggleable, hierarchical structure |
| **Progressive Disclosure** | Simple mode by default, unlock advanced features |
| **No-Code Configuration** | Workflow customization, field configuration, approval rules |
| **Multi-Tenancy** | Tenant isolation, per-tenant feature flags, per-tenant config |
| **API-First** | REST API for all operations |
| **PWA** | Offline-capable, mobile-responsive, installable |
| **Authentication** | User accounts, roles, basic permissions, tenant membership |

#### Basic Reporting

| Report | Description |
|--------|-------------|
| **AR Aging** | Customer balances by aging bucket (30/60/90+) |
| **AP Aging** | Vendor balances by aging bucket (30/60/90+) |
| **Sales by Customer** | Revenue summary by customer, period filtering |
| **Purchases by Vendor** | Spend summary by vendor, period filtering |
| **Inventory Status** | Stock levels by location, reorder points |
| **Transaction Lists** | Filterable lists for all modules (orders, invoices, payments) |
| **Trial Balance** | GL account balances, debits/credits |

#### Industry Support (MVP)

| Industry | MVP Support Level |
|----------|-------------------|
| **Service** | ✅ Time-based billing, service items, project-lite tracking |
| **Retail** | ✅ POS-lite, inventory, customer sales, simple POS flow |
| **Distribution** | ✅ Full Q2C/P2P, warehouse operations, multi-location |
| **Manufacturing** | ❌ Deferred to v2 (BOM, routing, production orders) |

### Out of Scope for MVP

| Deferred Feature | Rationale |
|------------------|-----------|
| **HR/Payroll** | Complex, regulatory, not core to Q2C/P2P |
| **Manufacturing (BOM, routing, production)** | Complex workflows, adds significant scope |
| **Project Management** | Service-specific, can be added later |
| **CRM (beyond basic contacts)** | Marketing/sales pipeline, not core |
| **E-commerce Integration** | External connectors, future phase |
| **Banking Integrations** | API dependencies, future phase |
| **Mobile Native Apps** | PWA covers mobile, native later |
| **Multi-language** | Localization, future phase |
| **Multi-currency** | Global features, future phase |
| **Advanced Analytics/BI** | Embedded dashboards, future phase |
| **Plugin Marketplace** | Ecosystem, future phase |
| **Customer/Vendor Portals** | Self-service, future phase |
| **Tax Engine (complex)** | Basic tax handling in MVP, advanced later |
| **Serial/Lot Tracking** | Inventory complexity, future phase |
| **Barcode/RFID Integration** | Hardware integration, future phase |

### MVP Success Criteria

| Criteria | Success Signal |
|----------|----------------|
| **Functional Q2C** | Complete quote → cash flow works end-to-end |
| **Functional P2P** | Complete requisition → payment flow works end-to-end |
| **Self-Service Config** | User configures workflow without documentation/help |
| **Feature Flags Working** | Enable/disable modules without code changes |
| **Multi-Tenant Isolation** | Multiple tenants, isolated data, per-tenant config |
| **Performance** | Sub-100ms response times on core operations |
| **Offline Capability** | PWA works offline, syncs when connected |
| **One Production Deployment** | At least one real business running MVP in production |

### Future Vision

#### Post-MVP Roadmap

**Phase 2: Enhanced Core**
- Manufacturing module (BOM, routing, production orders)
- Multi-currency support
- Advanced reporting & dashboards
- Customer/Vendor self-service portals
- Serial/Lot tracking

**Phase 3: Ecosystem**
- Plugin marketplace
- Banking integrations
- E-commerce connectors (Shopify, WooCommerce, etc.)
- API webhooks & events
- Barcode/RFID integration

**Phase 4: Scale & Intelligence**
- AI-powered insights and recommendations
- Advanced analytics/BI
- Multi-language support
- Mobile native apps (iOS, Android)
- Advanced tax engine

**Phase 5: Platform**
- White-label capabilities
- Advanced workflow automation (visual builder)
- Industry-specific templates library
- Community module marketplace
- Partner/ISV ecosystem

#### Long-Term Vision

bmaderp becomes the definitive open-source ERP alternative:
- The go-to choice for businesses priced out of enterprise ERP
- A thriving community of contributors and users
- Case studies across service, retail, distribution, and manufacturing
- Recognized as the "Rust ERP" — fast, modern, truly free
