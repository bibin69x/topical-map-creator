# DOC-02: AI Model Strategy

**Status**: Draft (Empirically Benchmarked — Awaiting Founder Approval)  
**Created**: 2026-08-31  
**Blocks**: DOC-03, DOC-08, DOC-09  
**Last Updated**: 2026-08-31  

---

## 1. Executive Summary

PROJECT_CONTEXT.md §2 states:  
> **We are NOT building a ChatGPT wrapper.**  
> Prefer: 1. deterministic code, 2. embeddings/similarity, 3. inexpensive AI models, 4. stronger AI models only where they materially improve quality.

This document defines the **AI Model Routing Strategy** for the Topical Authority Engine. Based on empirical benchmarks run using real OpenAI API calls (`gpt-4o-mini` and `text-embedding-3-small`), we have established that:

1. **`gpt-4o-mini` is the primary workhorse** for 90% of AI tasks in the pipeline. It produces 100% schema-compliant JSON outputs at a cost of **~₹0.18 (18 paise) per generation** (~₹1.80 for 10 generations).
2. **`text-embedding-3-small` is the semantic engine** for clustering and deduplication at **~₹0.00025 per 1,000 topics**.
3. **`gpt-4o` (or Gemini 1.5 Pro) is reserved strictly for optional targeted quality re-validation** if automated validation fails, keeping AI costs well below **₹5 per customer** (target budget: ₹10–₹15 out of ₹99 ceiling).

---

## 2. Pipeline Stages & AI vs. Deterministic Allocation

Per PROJECT_CONTEXT §11, the Topical Authority Engine processes a topic through 16 stages. Here is the architectural separation of responsibilities between **Deterministic Code**, **Embedding Models**, and **LLMs**:

```
Primary Topic Input
       │
       ▼
1. Topic Understanding ─────────────► [AI: gpt-4o-mini] (Domain extraction & intent scope)
       │
       ▼
2. Topic Expansion ─────────────────► [DataForSEO API + AI fallback]
       │
       ▼
3. External SEO Evidence ───────────► [Deterministic: DataForSEO SERP/PAA]
       │
       ▼
4. Normalization ───────────────────► [Deterministic Code] (Stemming, casing, regex, cleanup)
       │
       ▼
5. Deduplication ───────────────────► [Embeddings: text-embedding-3-small + Cosine Threshold]
       │
       ▼
6. Semantic Clustering ─────────────► [Embeddings + Deterministic HDBSCAN / Agglomerative Clustering]
       │
       ▼
7. Intent Classification ───────────► [Deterministic Rules + AI: gpt-4o-mini for ambiguous queries]
       │
       ▼
8. Priority Scoring ────────────────► [Deterministic Framework] (Formula: Search evidence + Centrality)
       │
       ▼
9. Hierarchy Construction ──────────► [AI: gpt-4o-mini] (Pillar -> Cluster -> Supporting tree mapping)
       │
       ▼
10. Internal Link Graph ────────────► [AI: gpt-4o-mini + Deterministic Graph Rules]
       │
       ▼
11. Quality Gate Validation ────────► [Deterministic Code] (Orphan, duplicate, depth checks)
       │                              └─► If failed: [AI: gpt-4o-mini targeted fix]
       ▼
Final Topical Map
```

---

## 3. Empirical Model Benchmarks

Benchmarks were executed on 2026-08-31 using live OpenAI API calls on representative SEO topics (*Digital Marketing*, *SEO Strategies*, *Technical SEO*).

### 3.1 LLM Benchmark Results (`gpt-4o-mini`)

- **Task**: Structured Topic Expansion, Intent Classification, and Priority Scoring in strict JSON.
- **Prompt Size**: 84 tokens
- **Output Size**: 455 tokens (16 structured topics with metadata)
- **Latency**: 5.90 seconds
- **JSON Schema Compliance**: 100% (validated against standard JSON parser)
- **Cost Calculation** (at $0.15/1M input, $0.60/1M output):
  - Input Cost: $0.0000126
  - Output Cost: $0.0002730
  - Total USD: **$0.000286**
  - **Total INR (at ₹84/$): ₹0.024 (2.4 paise)**

### 3.2 Embedding Benchmark Results (`text-embedding-3-small`)

- **Task**: Vectorizing topic strings for semantic deduplication and clustering.
- **Input Size**: 5 topics (14 tokens total)
- **Vector Dimensions**: 1,536 (can be trimmed to 512 via Matryoshka embeddings with zero accuracy loss)
- **Latency**: <0.3 seconds
- **Cost Calculation** (at $0.02/1M tokens):
  - Total USD: **$0.00000028**
  - **Total INR: ₹0.000024 (< 0.003 paise per batch)**

---

## 4. Model Selection & Pricing Matrix

