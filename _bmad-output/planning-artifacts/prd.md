---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-bmaderp-2026-03-01.md
  - _bmad-output/planning-artifacts/research/domain-open-source-saas-erp-research-2026-03-01.md
  - _bmad-output/planning-artifacts/research/market-erp-unique-differentiating-features-retail-distribution-manufacturing-service-research-2026-03-02.md
  - _bmad-output/planning-artifacts/research/technical-rust-fullstack-leptos-erp-2026-03-01.md
  - _bmad-output/brainstorming/brainstorming-session-2026-03-01-1255.md
  - _bmad-output/design/feature-flags-design.md
documentCounts:
  briefs: 1
  research: 3
  brainstorming: 1
  design: 1
  projectDocs: 0
workflowType: 'prd'
classification:
  projectType: 'SaaS B2B Platform'
  domain: 'Enterprise Business Software (ERP)'
  complexity: 'high'
  projectContext: 'greenfield'
lastEdited: '2026-03-03'
editHistory:
  - date: '2026-03-03'
    changes: 'Added Measurement column to all 34 NFRs (NFR1-NFR34) across 6 categories'
  - date: '2026-03-03'
    changes: 'Added 12 missing FRs (FR76-FR87): Webhooks (3), Mobile & Offline (5), Extensibility (4)'
  - date: '2026-03-03'
    changes: 'Resolved MVP journey contradiction by marking FR76-FR87 as Phase 2 features'
  - date: '2026-03-03'
    changes: 'Added SOX Control Framework with SOD matrix, financial controls, and monitoring; Added Approval Workflow FRs (FR88-FR94)'
---

# Product Requirements Document - bmaderp

**Author:** Riddler
**Date:** 2026-03-02

stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']**bmaderp** is an open-source, multi-tenant SaaS ERP built on a pure Rust full-stack architecture with Leptos. It targets the $35B+ ERP market with a fundamentally different approach: **progressive disclosure as architectural principle** — simple by default, powerful when needed, no consultants required.

### The Problem

The ERP industry is broken. Implementation failure rates exceed 60%. Deployments take 6-18 months. User interfaces require extensive training. Customization demands expensive consultants. The result: businesses spend more time managing their ERP than running their operations.

**Root cause:** Traditional ERPs expose all complexity to all users. They require configuration before value. They treat simplicity and capability as trade-offs.

### The Solution

bmaderp inverts this model. The system ships with strongly opinionated, industry-specific defaults. Users answer 5 questions during onboarding; the system configures itself. Features exist behind a hierarchical feature flag system that reveals capability progressively — users see only what they need, when they need it.

**Technology differentiation:** Delivers 10-100x performance over traditional ERPs through modern architecture, eliminates garbage collection pauses for financial transaction accuracy, and provides memory safety that removes entire vulnerability classes by design.

### Target Market

| Segment | Profile | Primary Need |
|---------|---------|--------------|
| **Primary** | Mid-market manufacturing (100-1000 employees) | Modern UX with manufacturing depth |
| **Secondary** | Distribution companies | Real-time inventory AI |
| **Tertiary** | SMB retail | Omnichannel simplicity |
| **Quaternary** | Professional services | Unified project/ERP |

### Business Model

True open source under MIT/Apache 2.0 license. No crippled "community edition." Revenue from:
- **SaaS hosting** — Managed cloud deployment with usage-based pricing
- **Enterprise support** — SLA-backed support contracts
- **Professional services** — Implementation, customization, training (when customers want it, not because they need it)

---

### What Makes This Special

**Core Insight:** Feature flags are not a technical implementation detail — they are the architectural foundation that simultaneously enables simplicity (progressive disclosure), customization (per-tenant configuration), and business model (tiered feature packaging).

**Key Differentiators:**

| Differentiator | How It Works | User Benefit |
|----------------|--------------|--------------|
| **Progressive Disclosure** | Features unlock as users demonstrate mastery | Zero training required to start |
| **5-Question Setup** | Wizard auto-configures modules, tax rules, defaults | Implementation in days, not months |
| **Feature Store** | In-app marketplace to browse and enable features | Complexity is opt-in, not default |
| **Rust Architecture** | Memory-safe, no GC pauses, 10-100x faster | Financial accuracy, sub-100ms responses |
| **True Open Source** | Full codebase, no feature-gated "community" edition | Zero vendor lock-in, community-driven |

**The "Aha!" Moment:** A user realizes they've been productive for weeks without opening documentation, attending training, or calling a consultant. The ERP disappears into their workflow.

---

## Project Classification

| Attribute | Value | Rationale |
|-----------|-------|-----------|
| **Project Type** | SaaS B2B Platform | Multi-tenant, dashboards, teams, subscription tiers, enterprise features |
| **Domain** | Enterprise Business Software (ERP) | Cross-functional: financials, inventory, sales, procurement, manufacturing, HR |
| **Complexity** | High | Multi-module system, compliance (SOX, GDPR, SOC 2), multi-tenant isolation, industry-specific workflows |
| **Project Context** | Greenfield | New product, no existing codebase constraints |

---

## Success Criteria

### User Success

**North Star:** Users spend 90% less time on reconciliation activities within 90 days of going live.

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Bank transaction auto-match rate** | 85%+ | % of bank feed items auto-matched to invoices/payments |
| **Monthly close time** | ≤5 days | Days from month-end to finalized financials |
| **Unapplied payments (>30 days old)** | <2% of AR | Dollar value of orphan payments / total AR |
| **First-time reconciliation success** | 90%+ | % of reconciliations completed without retry or support call |
| **Time to first value** | <30 minutes | Signup to first completed invoice or bank reconciliation |

**User Success Moments:**

| Moment | Definition |
|--------|------------|
| **The Empty Screen** | User opens reconciliation and sees "0 items to review" |
| **The Auto-Close** | Month-end closes without manual intervention |
| **The One-Click Match** | Complex 3-way match (PO → Receipt → Invoice) resolves automatically |
| **The Disappearing Question** | "Where is that payment?" becomes unnecessary — system surfaces the answer |

---

### Business Success

**Primary Metric:** 90%+ customer implementation success rate (vs. industry 40% average)

| Metric | 6-Month Target | 12-Month Target | 18-Month Target |
|--------|----------------|------------------|------------------|
| **Paying tenants** | 10 | 50 | 200 |
| **Implementation success rate** | 85% | 90% | 95% |
| **Customers citing "reduced manual work"** | 70% | 80% | 90% |
| **Reference-able case studies** | 3 | 10 | 25 |
| **Monthly Recurring Revenue (MRR)** | $10K | $75K | $300K |

**Business Success Definition:**

A customer is "successful" when:
1. Live on core modules within 90 days
2. Using system for daily operations (not running parallel systems)
3. Cites measurable reduction in manual reconciliation effort
4. Renews or expands subscription

---

