# DOC-17: Backup & Disaster Recovery Strategy

**Status**: Approved (Production Ready)  
**Created**: 2026-08-31  
**Fulfills**: Definition of Done §40 (*Backup/recovery strategy exists*)  
**Last Updated**: 2026-08-31  

---

## 1. Executive Summary

This document formalizes the backup architecture, point-in-time recovery (PITR) procedures, disaster recovery runbooks, and statutory financial data retention protocols for the Topical Authority Creator MVP.

Per [PROJECT_CONTEXT.md §24 & §40](file:///d:/Gravity%20Projects/topical-map-creator/docs/PROJECT_CONTEXT.md):
- **Continuous WAL Archiving**: Zero user data loss via Supabase continuous Write-Ahead Log (WAL) archiving.
- **Statutory Compliance**: Preserves transaction logs for 8 years under the Indian Companies Act 2013 and Central Goods & Services Tax (CGST) Act 2017.
- **Provider Resilience**: Automatic deterministic engine fallback if DataForSEO or OpenAI APIs experience outages.

---

## 2. Recovery Objectives

| Metric | Target | Rationale |
|--------|--------|-----------|
| **RPO (Recovery Point Objective)** | **< 5 minutes** | Continuous WAL streaming captures database transactions almost instantaneously. |
| **RTO (Recovery Time Objective)** | **< 60 minutes** | Instant rollback via Supabase snapshot restore or scripted PostgreSQL restore. |
| **Data Redundancy** | **Multi-AZ Replication** | Primary database replicated across availability zones in AWS ap-south-1 (Mumbai). |

---

## 3. Automated Backup Architecture

```mermaid
flowchart TD
    subgraph Primary Production [Supabase PostgreSQL (Mumbai)]
        ActiveDB[(Primary Database)]
        WAL[Continuous WAL Archiving]
    end

    subgraph Cold Storage [Encrypted Backup S3]
        DailySnap[Daily Snapshot (02:00 IST)]
        WeeklyArchive[Weekly Archive (Sun 03:00 IST)]
    end

    ActiveDB -->|Every Transaction| WAL
    ActiveDB -->|Automated Cron| DailySnap
    DailySnap -->|Rollup| WeeklyArchive

    subgraph Restoration Paths
        WAL -.->|PITR Restore to exact minute| StandbyDB[(Restored Instance)]
        DailySnap -.->|Full Baseline Restore| StandbyDB
    end
```

### 3.1 Backup Retention Schedule
- **Continuous WAL**: Retained for 7 days (allows restoration to any second within the past 168 hours).
- **Daily Snapshots**: Automated snapshot at 02:00 IST every night, retained for 30 days.
- **Monthly Rollups**: First snapshot of every calendar month, retained for 12 months.

---

## 4. Statutory Financial Record Retention (India GST & Companies Act)

Under **Section 128 of the Indian Companies Act 2013** and **Section 36 of the CGST Act 2017**:
- All payment transactions, order IDs, invoice metadata, and tax calculation records must be preserved for **not less than 8 years** from the end of the relevant financial year.
- **Account Deletion Safeguard**: When a user exercises their right to be forgotten (`DELETE /api/user/account`), their personal identification (name, email) and projects are deleted, while their payment audit record in the `payments` table has `user_id` set to `NULL` to preserve transaction IDs, Razorpay order IDs, and GST accounting integrity per DOC-16.

---

## 5. Disaster Recovery Runbook

### Step 1: Incident Assessment & Triage
1. Check `/api/health` and `/api/admin/metrics` to identify error codes and failure scope.
2. Determine whether the incident is a database corruption, migration failure, or external provider outage.

### Step 2: Database Point-in-Time Recovery (PITR)
If data corruption occurred at timestamp `T`:
1. Log in to the Supabase Cloud Management Console.
2. Select the Production Project (`aybxbtpzlrwmdnahwqlh`).
3. Navigate to **Database > Backups > Point in Time Recovery**.
4. Select target recovery timestamp `T - 2 minutes`.
5. Execute restore onto a clone instance or target branch.
6. Verify table counts:
   ```sql
   SELECT count(*) FROM users_profile;
   SELECT count(*) FROM entitlements;
   SELECT count(*) FROM projects;
   ```

### Step 3: Application Failover & Vercel Edge Redeployment
1. If database connection strings change, update `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel Project Settings.
2. Trigger an immediate edge deployment:
   ```bash
   vercel --prod
   ```
3. Run `npm test` and verify `/api/health` returns `200 OK` with status `HEALTHY`.

---

## 6. External Provider Outage Fallback Protocol

If an external research or AI vendor suffers an outage:
- **DataForSEO Outage**: The `DataForSEOProvider` detects non-200 responses or timeout errors and automatically activates high-quality deterministic seed keyword expansion without halting user generations.
- **OpenAI API Outage**: The `AIRouter` catches API exceptions or rate limits and engages deterministic clustering and intent classification heuristics.
- **Zero Cost Leakage**: If an engine execution completely fails, the PL/pgSQL transaction aborts and the user's credit is refunded immediately.
