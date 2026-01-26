# Testing

## Pyramid
| Level | Coverage | Tool |
|-------|----------|------|
| Unit | 70% | Vitest |
| Integration | 20% | Vitest + RTL |
| E2E | 10% | Playwright |

## Unit Test
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('formatPrice', () => {
  it('formats correctly', () => { expect(formatPrice(1000)).toBe('$1,000.00'); });
});
```

## Component Test (RTL)
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('calls onClick', async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click</Button>);
  await userEvent.click(screen.getByRole('button', { name: /click/i }));
  expect(onClick).toHaveBeenCalled();
});
```

## Query Priority
1. `getByRole('button', { name: /submit/i })` - accessibility
2. `getByLabelText(/email/i)` - semantic
3. `getByTestId('x')` - last resort

## Hook Test
```typescript
import { renderHook, act } from '@testing-library/react';

it('increments', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

## Mocking
```typescript
vi.mock('@/lib/api', () => ({ fetchUsers: vi.fn(() => Promise.resolve([])) }));
const fn = vi.fn().mockResolvedValue({ data: 'x' });
```

## With TanStack Query
```typescript
const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);
render(<C />, { wrapper });
```

## MSW
```typescript
const server = setupServer(http.get('/api/users', () => HttpResponse.json([])));
beforeAll(() => server.listen()); afterAll(() => server.close());
```
