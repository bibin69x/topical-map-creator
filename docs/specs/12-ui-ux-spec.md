# DOC-12: UI/UX Wireframes & Component Spec

**Status**: Draft (Under Review)  
**Created**: 2026-08-31  
**Blocks**: Phase 4 Specs & Frontend Coding Phase  
**Last Updated**: 2026-08-31  

---

## 1. Executive Summary

This document specifies the user interface, design system tokens, component hierarchy, ASCII wireframes, and page layouts for the Topical Authority Creator MVP.

Per [PROJECT_CONTEXT.md §3 (Anti-AI-Slop Rules — NON-NEGOTIABLE)](file:///d:/Gravity%20Projects/topical-map-creator/docs/PROJECT_CONTEXT.md):
- **Avoid**: Glowing gradients, AI robot icons, decorative brains, card clutter, giant empty spaces, chat interfaces, and gimmicky visual decoration.
- **Prioritize**: Professional information density, fast comprehension, clear hierarchy, high-contrast typography, and accessible data views.

---

## 2. Design System Tokens & Anti-Slop Palette

### Color Palette (Tailwind Tokens)
- **Neutral Base (Dark Mode)**: `slate-950` (Background), `slate-900` (Cards/Panels), `slate-800` (Borders).
- **Neutral Base (Light Mode)**: `slate-50` (Background), `white` (Cards), `slate-200` (Borders).
- **Primary Action Accent**: `indigo-600` (Hover: `indigo-700`, Active: `indigo-800`).
- **Priority Badges**:
  - `HIGH`: Background `rose-500/10`, Text `rose-600` (Dark: `rose-400`), Border `rose-500/20`.
  - `MEDIUM`: Background `amber-500/10`, Text `amber-600` (Dark: `amber-400`), Border `amber-500/20`.
  - `LOW`: Background `slate-500/10`, Text `slate-600` (Dark: `slate-400`), Border `slate-500/20`.
- **Search Intent Badges**:
  - `INFORMATIONAL`: Blue badge (`sky-500`)
  - `COMMERCIAL`: Purple badge (`violet-500`)
  - `TRANSACTIONAL`: Emerald badge (`emerald-600`)
  - `NAVIGATIONAL`: Zinc badge (`zinc-500`)

---

## 3. Key Layout Wireframes

### 3.1 Results Dashboard Layout (`/generations/:id/results`)

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ [Logo] Topical Authority Creator         [Projects]  [Credits: 9]  [User Avatar]  │
├───────────────────────────────────────────────────────────────────────────────────┤
│ ← Back to Projects   Primary Topic: "Digital Marketing"   (India | English)        │
│ ┌───────────────────────────────────────────────────────────────────────────────┐ │
│ │  Overview  │  Topics (42)  │  Clusters (6)  │  Intent  │  Internal Links  │ Export│ │
│ └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                   │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌─────────────────────────────┐ │
│ │ Total Topics         │ │ Clusters             │ │ High Priority Topics        │ │
│ │ 42                   │ │ 6 Topic Groups       │ │ 14 Topics (Action First)    │ │
│ └──────────────────────┘ └──────────────────────┘ └─────────────────────────────┘ │
│                                                                                   │
│ ┌───────────────────────────────────────────────────────────────────────────────┐ │
│ │ Search Topics: [ Q Search topics... ]  Filter Cluster: [ All ▼ ]  Priority: [▼]│ │
│ ├──────────────────────┬─────────────────┬─────────────────┬────────────────────┤ │
│ │ Topic                │ Cluster         │ Search Intent   │ Priority           │ │
│ ├──────────────────────┼─────────────────┼─────────────────┼────────────────────┤ │
│ │ SEO Strategies       │ Technical SEO   │ Informational   │ [ HIGH ]           │ │
│ │ Keyword Research     │ Content Strategy│ Commercial      │ [ HIGH ]           │ │
│ │ Local SEO Checklist  │ Local Search    │ Transactional   │ [ MEDIUM ]         │ │
│ └──────────────────────┴─────────────────┴─────────────────┴────────────────────┤ │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Asynchronous Progress View (`/generations/:id`)

Shows progress states during generation (§19) without blocking the user:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ Generating Topical Map for "Digital Marketing"                                    │
│ Status: RESEARCHING (Step 2 of 7)                                                 │
│                                                                                   │
│ [==================================--------------------------------] 45%         │
│                                                                                   │
│  ✓ QUEUED                                                                         │
│  ➜ RESEARCHING (Gathering Google SERP & PAA signals...)                           │
│  ◯ EXPANDING TOPICS                                                               │
│  ◯ CLUSTERING                                                                     │
│  ◯ ANALYZING INTENT                                                               │
│  ◯ PRIORITIZING                                                                   │
│  ◯ BUILDING MAP                                                                   │
│                                                                                   │
│  Note: You can leave this page. Your map will save to Projects automatically.     │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. UI Component Architecture (`src/components/`)

```
src/components/
├── layout/
│   ├── AppHeader.tsx             # Includes credit counter & user menu
│   ├── AppSidebar.tsx            # Left navigation sidebar
│   └── MarketingHeader.tsx       # Landing page nav
├── results/
│   ├── MapOverviewTab.tsx        # High-level metric cards & summary
│   ├── TopicsTableTab.tsx        # Datatable with search, sort, filter
│   ├── ClusterTreeTab.tsx        # Interactive visual cluster hierarchy
│   ├── IntentDistributionTab.tsx # Intent pie/bar chart distribution
│   ├── InternalLinkGraphTab.tsx  # Interactive link graph visualization
│   └── ExportModal.tsx           # CSV and PDF download dialog
└── ui/                           # Primitive shadcn components
```
