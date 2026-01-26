# Async & Hook Testing

## Testing Custom Hooks
```typescript
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

## Testing Hooks with Props
```typescript
it('updates when props change', () => {
  const { result, rerender } = renderHook(
    ({ val }) => useCounter(val),
    { initialProps: { val: 0 } }
  );
  expect(result.current.count).toBe(0);
  rerender({ val: 5 });
  expect(result.current.count).toBe(5);
});
```

## waitFor (Async Assertions)
```typescript
import { waitFor } from '@testing-library/react';

it('loads data async', async () => {
  render(<UserList />);
  await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());
});
```

## findBy Queries (Auto-wait)
```typescript
it('waits for element', async () => {
  render(<AsyncComponent />);
  expect(await screen.findByText('Loaded')).toBeInTheDocument();
});
```

## Testing Async Functions
```typescript
it('fetches data', async () => {
  const result = await fetchUserData(1);
  expect(result).toEqual({ id: 1, name: 'John' });
});

it('handles error', async () => {
  await expect(fetchUserData(-1)).rejects.toThrow('Invalid ID');
});
```

## Testing with TanStack Query
```typescript
const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

it('fetches with hook', async () => {
  const { result } = renderHook(() => useUser(1), { wrapper });
  await waitFor(() => expect(result.current.data).toEqual({ id: 1, name: 'John' }));
});
```

## Fake Timers
```typescript
it('handles debounced async', async () => {
  vi.useFakeTimers();
  render(<DebouncedSearch />);
  await userEvent.type(screen.getByRole('textbox'), 'query');
  await act(async () => vi.advanceTimersByTime(500));
  await waitFor(() => expect(screen.getByText('Results')).toBeInTheDocument());
  vi.useRealTimers();
});
```

## Best Practices
- Wrap state updates in `act`
- Use `waitFor` for async assertions
- Use `findBy` for async elements
- Mock external dependencies
