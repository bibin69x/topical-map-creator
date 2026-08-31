# PROJECT_CONTEXT.md
# Topical Authority Creator — MVP Source of Truth

Version: 1.0
Status: MVP Build Context
Initial Market: India
Launch Price: ₹199 Early Access
Initial Goal: 10,000 paying customers

---

## 1. What We Are Building

Topical Authority Creator is an affordable SEO software product for:

- SEO freshers
- Digital marketing freshers
- Freelancers
- Small SEO/digital marketing practitioners

The product helps users create an actionable Topical Authority Map for a topic and optionally a website.

The core output includes:

- topic hierarchy
- topic clusters
- supporting topics
- search intent
- topic priority
- internal-linking relationships
- exportable content strategy

Core promise:

> Build topical authority without expensive SEO software.

The first product is intentionally narrow. We are NOT building a complete SEO platform in MVP.

---

## 2. Founder/Product Principles — NON-NEGOTIABLE

### We are NOT building a ChatGPT wrapper.

The product must not simply send a user prompt to an LLM and display the response.

The core architecture is:

DATA → SEO LOGIC → AI REASONING → VALIDATION → FINAL OUTPUT

Never:

USER → LLM → TOPICAL MAP

AI is a component of the product, not the product itself.

### Use the cheapest reliable method

Prefer:

1. deterministic application code
2. embeddings/similarity where useful
3. inexpensive AI models
4. stronger AI models only where they materially improve quality

Use AI for semantic reasoning, ambiguity, classification, contextual interpretation and useful explanations.

Use deterministic code for tasks such as:

- normalization
- deduplication
- limits
- scoring calculations
- hierarchy constraints
- usage/credit enforcement
- rate limiting
- authorization
- cost controls
- validation

### Quality over volume

Do not optimize for hundreds of random keywords.

The goal is:

> A coherent, actionable topical authority structure that an SEO professional can actually execute.

### Affordable does not mean low quality

The customer should feel:

> This is surprisingly good for ₹199.

---

## 3. Anti-AI-Slop UI Rules — NON-NEGOTIABLE

The product should feel like serious professional SEO software.

Avoid:

- excessive gradients
- glowing effects
- AI robots/brains
- decorative AI imagery
- meaningless “AI-powered” labels
- excessive rounded cards
- dashboard card overload
- unnecessary animations
- chat-first interfaces
- giant empty spaces
- visual decoration without functional purpose

Prioritize:

1. clarity
2. hierarchy
3. information density without clutter
4. fast comprehension
5. useful interaction
6. consistency
7. accessibility
8. responsive behavior

The topical map and SEO insights are the visual centerpiece.

The UI should answer:

> What should I create?
> Why should I create it?
> How does it connect to the rest of my site?
> What should I do first?

---

## 4. Business Model

### Launch Offer

₹199 Early Access.

Customer-facing value:

> 10 Topical Authority Projects

Internally:

> 1 completed project generation = 1 generation credit.

Paid entitlement:

- 10 generation credits
- project saving
- topic clustering
- search intent
- priority scoring
- internal-link suggestions
- CSV export
- PDF export

No API access.
No bulk generation.
No unlimited generation.

### Why credits

Credits provide predictable:

- AI cost
- SEO data cost
- infrastructure usage
- abuse protection
- future pricing flexibility

---

## 5. Free Plan

The free plan must demonstrate real value.

Free user receives:

- 1 project
- 1 complete topical map
- approximately 30–50 topics initially
- basic clustering
- basic intent

Free limitations:

- 1 generation
- no PDF export
- no CSV export
- no advanced internal-linking view
- no regeneration
- limited project history

Post-generation conversion message:

> Your topical map is ready. Unlock 9 more maps + exports for ₹199.

Do not make the free product intentionally useless.

---

## 6. Hard Economics Constraint — NON-NEGOTIABLE

Customer price:

₹199

Absolute maximum fully-loaded variable cost per paying customer:

₹99

Minimum target contribution:

₹100

Preferred target cost:

₹30–₹50 per paid customer

Warning zone:

₹50–₹75

