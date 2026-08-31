# DOC-06: API Contract & Route Specification

**Status**: Draft (Under Review)  
**Created**: 2026-08-31  
**Blocks**: Phase 3 UX Specs (DOC-12), Phase 4 Security (DOC-14)  
**Last Updated**: 2026-08-31  

---

## 1. Executive Summary

This document defines the complete RESTful and Server Action API contract for the Topical Authority Creator MVP.

Key principles enforced across all API routes:
1. **Strict Input Validation**: Every request payload is validated server-side using Zod schemas before processing (§26).
2. **Server-Side Authorization**: Every endpoint verifies session token, resource ownership, and entitlement credits (§25 & §26).
3. **Consistent Error Schema**: All errors return a standardized RFC-7807 JSON error object.
4. **Rate Limiting**: Tiered rate limits enforced at the edge/middleware level (§27).

---

## 2. Standard Request & Error Schemas

### Standard Success Response Wrapper
```typescript
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}
```

### Standard Error Response Schema
```typescript
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;           // E.g., 'INSUFFICIENT_CREDITS', 'UNAUTHORIZED', 'RESOURCE_NOT_FOUND'
    message: string;        // Human-readable summary
    details?: unknown;      // Validation errors field list
    timestamp: string;
  };
}
```

---

## 3. Comprehensive Endpoint Inventory

| Method | Endpoint Route | Auth Tier | Rate Limit Tier | Description |
|--------|----------------|-----------|-----------------|-------------|
| **POST** | `/api/auth/signup` | Public | Strict (5 req/min) | Register new user via email/pass |
| **POST** | `/api/auth/login` | Public | Strict (5 req/min) | Authenticate user & issue session cookie |
| **POST** | `/api/auth/logout` | Authenticated | Standard (20 req/min) | Invalidate session |
| **GET** | `/api/projects` | Authenticated | Standard (60 req/min) | List user's active projects |
| **POST** | `/api/projects` | Authenticated | Standard (20 req/min) | Create a new project |
| **GET** | `/api/projects/:id` | Authenticated | Standard (60 req/min) | Get project details by ID |
| **DELETE** | `/api/projects/:id` | Authenticated | Standard (20 req/min) | Soft delete project |
| **POST** | `/api/generations` | Authenticated | Generation (1 active) | Start async generation for a project |
| **GET** | `/api/generations/:id` | Authenticated | High Polling (120 req/min) | Get generation status & progress state |
| **GET** | `/api/generations/:id/map` | Authenticated | Standard (60 req/min) | Fetch full generated topical map data |
| **GET** | `/api/entitlements` | Authenticated | Standard (60 req/min) | Get user credit balance & plan tier |
| **POST** | `/api/payments/checkout` | Authenticated | Standard (10 req/min) | Create Razorpay order for ₹199 plan |
| **POST** | `/api/payments/webhook` | Webhook Verified | Unlimited / Signature | Razorpay payment webhook handler |
| **GET** | `/api/exports/:id/csv` | Paid Entitled | Export Tier (10 req/min) | Download CSV export of topical map |
| **GET** | `/api/exports/:id/pdf` | Paid Entitled | Export Tier (10 req/min) | Download PDF export of topical map |
| **GET** | `/api/admin/metrics` | Admin Role | Strict Admin | Admin dashboard analytics & economics |

---

## 4. Key Endpoint Specifications

### 4.1 Create Project (`POST /api/projects`)

- **Auth Required**: Yes
- **Request Body (TypeScript/Zod)**:
```typescript
export interface CreateProjectPayload {
  name: string;           // 2-100 chars
  primaryTopic: string;   // 2-150 chars
  websiteUrl?: string;    // Optional valid URL
  country: string;        // 2-letter ISO code (e.g. 'IN')
  language: string;       // 2-letter ISO code (e.g. 'en')
}
```
- **Response (201 Created)**:
```typescript
export interface ProjectResponse {
  id: string;
  name: string;
  primaryTopic: string;
  websiteUrl?: string;
  country: string;
  language: string;
  createdAt: string;
}
```

---

### 4.2 Start Generation (`POST /api/generations`)

- **Auth Required**: Yes (Checks `credits_remaining > 0` for paid or 1-time for free)
- **Request Body**:
```typescript
export interface StartGenerationPayload {
  projectId: string;
}
```
- **Response (202 Accepted)**:
```typescript
export interface StartGenerationResponse {
  generationId: string;
  projectId: string;
  status: 'QUEUED';
  creditDeducted: number;
  creditsRemaining: number;
  startedAt: string;
}
```
- **Error Responses**:
  - `402 Payment Required`: `{ code: "INSUFFICIENT_CREDITS", message: "You have 0 credits. Upgrade for ₹199 to get 10 credits." }`
  - `409 Conflict`: `{ code: "CONCURRENT_GENERATION_LIMIT", message: "You already have an active generation in progress." }`

---

### 4.3 Generation Status (`GET /api/generations/:id`)

- **Auth Required**: Yes
- **Response (200 OK)**:
```typescript
export interface GenerationStatusResponse {
  generationId: string;
  projectId: string;
  status: 'QUEUED' | 'RESEARCHING' | 'EXPANDING_TOPICS' | 'CLUSTERING' | 'ANALYZING_INTENT' | 'PRIORITIZING' | 'BUILDING_MAP' | 'COMPLETED' | 'FAILED';
  progressPercentage: number;
  startedAt: string;
  completedAt?: string;
  errorCode?: string;
}
```

---

### 4.4 Full Topical Map Output (`GET /api/generations/:id/map`)

- **Auth Required**: Yes
- **Response (200 OK)**:
```typescript
export interface TopicalMapOutput {
  generationId: string;
  primaryTopic: string;
  summary: {
    totalTopics: number;
    totalClusters: number;
    highPriorityCount: number;
    intentDistribution: Record<'INFORMATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' | 'NAVIGATIONAL', number>;
  };
  topics: Array<{
    id: string;
    topic: string;
    parentTopicId: string | null;
    cluster: string;
    intent: 'INFORMATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' | 'NAVIGATIONAL';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    position: number;
  }>;
  internalLinks: Array<{
    id: string;
    sourceTopicId: string;
    targetTopicId: string;
    relationshipType: 'PARENT_CHILD' | 'RELATED_TOPIC' | 'SUPPORTING_TO_PILLAR';
  }>;
}
```

---

### 4.5 Payment Webhook (`POST /api/payments/webhook`)

- **Auth Required**: Verified Razorpay Signature (`X-Razorpay-Signature`)
- **Behavior**:
  1. Validates webhook HMAC signature against `RAZORPAY_WEBHOOK_SECRET`.
  2. Extracts `payment_id`, `order_id`, `amount`, `user_id`.
  3. Begins database transaction:
     - Updates `payments` table status to `SUCCESS`.
     - Upserts `entitlements` table: sets `plan = 'paid_early_access'` and adds `10` credits to `credits_total`.
  4. Returns `200 OK`.