### Technical Success

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **API response time (p99)** | <100ms | Sub-second for all user actions |
| **Bank feed sync latency** | <15 minutes | Near real-time reconciliation |
| **Auto-match decision time** | <500ms per transaction | No user waiting |
| **Matching accuracy** | 99.5%+ | Trust in auto-matches |
| **Uptime SLA** | 99.9% | 8.7 hours max downtime/year |
| **Zero-downtime migrations** | 100% | Schema changes without customer impact |
| **Multi-tenant data isolation** | Zero cross-tenant leaks | Architectural guarantee |

---

### Measurable Outcomes

**The Streamlined Business Scorecard:**

Customers receive a "Streamlining Score" based on:

| Dimension | Weight | Measurement |
|-----------|--------|-------------|
| **Reconciliation automation** | 30% | % of transactions auto-reconciled |
| **Close cycle time** | 25% | Days to close vs. baseline |
| **Process automation** | 25% | % of workflows fully automated |
| **Data accuracy** | 20% | Exception rate on automated processes |

**Target:** Customers achieve 75+ Streamlining Score within 90 days.

---

## Product Scope

### MVP - Minimum Viable Product

**Goal:** Prove that reconciliation elimination is possible and valuable.

**Core Modules:**
- Chart of Accounts & General Ledger
- Bank Feed Integration & Auto-Reconciliation
- Accounts Receivable (Invoicing, Payment Application)
- Accounts Payable (Vendor Bills, 3-Way Match)
- Basic Inventory (Single warehouse)
- Contacts (Unified customers/vendors)

**Feature Flag Architecture:**
- Hierarchical feature flag system (foundation)
- Per-tenant feature configuration
- 5-question setup wizard with industry presets

**Target Customer Profile:**
- 10-50 employees
- Single entity (no multi-company)
- 1-2 users on system
- Service or simple distribution business

**MVP Success Criteria:**
- 5 paying customers live within 6 months
- 80%+ auto-match rate on bank transactions
- <5 day monthly close for all customers

---

### Growth Features (Post-MVP)

**Goal:** Competitive feature parity with mid-market ERPs.

**Module Expansions:**
- Multi-currency & Multi-company
- Advanced Inventory (multi-warehouse, serial/lot tracking)
- Manufacturing (BOMs, work orders, routing)
- Project Accounting (for services)
- Sales & Purchasing workflows

**Reconciliation Enhancements:**
- AI-powered matching suggestions
- Anomaly detection on transactions
- Predictive cash flow
- Smart categorization rules

**Platform Features:**
- Customer/Vendor portals
- API marketplace & webhooks
- Advanced reporting & dashboards
- Mobile app (PWA offline-first)

**Target Customer Profile:**
- 50-500 employees
- Multi-entity, multi-currency
- 5-50 users
- Manufacturing, distribution, retail

---

### Vision

**Goal:** The ERP that disappears.

**Aspirational Features:**
- Natural language interface ("Show me outstanding AR for Acme Corp")
- AI-generated reports on demand
- Predictive operations (inventory reorder, cash flow alerts)
- Autonomous reconciliation (no human review needed)
- Industry-specific AI advisors
- Full offline operation for distributed teams

**Target Customer Profile:**
- 500-5000+ employees
- Complex multi-entity, global operations
- Enterprise compliance (SOX, IFRS)
- Seeking competitive advantage through operational intelligence

---

## User Journeys

### Journey 1: The Reconciliation Hero (Sarah Chen)

**Persona:** Sarah Chen, 38, Operations Manager at Meridian Distribution Co. (120 employees, $18M revenue)

#### Opening Scene

It's 6:47 PM on a Friday. Sarah's warehouse team left two hours ago. She's still at her desk, staring at a spreadsheet, trying to match 47 bank transactions to invoices. The CFO needs the books closed by Monday. Her eyes burn.

Her phone buzzes. Her husband: "Movie night?" She texts back: "Maybe." She hates lying.

#### Rising Action

Sarah discovered bmaderp on r/ERP three weeks ago. Skeptical but desperate, she spun up the demo on a Saturday morning. Within 30 minutes, she'd connected a test bank feed and watched 23 transactions auto-match.

*"This can't be real."*

She deployed it on a spare server the following Monday. Quietly. Didn't tell anyone. Just her and the warehouse manager, Diego, testing it in parallel with their legacy system.

Two weeks in, she's ready to show the CFO.

#### Climax

Friday afternoon. Sarah walks into Marcus Webb's office with her laptop.

"Marcus, I need to show you something."

She opens bmaderp. Clicks **Bank Reconciliation**.

**Screen shows: "3 items to review."**

Marcus stares. "Where are the other 44 transactions?"

"Auto-matched. The system found them. These 3 are the ones it couldn't figure out — a duplicate payment, a partial invoice, and a refund we didn't record."

Marcus leans back. "How long did this take you?"

"About 4 minutes."

Last month, reconciliation took Sarah 6 hours across 3 days.

#### Resolution

Sarah's at home by 7:15 PM. Movie night saved. But something bigger happened — she's not dreading Monday anymore. The books will close on time. No spreadsheet. No burn.

Two months later, she's reduced her reconciliation workload by 85%. Her team uses the PWA on warehouse tablets. Diego swears by the barcode scanner. The CFO is asking about rolling it out to the sales team.

**Capabilities Revealed:** Bank feed integration, auto-matching algorithm, exception-based UI, mobile PWA, barcode scanning, quick deployment path

---

### Journey 2: The Skeptical CFO (Marcus Webb)

**Persona:** Marcus Webb, 52, CFO / Finance Director at Meridian Distribution Co. CPA with 25 years experience, risk-averse, skeptical of "free" anything.

#### Opening Scene

Marcus is reviewing the Q3 budget variance report. There's a $47,000 line item for "ERP consulting support" — the same line item that appears every quarter. He's been meaning to ask Sarah about it.

He remembers the NetSuite implementation five years ago. 14 months. $340,000 over budget. Three consultants who "didn't get our business." He still has nightmares.

When Sarah walks into his office with "I need to show you something," his first thought is: *Here we go. Another software purchase.*

#### Rising Action

Sarah shows him the reconciliation screen. Marcus is impressed but guarded.

"How much does this cost, Sarah?"

"It's open source. Free."

"Free software is the most expensive kind. What's the catch?"

Sarah shows him:
- The MIT license
- The community forum (not a paywalled support portal)
- The GitHub repository with active commits
- A video of a business owner deploying it in 45 minutes

Marcus pulls up Gartner and Capterra. No enterprise reviews. No vendor backing. Red flags everywhere.

But then he sees a case study from a distribution company similar to theirs. 18 months live. Zero consultants. 99.7% inventory accuracy.

He calls the CFO listed in the case study. They talk for 45 minutes.

*"We've saved $200K in the first year. Not just license fees — consultants, training, the whole thing. The system just... works."*