Optimization required:

₹75–₹99

Absolute ceiling:

₹99

₹99 is the maximum allowable cost, NOT the target.

We should design the engine to target ₹30–₹50 average fully-loaded variable cost.

The ₹99 ceiling includes everything variable/usage-dependent, not just AI:

- AI/model costs
- SEO/search data
- hosting/infrastructure allocation
- database usage
- storage
- email
- payment processing
- monitoring
- abuse/fraud allowance
- refunds
- other usage-dependent costs

Fixed infrastructure costs must also be monitored separately.

---

## 7. Generation Cost Control — NON-NEGOTIABLE

Every generation has an internal complexity and cost budget.

The backend must enforce:

- maximum candidate topics
- maximum final topics
- maximum external data calls
- maximum AI calls/tokens
- maximum processing time
- maximum output size
- maximum estimated generation cost

The LLM must NEVER be allowed to dynamically create unlimited additional API calls.

Every external API operation is controlled by backend limits.

If a generation exceeds its budget:

- stop unnecessary processing
- mark generation appropriately
- do not allow runaway spending
- refund the customer's credit when failure is caused by our infrastructure

A successfully completed generation consumes its credit.

---

## 8. Research Strategy

Do NOT deeply research every candidate topic.

Use a funnel:

Primary Topic
↓
Cheap Topic Expansion
↓
Candidate Topics
↓
Normalization
↓
Deduplication
↓
Semantic Clustering
↓
Candidate Scoring
↓
Selective Deep Research
↓
Final Topic Selection
↓
AI Reasoning
↓
Validation
↓
Final Topical Map

Research budget should follow importance.

The objective is:

> Maximum SEO quality per rupee spent.

---

## 9. Research Budget

Each generation has an internal research budget controlling:

- number of external search requests
- search depth
- AI calls
- token usage
- candidate topics
- final topics
- processing time

Do not maximize API calls just because budget remains.

Make the fewest calls necessary to produce a high-quality result.

---

## 10. Research Caching

Where legally and contractually permitted, cache reusable public/search-derived research.

Before making an external research request:

1. Check cache.
2. Reuse sufficiently fresh data.
3. Call external provider only when needed.

Cache should consider relevant dimensions such as:

- query
- country
- language
- provider
- search configuration
- timestamp/freshness

User-private project data must NEVER be mixed into shared research/cache data.

Never expose one user's private project information to another user.

---

## 11. Topical Authority Engine

The engine is the core intellectual property of the product.

Required pipeline:

Primary Topic
↓
Topic Understanding
↓
Candidate Topic Expansion
↓
External SEO/Search Evidence
↓
Normalization
↓
Deduplication
↓
Semantic Similarity
↓
Topic Clustering
↓
Search Intent Classification
↓
Topic Relationship Analysis
↓
Priority Scoring
↓
Selective Deep Validation
↓
Topical Hierarchy
↓
Internal Linking Graph
↓
Automated Quality Checks
↓
Final Topical Authority Map

The engine should use the cheapest reliable method for each stage.

---

## 12. Evidence and Confidence

The system should distinguish between:

1. data-backed observations
2. algorithmically derived relationships
3. AI-inferred relationships

Do not present an AI inference as confirmed search data.

Where practical, important recommendations should have a confidence score or explanation.

---

## 13. Topic Hierarchy

The output should distinguish between:

- pillar topics
- cluster topics
- supporting topics

Example:

Digital Marketing
│
├── SEO
│   ├── Keyword Research
│   ├── On-Page SEO
│   ├── Technical SEO
│   ├── Local SEO
│   └── Link Building
│
├── Content Marketing
│   ├── Content Strategy
│   ├── Blog Writing
│   └── Content Distribution
│
└── Social Media Marketing
    ├── Instagram Marketing
    ├── LinkedIn Marketing
    └── Facebook Marketing

The hierarchy must be validated rather than blindly generated by an LLM.

---

## 14. Search Intent

Initial intent categories:

- Informational
- Commercial
- Transactional
- Navigational

Where confidence is low, do not pretend certainty.

