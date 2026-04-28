# Workspace

## Overview

pnpm workspace monorepo using TypeScript. The main product is **Deadline Decider** — a React web app for college students to track assignment deadlines in one organized place.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (Tailwind CSS, shadcn/ui, wouter routing, framer-motion)
- **API framework**: Express 5 (api-server artifact)
- **Database**: PostgreSQL + Drizzle ORM (not used by Deadline Decider — localStorage only)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Deadline Decider (`artifacts/deadline-decider`) — preview path: `/`
The main product. A frontend-only React app. No backend required — all data is stored in localStorage.

**Pages:**
- `/` — Landing page: product name, tagline, problem/solution sections, feature list, "Launch Deadline Decider" CTA button → /dashboard
- `/dashboard` — Main app: assignments grouped by urgency (Overdue, Due Today, Due This Week, Later), course filter, add/edit/delete/complete assignment flows

**Key files:**
- `src/contexts/AssignmentContext.tsx` — localStorage data layer (add/update/delete/complete)
- `src/pages/LandingPage.tsx` — landing page
- `src/pages/Dashboard.tsx` — assignment dashboard with urgency grouping
- `src/components/AssignmentCard.tsx` — individual assignment card with countdown
- `src/components/AddAssignmentForm.tsx` — add assignment dialog (zod + react-hook-form)
- `src/components/EditAssignmentDialog.tsx` — edit/delete/complete dialog
- `src/components/CourseFilter.tsx` — course filter pills/dropdown
- `src/App.tsx` — router setup

**Data model:**
```typescript
interface Assignment {
  id: string;
  courseName: string;
  assignmentName: string;
  dueDate: string; // ISO date string
  type: 'essay' | 'quiz' | 'project' | 'reading' | 'other';
  notes?: string;
  completed: boolean;
  createdAt: string;
}
```
localStorage key: `deadline-decider-assignments`

### API Server (`artifacts/api-server`) — preview path: `/api`
Shared Express 5 backend. Not used by Deadline Decider currently.

### Canvas (`artifacts/mockup-sandbox`) — preview path: `/__mockup`
Design sandbox for UI prototyping.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