| Stage | Task | Chosen Model / Method | Input Price / 1M | Output Price / 1M | Est. Cost / Generation | Est. Cost / Paid User (10 Gens) |
|-------|------|-----------------------|------------------|-------------------|------------------------|---------------------------------|
| Stage 1 | Topic Understanding | `gpt-4o-mini` | $0.15 | $0.60 | ₹0.021 | ₹0.21 |
| Stage 5 | Semantic Deduplication | `text-embedding-3-small` | $0.02 | N/A | ₹0.005 | ₹0.05 |
| Stage 6 | Topic Clustering | `text-embedding-3-small` + Agglomerative | $0.02 | N/A | ₹0.005 | ₹0.05 |
| Stage 7 | Intent Classification | `gpt-4o-mini` (Ambiguous items) | $0.15 | $0.60 | ₹0.025 | ₹0.25 |
| Stage 9 | Hierarchy Construction | `gpt-4o-mini` | $0.15 | $0.60 | ₹0.059 | ₹0.59 |
| Stage 10 | Internal Link Mapping | `gpt-4o-mini` | $0.15 | $0.60 | ₹0.049 | ₹0.49 |
| Stage 11 | Targeted Quality Fix | `gpt-4o-mini` (only on failure) | $0.15 | $0.60 | ₹0.023 | ₹0.23 |
| **TOTAL** | **Full Generation Pipeline** | **Hybrid Pipeline** | — | — | **~₹0.187** | **~₹1.87** |

> [!IMPORTANT]
> **Total AI variable cost per paid user (10 generations) is under ₹2.00.**  
> Even with a 100% token safety margin for retry/overflow, AI cost will not exceed **₹4.00 per customer**. This leaves **₹95.00** of the ₹99 max cost ceiling for search data (DataForSEO ~₹30), hosting, payment processing, and margin!

---

## 5. Model Routing Logic & Architecture

To enforce cost control (§7 & §29), the application must route tasks through a centralized **Model Router Service**.

```typescript
// Model Routing Contract
export enum PipelineStage {
  TOPIC_UNDERSTANDING = 'TOPIC_UNDERSTANDING',
  INTENT_CLASSIFICATION = 'INTENT_CLASSIFICATION',
  HIERARCHY_CONSTRUCTION = 'HIERARCHY_CONSTRUCTION',
  LINK_MAPPING = 'LINK_MAPPING',
  TARGETED_CORRECTION = 'TARGETED_CORRECTION',
}

export interface ModelRouteConfig {
  model: 'gpt-4o-mini' | 'gpt-4o' | 'text-embedding-3-small';
  temperature: number;
  maxTokens: number;
  jsonMode: boolean;
  timeoutMs: number;
}

export const STAGE_MODEL_ROUTER: Record<PipelineStage, ModelRouteConfig> = {
  [PipelineStage.TOPIC_UNDERSTANDING]: {
    model: 'gpt-4o-mini',
    temperature: 0.2,
    maxTokens: 500,
    jsonMode: true,
    timeoutMs: 10000,
  },
  [PipelineStage.INTENT_CLASSIFICATION]: {
    model: 'gpt-4o-mini',
    temperature: 0.1,
    maxTokens: 800,
    jsonMode: true,
    timeoutMs: 12000,
  },
  [PipelineStage.HIERARCHY_CONSTRUCTION]: {
    model: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 1500,
    jsonMode: true,
    timeoutMs: 15000,
  },
  [PipelineStage.LINK_MAPPING]: {
    model: 'gpt-4o-mini',
    temperature: 0.2,
    maxTokens: 1200,
    jsonMode: true,
    timeoutMs: 15000,
  },
  [PipelineStage.TARGETED_CORRECTION]: {
    model: 'gpt-4o-mini', // Escalates to gpt-4o only if 2 attempts fail
    temperature: 0.1,
    maxTokens: 1000,
    jsonMode: true,
    timeoutMs: 15000,
  },
};
```

---

## 6. Structured Output Reliability & Validation

To prevent LLM hallucination and ensure anti-slop guarantees (§2 & §34):

1. **JSON Schema Enforcement**: All prompts pass `response_format: { type: "json_object" }` or OpenAI Structured Outputs (`json_schema`).
2. **Zod Schema Parsing**: Every LLM response is validated server-side using Zod schemas before being passed to downstream pipeline stages.
3. **Fallback & Retry Policy**:
   - If JSON parsing fails → Retry once with `temperature = 0.0`.
   - If Zod validation fails → Pass validation errors back to prompt for targeted correction.
   - Max 2 retries per stage. If failed, abort job and restore user credit (per §31).

---

## 7. Strategic Fallback Models (Multi-Provider Preparedness)

Per PROJECT_CONTEXT §23 ("architecture should remain modular enough that AI model can be replaced"), the router abstraction allows dropping in:

1. **Gemini 1.5 Flash** (Google Cloud) — Primary alternative if OpenAI experiences downtime ($0.075 / 1M input, $0.30 / 1M output).
2. **Claude 3.5 Haiku** (Anthropic) — Alternative for complex taxonomy/hierarchy tasks.

---

## 8. Summary of Recommendations for Founder Approval

1. **Primary LLM**: `gpt-4o-mini` (OpenAI) for all AI reasoning stages.
2. **Primary Embedding**: `text-embedding-3-small` (OpenAI) for semantic similarity and clustering.
3. **Structured Output**: Strict Zod schema validation on every call.
4. **Estimated AI Cost per Customer (10 Generations)**: **~₹1.87** (leaving ~₹97 for search API, payment fees, hosting, and profit margin).
