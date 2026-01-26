---
name: frontend-development
description: Modern frontend development with React 19, Next.js 15, TypeScript 5.7+, TanStack Query v5, TanStack Router, state management (Zustand, Jotai, Signals), performance optimization (RSC, streaming, partial hydration), MUI v7 styling, accessibility (WCAG 2.2), and testing (Vitest, Testing Library). Use for creating components, pages, features, data fetching, routing, styling, or performance optimization.
license: MIT
version: 2.0.0
---

# Frontend Development Skill

Production-ready frontend with 2025-2026 best practices.

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| Data fetching | TanStack Query v5 (useSuspenseQuery) |
| Routing | TanStack Router (type-safe) |
| State (global) | Zustand / Jotai |
| Styling | MUI v7 sx prop |
| Testing | Vitest + Testing Library |

## 2025 Key Updates

| Area | Best Practice |
|------|---------------|
| React | v19: Server Components, Actions |
| Data | TanStack Query v5: useSuspenseQuery |
| Router | TanStack Router: 100% type-safe |
| State | Signals, Zustand, Jotai |
| Perf | RSC, streaming, partial hydration |

## Core Patterns

**Components:** React.FC + lazy() + Suspense + no early returns

**Data:** useSuspenseQuery + cache-first + invalidation

**Routing:** File-based + loaders + type-safe params

## Reference Files

| Topic | File |
|-------|------|
| Components | `references/component-patterns.md` |
| Data | `references/data-fetching.md` |
| Routing | `references/routing.md` |
| State | `references/state-management.md` |
| Styling | `references/styling.md` |
| Performance | `references/performance.md` |
| Testing | `references/testing.md` |
| Code | `references/code-patterns.md` |

## Quick Start

```typescript
import { useSuspenseQuery } from '@tanstack/react-query';
import { SuspenseLoader } from '~components/SuspenseLoader';

const MyComponent: React.FC<{ id: number }> = ({ id }) => {
  const { data } = useSuspenseQuery({
    queryKey: ['entity', id],
    queryFn: () => api.get(id),
  });
  return <div>{data.name}</div>;
};

// <SuspenseLoader><MyComponent id={1} /></SuspenseLoader>
```

## Import Aliases

| Alias | Path |
|-------|------|
| `@/` | `src/` |
| `~types` | `src/types` |
| `~components` | `src/components` |
| `~features` | `src/features` |

## Resources

- React 19: https://react.dev/blog/2024/12/05/react-19
- TanStack Query: https://tanstack.com/query/latest
- TanStack Router: https://tanstack.com/router/latest
