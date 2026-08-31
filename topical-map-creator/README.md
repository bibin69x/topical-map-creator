# Topical Authority Creator (MVP V1)

> **Build a complete topical authority strategy without expensive SEO software.**

An affordable, production-grade SEO software platform built for SEO freshers, digital marketing practitioners, freelancers, and small agencies. Turn any primary niche topic or website domain into an actionable, structured topical map with clusters, search intent, deterministic priority scores, internal-linking recommendations, and CSV/PDF export.

---

## 💎 Core Product Principles (Non-Negotiable)

1. **NOT a ChatGPT Wrapper**:
   `DATA → SEO LOGIC → AI REASONING → VALIDATION → FINAL OUTPUT` (Never `USER → LLM → TOPICAL MAP`).
2. **Cheapest Reliable Method**:
   Deterministic application code first, semantic AI models only where they provide genuine reasoning value.
3. **Quality Over Volume**:
   Coherent, actionable topical hierarchy that a human SEO specialist can actually execute — not 500 keyword dumps.
4. **Strict Economic Guardrails**:
   - Launch Price: **₹199 Early Access** (10 generation credits).
   - Cost Budget: Target **₹30–₹50** per paid user, with a hard ceiling of **₹99**.
   - Per-Generation Hard Cap: Maximum **₹6.00** combined search and AI API cost.
5. **Anti-AI-Slop Interface**:
   Professional Slate/Indigo palette, compact dense data tables, zero generic purple gradients or conversational chatbot interfaces.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 App Router (React 18, TypeScript, Tailwind CSS).
- **Database & Auth**: Supabase PostgreSQL 15 with Row-Level Security (RLS) policies and `@supabase/ssr` cookie-based authentication.
- **SEO Data Provider**: DataForSEO Google Ads/SERP APIs with deterministic fallback.
- **AI Reasoning**: OpenAI `gpt-4o-mini` with strict Zod JSON schemas and XML tag isolation (`<untrusted_search_data>`).
- **Payments**: Razorpay India (UPI, Netbanking, Cards) with HMAC-SHA256 server-verified webhooks and transaction credit allocation.
- **Exports**: Client-side RFC 4180 CSV export and executive printable PDF report view (`PdfReportView`).
- **Telemetry & Monitoring**: In-memory and SQL operational admin dashboard (`/admin`) tracking latency, success rate, and cost vs budget caps.

---

## 📂 Project Structure

```text
├── docs/
│   ├── PROGRESS.md                    # Live progress tracking and sprint status
│   ├── PROJECT_CONTEXT.md             # MVP source of truth and founder directives
│   ├── topical-authority-V1.txt       # Original product blueprint
│   └── specs/                         # 17 exhaustive engineering and business specs
├── supabase/
│   └── migrations/
│       └── 20260831000000_initial_schema.sql  # 11 entities, RLS policies, triggers
├── src/
│   ├── app/
│   │   ├── (dashboard)/               # Dashboard routes (projects, create, generation)
│   │   ├── admin/                     # Operational telemetry & cost monitoring UI
│   │   ├── api/                       # RESTful API endpoints & webhooks
│   │   ├── login/ & signup/           # User authentication portals
│   │   ├── privacy/, terms/, refund/  # Legal and statutory compliance suite
│   │   ├── error.tsx & not-found.tsx  # Production resilience & error boundaries
│   │   └── page.tsx                   # Marketing landing page
│   ├── components/
│   │   ├── layout/                    # Responsive Navbar with live session state
│   │   ├── results/                   # 6-Tab Results Dashboard (Overview, Topics, Clusters, Intent, Links, Export)
│   │   └── ui/                        # Button, Badge, Card, Progress primitives
│   └── lib/
│       ├── engine/                    # 16-stage Topical Engine, scoring, validation, providers
│       ├── services/                  # Payment, auth, account deletion, health services
│       └── supabase/                  # Server and client SSR database connectors
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm 9+
- Supabase project (or local PostgreSQL instance)
- Razorpay account (Test mode or Live)

### 2. Installation
```bash
git clone https://github.com/bibin69x/topical-map-creator.git
cd topical-map-creator
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the required environment variables:
```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Research Provider API Keys (Optional in local dev; deterministic fallback included)
DATAFORSEO_API_LOGIN=your-login
DATAFORSEO_API_PASSWORD=your-password

# AI Model Strategy (Optional in local dev; deterministic fallback included)
OPENAI_API_KEY=sk-proj-your-key-here

# Payment Gateway (Razorpay India)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup
Run the SQL migration in your Supabase SQL Editor:
```bash
# File: supabase/migrations/20260831000000_initial_schema.sql
```
This migration provisions all 11 core tables (`profiles`, `entitlements`, `projects`, `generations`, `topics`, `clusters`, `internal_links`, `generation_costs`, `audit_logs`, `payments`, `feedback`), PostgreSQL triggers, and RLS policies.

### 5. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the application.

---

## 🧪 Testing

The repository uses **Vitest** for fast unit and integration testing covering critical security, payment, scoring, and engine business logic:

```bash
# Run all automated tests
npm test
```

### Verified Test Suites (26/26 Passing):
- `src/lib/engine/pipeline.test.ts`: Complete 16-stage engine integration & budget cap checks.
- `src/lib/engine/scoring/priority.test.ts`: 0–100 deterministic scoring formula tests.
- `src/lib/engine/validation/quality_gates.test.ts`: 10 quality gates verification.
- `src/lib/engine/ai/sanitization.test.ts`: Prompt injection XML escaping & length checks.
- `src/lib/services/payment_checkout.test.ts`: Razorpay order creation & paise conversion.
- `src/lib/services/payment.test.ts`: HMAC-SHA256 signature verification & length matching.
- `src/lib/services/auth.test.ts`: User credentials & initial entitlement allocation.
- `src/lib/services/account.test.ts`: Cascade account deletion & GST transaction anonymization.
- `src/lib/services/health.test.ts`: Health check contract, RPO/RTO bounds & retention.
- `src/lib/services/export.test.ts`: RFC 4180 CSV generation & escaping.

---

## 🚢 Production Build & Deployment

### Build Command:
```bash
npm run build
```

The build compiles clean static and dynamic routes:
- `○ /` - Marketing landing page
- `○ /login` & `/signup` - Auth portals
- `○ /create` - Topical map generator wizard
- `○ /projects` - User projects repository
- `ƒ /projects/[id]` - 6-tab interactive dashboard
- `ƒ /projects/[id]/generating` - Real-time progress monitor
- `○ /admin` - Telemetry & cost monitoring dashboard
- `ƒ /api/health` - Production uptime & health verification
- `ƒ /api/webhooks/razorpay` - Razorpay HMAC webhook processor

### Deploy to Vercel:
1. Connect GitHub repository to Vercel.
2. Configure environment variables from `.env.local`.
3. Set build command to `npm run build` and output directory to `.next`.
4. Deploy!

---

## ⚖️ Legal & Compliance

- **Statutory Retention**: Transaction and invoice records anonymized and retained for 8 years in compliance with Section 36 of the Indian CGST Act 2017.
- **Right to Erasure**: Full account deletion API (`DELETE /api/user/account`) cascading user projects, topics, and sessions.
- **Privacy First**: Zero training of foundational AI models on customer generation topics.

---

## 📄 License

Proprietary © 2026 Topical Authority Creator. All rights reserved.
