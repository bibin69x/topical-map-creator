# DOC-18: Beta Launch Runbook & Operational Checklist

**Status:** Approved for Beta Rollout  
**Author:** AI Agent / Founding Team  
**Date:** 2026-08-31  
**Scope:** 20–50 Initial Beta Users Cohort (§39 & §41 of V1 Blueprint)

---

## 1. Beta Cohort Objectives

The initial beta launch is deliberately constrained to **20–50 real SEO freshers, digital marketing practitioners, and freelancers**.

### Primary Objectives:
1. **Prove Value Demonstration:** Validate that users can turn a niche topic into a coherent, actionable topical authority hierarchy within 3 minutes.
2. **Economic Validation:** Verify that actual per-generation search + AI costs remain strictly below the **₹6.00 hard cap** and fully-loaded paid user cost remains below the **₹99 ceiling** (target ₹30–₹50).
3. **Conversion & Checkout Flow:** Test that early access users are motivated to purchase 10 credits for ₹199 via Razorpay UPI/cards after exhausting their free initial credit.
4. **Output Actionability:** Collect rating and qualitative feedback via the embedded `FeedbackWidget` to ensure no "AI slop" or random keyword stuffing.

---

## 2. Pre-Launch Verification Checklist

Before onboarding the first external beta user, the operator must verify:

| Component | Check | Verification Method | Status |
|-----------|-------|---------------------|--------|
| **Database & Tables** | 11 tables + RLS + triggers | Run `supabase/migrations/20260831_init_ddl.sql` | 🟢 Verified |
| **Auth SSR** | Sign up, login, session cookies | Verify `@supabase/ssr` server/browser clients | 🟢 Verified |
| **Search Data Provider** | DataForSEO / Serper fallback | `DATAFORSEO_API_LOGIN` or fallback active | 🟢 Verified |
| **AI Reasoning Model** | OpenAI gpt-4o-mini structured output | `OPENAI_API_KEY` configured with JSON schema | 🟢 Verified |
| **Payment Gateway** | Razorpay test/live keys | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | 🟢 Verified |
| **Observability** | Health & telemetry endpoints | `GET /api/health` returns status `healthy` | 🟢 Verified |
| **Legal Compliance** | Disclosures published | `/privacy`, `/terms`, `/refund` routes live | 🟢 Verified |
| **Account Deletion** | Statutory cascade deletion | `DELETE /api/user/account` tested & verified | 🟢 Verified |

---

## 3. End-to-End User Journey Walkthrough

```text
[User Invites / Social Outreach]
              ↓
     1. Sign Up (/signup)
        • Free 1-credit initial grant
              ↓
     2. Create Map (/create)
        • Primary topic + optional website URL
              ↓
     3. Asynchronous Pipeline (16 Stages)
        • Research → Clusters → Intent → Priority → Links
              ↓
     4. Results Dashboard (/projects/[id])
        • 6-Tab navigation + FeedbackWidget
              ↓
     5. Free Credit Exhaustion & Upgrade
        • Modal prompts ₹199 Early Access
              ↓
     6. Razorpay Checkout & Webhook Verification
        • Server verifies HMAC-SHA256 → Grants 10 credits
              ↓
     7. CSV / Executive PDF Export Unlocked
```

---

## 4. Operational Monitoring during Beta

During the beta cohort, the engineering/operations team must monitor the `/admin` dashboard at least twice daily:

### Key Performance Indicators (§41):
1. **Activation Rate:** Target > 80% of signups must execute their first generation.
2. **Generation Success Rate:** Target > 95%. Any pipeline failure must automatically trigger a credit refund.
3. **Average Variable Cost / Gen:** Must remain ≤ ₹4.50 (with ₹6.00 hard cap threshold).
4. **Paid Conversion Rate:** Target > 15% from free to ₹199 Early Access.
5. **Satisfaction Rating:** Minimum average 4.0 / 5.0 stars on submitted feedback.

---

## 5. Incident Response & Triage Runbook

### Incident A: Search Provider Outage or Rate Limit
- **Symptom:** Pipeline reports DataForSEO 429 or 503 error.
- **Automated Mitigation:** The engine automatically falls back to secondary Serper/cached search results.
- **Manual Action:** If all external providers fail, the job fails gracefully, credit is automatically refunded to the user, and an audit log is emitted to `/admin`.

### Incident B: Razorpay Webhook Delivery Failure
- **Symptom:** User paid ₹199 on Razorpay, but credits remain 0.
- **Resolution:**
  1. Inspect Razorpay Dashboard Webhook logs for HTTP response.
  2. If signature mismatch: Verify `RAZORPAY_WEBHOOK_SECRET` env variable.
  3. Manual credit sync: If payment is captured in Razorpay, trigger credit top-up via admin console or DB function:
     ```sql
     SELECT grant_paid_credits('<user-uuid>', 10, 'rzp_pay_manual_reconcile');
     ```

### Incident C: Prompt Injection Attempt via Primary Topic
- **Symptom:** Input contains `<script>` or injection patterns.
- **Automated Mitigation:** `sanitizeUserInput()` trims, strips XML delimiters, and neutralizes injection vectors before pipeline execution.
- **Test Coverage:** Verified in `pipeline.test.ts` and `sanitization.test.ts`.

---

## 6. Feedback Triage & Roadmap Transition

All feedback captured via `FeedbackWidget` is visible in `/admin` reviews table:
- **Quality issues:** Route to prompt tuning (`docs/specs/09-prompt-specs.md`) and scoring weight adjustments (`docs/specs/10-priority-scoring.md`).
- **Feature requests:** Strictly evaluate against §44 Founder Rules (reject ChatGPT wrappers, avoid unnecessary complexity, focus on topical authority actionability).