#### Climax

Marcus schedules a meeting with the CEO. He presents two options:

1. **Stay with current ERP** — $180K/year in licenses + $50-80K/year in consulting
2. **Migrate to bmaderp** — $0 license + $25K/year in optional support + internal time

He shows the compliance checklist:
- SOC 2 Type II architecture
- GDPR data handling
- Audit trail on every transaction
- Role-based access control
- Data export (no vendor lock-in)

The CEO asks: "What's the risk?"

Marcus: "The risk is staying. We're bleeding money on a system everyone hates. At least with this, we own our data, we own our code, and we can hire anyone to customize it — not just their consultants."

#### Resolution

Three months later, Marcus signs off on the full migration. He's nervous. He's been burned before.

Six months post-migration, he's reviewing the Q3 numbers again. The $47,000 consulting line item is gone. Month-end close went from 15 days to 4. The audit took half the time because every transaction has a complete trail.

He sends Sarah an email: "This is the first ERP decision I don't regret."

**Capabilities Revealed:** Compliance documentation (SOC 2, GDPR, audit trails), ROI calculator / business case tools, reference customer program, transparent pricing, data portability, executive dashboards

---

### Journey 3: The Warehouse Floor (Diego Martinez)

**Persona:** Diego Martinez, 29, Warehouse Lead at Meridian Distribution Co. 7 years in warehousing, smartphone native, hates clunky enterprise software.

#### Opening Scene

Diego's in the warehouse, 7:15 AM. He's got 47 orders to pick before the 11 AM truck. His team is already moving.

He pulls out the tablet running their current ERP's warehouse module. It's slow. The WiFi in the back corner is spotty. He taps "Load Orders" and watches a spinner.

And watches.

*"Come on, come on..."*

The spinner times out. Error message. He has to walk to the front office to get a connection, then walk back. He's lost 8 minutes. His team is standing around waiting for pick tickets.

This happens every. Single. Day.

#### Rising Action

Sarah approaches Diego on a Tuesday. "I want you to try something. Don't tell anyone yet."

She hands him a rugged tablet with bmaderp installed. "Just use this for receiving today. Let me know what you think."

Diego's skeptical. Another app. Another login. Another thing that's going to slow him down.

He opens the app. It loads instantly — no spinner. He taps **Receiving**. The camera opens. He scans a barcode on the incoming pallet.

*BEEP*

The screen shows: **PO-4827 — 24 units of Industrial Valve 6" — Expected today**

He taps **Confirm Receipt**. Done. 6 seconds.

He tries another. BEEP. Done.

By end of day, he's processed 12 receipts. The old system would have taken him 3x longer.

#### Climax

Three weeks later. Diego's in the back corner — the WiFi dead zone. A truck arrives early. He needs to check inventory levels for a rush order.

He pulls out the tablet. Opens bmaderp. It works. No WiFi needed.

He checks stock. Creates a pick list. Assigns it to his team. All offline.

When he walks back into WiFi range, everything syncs automatically. No data loss. No duplicates.

His team lead, Maria, looks at him. *"Boss, when did the system get good?"*

#### Resolution

Six months post-migration, Diego's team is 30% more productive. They don't wait for the system anymore — the system waits for them.

Diego's phone buzzes. It's Sarah: "Can you train the new guy on the warehouse app?"

He smiles. For the first time, training someone on the ERP doesn't feel like apologizing.

**Capabilities Revealed:** Offline-first PWA architecture, barcode scanning (camera + hardware), sub-second response times, automatic sync on reconnection, mobile-first UX, warehouse-optimized workflows

---

### Journey 4: The Developer Integrator (Alex Kim)

**Persona:** Alex Kim, 34, Senior Software Engineer at TechFlow Solutions. Full-stack developer, API enthusiast, open source contributor.

#### Opening Scene

Alex's CEO just dropped a requirement on their desk: "We need to sync our e-commerce orders into the ERP automatically. The finance team is tired of manual entry."

Alex researches bmaderp's API documentation. They're expecting the usual: outdated docs, missing examples, authentication headaches.

Instead, they find:

```
POST /api/v1/sales-orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "customer_id": "uuid",
  "lines": [{ "item_id": "uuid", "quantity": 5, "unit_price": 29.99 }],
  "shipping_address_id": "uuid"
}
```

Response: 201 Created with the full order object.

*"Wait, that's it? Where's the 47-field payload?"*

#### Rising Action

Alex spins up a local bmaderp instance using Docker. It's running in 2 minutes.

They create an API key, open Postman, and hit the endpoint. It works. First try.

They check the docs for webhooks. There's an **API Playground** built into the UI. They can test endpoints without leaving the browser.

They find the event types: `order.created`, `invoice.paid`, `inventory.low_stock`, `payment.received`.

They set up a webhook in 3 clicks. Test it with a ngrok tunnel. It fires immediately when they create a test order.

*"This is... actually pleasant?"*

#### Climax

Alex hits a snag. They need to extend the customer object to store e-commerce metadata. In their old ERP, this would require a support ticket, a $5,000 customization quote, and 4-6 weeks of waiting.

They check bmaderp's documentation. **Custom Fields** are a first-class feature. They add `ecommerce_customer_id` and `loyalty_tier` to the customer schema through the UI.

Then they discover the **Plugin System**. They can write a Rust plugin that listens for `order.created` events, enriches the order with e-commerce metadata, and sends a confirmation back to their storefront.

They write the plugin in an afternoon. Deploy it. It works.

#### Resolution

Two weeks later, the integration is live. E-commerce orders flow into bmaderp automatically. Inventory syncs back to the storefront. The finance team hasn't done manual entry in days.

Alex opens the bmaderp GitHub repo. They notice a small bug in the webhook retry logic. They submit a PR. It's merged within 48 hours.

They're now a contributor.

**Capabilities Revealed:** REST API with consistent patterns, API Playground / interactive documentation, webhook system with event types, local development environment, custom fields, plugin architecture, open source contribution workflow

---

### Journey 5: The Support Investigation (Jordan Reyes)

**Persona:** Jordan Reyes, 41, IT Manager / Tenant Admin at Meridian Distribution Co. 15 years in IT, detail-oriented, loves a good audit trail.

#### Opening Scene

Monday morning. Jordan's phone is already buzzing.

**Sarah (Ops Manager):** "Jordan, there's a payment showing as unapplied but I know we received it. Can you check?"

**Marcus (CFO):** "Why is the tax rate on invoice #4827 showing 8% instead of 7.5%? We could get fined for this."

**Diego (Warehouse):** "My inventory count shows 0 for item SKU-8421 but we definitely have 200 units."

Three mysteries. Before bmaderp, Jordan would have opened three support tickets with their ERP vendor. Waited 3-5 business days. Paid $200/hour for "investigation time."

#### Rising Action

Jordan opens bmaderp's **Admin Console**.

