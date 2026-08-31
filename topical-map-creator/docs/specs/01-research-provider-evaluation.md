# DOC-01: Research Provider Evaluation

**Status**: Draft (Web Research Complete — Awaiting API Key Benchmarks)  
**Created**: 2026-08-31  
**Blocks**: DOC-03, DOC-08  
**Last Updated**: 2026-08-31

---

## 1. Purpose

This document evaluates SEO/search data providers for the Topical Authority Engine's research pipeline. The engine requires external data for:

1. **Topic expansion** — discovering subtopics, related queries, and long-tail variations
2. **Search evidence** — SERP features, People Also Ask, Related Searches, Autocomplete
3. **Keyword data** — search volume, keyword difficulty (nice-to-have for MVP)
4. **Validation** — confirming topic relevance via real search data

The provider selection directly impacts:
- Generation quality (data richness)
- Generation cost (must stay within ₹30–₹50 target, ₹99 ceiling per PROJECT_CONTEXT §6)
- Legal caching ability (per §10)
- Latency (async generation, §19)

---

## 2. Provider Shortlist

### 2.1 DataForSEO

**Type**: API-first SEO data platform  
**Model**: Pay-as-you-go (no subscription)  
**Minimum deposit**: $50 (~₹4,200)  
**Free trial**: $1 credit on signup

#### Available APIs Relevant to Our Pipeline

| API | Endpoint | Use Case | Pricing (per 1K) | Mode |
|-----|----------|----------|-------------------|------|
| SERP API | Google Organic | SERP features, PAA, Related Searches | $0.60 (Standard), $1.20 (Priority), $2.00 (Live) | Async/Live |
| SERP API | Google Autocomplete | Topic expansion via suggestions | $0.60 (Standard) | Async/Live |
| Labs API | Keyword Suggestions | Topic expansion | $0.012/task + $0.00012/item | Async |
| Labs API | Related Keywords | Semantic relationships | $0.012/task + $0.00012/item | Async |
| Labs API | Search Intent | Intent classification | $0.012/task + $0.00012/item | Async |

#### Data Richness (Single SERP Request Returns)
- Organic results (title, URL, snippet, position)
- People Also Ask (questions + expanded answers)
- Related Searches
- Featured Snippets
- Knowledge Graph data
- AI Overviews (where available)
- All structured as JSON

#### Key Facts
- **Rate limits**: 2,000 requests/min (general), 30 concurrent (Live)
- **Caching**: Results stored on their servers for 30 days (Standard mode). You are permitted to cache on your own systems.
- **Geographic coverage**: India (✅), supports country + language targeting
- **Latency**: Standard queue ~5 min, Priority ~1 min, Live ~6 seconds
- **July 2026 pricing update**: ~20% increase across Labs API, removed monthly commitments

---

### 2.2 Serper.dev

**Type**: Lightweight Google SERP API  
**Model**: Prepaid credits  
**Free tier**: 2,500 free queries on signup

#### Pricing

| Tier | Cost per 1K requests |
|------|---------------------|
| Standard | ~$1.00 |
| High Volume | ~$0.30 |

#### Data Returned
- Organic results
- People Also Ask
- Related Searches
- Knowledge Graph
- Structured JSON

#### Key Facts
- **Depth multiplier**: 1 credit for 10 results, 2 credits for 11–100 results
- **Credit expiry**: 6 months from purchase
- **No keyword suggestion/expansion API** — SERP data only
- **Rate limits**: Not publicly documented in detail
- **Caching policy**: Not explicitly documented (review ToS before relying on)
- **Geographic coverage**: India (✅)
- **Latency**: Real-time responses (~1-3 seconds)

---

### 2.3 SerpAPI

**Type**: Full-featured SERP scraping API  
**Model**: Monthly subscription  
**Starter plan**: $25/month for 1,000 searches

#### Pricing

| Plan | Searches | Cost/1K |
|------|----------|---------|
| Starter | 1,000/month | $25.00 |
| Enterprise (reserved) | Custom | $2.75 |
| Enterprise (on-demand) | Custom | $7.50 |