Intent should be determined using evidence and/or defined logic, not arbitrary LLM output alone.

---

## 15. Priority Scoring

Priority must NOT be selected purely by the LLM.

Priority should be calculated using a defined scoring framework.

Potential signals:

- search evidence
- topic importance
- cluster position
- business relevance
- intent
- topical centrality
- relationship to pillar topic
- available data confidence

Initial UI categories:

- High
- Medium
- Low

The backend should store the underlying score/signals where practical.

---

## 16. Internal Linking

V1 should provide logical relationship suggestions.

Examples:

SEO
↓
Keyword Research

SEO
↓
Technical SEO

Technical SEO
↓
Crawlability

Technical SEO
↓
Indexing

Relationship types should include:

- parent → child
- related topic
- supporting article → pillar

The purpose is to turn the map into an execution plan, not merely a keyword list.

---

## 17. Automated Quality Gates

Every completed generation must pass automated validation.

Minimum checks:

- duplicate-topic detection
- malformed topic detection
- empty/invalid clusters
- hierarchy consistency
- orphan detection
- excessive topic similarity
- intent validation
- topic-count limits
- output schema validation
- internal-link consistency

If a section fails, attempt targeted correction rather than blindly regenerating the entire project.

---

## 18. Product Workflow

Landing Page
↓
Sign Up
↓
Free Generation
↓
Create Topical Map
↓
Research + Analysis
↓
Results
↓
Value Demonstration
↓
₹199 Upgrade
↓
Payment
↓
Verified Webhook
↓
10 Generation Credits
↓
Create Additional Projects

---

## 19. Core User Flow

### Step 1 — Account

Supported:

- email/password
- optional Google authentication

Use managed authentication. Do not implement password security ourselves.

### Step 2 — Create Project

Inputs:

- Primary Topic
- Website URL — optional
- Target Country
- Language

### Step 3 — Generate

User clicks:

> Generate Topical Map

Generation is asynchronous.

States:

QUEUED
↓
RESEARCHING
↓
EXPANDING TOPICS
↓
CLUSTERING
↓
ANALYZING INTENT
↓
PRIORITIZING
↓
BUILDING MAP
↓
COMPLETED

---

## 20. Results UX

Primary navigation:

Overview | Topics | Clusters | Intent | Internal Links | Export

### Overview

Display:

- primary topic
- total topics
- clusters
- high-priority topics
- intent distribution
- project status

### Topics

Table fields:

- Topic
- Cluster
- Intent
- Priority

Interactions:

- search
- filter
- sort
- expand cluster

### Clusters

Visual hierarchy of topic groups.

### Intent

Clear intent distribution.

### Internal Links

Graph/tree representation showing relationships.

### Export

V1:

- CSV
- PDF

---

## 21. UI Structure

### Marketing Site

Hero:

> Build Topical Authority Without Expensive SEO Tools

Supporting message:

> Generate structured topic clusters, search intent, priorities and internal-linking opportunities in minutes.

Primary CTA:

> Create My Topical Map

Launch price:

> ₹199 Early Access

### Dashboard

Sidebar:

- Dashboard
- Projects
- Create Map
- Settings

Header:

- credits remaining

### Create Map

Fields:

- Primary topic
- Website URL
- Country
- Language

CTA:

> Generate Topical Map

---

## 22. Technical Stack

### Frontend

Next.js + TypeScript

### UI

Tailwind CSS + shadcn/ui

### Database

PostgreSQL, preferably through Supabase for MVP.

### Authentication

Supabase Auth or equivalent managed authentication.

### Backend

Next.js server-side APIs/server actions initially.

Do NOT introduce microservices in MVP.

### Background Processing

Generation must be asynchronous.

Use a managed background-job/queue mechanism initially.

If workload requires it later:

API
↓
Queue
↓
Worker
↓
Generation Engine

### Storage

Object storage for:

- generated PDFs
- temporary export files

Do not store large generated artifacts directly in database rows.

---

## 23. High-Level Architecture