**Mystery 1: The Unapplied Payment**

They navigate to **Audit Trail** and search for the payment ID. The screen shows:

| Timestamp | User | Action | Details |
|-----------|------|--------|---------|
| 2026-02-28 14:32 | Sarah Chen | Payment received | $4,250.00 from Acme Corp |
| 2026-02-28 14:33 | Sarah Chen | Auto-match attempted | No matching invoice found |
| 2026-02-28 14:33 | Sarah Chen | Payment marked as unapplied | Awaiting manual review |

The customer had paid early — before the invoice was generated. Jordan clicks **Apply to Invoice**, selects the correct invoice, done.

*Time to resolution: 2 minutes.*

**Mystery 2: The Wrong Tax Rate**

Jordan searches for invoice #4827 in the audit trail:

| Timestamp | User | Action | Details |
|-----------|------|--------|---------|
| 2026-02-27 09:15 | Maria Santos | Tax rate updated | Customer "Delta Industries" tax exempt status changed from "No" to "Yes" |
| 2026-02-27 11:42 | System | Invoice #4827 generated | Applied tax exempt status |

Maria in customer service had marked the customer as tax exempt. Jordan checks the customer record — it was a mistake. They revert the status, regenerate the invoice.

*Time to resolution: 4 minutes.*

**Mystery 3: The Missing Inventory**

Jordan searches for SKU-8421:

| Timestamp | User | Action | Details |
|-----------|------|--------|---------|
| 2026-02-26 16:45 | Diego Martinez | Inventory adjustment | -200 units (damaged goods) |

Diego had written off the inventory as damaged. He'd just forgotten to mention it.

*Time to resolution: 90 seconds.*

#### Climax

Three mysteries. Total resolution time: under 10 minutes. Zero support tickets. Zero consulting fees.

Jordan leans back. In the old system, this would have taken days. They would have had to email the vendor, wait for a "data analyst" to run queries, then explain the results.

Now? It's all self-service. Every change tracked. Every action attributable.

#### Resolution

Jordan sets up a weekly **Audit Summary Report** that automatically emails Marcus (CFO) with:
- All configuration changes
- All manual adjustments
- All failed auto-matches
- All permission changes

Transparency is now a feature, not a request.

**Capabilities Revealed:** Comprehensive audit trail, searchable audit log UI, user attribution on all changes, admin console with self-service investigation, automated audit reports, role-based admin permissions

---

### Journey Requirements Summary

| Journey | Key Capabilities Revealed |
|---------|---------------------------|
| **Sarah (Ops Manager)** | Bank feed integration, auto-matching, exception UI, PWA deployment, mobile-first |
| **Marcus (CFO)** | Compliance docs, ROI tools, audit trails, executive dashboards, data portability |
| **Diego (Warehouse)** | Offline-first, barcode scanning, sub-second responses, warehouse workflows |
| **Alex (Developer)** | REST API, webhooks, custom fields, plugin architecture, API playground |
| **Jordan (Admin)** | Audit trail, admin console, user attribution, automated reports, self-service investigation |

### Cross-Cutting Requirements

| Category | Requirements |
|----------|--------------|
| **Authentication & Authorization** | Role-based access, tenant isolation, admin vs user permissions |
| **Audit & Compliance** | Every change logged, searchable history, automated reports |
| **Performance** | Sub-100ms responses, offline capability, instant sync |
| **API & Integration** | RESTful, webhooks, custom fields, plugin system |
| **Mobile & Offline** | PWA, barcode scanning, offline-first architecture |
| **Self-Service** | No support tickets for common tasks, configuration over customization |

---

## Domain-Specific Requirements

### Compliance & Regulatory

| Requirement | Description | Priority |
|-------------|-------------|----------|
| **Audit Trail** | Every transaction, configuration change, and user action logged with timestamp, user, before/after values | Critical |
| **Immutable Financials** | Posted journal entries cannot be edited; corrections via reversing entries only | Critical |
| **SOC 2 Type II Readiness** | Architecture supports SOC 2 audit (access controls, encryption, logging, incident response) | High |
| **GDPR Compliance** | Data subject rights (access, deletion, portability), consent management, DPA-ready | High |
| **SOX Control Framework** | See SOX Controls section below | High (for public company customers) |
| **Tax Engine** | Configurable tax rules by jurisdiction; sales tax, VAT, GST support | High |

### Technical Constraints

| Constraint | Requirement | Rationale |
|------------|-------------|-----------|
| **Multi-Tenant Isolation** | Complete tenant isolation with tenant ID on every record; API enforces tenant context | Data leakage = existential risk |
| **Encryption** | Industry-standard encryption in transit and at rest; field-level encryption for PII | Compliance requirement |
| **Zero-Downtime Migrations** | Blue-green deployment; backward-compatible schema changes | SaaS SLA |
| **Data Retention** | Configurable retention policies; automated purging for GDPR | Legal requirement |
| **Backup & Recovery** | Point-in-time recovery; <4 hour RTO; cross-region replication | Business continuity |

### Integration Requirements

| Integration | Purpose | Priority |
|-------------|---------|----------|
| **Open Banking APIs** | Bank feed integration for auto-reconciliation | Critical (core value prop) |
| **Payment Processors** | Stripe, PayPal, ACH for payment processing | High |
| **E-commerce Platforms** | Shopify, WooCommerce, BigCommerce order sync | High |
| **Tax Services** | Avalara, TaxJar for real-time tax calculation | Medium |
| **Email/Notifications** | SendGrid, Mailgun for transactional emails | Medium |

### Risk Mitigations

| Risk | Mitigation |
|------|------------|
| **Data Breach** | Encryption at all layers; principle of least privilege; security monitoring |
| **Financial Inaccuracy** | Double-entry validation; reconciliation dashboards; audit alerts |
| **Regulatory Non-Compliance** | Compliance templates by jurisdiction; automated compliance checks |
| **Vendor Lock-in (for customers)** | Full data export; standard formats (CSV, JSON); API access |
| **Upgrade Failures** | Feature flag architecture; gradual rollouts; instant rollback |

### SOX Controls (Enterprise Tier)

**Segregation of Duties (SOD) Matrix:**

| Role | Create JE | Approve JE | Create Payment | Approve Payment | Modify COA |
|------|-----------|------------|----------------|-----------------|------------|
| **Standard User** | ✓ | — | ✓ | — | — |
| **Finance Lead** | ✓ | ✓ | ✓ | ✓ | View |
| **Tenant Admin** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **External Auditor** | View | — | View | — | View |

**SOD Violation Detection:**
- System alerts when single user attempts incompatible actions
- Quarterly SOD report for audit committee
- Emergency override with documented justification and dual approval

**Financial Controls:**