#### Key Facts
- **Most expensive** at our scale
- Monthly subscription model (unused credits don't roll over)
- Good data quality and reliability
- **Eliminates itself on cost** — at $25/1K requests, a single generation with 20 SERP calls costs $0.50 (~₹42) just for search data
- **Geographic coverage**: India (✅)

---

### 2.4 ValueSERP (Traject Data)

**Type**: Budget SERP API  
**Model**: Monthly credit-based subscription  
**Starting price**: ~$1.60/1K requests

#### Key Facts
- Batch processing focused (up to 15K requests scheduled)
- **Less suitable for real-time/live requests** — optimized for batch/scheduled use
- City-level location targeting
- Cost can drop to ~$0.50/1K at high volume
- **Geographic coverage**: India (✅)

---

### 2.5 Google Custom Search API

**Status**: ❌ DEPRECATED — Shutting down January 1, 2027

Not viable for a new product. Eliminated.

---

## 3. Comparative Analysis

### 3.1 Cost Comparison (per 1,000 requests)

| Provider | SERP Data | Keyword Expansion | Combined Available | Model |
|----------|-----------|-------------------|-------------------|-------|
| **DataForSEO** | $0.60 (Std) / $2.00 (Live) | $0.012/task + $0.00012/item | ✅ Both | Pay-as-you-go |
| **Serper.dev** | $0.30–$1.00 | ❌ Not available | SERP only | Prepaid credits |
| **SerpAPI** | $2.75–$25.00 | ❌ Not available | SERP only | Subscription |
| **ValueSERP** | $0.50–$1.60 | ❌ Not available | SERP only | Subscription |

### 3.2 Feature Matrix

| Feature | DataForSEO | Serper.dev | SerpAPI | ValueSERP |
|---------|-----------|-----------|---------|-----------|
| Google SERP results | ✅ | ✅ | ✅ | ✅ |
| People Also Ask | ✅ | ✅ | ✅ | ✅ |
| Related Searches | ✅ | ✅ | ✅ | ✅ |
| Autocomplete/Suggest | ✅ (dedicated endpoint) | ❌ | ✅ | ❌ |
| Keyword Suggestions | ✅ (Labs API) | ❌ | ❌ | ❌ |
| Related Keywords | ✅ (Labs API) | ❌ | ❌ | ❌ |
| Search Intent data | ✅ (Labs API) | ❌ | ❌ | ❌ |
| Search Volume | ✅ (Labs API) | ❌ | ❌ | ❌ |
| Pay-as-you-go | ✅ | ✅ (prepaid) | ❌ (subscription) | ❌ (subscription) |
| No monthly minimum | ✅ | ✅ | ❌ ($25/mo) | ❌ |
| India targeting | ✅ | ✅ | ✅ | ✅ |
| Caching permitted | ✅ (explicitly) | ⚠️ (check ToS) | ⚠️ (check ToS) | ⚠️ (check ToS) |
| Async/queue mode | ✅ (Standard queue) | ❌ (live only) | ❌ (live only) | ✅ (batch) |
| Free trial credits | ✅ ($1) | ✅ (2,500 queries) | ✅ (100 searches) | ❌ |

---

## 4. Cost Modeling Per Generation

### Assumptions
- 1 generation produces ~30–50 final topics (per §5)
- Pipeline needs: topic expansion + SERP evidence + validation
- Target: ₹30–₹50 total variable cost per paid customer (10 generations)
- Therefore: **₹3–₹5 per generation** is the search data budget

### 4.1 DataForSEO — Estimated Cost Per Generation

| Pipeline Stage | API Used | Requests | Est. Cost |
|---------------|----------|----------|-----------|
| Topic understanding | SERP (Standard) | 1 | $0.0006 |
| Autocomplete expansion | Autocomplete (Standard) | 3–5 | $0.003 |
| Related keyword expansion | Labs: Keyword Suggestions | 1 task, ~100 items | $0.024 |
| SERP evidence (selective) | SERP (Standard) | 5–10 | $0.006 |
| PAA/Related Searches | Included in SERP calls | 0 (free) | $0.00 |
| Deep validation (top topics) | SERP (Standard) | 3–5 | $0.003 |
| **Total per generation** | | **~13–22 requests** | **~$0.036 ($0.02–$0.05)** |

**$0.036 ≈ ₹3.00 per generation**

**Per paid customer (10 generations): ~₹30**

> [!TIP]
> This leaves significant room within the ₹99 ceiling for AI costs, infrastructure, and payment processing.

### 4.2 Serper.dev — Estimated Cost Per Generation

| Pipeline Stage | API Used | Requests | Est. Cost |
|---------------|----------|----------|-----------|
| Topic understanding | SERP | 1 | $0.001 |
| Topic expansion | SERP (multiple queries) | 5–8 | $0.008 |
| SERP evidence | SERP | 5–10 | $0.01 |
| Deep validation | SERP | 3–5 | $0.005 |
| **Total per generation** | | **~14–24 requests** | **~$0.024 ($0.015–$0.035)** |

**$0.024 ≈ ₹2.00 per generation** (at high-volume $0.30/1K rate)

**Per paid customer (10 generations): ~₹20**

> [!WARNING]
> Cheaper per-SERP, but **no keyword expansion API** means we'd need to use AI to generate expansion candidates (increasing AI cost) or rely solely on PAA + Related Searches for topic discovery. This limits data-driven expansion quality.

### 4.3 Hybrid Approach — DataForSEO + Serper.dev

| Layer | Provider | Reason | Cost |
|-------|----------|--------|------|
| Keyword expansion | DataForSEO Labs | Only provider with this | ~$0.024/gen |
| Real-time SERP evidence | Serper.dev | Faster, cheaper per-SERP | ~$0.015/gen |
| **Combined** | | | **~$0.039/gen ≈ ₹3.30** |

> [!NOTE]
> Adds complexity of two provider integrations. Not recommended for MVP unless DataForSEO Standard queue latency is unacceptable.

---

## 5. Latency Analysis

Generation is asynchronous (§19), so real-time latency is NOT critical. However, total generation time affects UX.

| Provider | Mode | Typical Latency | Suitable for Async Gen? |
|----------|------|----------------|------------------------|
| DataForSEO | Standard | ~5 min | ✅ Yes — queue fits our async model |
| DataForSEO | Priority | ~1 min | ✅ Yes (2x cost) |
| DataForSEO | Live | ~6 sec | ✅ Yes (3.3x cost, unnecessary) |
| Serper.dev | Live only | ~1-3 sec | ✅ Yes |
| ValueSERP | Batch | Variable | ⚠️ Less predictable timing |

**Recommendation**: DataForSEO **Standard queue** is ideal. Our generation is already async with progress states (RESEARCHING → EXPANDING → etc.). A 5-minute queue for ~20 requests adds acceptable latency to an already multi-minute process.

If UX testing reveals users want faster results, upgrade to **Priority queue** at 2x cost (still within budget).

---

## 6. Caching Strategy Compatibility

Per PROJECT_CONTEXT §10, we must cache reusable research data where legally permitted.

| Provider | Caching Allowed | Duration | Notes |
|----------|----------------|----------|-------|
| **DataForSEO** | ✅ Explicitly permitted | Their server: 30 days; Our server: unrestricted | Best caching story — Standard queue results can be re-fetched for 30 days at no cost |
| **Serper.dev** | ⚠️ Not explicitly documented | N/A | Must review ToS carefully |
| **SerpAPI** | ⚠️ ToS review needed | N/A | — |

**DataForSEO's caching model directly aligns with §10**:
- Same-query cache hits across users = free (shared research cache from §10)
- 30-day server-side retention = natural freshness window
- Explicit permission to store on our systems

---

## 7. Risk Assessment

| Risk | DataForSEO | Serper.dev | Mitigation |
|------|-----------|-----------|------------|
| Provider goes down | Medium | Medium | Abstraction layer allows provider swap |
| Pricing increase | Already happened (July 2026, +20%) | Possible | Build cost alerts, provider abstraction |
| Data quality insufficient | Low (rich SERP + Labs data) | Medium (SERP-only) | Benchmark before committing |
| Rate limit issues | Low (2K req/min) | Unknown | Monitor, batch requests |
| ToS violation | Low (caching explicitly allowed) | Medium | Legal review before caching |

---

## 8. Recommendation

### Primary Provider: DataForSEO

**Rationale**:

1. **Only provider with keyword expansion APIs** — Labs API gives us Keyword Suggestions, Related Keywords, and Search Intent data that no other provider offers at this price point
2. **Richest data per request** — A single SERP request returns organic results + PAA + Related Searches + Featured Snippets + AI Overviews
3. **Pay-as-you-go** — No monthly commitment, no wasted subscription costs during low-volume periods
4. **Explicit caching permission** — Directly enables §10 research caching strategy
5. **Async-native** — Standard queue mode aligns perfectly with our async generation architecture
6. **Cost** — ~₹3/generation, ~₹30/paid customer well within ₹30–₹50 target
7. **India coverage** — Full country + language targeting
8. **$50 minimum deposit** — Low barrier to start

### Fallback Provider: Serper.dev

**When**: If DataForSEO has outages or if we need real-time SERP data for a specific pipeline stage.

**Not recommended as primary** because:
- No keyword expansion API (forces AI to do data work = higher AI cost + lower quality)
- Caching legality unclear
- Credit expiry (6 months)

### Eliminated

| Provider | Reason |
|----------|--------|
| SerpAPI | Too expensive (~10x DataForSEO at our scale) |
| ValueSERP | No keyword APIs, batch-only model, less predictable |
| Google CSE | Deprecated, shutting down Jan 2027 |
| SE Ranking | Subscription model, not API-first for our use case |
| SEOptimer | Audit-focused, not keyword/SERP research |

---

## 9. Integration Architecture Preview

```
┌─────────────────────────────────────────────┐
│           Research Provider Layer            │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │    IResearchProvider (Interface)      │   │
│  │                                      │   │
│  │  + getSERPResults(query, opts)        │   │
│  │  + getAutocompleteSuggestions(query)  │   │
│  │  + getKeywordSuggestions(keyword)     │   │
│  │  + getRelatedKeywords(keyword)        │   │
│  │  + getSearchIntent(keywords)          │   │
│  └──────────┬───────────────────────────┘   │
│             │                               │
│    ┌────────┴────────┐                      │
│    │                 │                      │
│  ┌─┴──────────┐  ┌──┴───────────┐          │
│  │ DataForSEO │  │  Serper.dev  │          │
│  │ Provider   │  │  Provider    │          │
│  │ (Primary)  │  │  (Fallback)  │          │
│  └────────────┘  └──────────────┘          │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │       Research Cache Layer           │   │
│  │  (check before external calls)       │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### TypeScript Interface (Preview)

```typescript
interface SERPResult {
  organic: OrganicResult[];
  peopleAlsoAsk: PAAItem[];
  relatedSearches: string[];
  featuredSnippet?: FeaturedSnippet;
  knowledgeGraph?: KnowledgeGraphItem;
}

interface KeywordSuggestion {
  keyword: string;
  searchVolume?: number;
  cpc?: number;
  competition?: number;
}

interface IResearchProvider {
  /** Get SERP results including PAA, Related Searches */
  getSERPResults(
    query: string,
    options: { country: string; language: string; depth?: number }
  ): Promise<SERPResult>;

  /** Get autocomplete suggestions for a partial query */
  getAutocompleteSuggestions(
    query: string,
    options: { country: string; language: string }
  ): Promise<string[]>;

  /** Get keyword expansion suggestions */
  getKeywordSuggestions(
    keyword: string,
    options: { country: string; language: string; limit?: number }
  ): Promise<KeywordSuggestion[]>;

  /** Get semantically related keywords */
  getRelatedKeywords(
    keyword: string,
    options: { country: string; language: string; limit?: number }
  ): Promise<KeywordSuggestion[]>;
}
```

---

## 10. Pending — API Benchmark Testing

> [!IMPORTANT]
> The following benchmarks must be completed before this document is finalized. They require a DataForSEO API key ($50 deposit) and optionally a Serper.dev account (free 2,500 queries).

### Test Plan

**Sample topics** (covering different complexity levels):

1. "digital marketing" — broad, high-volume
2. "local SEO for restaurants" — niche, specific
3. "technical SEO audit checklist" — long-tail, informational
4. "best CRM for small business" — commercial intent
5. "yoga for beginners" — non-tech, different vertical

**For each topic, test**:

| Test | Provider | What to Measure |
|------|----------|----------------|
| SERP results | DataForSEO Standard | Response time, data richness, PAA count, Related Searches count |
| SERP results | Serper.dev | Same metrics for comparison |
| Autocomplete | DataForSEO | Suggestion count, relevance |
| Keyword Suggestions | DataForSEO Labs | Suggestion count, relevance, cost per call |
| Related Keywords | DataForSEO Labs | Semantic relevance, cost per call |
| End-to-end generation | DataForSEO | Total time for ~20 calls, total cost |

**Quality criteria**:
- Are PAA questions relevant to the topic?
- Do Related Searches provide genuine subtopic expansion?
- Are Keyword Suggestions diverse enough for a topical map?
- Is the data quality consistent across Indian search context?

### Required API Keys

| Provider | Account Type | Cost | Action Needed |
|----------|-------------|------|---------------|
| **DataForSEO** | Pay-as-you-go | $50 deposit (~₹4,200) | Founder to create account + share API credentials |
| **Serper.dev** | Free trial | $0 (2,500 free queries) | Founder to create account + share API key |

---

## 11. Decision Summary

| Decision | Choice | Confidence | Revisit Trigger |
|----------|--------|------------|----------------|
| Primary research provider | DataForSEO | **High** (pending benchmarks) | Benchmark quality fails |
| Fallback provider | Serper.dev | Medium | DataForSEO reliability issues |
| API mode | Standard (async queue) | High | UX testing shows unacceptable latency |
| Caching strategy | Cache on our DB + leverage 30-day server retention | High | ToS change |
| Estimated search cost/generation | ~₹3 (~$0.036) | Medium (needs benchmark validation) | Actual costs deviate >50% |
| Estimated search cost/paid customer | ~₹30 ($0.36) | Medium | Usage patterns differ from assumptions |

---

## Appendix A: Provider API Documentation Links

- **DataForSEO**: https://docs.dataforseo.com/
- **DataForSEO SERP API**: https://docs.dataforseo.com/v3/serp/google/organic/
- **DataForSEO Labs API**: https://docs.dataforseo.com/v3/dataforseo_labs/
- **DataForSEO Pricing**: https://dataforseo.com/pricing
- **Serper.dev**: https://serper.dev/
- **Serper.dev Docs**: https://serper.dev/playground

## Appendix B: INR Conversion Note

All USD-to-INR conversions in this document use an approximate rate of **$1 = ₹84**. Actual rates will vary. The cost model in DOC-03 should use the prevailing rate at time of finalization.