User
↓
Next.js Frontend
↓
API Layer
↓
Auth + Entitlements + Rate Limits
↓
Generation Service
↓
Research Layer + SEO Logic + AI
↓
Validation
↓
Database / Storage
↓
Final Map
↓
User

The architecture should remain modular enough that the research provider, AI model, or queue can be replaced later without rewriting the entire product.

---

## 24. Database Model

Initial tables:

### profiles

- id
- user_id
- name
- created_at
- updated_at

### projects

- id
- user_id
- name
- primary_topic
- website_url
- country
- language
- created_at
- updated_at
- deleted_at

### generations

- id
- project_id
- user_id
- status
- credit_cost
- model_usage
- estimated_cost
- started_at
- completed_at
- error_code

### topics

- id
- generation_id
- parent_topic_id
- topic
- cluster
- intent
- priority
- position

### internal_links

- id
- generation_id
- source_topic_id
- target_topic_id
- relationship_type

### entitlements

- id
- user_id
- plan
- credits_total
- credits_used
- expires_at
- created_at

### payments

- id
- user_id
- provider
- provider_payment_id
- amount
- currency
- status
- created_at

### usage_events

- id
- user_id
- event_type
- resource_id
- metadata
- created_at

### audit_logs

- id
- user_id
- event_type
- metadata
- created_at

### research_cache

- id
- cache_key
- query
- country
- language
- provider
- data
- data_hash
- created_at
- expires_at

### generation_costs

- id
- generation_id
- ai_cost
- search_cost
- infrastructure_cost
- storage_cost
- total_cost
- input_tokens
- output_tokens
- external_requests
- created_at

---

## 25. Data Ownership

Every user-owned resource must have a reliable ownership relationship.

User
↓
Project
↓
Generation
↓
Topics

Server-side authorization is mandatory.

A user must never access another user's resource by changing IDs in a URL or API request.

Use row-level security where applicable.

---

## 26. Security Requirements

### Authentication

- managed authentication
- secure sessions
- email verification
- password reset
- optional OAuth

### Authorization

Every request must verify:

1. authenticated user
2. resource ownership
3. operation permission
4. sufficient entitlement/credits

### Secrets

API keys and secrets must be server-only.

Never expose:

- AI API keys
- SEO data API keys
- payment secrets
- database service-role keys

### Input validation

Validate:

- topic length
- URL format
- country
- language
- request body size
- IDs
- export parameters

### External content

Treat external search/API content as untrusted data.

Never allow retrieved content to execute code or override application/system instructions.

---

## 27. Rate Limiting

These are separate concepts:

HTTP/API rate limit
≠
Generation credit limit
≠
Research budget

### Anonymous

Strict limits.

Do not expose expensive generation anonymously.

### Free

- one generation entitlement
- API request limits
- concurrency limit

### Paid

Higher API limits but still bounded by credits and research budget.

Initial example:

- 20 requests/minute
- 200 requests/hour
- 1 active generation

Tune these during beta.

---

## 28. Abuse Prevention

Protect against:

- multiple free accounts
- automated account creation
- excessive generation
- concurrent generation abuse
- prompt-driven API explosions
- recursive generation
- excessive retries
- malicious URLs
- unusually large inputs

Possible controls:

- email verification
- CAPTCHA/bot protection where appropriate
- IP-level limits
- abuse signals
- device/browser signals where appropriate
- payment verification
- concurrency limits
- server-side entitlement checks

Do not rely on frontend credit counters.

---

## 29. Cost Security

Cost protection is a security requirement.

The system must prevent:

- unlimited LLM calls
- unlimited search requests
- recursive generation
- uncontrolled retries
- large malicious inputs
- LLM-generated API request explosions

LLM output must never directly control unlimited external API execution.

---

## 30. Payment Architecture

Customer-facing payment flow:

User
↓
₹199 Checkout
↓
Payment Provider
↓
Server Webhook
↓
Verify Signature
↓
Verify Payment
↓
Create/Update Entitlement
↓
10 Credits Available

The browser's payment-success response must never independently grant paid access.

Only verified server-side payment events can change entitlements.

---

## 31. Failure Handling

If generation fails because of our infrastructure:

- mark generation failed
- do not unfairly consume customer credit
- refund the credit
- log the failure
- make retry possible

Example:

Credit = 8
↓
Generation starts
↓
Internal failure
↓
Generation FAILED
↓
Credit restored
↓
Retry available

This must be transactional.

---

## 32. Data Retention and Deletion

Collect only what is necessary.

Keep:

- account information
- projects
- generated maps
- usage records
- payment records
- required security/audit records

Avoid unnecessary retention of:

- raw external search responses
- unnecessary IP history
- temporary API responses
- redundant AI prompts/results
- temporary files

Temporary generation data should have an expiration policy.

### Account deletion

Settings → Delete Account

Flow:

Delete Account
↓
Confirmation
↓
Deletion job
↓
Projects deleted
↓
Generated maps deleted
↓
Stored files deleted
↓
Account deleted

Some records may need to be retained for legal, tax, accounting, payment, fraud-prevention or other legitimate requirements. Explain applicable exceptions in the Privacy Policy.

---

## 33. Privacy Principles

Default principles:

1. Collect only necessary data.
2. Do not sell user data.
3. Do not use customer projects to train AI by default.
4. Clearly disclose third-party processors.
5. Allow account/data deletion.
6. Protect API credentials and payment information.
7. Do not retain raw data without a reason.
8. Keep user-private project data isolated from shared research/cache data.

---

## 34. AI Governance

AI is an internal component of the SEO engine.

Do not expose the product as a generic chat interface.

LLM operations should be task-specific.

Each AI operation should have:

- defined input schema
- defined output schema
- token/output limits
- validation
- retry policy
- model selection
- cost tracking

Prefer structured JSON output for internal processing.

Validate AI output before storing or displaying it as a final result.

---

## 35. Observability

### Product metrics

- signups
- first generation
- generation completion
- free → paid conversion
- credits used
- repeat usage
- exports

### Engineering metrics

- API errors
- generation failures
- latency
- queue time
- external API failures
- AI failures
- database failures

### Economics

- cost/generation
- average cost/paid customer
- AI cost
- external data cost
- payment fees
- refunds
- contribution

---

## 36. Admin Dashboard

MVP admin functionality should show:

### Users

- total users
- free users
- paid users

### Usage

- generations today
- generations this week
- successful generations
- failed generations

### Economics

- AI spend
- external API spend
- average cost/generation
- average cost/customer

### Revenue

- payments
- refunds
- conversion

### System

- errors
- failed jobs
- external API failures

---

## 37. MVP MUST HAVE

### Product

- landing page
- signup/login
- free plan
- ₹199 payment
- entitlement system
- credit system
- create project
- generate topical map
- save project
- topic hierarchy
- clustering
- search intent
- priority
- internal linking
- results dashboard
- CSV export
- PDF export
- settings
- account deletion

### Engine

- research pipeline
- candidate topic generation
- normalization
- deduplication
- clustering
- intent classification
- priority scoring
- hierarchy generation
- internal linking
- automated output validation
- research caching
- generation cost tracking
- generation budget enforcement

### Engineering

- server-side authorization
- rate limiting
- asynchronous generation
- retries
- failure handling
- monitoring
- audit logging
- secure secret management

### Legal/customer-facing

- Privacy Policy
- Terms of Service
- Refund Policy
- Cookie notice/policy where applicable

---

## 38. Explicitly OUT OF SCOPE for MVP

Do NOT build:

- rank tracking
- backlink monitoring
- Google Search Console integration
- WordPress plugin
- AI article generation
- content writing platform
- competitor monitoring
- agency white-label
- team accounts
- public API
- Chrome extension
- mobile app
- keyword rank database
- automated publishing
- enterprise billing

These can be considered after MVP validation.

---

## 39. Development Phases

### Phase 0 — Economics + Research Validation

Before serious production development:

- choose research/data providers
- test sample topics
- benchmark generation quality
- estimate actual cost
- build cost simulator
- validate AI model routing
- validate research budget

### Phase 1 — Foundation