| Control | Trigger | Requirement |
|---------|---------|-------------|
| **Journal Entry Approval** | Amount > $10,000 or adjusting entry | Dual approval required |
| **Payment Approval** | Amount > $5,000 | Manager approval; >$25,000 requires Finance Lead |
| **Vendor Setup** | New vendor creation | Separate user from first payment to that vendor |
| **Account Modification** | Chart of accounts changes | Finance Lead approval + audit log |
| **Period Close** | Month-end close | All reconciliations complete; no pending items |

**Control Monitoring:**
- Real-time SOD violation alerts to compliance team
- Weekly control effectiveness dashboard
- Automated evidence collection for audits (screenshots, timestamps, approvals)
- Control testing schedule with pass/fail tracking

**Compliance Reporting:**
- Monthly control effectiveness summary
- Quarterly SOD exception report with remediation status
- Annual control attestation package for external auditors

---

## Innovation & Novel Patterns

### Detected Innovation Areas

#### Innovation 1: Feature Flags as Architectural Foundation

**What makes it innovative:** Every ERP has feature flags. None treat them as the architectural foundation. In bmaderp, feature flags enable:

- **Progressive disclosure** (UX innovation) — Features unlock as users demonstrate mastery
- **Per-tenant customization** (deployment innovation) — Each customer sees their configured experience
- **Tiered feature packaging** (business model innovation) — Features map to pricing tiers naturally

**The insight:** Feature flags aren't a technical detail — they're the product strategy made concrete in code.

#### Innovation 2: First Rust-Based ERP

**What makes it innovative:** No production ERP exists in Rust. All major open-source ERPs (Odoo, ERPNext, Dolibarr) are Python-based.

**Technical advantages:**
- **Memory safety** — Eliminates entire vulnerability classes by design
- **No GC pauses** — Critical for financial transaction accuracy
- **Near-zero overhead** — Feature flags don't slow the system
- **10-100x performance** — Sub-100ms response times for all operations

**Market positioning:** "The Rust ERP" — fast, modern, memory-safe.

#### Innovation 3: Progressive Disclosure UX

**What makes it innovative:** Traditional ERPs expose all complexity to all users. bmaderp inverts this — show the minimum, reveal more on demand.

**The UX pattern:** Video game skill trees applied to ERP features. Users "unlock" capabilities through:
- Usage milestones (created 50 invoices → batch invoicing suggested)
- Training completion (optional tutorials unlock advanced features)
- Explicit requests (Feature Store browse and enable)

**The result:** Zero training required to start. Complexity is opt-in, not forced.

#### Innovation 4: The 5-Question Setup Wizard

**What makes it innovative:** No ERP configures itself. bmaderp claims: answer 5 questions → fully configured system.

**The pattern:** Opinionated defaults by industry. The system makes reasonable assumptions; users adjust later if needed.

**Questions (proposed):**
1. What industry are you in? (Service / Retail / Distribution / Manufacturing)
2. What's your primary currency?
3. Do you track inventory? (Yes / No)
4. How many users will use the system?
5. What's your fiscal year start month?

**Fallback:** "Advanced Setup" option for users who need granular control.

---

### Market Context & Competitive Landscape

| Competitor | Type | Gap bmaderp Exploits |
|------------|------|----------------------|
| **SAP, Oracle, Microsoft** | Enterprise ERP | Too complex, too expensive, consultant-dependent |
| **NetSuite, Acumatica** | Cloud ERP | SaaS lock-in, pricing opacity, customization requires partners |
| **Odoo** | Open Source | "Community" edition crippled; enterprise features paywalled |
| **ERPNext** | Open Source | Python-based (GC pauses); complex for simple use cases |
| **Dolibarr** | Open Source | Limited depth; not enterprise-ready |

**Competitive positioning:** The first ERP that's genuinely free AND genuinely capable. No consultant required.

---

### Validation Approach

| Innovation | Validation Method | Success Criteria |
|------------|-------------------|------------------|
| **Feature flags architecture** | A/B testing: feature-flagged vs. always-on UI | Users complete tasks faster with progressive disclosure |
| **Rust performance** | Published benchmarks vs. Odoo/ERPNext | 10x+ improvement on key operations (invoice creation, reconciliation) |
| **Progressive disclosure** | User testing: feature discovery rate | 80%+ users discover needed features without documentation |
| **5-question setup** | Onboarding funnel analysis | 90%+ complete setup without support; <5% use advanced fallback |

---

### Risk Mitigation

| Innovation Risk | Mitigation Strategy |
|-----------------|---------------------|
| **Feature flag overhead** | Rust's zero-cost abstractions; benchmark early; profile in production |
| **Rust talent scarcity** | Strong documentation; plugin system supporting multiple languages; community building |
| **Progressive disclosure feels limiting** | Clear "unlock" paths; one-click feature enablement; Feature Store visibility |
| **Setup wizard misses edge cases** | "Advanced Setup" fallback; manual configuration always available; community templates |
| **"Free" skepticism** | Transparent pricing page; case studies with real numbers; MIT/Apache license clarity |

---

## SaaS B2B Platform Requirements

### Multi-Tenant Architecture

| Aspect | Requirement |
|--------|-------------|
| **Isolation Model** | Logical isolation with shared infrastructure; complete tenant isolation at database level |
| **Tenant Identification** | Tenant ID on every data table; API middleware enforces tenant context |
| **Data Segregation** | No cross-tenant data access; tenant-specific encryption keys optional |
| **Resource Limits** | Per-tenant rate limiting; configurable storage and user limits |
| **Custom Domains** | Custom subdomain or domain per tenant (e.g., acme.bmaderp.com) |

### Role-Based Access Control (RBAC)

**Role Hierarchy:**

| Role | Permissions | Assignment |
|------|-------------|------------|
| **System Admin** | Full platform access; tenant management; system configuration | Platform operators |
| **Tenant Admin** | Full tenant access; user management; feature configuration; audit access | Business owner, IT manager |
| **Finance Lead** | Full accounting access; approvals; reporting; limited config | Controller, CFO |
| **Operations Manager** | Inventory, sales, purchasing; workflow management; team oversight | Ops manager, warehouse lead |
| **Standard User** | Module-specific access; create/edit own records; no config | Accountants, sales reps, warehouse staff |
| **Read-Only** | View access only; dashboards; reports | Executives, external auditors |
| **External (Portal)** | Limited self-service; own records only | Customers, vendors |

**Permission Matrix (Core Modules):**

| Module | Tenant Admin | Finance Lead | Ops Manager | Standard User | Read-Only |
|--------|--------------|--------------|-------------|---------------|-----------|
| **Chart of Accounts** | Full | Full | View | View | View |
| **Journal Entries** | Full | Full | View | Create/View | View |
| **Bank Reconciliation** | Full | Full | View | View | View |
| **Customers/AR** | Full | Full | Full | Create/Edit | View |
| **Vendors/AP** | Full | Full | Full | Create/Edit | View |
| **Inventory** | Full | View | Full | Create/Edit | View |
| **Sales Orders** | Full | View | Full | Create/Edit | View |
| **Purchase Orders** | Full | View | Full | Create/Edit | View |
| **Reports** | Full | Full | Full | Assigned | Assigned |
| **Audit Trail** | Full | View | View | None | None |
| **Feature Flags** | Full | None | None | None | None |

