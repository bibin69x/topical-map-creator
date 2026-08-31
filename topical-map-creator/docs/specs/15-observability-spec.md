# DOC-15: Observability & Monitoring Spec

**Status**: Draft (Under Review)  
**Created**: 2026-08-31  
**Blocks**: Phase 5 Launch Readiness  
**Last Updated**: 2026-08-31  

---

## 1. Executive Summary

This document specifies the telemetry, error tracking, product analytics, economic metric dashboards, and health monitoring for the Topical Authority Creator MVP.

Per [PROJECT_CONTEXT.md §35 & §36](file:///d:/Gravity%20Projects/topical-map-creator/docs/PROJECT_CONTEXT.md):
- **Track day-one economics**: Every generation's cost (AI + Search) must be logged and monitored.
- **Admin Dashboard**: Expose real-time product, engineering, and unit economics metrics.

---

## 2. Telemetry & Monitoring Stack

| Category | Service / Tool | Purpose | Key Events / Alerts |
|----------|----------------|---------|---------------------|
| **Error Tracking** | **Sentry** | Unhandled exceptions in Next.js Server Actions, Edge, and Background Jobs | Alert if generation failure rate > 5% in 1 hour |
| **Log Management** | **Axiom / Vercel Logs** | Structured JSON logs for all API requests & engine stages | Log `generationId`, `userId`, `durationMs`, `costInr` |
| **Product Analytics** | **PostHog (Self-Hosted/Cloud)** | Privacy-first event tracking for funnel conversion | `signup`, `first_generation_started`, `upgrade_clicked`, `payment_success` |
| **Economic Monitoring** | **PostgreSQL `generation_costs`** | Database queries for cost tracking vs ₹99 ceiling | Alert if avg cost per generation > ₹6.00 |

---

## 3. Critical Product & Engineering Metrics (§35)

### 3.1 Product & Business Metrics
- **Activation Rate**: `(Users with >= 1 completed generation) / (Total Signups)`
- **Free-to-Paid Conversion**: `(Paid Users) / (Total Signups)`
- **Credit Utilization**: Average credits consumed per paid user (Target: ~6–7 out of 10)
- **Refund Rate**: `(Refunded Payments) / (Total Payments)` (Target: < 2%)

### 3.2 Engineering & Operational Metrics
- **Generation Success Rate**: `(Completed Generations) / (Total Generations Started)` (Target: > 98%)
- **Pipeline Latency**: P50 and P95 execution duration (Target: < 180 seconds)
- **External Provider Error Rate**: DataForSEO and OpenAI HTTP failure count

---

## 4. Admin Dashboard Data Queries (§36)

The internal admin dashboard (`/admin`) queries PostgreSQL directly:

```sql
-- Admin Summary Query: Unit Economics & Usage (Today & All-Time)
SELECT 
    COUNT(DISTINCT u.id) AS total_users,
    COUNT(DISTINCT CASE WHEN e.plan = 'paid_early_access' THEN u.id END) AS paid_users,
    COUNT(DISTINCT CASE WHEN e.plan = 'free' THEN u.id END) AS free_users,
    COUNT(g.id) AS total_generations,
    COUNT(CASE WHEN g.status = 'COMPLETED' THEN 1 END) AS successful_generations,
    COUNT(CASE WHEN g.status = 'FAILED' THEN 1 END) AS failed_generations,
    ROUND(AVG(gc.total_cost_inr), 2) AS avg_cost_per_generation_inr,
    ROUND(SUM(gc.total_cost_inr), 2) AS total_variable_spend_inr,
    ROUND(SUM(p.amount_inr), 2) AS total_gross_revenue_inr
FROM auth.users u
LEFT JOIN entitlements e ON u.id = e.user_id
LEFT JOIN generations g ON u.id = g.user_id
LEFT JOIN generation_costs gc ON g.id = gc.generation_id
LEFT JOIN payments p ON u.id = p.user_id AND p.status = 'SUCCESS';
```
