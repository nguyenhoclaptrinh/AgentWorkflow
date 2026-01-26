# Data Fetching (TanStack Query v5)

## useSuspenseQuery (Primary)
```typescript
const { data } = useSuspenseQuery({
  queryKey: ['entity', id],
  queryFn: () => api.get(id),
});
// data is ALWAYS defined, Suspense handles loading
```

## useSuspenseQuery vs useQuery
| Feature | useSuspenseQuery | useQuery |
|---------|------------------|----------|
| Loading | Suspense | Manual isLoading |
| Data type | Always defined | Data \| undefined |
| Use for | **New code** | Legacy only |

## Cache-First
```typescript
queryFn: async () => {
  const cached = queryClient.getQueryData<{rows:T[]}>(['list']);
  const found = cached?.rows.find(r => r.id === id);
  if (found) return found;
  return api.get(id);
},
staleTime: 5 * 60 * 1000,  // 5min fresh
gcTime: 10 * 60 * 1000,     // 10min cache
```

## Query Keys
`['entities', blogId]` list | `['entity', id]` single | `['entity', id, 'history']` related

## API Service
```typescript
export const api = {
  get: (id: number): Promise<T> => apiClient.get(`/blog/${id}`).then(r => r.data),
  update: (id: number, data: D): Promise<T> => apiClient.put(`/blog/${id}`, data).then(r => r.data),
};
```
**Route:** `/blog/route` NOT `/api/blog/route`

## Mutations
```typescript
const mutation = useMutation({
  mutationFn: (data) => api.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['entity', id] });
    showSuccess('Updated');
  },
  onError: () => showError('Failed'),
});
```

## Parallel Queries
```typescript
const [q1, q2] = useSuspenseQueries({ queries: [
  { queryKey: ['a'], queryFn: () => api.getA() },
  { queryKey: ['b'], queryFn: () => api.getB() },
]});
```

## Error Handling
Use `useMuiSnackbar` for notifications, `onError` callback in mutations.