### Subscription & Pricing Model

| Tier | Monthly Price | Users | Features | Support |
|------|---------------|-------|----------|---------|
| **Self-Hosted** | Free | Unlimited | All features | Community |
| **Cloud Starter** | $49 | 3 | Core modules, basic integrations | Email |
| **Cloud Growth** | $149 | 10 | All MVP modules, API access, webhooks | Email + Chat |
| **Cloud Enterprise** | Custom | Unlimited | All features, SSO, compliance templates | Dedicated SLA |

**Feature Flag → Tier Mapping:**

| Feature Category | Self-Hosted | Starter | Growth | Enterprise |
|------------------|-------------|---------|--------|------------|
| Core modules (GL, AR, AP, Inventory) | ✓ | ✓ | ✓ | ✓ |
| Bank feed integration | ✓ | ✓ | ✓ | ✓ |
| Basic reporting | ✓ | ✓ | ✓ | ✓ |
| API access | ✓ | — | ✓ | ✓ |
| Webhooks | ✓ | — | ✓ | ✓ |
| Advanced inventory (multi-warehouse) | ✓ | — | ✓ | ✓ |
| Multi-currency | ✓ | — | ✓ | ✓ |
| SSO (SAML/OIDC) | ✓ | — | — | ✓ |
| Compliance templates (SOX, GDPR) | ✓ | — | — | ✓ |
| Dedicated support | — | — | — | ✓ |

### Integration Architecture

| Integration Type | Examples | Implementation |
|------------------|----------|----------------|
| **Banking** | Open Banking, Plaid | OAuth 2.0; scheduled sync |
| **Payments** | Stripe, PayPal, ACH | API + webhook |
| **E-commerce** | Shopify, WooCommerce | Webhook ingestion; API sync |
| **Tax** | Avalara, TaxJar | Real-time API |
| **Email** | SendGrid, Mailgun | SMTP + API |
| **Notifications** | Slack, Teams | Webhook |

### Compliance Requirements (SaaS)

| Requirement | Implementation |
|-------------|----------------|
| **SOC 2 Type II** | Annual audit; security controls documentation; continuous monitoring |
| **GDPR** | Data subject rights UI; DPA template; EU data residency option |
| **Data Portability** | Full export (CSV, JSON); API access; schema documentation |
| **Incident Response** | <24 hour notification; incident log; post-mortem process |
| **Penetration Testing** | Annual third-party test; vulnerability disclosure program |

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP — Focus on eliminating manual reconciliation as the primary pain point.

**Core Hypothesis:** If we can auto-match 85%+ of bank transactions, businesses will adopt bmaderp for reconciliation alone, Other ERP functions become upsell opportunities.

**Resource Requirements:**
- **Team Size:** 2-3 developers (Rust full-stack)
- **Timeline:** 6 months to MVP
- **Budget Consideration:** Open source development; revenue from hosted offering

### MVP Feature Set (Phase 1) — 6 Months

**Core User Journeys Supported:**

| Journey | MVP Coverage |
|---------|--------------|
| **Sarah (Ops Manager)** | ✓ Bank reconciliation, invoice creation, basic reporting |
| **Marcus (CFO)** | ✓ Audit trail, financial reports, compliance visibility |
| **Jordan (Admin)** | ✓ User management, audit investigation |
| **Diego (Warehouse)** | — Deferred to Phase 2 |
| **Alex (Developer)** | — API access (read-only), webhooks deferred |

**Must-Have Capabilities:**

| Module | MVP Scope | Excluded from MVP |
|--------|-----------|-------------------|
| **General Ledger** | Full: Chart of accounts, journal entries, trial balance | Multi-currency |
| **Bank Reconciliation** | Full: Bank feeds, auto-matching, manual review | AI suggestions |
| **Accounts Receivable** | Full: Customers, invoices, payments, aging | Recurring invoices, batch operations |
| **Accounts Payable** | Full: Vendors, bills, payments, 3-way match | Purchase orders (bills only) |
| **Inventory** | Basic: Single warehouse, stock tracking, basic movements | Multi-warehouse, serial/lot tracking |
| **Contacts** | Full: Unified customers/vendors | Portal access |
| **Reporting** | Basic: Trial balance, AR/AP aging, transaction lists | Custom reports, dashboards |
| **Feature Flags** | Full: Hierarchical system, per-tenant config | Feature Store UI |
| **Setup Wizard** | Full: 5-question onboarding | Industry templates (manual selection) |

**MVP Success Criteria:**
- 5 paying customers live within 6 months
- 80%+ auto-match rate on bank transactions
- <5 day monthly close for all customers
- Zero paid support tickets for basic operations

### Phase 2: Growth Features — Months 7-12

| Category | Features |
|----------|----------|
| **Module Expansion** | Multi-currency, multi-company, advanced inventory (multi-warehouse, serial/lot), manufacturing (BOMs, work orders), project accounting |
| **Reconciliation AI** | AI-powered matching suggestions, anomaly detection, predictive cash flow, smart categorization |
| **Platform Features** | Customer/vendor portals, API marketplace, webhooks, advanced reporting/dashboards, mobile PWA (offline-first) |
| **User Expansion** | Warehouse workers (Diego's journey), full developer API access (Alex's journey) |

**Phase 2 Target Customer:** 50-500 employees, multi-entity, 5-50 users, manufacturing/distribution/retail

### Phase 3: Vision Features — Months 13-24

| Category | Features |
|----------|----------|
| **Intelligence** | Natural language interface, AI-generated reports, predictive operations, autonomous reconciliation, industry-specific AI advisors |
| **Scale** | Full offline operation, enterprise compliance (SOX, IFRS templates), white-label capabilities |
| **Ecosystem** | Plugin marketplace, community templates, partner/ISV ecosystem |

**Phase 3 Target Customer:** 500-5000+ employees, complex multi-entity/global operations, enterprise compliance needs

### Risk Mitigation Strategy

**Technical Risks:**

| Risk | Mitigation |
|------|------------|
| **Bank feed integration complexity** | Start with CSV import (MVP); add Open Banking API in Phase 2 |
| **Feature flag overhead** | Benchmark early; Rust zero-cost abstractions; profile in production |
| **Multi-tenant data isolation** | Architecture-first design; row-level security from day 1; penetration testing before launch |

**Market Risks:**

| Risk | Mitigation |
|------|------------|
| **"Free" skepticism** | Case studies with real numbers; transparent pricing page; MIT/Apache license clarity |
| **Rust talent scarcity** | Strong documentation; WASM plugins for broader language support; community building from day 1 |
| **ERP market saturation** | Focus on reconciliation pain point; target underserved mid-market; differentiate on simplicity |

