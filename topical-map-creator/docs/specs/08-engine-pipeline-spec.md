# DOC-08: Engine Pipeline Specification (Core IP)

**Status**: Draft (Under Review)  
**Created**: 2026-08-31  
**Blocks**: DOC-09 (Prompts), DOC-10 (Scoring), DOC-11 (Budget)  
**Last Updated**: 2026-08-31  

---

## 1. Executive Summary

This document specifies the internal pipeline architecture for the **Topical Authority Engine**, which is the core intellectual property of the product ([PROJECT_CONTEXT.md §11](file:///d:/Gravity%20Projects/topical-map-creator/docs/PROJECT_CONTEXT.md)).

Per §2 ("NOT a ChatGPT wrapper"), the engine uses deterministic code for deduplication, limits, scoring calculations, hierarchy constraints, and quality validation, reserving AI exclusively for semantic reasoning, classification, and taxonomy mapping.

---

## 2. Complete Pipeline Stage Matrix

| Stage ID | Stage Name | Processing Method | Primary Tool / Model | Inputs | Outputs | Quality Gate / Constraint |
|----------|------------|-------------------|----------------------|--------|---------|---------------------------|
| **ST-01** | Primary Topic Input | Deterministic | Zod Validator | User Input | Cleaned Topic & Country/Lang | Max 150 chars, valid country |
| **ST-02** | Topic Understanding | AI Reasoning | `gpt-4o-mini` | Primary Topic | 4-6 Core Sub-dimensions | Must return structured JSON |
| **ST-03** | Candidate Expansion | Data API + AI | DataForSEO / `gpt-4o-mini` | Core Dimensions | 80-120 Candidate Topics | Max 150 raw candidates |
| **ST-04** | Search Evidence Retrieval | Data API | DataForSEO SERP / PAA | Candidate Queries | PAA Questions & Related Queries | Cached check first (§10) |
| **ST-05** | Text Normalization | Deterministic | Regex / Porter Stemmer | Raw Candidates | Cleaned, Standardized Strings | Strips special chars, lowercases |
| **ST-06** | Semantic Deduplication | Embeddings | `text-embedding-3-small` | Normalized Candidates | Unique Candidates List | Cosine similarity threshold > 0.88 |
| **ST-07** | Topic Clustering | Deterministic ML | Agglomerative Clustering | Unique Topic Vectors | 5-8 Distinct Clusters | Max 8 clusters per map |
| **ST-08** | Search Intent Classification| Hybrid Rule+AI | Rule Engine + `gpt-4o-mini` | Candidate Topics | Intent (`INFORMATIONAL`, etc.) | High confidence mapping |
| **ST-09** | Priority Scoring | Deterministic Formula| Custom Scoring Engine | Search Signals & Centrality | Score (0-100) & Priority (H/M/L) | Formula-driven, no LLM guess |
| **ST-10** | Hierarchy Construction | AI Reasoning | `gpt-4o-mini` | Clusters + Candidates | Pillar -> Cluster -> Subtopic Tree | Max depth = 3 levels (§13) |
| **ST-11** | Selective Deep Validation | Data API | DataForSEO SERP | Top 5 Pillar Topics | Verified Search Signals | Limited to top priority topics |
| **ST-12** | Internal Link Graph | AI + Graph Rules | `gpt-4o-mini` + DAG Engine | Hierarchy Tree | Directed Link Relationships | 0 cycles, valid parent-child |
| **ST-13** | Quality Gate Check | Deterministic Rules | Quality Audit Engine | Complete Map Data | Pass / Fail + Issue List | 0 orphans, max 50 topics |
| **ST-14** | Database Persistence | Deterministic DB | Supabase Client | Validated Map Data | DB Row IDs (`topics`, `links`) | Transactional insert |

---

## 3. Detailed Stage Specifications & TypeScript Interfaces

### Stage 01 & 02 — Topic Understanding & Sub-dimension Decomposition

- **Purpose**: Deconstruct a broad primary topic into core topical dimensions.
- **Input**: `{ primaryTopic: "Digital Marketing", country: "IN", language: "en" }`
- **Output TypeScript Interface**:
```typescript
export interface TopicUnderstandingResult {
  primaryTopic: string;
  subDimensions: string[]; // E.g. ["SEO", "Content Marketing", "PPC", "Social Media", "Email Marketing"]
  targetAudience: string;
}
```

---

### Stage 05 & 06 — Normalization & Semantic Deduplication

- **Purpose**: Strip redundant variants (e.g. "seo strategy", "SEO Strategies", "strategies for seo") using deterministic string rules + vector embedding cosine similarity.
- **Deduplication Threshold**: `CosineSimilarity(v1, v2) >= 0.88` -> Merge into canonical form.
- **Algorithm**:
```typescript
import { cosineSimilarity } from '@/lib/engine/math';

export function deduplicateTopics(topics: string[], embeddings: number[][]): string[] {
  const uniqueIndices: number[] = [];
  
  for (let i = 0; i < topics.length; i++) {
    let isDuplicate = false;
    for (const j of uniqueIndices) {
      if (cosineSimilarity(embeddings[i], embeddings[j]) >= 0.88) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      uniqueIndices.push(i);
    }
  }
  
  return uniqueIndices.map(i => topics[i]);
}
```

---

### Stage 07 — Topic Clustering (Agglomerative Hierarchical Clustering)

- **Purpose**: Group 30–50 unique topics into 5–8 logical clusters without relying on generic LLM categorization.
- **Method**: Hierarchical Agglomerative Clustering (Wards linkage) on normalized embeddings, bounded by `min_cluster_size = 3` and `max_clusters = 8`.

---

### Stage 10 — Hierarchy Construction Tree (§13)

- **Rule**: Bounded tree with strict max depth = 3.
  - **Level 1**: Pillar Topic (Root)
  - **Level 2**: Cluster Category (Sub-pillar)
  - **Level 3**: Supporting Article / Subtopic

```typescript
export interface TopicTreeNode {
  id: string;
  topic: string;
  cluster: string;
  level: 1 | 2 | 3;
  intent: 'INFORMATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' | 'NAVIGATIONAL';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  children: TopicTreeNode[];
}
```

---

### Stage 13 — Automated Quality Gates (§17)

Before saving to the database, the completed generation payload must pass 10 automated checks. If any critical check fails, the audit engine triggers targeted correction.

```typescript
export interface QualityAuditResult {
  passed: boolean;
  issues: Array<{
    code: 'DUPLICATE_TOPIC' | 'ORPHAN_TOPIC' | 'EXCESSIVE_DEPTH' | 'INVALID_INTENT' | 'EXCEEDED_TOPIC_LIMIT';
    severity: 'CRITICAL' | 'WARNING';
    description: string;
    affectedTopicId?: string;
  }>;
}

export function auditTopicalMap(mapData: TopicalMapPayload): QualityAuditResult {
  const issues: QualityAuditResult['issues'] = [];

  // Check 1: Topic Count Limit (Max 50 for MVP)
  if (mapData.topics.length > 50) {
    issues.push({
      code: 'EXCEEDED_TOPIC_LIMIT',
      severity: 'CRITICAL',
      description: `Generated topic count (${mapData.topics.length}) exceeds MVP ceiling of 50.`,
    });
  }

  // Check 2: Orphan Detection
  const topicIdSet = new Set(mapData.topics.map(t => t.id));
  mapData.topics.forEach(t => {
    if (t.parentTopicId && !topicIdSet.has(t.parentTopicId)) {
      issues.push({
        code: 'ORPHAN_TOPIC',
        severity: 'CRITICAL',
        description: `Topic "${t.topic}" references non-existent parent ID ${t.parentTopicId}.`,
        affectedTopicId: t.id,
      });
    }
  });

  return {
    passed: !issues.some(i => i.severity === 'CRITICAL'),
    issues,
  };
}
```
