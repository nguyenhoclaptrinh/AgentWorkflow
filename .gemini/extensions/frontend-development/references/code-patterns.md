# Code Patterns (for Planners)

## Modern Component
```typescript
'use client';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMuiSnackbar } from '@/hooks/useMuiSnackbar';

interface Props { id: number; onComplete?: () => void; }

export const Card: React.FC<Props> = ({ id, onComplete }) => {
  const qc = useQueryClient();
  const { showSuccess, showError } = useMuiSnackbar();
  const { data } = useSuspenseQuery({ queryKey: ['entity', id], queryFn: () => api.get(id) });
  const mutation = useMutation({
    mutationFn: (d: Partial<T>) => api.update(id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['entity', id] }); showSuccess('Updated'); onComplete?.(); },
    onError: () => showError('Failed'),
  });
  return <Paper sx={{ p: 2 }}><Box>{data.name}</Box><Button onClick={() => mutation.mutate({ status: 'active' })} disabled={mutation.isPending}>Save</Button></Paper>;
};
// Usage: <SuspenseLoader><Card id={1} /></SuspenseLoader>
```

## Server + Client Island
```typescript
// page.tsx (Server)
async function Page({ id }) {
  const data = await db.find(id);
  return <><Details data={data} /><Actions id={id} /></>;  // Actions is 'use client'
}
```

## Router with Loader
```typescript
export const Route = createFileRoute('/users/$userId')({
  component: () => <SuspenseLoader><UserPage /></SuspenseLoader>,
  loader: async ({ params }) => ({ user: await api.getUser(params.userId) }),
});
function UserPage() { const { user } = Route.useLoaderData(); return <div>{user.name}</div>; }
```

## Zustand Store
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create<Store>()(persist(
  (set) => ({ theme: 'light', setTheme: (t) => set({ theme: t }), sidebar: true, toggle: () => set(s => ({ sidebar: !s.sidebar })) }),
  { name: 'app' }
));
```

## Form + Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ email: z.string().email(), name: z.string().min(2) });

function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  return <form onSubmit={handleSubmit(onSubmit)}><TextField {...register('email')} error={!!errors.email} /><Button type="submit">Submit</Button></form>;
}
```

## API Service
```typescript
export const api = {
  get: (id: number): Promise<T> => apiClient.get(`/resource/${id}`).then(r => r.data),
  list: (): Promise<T[]> => apiClient.get('/resource').then(r => r.data),
  create: (d: D): Promise<T> => apiClient.post('/resource', d).then(r => r.data),
  update: (id: number, d: D): Promise<T> => apiClient.put(`/resource/${id}`, d).then(r => r.data),
  delete: (id: number): Promise<void> => apiClient.delete(`/resource/${id}`),
};
```

## Test
```typescript
it('saves on click', async () => {
  const onComplete = vi.fn();
  render(<Card id={1} onComplete={onComplete} />, { wrapper });
  await userEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(onComplete).toHaveBeenCalled();
});
```
