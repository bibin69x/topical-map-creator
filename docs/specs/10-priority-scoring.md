# DOC-10: Priority Scoring Framework

**Status**: Draft (Under Review)  
**Created**: 2026-08-31  
**Blocks**: Phase 3 UX Specs (DOC-12)  
**Last Updated**: 2026-08-31  

---

## 1. Executive Summary

This document specifies the deterministic **Priority Scoring Framework** for the Topical Authority Creator MVP.

Per [PROJECT_CONTEXT.md §15](file:///d:/Gravity%20Projects/topical-map-creator/docs/PROJECT_CONTEXT.md):
- **NON-NEGOTIABLE**: Priority must NOT be arbitrarily selected by an LLM prompt.
- Priority must be calculated algorithmically using empirical search signals, structural centrality, intent value, and confidence metrics.
- The UI exposes `High`, `Medium`, and `Low` badges, while the database stores the raw underlying score (0–100).

---

## 2. Mathematical Scoring Formula

Each topic receives a raw score $S \in [0, 100]$ calculated by:

$$\text{Score} = (0.35 \times S_{\text{search}}) + (0.35 \times S_{\text{centrality}}) + (0.20 \times S_{\text{intent}}) + (0.10 \times S_{\text{confidence}})$$

---

## 3. Signal Definitions & Weighting Breakdown

### 3.1 Search Evidence Signal ($S_{\text{search}}$) — Weight: 35%

Evaluates whether real users actively query this topic on search engines (DataForSEO SERP/PAA evidence).

| Condition | Points Allocated |
|-----------|------------------|
| Topic appears in Google People Also Ask (PAA) | +40 pts |
| Topic appears in Google Related Searches | +30 pts |
| Topic appears in Google Autocomplete | +20 pts |
| Purely synthetic / AI-suggested topic (no SERP match) | +5 pts |

*Maximum $S_{\text{search}} = 100$ pts.*

---

### 3.2 Topical Centrality Signal ($S_{\text{centrality}}$) — Weight: 35%

Evaluates the topic's structural position in the topical hierarchy tree and internal link graph.

| Metric | Points Allocated |
|--------|------------------|
| Root Pillar Topic (Level 1) | +50 pts |
| Sub-pillar / Cluster Head (Level 2) | +35 pts |
| Supporting Topic (Level 3) | +15 pts |
| Inbound Link Degree ($\ge 3$ incoming link recommendations) | +25 pts |
| Inbound Link Degree ($1–2$ incoming link recommendations) | +10 pts |

*Maximum $S_{\text{centrality}} = 100$ pts.*

---

### 3.3 Search Intent Commercial Value Signal ($S_{\text{intent}}$) — Weight: 20%

Evaluates business relevance and monetization potential of the query intent.

| Intent Category | Points Allocated |
|-----------------|------------------|
| `TRANSACTIONAL` (Buy, pricing, hire, order) | +100 pts |
| `COMMERCIAL` (Best, review, vs, comparison) | +80 pts |
| `INFORMATIONAL` (How to, guide, what is, tips) | +50 pts |
| `NAVIGATIONAL` (Login, site brand query) | +20 pts |

---

### 3.4 Data Confidence Signal ($S_{\text{confidence}}$) — Weight: 10%

Distinguishes verified data-backed observations from AI-inferred relationships (§12).

| Data Source | Points Allocated |
|-------------|------------------|
| Backed by fresh DataForSEO SERP request | +100 pts |
| Backed by 30-day cached research data | +80 pts |
| Inferred via LLM semantic expansion | +40 pts |

---

## 4. UI Bucketing Thresholds

The underlying numeric score (0.0 to 100.0) maps deterministically to the user-facing priority categories:

```typescript
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export function calculatePriorityBucket(score: number): PriorityLevel {
  if (score >= 70.0) {
    return 'HIGH';
  } else if (score >= 45.0) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}
```

- **`HIGH` (Score $\ge 70.0$)**: Core pillars, high-intent transactional topics, and topics backed by Google PAA/SERP features. (Create these first!).
- **`MEDIUM` ($45.0 \le \text{Score} < 70.0$)**: Essential supporting articles, informational cluster guides.
- **`LOW` ($\text{Score} < 45.0$)**: Niche long-tail topics for comprehensive topical coverage.

---

## 5. TypeScript Implementation (`lib/engine/scoring/priority.ts`)

```typescript
export interface PriorityInputSignals {
  inPAA: boolean;
  inRelatedSearches: boolean;
  inAutocomplete: boolean;
  level: 1 | 2 | 3;
  inboundLinkCount: number;
  intent: 'TRANSACTIONAL' | 'COMMERCIAL' | 'INFORMATIONAL' | 'NAVIGATIONAL' | 'UNKNOWN';
  isDataBacked: boolean;
}

export function computeTopicPriority(signals: PriorityInputSignals): {
  rawScore: number;
  priority: PriorityLevel;
} {
  // 1. Search Evidence (35%)
  let searchPts = 5;
  if (signals.inPAA) searchPts += 40;
  if (signals.inRelatedSearches) searchPts += 30;
  if (signals.inAutocomplete) searchPts += 20;
  searchPts = Math.min(100, searchPts);

  // 2. Centrality (35%)
  let centralityPts = signals.level === 1 ? 50 : signals.level === 2 ? 35 : 15;
  if (signals.inboundLinkCount >= 3) centralityPts += 25;
  else if (signals.inboundLinkCount >= 1) centralityPts += 10;
  centralityPts = Math.min(100, centralityPts);

  // 3. Intent Value (20%)
  const intentPts =
    signals.intent === 'TRANSACTIONAL' ? 100 :
    signals.intent === 'COMMERCIAL' ? 80 :
    signals.intent === 'INFORMATIONAL' ? 50 : 20;

  // 4. Confidence (10%)
  const confidencePts = signals.isDataBacked ? 100 : 40;

  // Weighted Sum Formula
  const rawScore = Number((
    (0.35 * searchPts) +
    (0.35 * centralityPts) +
    (0.20 * intentPts) +
    (0.10 * confidencePts)
  ).toFixed(2));

  return {
    rawScore,
    priority: calculatePriorityBucket(rawScore),
  };
}
```
