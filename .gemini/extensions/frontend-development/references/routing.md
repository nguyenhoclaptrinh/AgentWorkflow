# Routing (TanStack Router)

## Basic Route
```typescript
// routes/my-route/index.tsx
import { createFileRoute } from '@tanstack/react-router';
const Page = lazy(() => import('@/features/my/Page'));

export const Route = createFileRoute('/my-route/')({
  component: Page,
  loader: () => ({ crumb: 'My Route' }),
});
```

## File Structure
```
routes/
  __root.tsx      # Root layout
  index.tsx       # / home
  users/
    index.tsx     # /users
    $userId/
      index.tsx   # /users/:userId
```

## Loader with Data
```typescript
export const Route = createFileRoute('/users/$userId')({
  component: UserPage,
  loader: async ({ params }) => ({ user: await api.getUser(params.userId) }),
});
function UserPage() { const { user } = Route.useLoaderData(); }
```

## Search Params
```typescript
import { z } from 'zod';
const search = z.object({ page: z.number().default(1), q: z.string().optional() });

export const Route = createFileRoute('/list/')({
  validateSearch: search,
});
function List() { const { page, q } = Route.useSearch(); }
```

## Navigation
```typescript
// Declarative
<Link to="/users/$userId" params={{ userId: '1' }}>View</Link>

// Programmatic
navigate({ to: '/users/$userId', params: { userId: '1' } });
```

## Error/Pending
```typescript
errorComponent: ({ error }) => <Error error={error} />,
pendingComponent: () => <Loading />,
```

## Route Guards
```typescript
beforeLoad: async ({ context }) => {
  if (!context.auth.isAdmin) throw redirect({ to: '/login' });
},
```

## Prefetch
```typescript
<Link to="/user/$id" params={{ id }} preload="intent">View</Link>
```
