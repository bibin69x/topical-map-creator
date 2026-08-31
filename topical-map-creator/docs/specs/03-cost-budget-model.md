# DOC-03: Cost Simulator & Budget Model (GO / NO-GO GATE)

**Status**: Completed — **PASS (GO CERTIFIED)**  
**Created**: 2026-08-31  
**Blocks**: DOC-04 (Architecture) & all Phase 1-4 specs  
**Last Updated**: 2026-08-31  

---

## 1. Purpose & Constraint Baseline

This document is the **formal financial validation gate** required before writing system architecture, schemas, or code.

Per **PROJECT_CONTEXT.md §6 (Hard Economics Constraint — NON-NEGOTIABLE)**:

- **Launch Price**: ₹199 (Early Access)
- **Target Entitlement**: 10 Generation Credits per paid account
- **Preferred Target Cost**: ₹30–₹50 fully-loaded variable cost per paid customer
- **Warning Zone**: ₹50–₹75
- **Optimization Required**: ₹75–₹99
- **Absolute Ceiling**: ₹99 (Maximum allowable limit)
- **Minimum Gross Margin Target**: ₹100 per customer

---

## 2. Fully-Loaded Variable Cost Model (Per Paid Customer)

Based on empirical benchmarks from [DOC-01](file:///d:/Gravity%20Projects/topical-map-creator/docs/specs/01-research-provider-evaluation.md) (DataForSEO) and [DOC-02](file:///d:/Gravity%20Projects/topical-map-creator/docs/specs/02-ai-model-strategy.md) (OpenAI `gpt-4o-mini`), here is the fully-loaded cost breakdown for 1 paid customer executing **10 generations**:

| Cost Component | Unit Cost / Rate | Usage per Customer (10 Gens) | Conservative Cost (INR) | Expected Cost (INR) | % of Variable Budget |
|----------------|------------------|------------------------------|--------------------------|---------------------|----------------------|
| **SEO / Search API** (DataForSEO) | $0.60 / 1K requests (~₹0.05/req) | ~20 requests x 10 = 200 reqs | ₹32.00 | ₹28.00 | 58.5% |
| **AI LLM Reasoning** (`gpt-4o-mini`) | $0.15/1M in, $0.60/1M out | ~5,500 tokens x 10 = 55K tokens | ₹3.50 | ₹1.87 | 3.9% |
| **AI Embeddings** (`text-embedding-3-small`) | $0.02/1M tokens | ~2,500 tokens x 10 = 25K tokens | ₹0.10 | ₹0.05 | 0.1% |
| **Payment Gateway** (Razorpay) | 2.0% + 18% GST | 2.36% of ₹199 | ₹4.70 | ₹4.70 | 9.8% |
| **Serverless Compute / Edge** (Vercel) | $0.60 / 1M execution seconds | 100s compute total | ₹3.00 | ₹2.00 | 4.2% |
| **Database & Storage** (Supabase) | $0.125 / GB transfer + DB IOPS | 50MB DB ops + PDF storage | ₹2.50 | ₹1.50 | 3.1% |
| **Transactional Email / Auth** | $0.001 / email | 5 emails (welcome, receipts) | ₹0.80 | ₹0.50 | 1.0% |
| **Refunds & Abuse Allowance** | 5% failure/refund buffer | Allocation per paid user | ₹5.00 | ₹4.00 | 8.4% |
| **TOTAL VARIABLE COST** | — | — | **₹51.60** | **₹42.62** | **100.0%** |

> [!IMPORTANT]
> - **Expected Variable Cost**: **₹42.62** (well inside the ₹30–₹50 target zone!)
> - **Conservative Variable Cost**: **₹51.60** (just at the boundary of the target zone, far below the ₹99 ceiling!)
> - **Expected Contribution Margin**: **₹156.38 per customer** (78.5% gross margin, exceeding the ₹100 target!)

---

## 3. Free Plan Cost Impact & Blended Economics

Per PROJECT_CONTEXT §5, free users receive **1 complete topical map generation** (no export capability). We must model the blended cost across different conversion rates.

### Free User Unit Cost
- 1 Generation search API: ₹2.80
- 1 Generation AI reasoning: ₹0.19
- 1 Generation storage/compute: ₹0.35
- **Total cost per free generation**: **~₹3.34**

### Blended Customer Cost Matrix (Free : Paid Ratio)

| Free-to-Paid Conversion Rate | Free Users per Paid User | Free Tier Overhead Cost | Paid User Variable Cost | Blended Cost per Paid User | Status vs ₹99 Ceiling | Gross Profit per Paid User |
|------------------------------|--------------------------|-------------------------|-------------------------|----------------------------|-----------------------|----------------------------|
| **10.0%** (1 in 10 converts) | 9 free users | ₹30.06 | ₹42.62 | **₹72.68** | 🟢 PASS (Warning Zone) | **₹126.32** |
| **15.0%** (1 in 6.6 converts)| 5.6 free users | ₹18.70 | ₹42.62 | **₹61.32** | 🟢 PASS (Warning Zone) | **₹137.68** |
| **20.0%** (1 in 5 converts)  | 4 free users | ₹13.36 | ₹42.62 | **₹55.98** | 🟢 PASS (Target/Warn boundary) | **₹143.02** |
| **25.0%** (1 in 4 converts)  | 3 free users | ₹10.02 | ₹42.62 | **₹52.64** | 🟢 PASS (Target Zone) | **₹146.36** |

Even at a conservative **10% conversion rate**, the blended cost of ₹72.68 is safely below the **₹99 maximum ceiling**, yielding **₹126.32 profit per paying customer**!

---

## 4. Sensitivity & Stress Testing

What happens if external costs spike or usage patterns change?

| Scenario | Condition | Impact on Variable Cost | New Variable Cost | Status vs Ceiling | Action Plan |
|----------|-----------|-------------------------|-------------------|-------------------|-------------|
| **Search API Price Hikes** | DataForSEO raises price by 50% | +₹14.00 | ₹56.62 | 🟢 PASS | Enforce stricter caching (§10) |
| **Heavy Token Usage** | User topics require 2x LLM tokens | +₹2.00 | ₹44.62 | 🟢 PASS | No action needed (AI is cheap) |
| **Full 10/10 Credit Utilization** | 100% of customers use all 10 credits | +₹5.00 | ₹47.62 | 🟢 PASS | Expected behavior |
| **High Refund Rate** | 10% refund rate | +₹5.00 | ₹47.62 | 🟢 PASS | Improve pipeline quality gates |
| **Worst-Case Compound** | 50% Search hike + 10% conversion + 100% credit use | +₹25.00 | **₹86.62** | 🟢 PASS | Still ₹12.38 below ₹99 ceiling! |

---

## 5. Fixed Infrastructure Costs (Monthly Baseline)

To run the platform, the baseline fixed infrastructure costs in MVP stage are:

| Service | Plan / Tier | Monthly Cost (USD) | Monthly Cost (INR) | Notes |
|---------|-------------|--------------------|--------------------|-------|
| **Supabase** | Free Tier / Pro ($25) | $0 - $25 | ₹0 - ₹2,100 | Starts free, upgrades at scale |
| **Vercel** | Hobby / Pro ($20) | $0 - $20 | ₹0 - ₹1,680 | Starts free |
| **Domain & DNS** | Namecheap/Cloudflare | $1.00 | ₹84 | Annual amortized |
| **DataForSEO Deposit** | One-time initial pool | $50.00 | ₹4,200 | Working capital buffer |
| **Total Fixed Monthly** | Starter Tier | **~$25.00** | **~₹2,100 / month** | Break-even at **14 paying users/month**! |

---

## 6. Formal Pass/Fail Certification

```
════════════════════════════════════════════════════════════════════════
                  FINANCIAL VALIDATION CERTIFICATE
════════════════════════════════════════════════════════════════════════
 Target Variable Cost Range  : ₹30.00 – ₹50.00
 Modeled Variable Cost       : ₹42.62 (Expected) / ₹51.60 (Conservative)
 Absolute Ceiling Constraint : ₹99.00
 Blended Cost (at 10% Conv)  : ₹72.68
 Break-even Paid Volume      : 14 customers / month
 Projected Gross Margin      : 78.5% (₹156.38 profit per ₹199 sale)

 VERDICT: PASS 🟢 (GO FOR ARCHITECTURE & PHASE 1 SPECS)
════════════════════════════════════════════════════════════════════════
```

---

## 7. Cost Enforcers & Safeguards for Implementation

To guarantee these numbers hold during development:

1. **Hard Generation Request Limits**: Max 25 DataForSEO API requests per generation enforced by backend pipeline (DOC-11).
2. **LLM Output Token Cap**: Max 1,500 output tokens per call via `max_tokens`.
3. **Research Cache First**: Check PostgreSQL `research_cache` table before every external API call.
4. **Server-Side Entitlement Deduction**: Credits deducted transactionally before starting processing.