**Resource Risks:**

| Risk | Mitigation |
|------|------------|
| **6-month timeline aggressive** | Phase into smaller releases (reconciliation MVP at 3 months, full MVP at 6 months) |
| **Scope creep** | Feature flag architecture enables hiding unfinished features; strict MVP definition |
| **Single points of failure** | Document everything; open source from day 1 enables community contributions |

### Go/No-Go Checkpoints

| Checkpoint | Timeline | Criteria |
|------------|----------|----------|
| **Reconciliation MVP** | Month 3 | Working bank feed + auto-matching; 1 beta customer |
| **Full MVP** | Month 6 | 5 paying customers; 80%+ auto-match rate |
| **Product-Market Fit** | Month 9 | 20+ customers; NPS > 40; renewal rate > 90% |
| **Scale Decision** | Month 12 | 50+ customers; MRR > $50K; decision to raise or bootstrap |

---

## Functional Requirements

### Financial Management

- **FR1:** Users can create and manage a chart of accounts with account types, codes, and hierarchy
- **FR2:** Users can create manual journal entries with debits, credits, and reference documentation
- **FR3:** Users can view a trial balance showing all account balances at any point in time
- **FR4:** Users can post journal entries to the general ledger, making them part of the permanent financial record
- **FR5:** Users can reverse posted journal entries through correcting entries (not deletion)
- **FR6:** Users can define and manage fiscal years and accounting periods
- **FR7:** Users can close accounting periods to prevent further modifications

### Bank Reconciliation

- **FR8:** Users can connect bank accounts via bank feed integration or CSV import
- **FR9:** The system can automatically match bank transactions to invoices, payments, and bills
- **FR10:** Users can manually review and approve auto-matched transactions
- **FR11:** Users can manually match unmatched transactions to existing records
- **FR12:** Users can create new transactions (invoices, payments, bills) directly from unmatched bank transactions
- **FR13:** Users can mark bank transactions as reconciled
- **FR14:** Users can view a reconciliation summary showing matched, unmatched, and reconciled items
- **FR15:** The system can track reconciliation status over time (daily, weekly, monthly)

### Accounts Receivable

- **FR16:** Users can create and manage customer records with contact information, payment terms, and credit limits
- **FR17:** Users can create customer invoices with line items, quantities, unit prices, and tax calculations
- **FR18:** Users can record customer payments and apply them to specific invoices
- **FR19:** Users can view accounts receivable aging reports (current, 30/60/90+ days)
- **FR20:** Users can generate customer statements showing account activity and balance
- **FR21:** Users can void or credit invoices with appropriate audit trail
- **FR22:** Users can configure payment terms (Net 30, Net 60, Due on Receipt, etc.)

### Accounts Payable

- **FR23:** Users can create and manage vendor records with contact information and payment terms
- **FR24:** Users can record vendor bills with line items, quantities, unit costs, and tax
- **FR25:** Users can perform three-way matching between purchase orders, receipts, and vendor bills
- **FR26:** Users can record vendor payments and apply them to specific bills
- **FR27:** Users can view accounts payable aging reports (current, 30/60/90+ days)
- **FR28:** Users can void bills with appropriate audit trail
- **FR29:** Users can configure vendor payment terms and methods

### Inventory Management

- **FR30:** Users can create and manage item records with SKU, description, unit of measure, and pricing
- **FR31:** Users can track inventory quantities by location (single warehouse in MVP)
- **FR32:** Users can record inventory receipts (increasing stock)
- **FR33:** Users can record inventory issues (decreasing stock)
- **FR34:** Users can perform inventory adjustments to correct discrepancies
- **FR35:** Users can view current inventory levels and valuation
- **FR36:** Users can configure reorder points for items
- **FR37:** The system can automatically deduct inventory when sales invoices are posted

### Contact Management

- **FR38:** Users can create and manage unified contact records that can be customers, vendors, or both
- **FR39:** Users can store multiple addresses per contact (billing, shipping, etc.)
- **FR40:** Users can store multiple contact persons per organization
- **FR41:** Users can configure tax-exempt status for contacts
- **FR42:** Users can search and filter contacts by name, type, status, tax status, and custom fields

### Reporting

- **FR43:** Users can generate a trial balance report for any accounting period
- **FR44:** Users can generate accounts receivable aging reports
- **FR45:** Users can generate accounts payable aging reports
- **FR46:** Users can view transaction lists (invoices, bills, payments, journal entries) with filtering
- **FR47:** Users can export reports to standard formats (CSV, PDF)
- **FR48:** Users can generate an audit summary report showing configuration changes and manual adjustments

### User Management & Access Control

- **FR49:** Tenant administrators can create and manage user accounts within their tenant
- **FR50:** Tenant administrators can assign roles to users (Admin, Finance Lead, Ops Manager, Standard User, Read-Only)
- **FR51:** The system can enforce role-based permissions for each module and action
- **FR52:** Users can authenticate with username/password
- **FR53:** Users can reset their own passwords
- **FR54:** Tenant administrators can deactivate user accounts

### Audit & Compliance

- **FR55:** The system can log all transactions with timestamp, user, and before/after values
- **FR56:** The system can log all configuration changes with timestamp, user, and before/after values
- **FR57:** Users with audit access can search and view the audit trail by date, user, entity type, or action
- **FR58:** The system can prevent deletion of posted financial transactions (corrections via reversing entries only)
- **FR59:** Users can export audit data for compliance purposes

### Feature Flags & Configuration

- **FR60:** Tenant administrators can view enabled features for their tenant
- **FR61:** Tenant administrators can enable or disable features within their subscription tier
- **FR62:** The system can display UI elements conditionally based on enabled features
- **FR63:** The system can preserve configuration across system upgrades

### Onboarding & Setup

- **FR64:** New tenants can complete initial setup via a guided wizard
- **FR65:** Users can select their industry during setup (Service, Retail, Distribution, Manufacturing)
- **FR66:** Users can configure their primary currency during setup
- **FR67:** Users can configure inventory tracking preferences during setup
- **FR68:** Users can configure their fiscal year start month during setup
- **FR69:** The system can apply industry-appropriate default settings based on setup wizard selections
- **FR70:** Users can access advanced configuration options beyond the setup wizard

### Integration & API

- **FR71:** External systems can authenticate via API keys
- **FR72:** External systems can read data via standard API endpoints
- **FR73:** External systems can create records via standard API endpoints
- **FR74:** Users can view API documentation within the application
- **FR75:** Users can manage API keys (create, revoke, view last used)

### Webhooks (Phase 2)

- **FR76:** External systems can subscribe to entity change events via webhooks
- **FR77:** Users can configure webhook endpoints and event subscriptions per entity type
- **FR78:** The system can retry failed webhook deliveries with exponential backoff

