# DOC-09: Prompt Engineering Specification

**Status**: Draft (Under Review)  
**Created**: 2026-08-31  
**Blocks**: DOC-11 (Budget Enforcement) & Phase 3 UX Specs  
**Last Updated**: 2026-08-31  

---

## 1. Executive Summary

This document specifies the exact system prompts, user prompt templates, model routing parameters, input/output schemas, and Zod validation rules for all LLM operations within the **Topical Authority Engine**.

Per [PROJECT_CONTEXT.md §34 (AI Governance)](file:///d:/Gravity%20Projects/topical-map-creator/docs/PROJECT_CONTEXT.md):
- Every AI operation is task-specific with strict JSON output schemas.
- Outputs must be validated server-side using Zod before storing or rendering.
- No generic chat interface or open-ended prompts.

---

## 2. Prompt Inventory Overview

| Prompt ID | Target Pipeline Stage | Model | Temp | Max Tokens | Response Format | Est. Cost / Call |
|-----------|-----------------------|-------|------|------------|-----------------|------------------|
| **PE-01** | `ST-02`: Topic Understanding | `gpt-4o-mini` | 0.2 | 500 | `json_object` | ~₹0.021 |
| **PE-02** | `ST-08`: Ambiguous Intent Classification | `gpt-4o-mini` | 0.1 | 800 | `json_object` | ~₹0.025 |
| **PE-03** | `ST-10`: Hierarchy & Taxonomy Builder | `gpt-4o-mini` | 0.3 | 1,500 | `json_object` | ~₹0.059 |
| **PE-04** | `ST-12`: Internal Linking Graph Builder | `gpt-4o-mini` | 0.2 | 1,200 | `json_object` | ~₹0.049 |

---

## 3. Detailed Prompt Specifications

### 3.1 PE-01: Topic Understanding & Sub-niche Decomposition (`ST-02`)

- **Model**: `gpt-4o-mini`
- **Temperature**: `0.2`
- **Max Output Tokens**: `500`

#### System Prompt
```text
You are a senior SEO strategist and topical authority architect.
Your task is to analyze a primary topic and break it down into 4 to 6 core sub-dimensions (pillar angles) that an SEO professional must cover to establish complete topical authority.

STRICT REQUIREMENTS:
1. Output valid JSON ONLY.
2. Do not include markdown codeblocks or conversational text.
3. Sub-dimensions must be distinct, non-overlapping, and actionable SEO topic categories.
```

#### User Prompt Template
```text
Primary Topic: "{{primaryTopic}}"
Target Country: "{{country}}"
Target Language: "{{language}}"

Return JSON in this exact structure:
{
  "primaryTopic": "{{primaryTopic}}",
  "subDimensions": [
    "Sub-dimension 1",
    "Sub-dimension 2",
    "Sub-dimension 3",
    "Sub-dimension 4"
  ],
  "targetAudience": "Brief target persona summary"
}
```

#### Zod Validation Schema
```typescript
import { z } from 'zod';

export const TopicUnderstandingSchema = z.object({
  primaryTopic: z.string().min(2),
  subDimensions: z.array(z.string()).min(3).max(6),
  targetAudience: z.string(),
});
```

---

### 3.2 PE-03: Hierarchy & Taxonomy Builder (`ST-10`)

- **Model**: `gpt-4o-mini`
- **Temperature**: `0.3`
- **Max Output Tokens**: `1,500`

#### System Prompt
```text
You are an expert SEO content taxonomy architect.
Given a primary topic and a list of unique candidate keywords, construct a 3-level topical hierarchy tree.

LEVEL DEFINITIONS:
- Level 1: Primary Pillar Topic (Root)
- Level 2: Sub-pillars / Cluster Categories (5 to 8 clusters)
- Level 3: Supporting Topics (Articles underneath each cluster)

RULES:
1. Every candidate topic must be mapped to exactly one cluster category.
2. Do NOT invent random keywords outside the provided candidates.
3. Ensure no orphan topics exist.
4. Output strictly formatted JSON matching the requested schema.
```

#### User Prompt Template
```text
Primary Topic: "{{primaryTopic}}"

Clusters:
{{clusterListJson}}

Candidate Keywords:
{{candidateKeywordsJson}}

Output JSON format:
{
  "primaryTopic": "{{primaryTopic}}",
  "clusters": [
    {
      "clusterName": "Category Name",
      "supportingTopics": [
        "Keyword 1",
        "Keyword 2"
      ]
    }
  ]
}
```

#### Zod Validation Schema
```typescript
export const HierarchyOutputSchema = z.object({
  primaryTopic: z.string(),
  clusters: z.array(
    z.object({
      clusterName: z.string(),
      supportingTopics: z.array(z.string()).min(1),
    })
  ).min(3).max(8),
});
```

---

### 3.3 PE-04: Internal Linking Graph Builder (`ST-12`)

- **Model**: `gpt-4o-mini`
- **Temperature**: `0.2`
- **Max Output Tokens**: `1,200`

#### System Prompt
```text
You are an SEO internal linking specialist.
Analyze the provided topical hierarchy and generate logical internal link relationship suggestions.

RELATIONSHIP TYPES:
- PARENT_CHILD: Supporting article links up to its parent Cluster Category or Pillar Topic.
- SUPPORTING_TO_PILLAR: High-priority supporting topic links directly to the root Pillar page.
- RELATED_TOPIC: Supporting topic links horizontally to a contextually relevant supporting topic in the same or adjacent cluster.

RULES:
1. Output valid JSON array ONLY.
2. Do NOT create self-referencing links (source == target).
3. Do NOT create circular link loops.
```

#### User Prompt Template
```text
Hierarchy Data:
{{hierarchyDataJson}}

Output JSON format:
{
  "internalLinks": [
    {
      "sourceTopic": "Topic A",
      "targetTopic": "Topic B",
      "relationshipType": "PARENT_CHILD" | "SUPPORTING_TO_PILLAR" | "RELATED_TOPIC"
    }
  ]
}
```

#### Zod Validation Schema
```typescript
export const InternalLinkOutputSchema = z.object({
  internalLinks: z.array(
    z.object({
      sourceTopic: z.string(),
      targetTopic: z.string(),
      relationshipType: z.enum(['PARENT_CHILD', 'SUPPORTING_TO_PILLAR', 'RELATED_TOPIC']),
    })
  ).min(5),
});
```

---

## 4. Execution & Error Handling Pipeline

```typescript
import { OpenAI } from 'openai';
import { z } from 'zod';

export async function executeStructuredPrompt<T>(params: {
  openai: OpenAI;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodSchema<T>;
  maxTokens: number;
  temperature: number;
}): Promise<T> {
  const response = await params.openai.chat.completions.create({
    model: params.model,
    temperature: params.temperature,
    max_tokens: params.maxTokens,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: params.systemPrompt },
      { role: 'user', content: params.userPrompt },
    ],
  });

  const rawJson = response.choices[0]?.message?.content;
  if (!rawJson) {
    throw new Error('LLM returned empty output');
  }

  const parsed = JSON.parse(rawJson);
  // Strict Zod schema validation
  return params.schema.parse(parsed);
}
```
