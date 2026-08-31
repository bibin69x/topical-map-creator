# DOC-11: Generation Budget & Cost Control Spec

**Status**: Draft (Under Review)  
**Created**: 2026-08-31  
**Blocks**: Phase 3 Specs & Phase 4 Ops  
**Last Updated**: 2026-08-31  

---

## 1. Executive Summary

This document specifies the backend cost enforcement mechanisms, resource limits, and transaction safety rules for generation jobs.

Per [PROJECT_CONTEXT.md §7 & §29 (Cost Security)](file:///d:/Gravity%20Projects/topical-map-creator/docs/PROJECT_CONTEXT.md):
- **NON-NEGOTIABLE**: The LLM must NEVER be allowed to dynamically trigger unlimited external API calls or recursive generation.
- Every generation job runs inside a hard-capped budget sandbox.
- Infrastructure failures automatically trigger transactional credit restoration (§31).

---

## 2. Hard Budget Cap Parameters (Per Generation Job)

| Resource Metric | Soft Limit (Warning) | Hard Cap (Abort Trigger) | Action on Breach |
|-----------------|----------------------|--------------------------|------------------|
| **External SERP/Keyword API Calls** | 20 calls | **25 calls** | Halt external requests; proceed with cached data |
| **LLM Reasoning Calls** | 5 calls | **7 calls** | Halt LLM processing; run deterministic fallback |
| **Total LLM Input Tokens** | 8,000 tokens | **12,000 tokens** | Truncate prompt context |
| **Total LLM Output Tokens** | 3,500 tokens | **5,000 tokens** | Enforce strict max_tokens |
| **Raw Candidate Topics** | 120 topics | **150 topics** | Truncate candidates before clustering |
| **Final Output Topics** | 45 topics | **50 topics** | Slice topics by priority score |
| **Job Execution Duration** | 180 seconds | **240 seconds (4 min)** | Timeout job, set status = FAILED |
| **Estimated Variable Cost** | ₹4.50 | **₹6.00** | Abort expensive steps |

---

## 3. Backend Budget Manager Interface (`lib/engine/budget.ts`)

```typescript
export interface GenerationBudgetTracker {
  generationId: string;
  externalApiCount: number;
  llmCallCount: number;
  inputTokens: number;
  outputTokens: number;
  startedAt: number;
  accumulatedCostInr: number;
}

export class BudgetExceededError extends Error {
  constructor(public metric: string, public limit: number, public current: number) {
    super(`Generation budget breached: ${metric} reached ${current} (limit: ${limit})`);
    this.name = 'BudgetExceededError';
  }
}

export function checkBudgetGuardrails(tracker: GenerationBudgetTracker): void {
  if (tracker.externalApiCount > 25) {
    throw new BudgetExceededError('External API Requests', 25, tracker.externalApiCount);
  }
  if (tracker.llmCallCount > 7) {
    throw new BudgetExceededError('LLM Calls', 7, tracker.llmCallCount);
  }
  if (tracker.inputTokens + tracker.outputTokens > 17000) {
    throw new BudgetExceededError('Total Tokens', 17000, tracker.inputTokens + tracker.outputTokens);
  }
  if (tracker.accumulatedCostInr > 6.00) {
    throw new BudgetExceededError('Generation Cost (INR)', 6.00, tracker.accumulatedCostInr);
  }
  
  const elapsedSec = (Date.now() - tracker.startedAt) / 1000;
  if (elapsedSec > 240) {
    throw new BudgetExceededError('Execution Time (sec)', 240, elapsedSec);
  }
}
```

---

## 4. Transactional Credit Restoration & Failure Handling (§31)

If a generation job fails due to an unhandled system error, API timeout, or infrastructure exception:
1. Mark `generations.status = 'FAILED'` with `error_code`.
2. **Transactionally restore 1 credit** to the user's `entitlements` record.
3. Write an audit log entry.

```sql
CREATE OR REPLACE FUNCTION restore_failed_generation_credit(
    p_generation_id UUID,
    p_error_code TEXT,
    p_error_message TEXT
) RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_status generation_status_enum;
BEGIN
    -- Get user and status
    SELECT user_id, status INTO v_user_id, v_status
    FROM generations WHERE id = p_generation_id FOR UPDATE;

    IF v_status <> 'COMPLETED' AND v_status <> 'FAILED' THEN
        -- 1. Update status to FAILED
        UPDATE generations
        SET status = 'FAILED',
            error_code = p_error_code,
            error_message = p_error_message,
            completed_at = NOW()
        WHERE id = p_generation_id;

        -- 2. Restore 1 credit to user entitlement
        UPDATE entitlements
        SET credits_used = GREATEST(0, credits_used - 1),
            updated_at = NOW()
        WHERE user_id = v_user_id;

        -- 3. Log usage event
        INSERT INTO usage_events (user_id, event_type, resource_id, metadata)
        VALUES (
            v_user_id,
            'CREDIT_REFUNDED_SYSTEM_FAILURE',
            p_generation_id,
            jsonb_build_object('error_code', p_error_code, 'message', p_error_message)
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. End-of-Job Cost Audit Logging

Upon successful generation completion, the worker inserts a record into `generation_costs`:

```typescript
export async function recordGenerationCost(params: {
  generationId: string;
  aiCostInr: number;
  searchCostInr: number;
  inputTokens: number;
  outputTokens: number;
  externalRequests: number;
}): Promise<void> {
  const supabase = createAdminServerClient();
  const totalCostInr = params.aiCostInr + params.searchCostInr + 0.35; // 0.35 INR storage/compute allocation

  await supabase.from('generation_costs').insert({
    generation_id: params.generationId,
    ai_cost_inr: params.aiCostInr,
    search_cost_inr: params.searchCostInr,
    infrastructure_cost_inr: 0.35,
    total_cost_inr: totalCostInr,
    input_tokens: params.inputTokens,
    output_tokens: params.outputTokens,
    external_requests: params.externalRequests,
  });
}
```