- repository
- Next.js
- TypeScript
- UI system
- Supabase
- authentication
- database
- environments
- deployment

### Phase 2 — Product Shell

- landing page
- dashboard
- projects
- create-map flow
- settings
- credits

### Phase 3 — Topical Engine

- topic research
- expansion
- normalization
- clustering
- intent
- prioritization
- hierarchy
- internal linking
- validation

### Phase 4 — Generation Infrastructure

- background jobs
- generation states
- retries
- failure handling
- cost tracking
- usage deduction

### Phase 5 — Monetization

- checkout
- payment webhook
- entitlement
- credit allocation
- refund handling

### Phase 6 — Results

- overview
- topics
- clusters
- intent
- internal links
- CSV
- PDF

### Phase 7 — Security + Operations

- rate limiting
- abuse prevention
- audit logs
- monitoring
- deletion
- retention

### Phase 8 — Beta

Launch to:

20–50 real users.

Measure everything before aggressive acquisition.

---

## 40. V1 Success Metrics

Milestones:

### 20 paying users

Validate willingness to pay.

### 100 paying users

Validate product-market signal.

### 1,000 paying users

Validate acquisition and economics.

### 10,000 paying users

Initial long-term target.

Revenue at 10,000 customers:

₹1,990,000 gross

The ₹199 price is an early-access validation strategy, not necessarily the permanent pricing model.

---

## 41. Critical Metrics

Track from day one:

### Activation

Percentage of signups generating their first map.

### Free → Paid

Percentage of free users purchasing.

### Generation success

Percentage of generations completed successfully.

### Average cost/generation

Critical economic metric.

### Fully-loaded cost/paid customer

Target: ₹30–₹50
Absolute maximum: ₹99

### Repeat usage

How many credits customers actually consume.

### Refund rate

Important quality/satisfaction indicator.

---

## 42. Quality Standard

The product must NOT produce:

> 500 random SEO keywords.

It must produce:

> A logical content architecture a human SEO can actually execute.

Minimum quality characteristics:

- coherent hierarchy
- minimal duplicate topics
- meaningful clusters
- reasonable intent
- useful priorities
- logical internal links
- understandable output
- evidence-backed decisions where applicable

---

## 43. Founder Rule

We are not trying to beat Ahrefs or Semrush in V1.

We are trying to make a customer say:

> I would normally spend hours doing this manually. ₹199 is a no-brainer.

The competitive advantage should come from:

1. SEO-specific data acquisition
2. proprietary processing and organization
3. deterministic SEO logic
4. intelligent use of AI
5. quality validation
6. excellent UX
7. extremely low operating cost

AI models are replaceable.

Our SEO engine, data pipeline, scoring logic, UX, quality system and accumulated product intelligence are the real product.

Every feature must improve at least one of:

- SEO output quality
- user experience
- conversion/retention
- economics
- security

If it does not meaningfully improve one of these, it does not belong in MVP.

---

## 44. Agent Instructions

Any coding agent working on this repository must:

1. Read this file before making changes.
2. Treat this file as the MVP source of truth.
3. Do not expand MVP scope without explicit founder approval.
4. Do not replace the SEO engine with a generic LLM prompt.
5. Do not introduce unnecessary infrastructure or microservices.
6. Do not expose secrets to the client.
7. Do not trust client-side credits or payment status.
8. Enforce authorization server-side.
9. Enforce generation budgets server-side.
10. Keep AI operations structured and validated.
11. Track generation cost.
12. Preserve the ₹99 maximum fully-loaded variable cost constraint.
13. Prefer simple, maintainable implementations.
14. Prioritize quality and UX over feature count.
15. Avoid AI-slop visual design.
16. Add tests for critical business/security logic.
17. Document important architectural decisions when implementation details change.
18. If a requested change conflicts with this file, stop and surface the conflict rather than silently changing the product direction.

---

## 45. Current Decision Boundary

For MVP, the team is intentionally NOT solving every SEO problem.

We are solving one problem extremely well:

> Create a high-quality, actionable topical authority map at an exceptionally affordable price.

Do not change this product direction until real users provide evidence that it should change.