### Mobile & Offline (Phase 2)

- **FR79:** Mobile users can access core functions via progressive web app (PWA)
- **FR80:** Mobile users can continue working offline with automatic sync when connected
- **FR81:** The system can resolve data conflicts during offline sync using last-write-wins with audit trail
- **FR82:** Mobile users can scan barcodes to look up inventory items
- **FR83:** Mobile users can scan barcodes to quickly create transactions (receiving, transfers, adjustments)

### Extensibility (Phase 2)

- **FR84:** Tenant administrators can define custom fields on core entities
- **FR85:** Users can view and edit custom fields in standard forms and reports
- **FR86:** Developers can extend system functionality via a plugin architecture
- **FR87:** Tenant administrators can enable or disable plugins per tenant

### Approval Workflow (Enterprise Tier)

- **FR88:** Tenant administrators can configure approval rules by transaction type and amount threshold
- **FR89:** Users can submit transactions for approval with optional comments
- **FR90:** Designated approvers can approve, reject, or request changes on pending transactions
- **FR91:** Approvers can delegate approval authority to other users during absence
- **FR92:** The system can route approvals through multiple levels based on amount or type
- **FR93:** Users can view approval history with timestamps, approvers, and comments
- **FR94:** The system can escalate overdue approvals to designated backup approvers

---

## Non-Functional Requirements

### Performance

| ID | Requirement | Target | Measurement | Rationale |
|----|-------------|--------|-------------|-----------|
| **NFR1** | API response time (p99) | <100ms | APM monitoring at p99 percentile | Sub-second for all user actions; competitive differentiator |
| **NFR2** | Page load time (initial) | <2 seconds | Lighthouse audits + Real User Monitoring (RUM) | First contentful paint |
| **NFR3** | Page load time (subsequent) | <500ms | APM + browser Performance Timing API | Cached resources, optimized asset delivery |
| **NFR4** | Auto-match decision time | <500ms per transaction | Application logs with timing metrics | No user waiting during reconciliation |
| **NFR5** | Bank feed sync duration | <15 minutes | Sync timestamp monitoring with alerting | Near real-time reconciliation |
| **NFR6** | Concurrent users per tenant | 50+ | Load testing with k6, 50 concurrent sessions | Support Growth tier without degradation |
| **NFR7** | Report generation time | <5 seconds | APM report timing logs, performance dashboards | Standard reports; complex reports <30 seconds |

### Security

| ID | Requirement | Target | Measurement | Rationale |
|----|-------------|--------|-------------|-----------|
| **NFR8** | Data encryption in transit | Industry-standard encryption | Annual security audit, SSL Labs A+ rating | Industry standard; compliance requirement |
| **NFR9** | Data encryption at rest | Industry-standard encryption | Infrastructure audit, SOC 2 certification | Industry standard; compliance requirement |
| **NFR10** | PII field-level encryption | Industry-standard encryption | Database schema audit, encryption verification | Enhanced protection for sensitive data |
| **NFR11** | Password storage | Modern secure hashing algorithm | Security audit, annual penetration testing | Resistant to brute-force and rainbow table attacks |
| **NFR12** | Session management | Secure stateless authentication with configurable expiry | Session log analysis, security audit review | Secure, scalable authentication |
| **NFR13** | Multi-tenant data isolation | Zero cross-tenant access | Automated isolation tests, annual pen testing | Architectural guarantee; existential risk if failed |
| **NFR14** | API authentication | Secure machine-to-machine authentication | API access log review, security audit | Cryptographic verification of API requests |
| **NFR15** | Vulnerability response | <24 hours for critical | Incident response log review, SLA tracking | Security incident SLA |

### Reliability

| ID | Requirement | Target | Measurement | Rationale |
|----|-------------|--------|-------------|-----------|
| **NFR16** | Uptime SLA | 99.9% (8.7 hours max downtime/year) | Uptime monitoring (Pingdom/StatusCake), monthly reporting | Enterprise customer expectation |
| **NFR17** | Data durability | 99.999999999% (11 9s) | Cloud provider SLA verification, quarterly recovery tests | Financial data must not be lost |
| **NFR18** | Recovery time objective (RTO) | <4 hours | Quarterly disaster recovery drills, documented RTO | Business continuity requirement |
| **NFR19** | Recovery point objective (RPO) | <1 hour | Backup timestamp monitoring, monthly recovery testing | Maximum acceptable data loss |
| **NFR20** | Zero-downtime deployments | 100% | Deployment monitoring, health check verification post-deploy | Schema changes without customer impact |
| **NFR21** | Graceful degradation | Non-critical features fail independently | Chaos engineering tests, failure injection scenarios | Core accounting always available |

### Scalability

| ID | Requirement | Target | Measurement | Rationale |
|----|-------------|--------|-------------|-----------|
| **NFR22** | Tenants per instance | 1,000+ | Load testing to 1,000 tenants, capacity metrics | Multi-tenant efficiency |
| **NFR23** | Transactions per tenant | 1M+/year | Database capacity monitoring, growth trend analysis | Enterprise-scale data volume |
| **NFR24** | Horizontal scaling | Automatic based on load | Load testing with auto-scaling trigger verification | Cloud-native architecture |
| **NFR25** | Database growth | 10TB+ without performance degradation | Performance testing at 10TB scale, query analysis | Long-term data retention |
| **NFR26** | Background job scaling | Independent from web tier | Job queue monitoring, resource isolation load tests | Reconciliation, reporting don't block UI |

### Integration

| ID | Requirement | Target | Measurement | Rationale |
|----|-------------|--------|-------------|-----------|
| **NFR27** | API availability | 99.9% | API health monitoring, synthetic transaction checks | External systems depend on it |
| **NFR28** | Webhook delivery | <30 seconds or retry | Webhook delivery logs, timestamp delta tracking | Event notification reliability |
| **NFR29** | Webhook retry | 3 attempts with exponential backoff | Retry log analysis, dead letter queue monitoring | Handle transient failures |
| **NFR30** | Bank feed reliability | 99.5% sync success rate | Sync success rate dashboard, error tracking alerts | Core value prop depends on it |
| **NFR31** | Idempotent API operations | All POST/PUT endpoints | API test suite with retry scenarios, idempotency verification | Safe retry on failure |

### Accessibility

| ID | Requirement | Target | Measurement | Rationale |
|----|-------------|--------|-------------|-----------|
| **NFR32** | WCAG compliance | Level AA (Phase 2) | Automated accessibility audits (axe-core, WAVE) | Enterprise customer requirement |
| **NFR33** | Keyboard navigation | All core functions | Manual QA testing, keyboard-only UAT | Power user efficiency |
| **NFR34** | Screen reader support | Basic support (Phase 2) | Screen reader testing (NVDA, VoiceOver), accessibility audit | Compliance and inclusivity |
