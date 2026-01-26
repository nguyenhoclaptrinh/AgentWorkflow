# Component Patterns

## React.FC Pattern
```typescript
interface Props { userId: number; onAction?: () => void; }

export const MyComponent: React.FC<Props> = ({ userId }) => {
  return <div>User: {userId}</div>;
};
export default MyComponent;
```

## Lazy Loading
```typescript
const Heavy = React.lazy(() => import('./Heavy'));
// Named: React.lazy(() => import('./M').then(m => ({ default: m.Named })))
```
**When:** Routes, modals, DataGrid, charts, heavy libraries.

## Suspense Boundaries
```typescript
<SuspenseLoader><LazyComponent /></SuspenseLoader>
```
**Rule:** Always wrap lazy components and useSuspenseQuery.

## No Early Returns (Critical)
```typescript
// NEVER: if (isLoading) return <Spinner />;
// ALWAYS: <SuspenseLoader><Content /></SuspenseLoader>
```

## Server Components (React 19)
```typescript
// Server (default): no directive, async, direct DB
async function Server() { const d = await db.query(); return <div>{d}</div>; }

// Client: 'use client', interactive
'use client';
function Client() { const [s,set] = useState(0); return <button onClick={()=>set(s+1)}>{s}</button>; }
```

## Component Order
1. Imports 2. Props interface 3. Styles 4. Component (hooks→handlers→render) 5. Export

## File Organization
```
features/my-feature/
  api/        # API service
  components/ # Feature components
  hooks/      # Custom hooks
  types/      # TypeScript types
```

## Import Aliases
`@/` → `src/` | `~types` → `src/types` | `~components` → `src/components`

## Split When
>300 lines, multiple responsibilities, reusable sections.
