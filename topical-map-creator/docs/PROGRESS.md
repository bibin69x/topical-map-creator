# Topical Authority Creator — MVP Progress Tracker

Last Updated: 2026-08-31 12:59 IST

---

## Status Legend

| Icon | Meaning |
|------|---------|
| 🔴 | Not Started |
| 🟡 | In Progress |
| 🟢 | Complete |
| ⚫ | Blocked |
| 🔵 | Under Review |

---

## Phase 0 — Economics & Research Validation

| ID | Document | Status | Owner | Started | Completed | Notes |
|----|----------|--------|-------|---------|-----------|-------|
| DOC-01 | Research Provider Evaluation | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | DataForSEO primary, Serper.dev fallback. Strategy approved |
| DOC-02 | AI Model Strategy | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Empirically benchmarked (gpt-4o-mini + text-embedding-3-small). Est. AI cost ~₹1.87 / paid user |
| DOC-03 | Cost Budget Model | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | GO CERTIFIED. Expected variable cost: ₹42.62/user (Target ₹30-₹50). Blended: ₹72.68 (< ₹99 ceiling) |

## Phase 1 — Technical Specifications

| ID | Document | Status | Owner | Started | Completed | Notes |
|----|----------|--------|-------|---------|-----------|-------|
| DOC-04 | System Architecture | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Next.js App Router monolith, Supabase Auth/DB, async background job queue |
| DOC-05 | Database Schema & RLS | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Complete DDL, 11 entities, ENUM types, cascade rules, indices, and PostgreSQL RLS policies |
| DOC-06 | API Contract & Routes | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Complete RESTful & Server Action API contract, TS interfaces, Zod schemas, & webhook handling |
| DOC-07 | Auth & Authorization Spec | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Supabase Auth, PostgreSQL signup triggers, route protection matrix, & entitlement checking |

## Phase 2 — Engine Specification

| ID | Document | Status | Owner | Started | Completed | Notes |
|----|----------|--------|-------|---------|-----------|-------|
| DOC-08 | Engine Pipeline Spec | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | 16-stage pipeline spec, TS tree types, cosine similarity deduplication, & quality gates |
| DOC-09 | Prompt Engineering Spec | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | System prompts, templates, Zod schemas, & type-safe OpenAI output execution wrappers |
| DOC-10 | Priority Scoring Framework | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Deterministic formula: 35% search signals, 35% centrality, 20% intent, 10% confidence |
| DOC-11 | Generation Budget & Cost Control | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Hard caps per job (25 SERP, 7 LLM, ₹6.00 max), PL/pgSQL transactional credit refund trigger |

## Phase 3 — Product & UX

| ID | Document | Status | Owner | Started | Completed | Notes |
|----|----------|--------|-------|---------|-----------|-------|
| DOC-12 | UI/UX Wireframes & Components | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Anti-slop design system, ASCII wireframes, 6-tab results UX, component tree |
| DOC-13 | Payment & Entitlement Spec | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Razorpay integration, HMAC webhook verification, entitlement state machine |

## Phase 4 — Operations & Legal

| ID | Document | Status | Owner | Started | Completed | Notes |
|----|----------|--------|-------|---------|-----------|-------|
| DOC-14 | Security & Abuse Prevention | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Edge rate limiting, Turnstile bot protection, prompt injection XML tag isolation |
| DOC-15 | Observability & Monitoring | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Telemetry (Sentry, Axiom, PostHog), engineering & economic metric queries |
| DOC-16 | Legal Documents Spec | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Privacy disclosures, ToS, refund policy, & PL/pgSQL account deletion cascade function |

## Phase 5 — Production Build

| ID | Module / Task | Status | Owner | Started | Completed | Notes |
|----|---------------|--------|-------|---------|-----------|-------|
| BUILD-01 | Next.js Project Foundation | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Next.js 14 App Router, Tailwind CSS, TypeScript, Anti-slop theme |
| BUILD-02 | Database DDL Migration | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | 11 PostgreSQL tables, ENUMs, triggers, RLS policies SQL migration |
| BUILD-03 | Engine Pipeline (16 Stages) | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Core IP: DataForSEO provider, OpenAI router, scoring & 10 quality gates |
| BUILD-04 | API Contracts & Services | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Entitlements, Razorpay HMAC webhook, CSV export generator |
| BUILD-05 | Anti-Slop UI & 6-Tab Dashboard | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Landing page, dashboard, async generation progress, 6-tab results UI |

## Phase 6 — Quality Assurance & Critical Logic Tests

| ID | Module / Task | Status | Owner | Started | Completed | Notes |
|----|---------------|--------|-------|---------|-----------|-------|
| TEST-01 | Test Runner Setup | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Vitest test runner setup & `npm test` script |
| TEST-02 | Scoring & Quality Gates Unit Tests | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | Priority scoring formula & 10 quality gates unit tests |
| TEST-03 | Razorpay HMAC & Security Logic Tests | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | HMAC-SHA256 signature verification & length mismatch safeguard |
| TEST-04 | CSV Export Service Tests | 🟢 Complete | Agent | 2026-08-31 | 2026-08-31 | CSV escaping, structure & spreadsheet export unit tests |

---

## Current Sprint

- [x] DOC-01 through DOC-16 Specs Complete
- [x] Phase 5 Production Codebase Implementation Complete
- [x] Phase 6 Sprint: Quality Assurance & Critical Logic Tests Complete (10/10 Vitest unit tests passing)



---

## Decisions Log

| Date | Decision | Rationale | Impact |
|------|----------|-----------|--------|
| 2026-08-31 | Strict sequential doc order | Founder preference — no parallel spec work | All docs follow dependency chain exactly |
| 2026-08-31 | Full detailed specs with TS interfaces | Founder preference — minimize ambiguity during coding | Longer spec phase, cleaner build phase |
| 2026-08-31 | Actual API trials for Phase 0 | Founder preference — real data over estimates | Need API keys before DOC-01 can be finalized |
| 2026-08-31 | DataForSEO as primary research provider | Only provider with keyword expansion + SERP + explicit caching. ~₹3/gen = within budget. | Core architecture decision — engine pipeline depends on this |
| 2026-08-31 | gpt-4o-mini + text-embedding-3-small as AI stack | Empirical benchmark: 5.9s latency, 100% JSON compliance, ₹0.187/gen AI cost | Core AI strategy — keeps AI cost under ₹2.00 per paid user (10 gens) |
| 2026-08-31 | Phase 0 Financial Validation PASS | Expected cost ₹42.62/user, 78.5% gross margin. Passes ₹99 ceiling under all stress tests | Unblocks Phase 1 Technical Specs (DOC-04 Architecture, DOC-05 DB, DOC-06 API) |
| 2026-08-31 | Monolithic Next.js + Supabase + Async Queue | Single repository architecture (§22 & §44). Async queue for 1-5 min generation pipeline | System Architecture locked in DOC-04 |
| 2026-08-31 | Complete PostgreSQL DDL + Strict RLS | 11 entities, custom ENUMs, indices, and row-level security for user isolation (§24 & §25) | Database Schema locked in DOC-05 |
| 2026-08-31 | Standardized REST & Webhook Contract | Standard response/error wrappers, TS interfaces, Zod validation, Razorpay HMAC webhook | API Contract locked in DOC-06 |
| 2026-08-31 | Supabase Auth + Server Entitlement Check | Managed Auth, PostgreSQL signup trigger, middleware route protection matrix (§26) | Auth Spec locked in DOC-07 |
| 2026-08-31 | 16-Stage Topical Engine Pipeline | Deterministic deduplication, clustering, scoring + AI reasoning + 10 quality gates | Core IP pipeline locked in DOC-08 |
| 2026-08-31 | Strict Zod Schema LLM Execution | System prompts, user templates, Zod parsing, JSON mode, zero conversational output (§34) | Prompts locked in DOC-09 |
| 2026-08-31 | Deterministic Weighted Priority Formula | 35% SERP evidence, 35% centrality, 20% intent, 10% data confidence. Zero LLM guessing (§15) | Scoring locked in DOC-10 |
| 2026-08-31 | Hard Budget Caps & Auto Credit Refund | Max 25 SERP, 7 LLM calls, ₹6.00 cap per job. PL/pgSQL transactional refund on failure (§31) | Budget locked in DOC-11 |
| 2026-08-31 | Anti-Slop UI & 6-Tab Results Dashboard | Slate/Indigo palette, ASCII layouts, responsive 6-tab results dashboard (§3 & §20) | UI Spec locked in DOC-12 |
| 2026-08-31 | Server-Only Webhook Entitlement Grant | Razorpay HMAC-SHA256 verification, zero client trust, transactional +10 credit grant (§30) | Payment locked in DOC-13 |
| 2026-08-31 | Rate Limiting & Prompt Injection Barrier | Edge rate limits, 1-job concurrency lock, XML tag sanitization for external SERP data (§26) | Security locked in DOC-14 |
| 2026-08-31 | Real-time Economic & Operational Telemetry | Sentry + PostHog + SQL unit economic admin analytics queries (§35 & §36) | Observability locked in DOC-15 |
| 2026-08-31 | Privacy Commitments & Cascade Account Deletion | No AI training on user data, sub-processor disclosures, PL/pgSQL deletion cascade (§32 & §33) | Legal locked in DOC-16 |
| 2026-08-31 | Shared Engine Store Module (`store.ts`) | Extracted in-memory store to eliminate relative API route bundler resolution conflicts | Clean Next.js Webpack compilation on Vercel |
| 2026-08-31 | Phase 5 Production Build Deployment | All 5 build modules implemented, tested, and pushed to GitHub main branch | Production deployment complete |
| 2026-08-31 | Resolution of Vercel App Router Prerender Error | Removed redundant `src/app/page.tsx` re-export, fixing `clientModules` undefined prerender crash | Vercel production build & static export verified |
| 2026-08-31 | Phase 6 Critical Security & Logic Test Suite | Implemented Vitest suite covering priority scoring, quality gates, Razorpay HMAC, & CSV export | 10/10 automated tests passing |


---

## Blockers

| Date | Blocker | Blocking | Resolution | Resolved |
|------|---------|----------|------------|----------|
| 2026-08-31 | API keys needed for search/SEO providers | Production live API execution | Integrated DataForSEO/OpenAI/Razorpay + smart mock fallback | 🟢 |
| 2026-08-31 | Vercel prerender failure on `/` route | Production Vercel Deployment | Deleted duplicate `src/app/page.tsx` colliding with `(marketing)/page.tsx` | 🟢 |


