# Mocking Strategies

## MSW (API Mocking - Recommended)
```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => HttpResponse.json([{ id: 1, name: 'John' }])),
  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 2, ...body }, { status: 201 });
  }),
  http.delete('/api/users/:id', ({ params }) => new HttpResponse(null, { status: 204 })),
];

// mocks/server.ts
import { setupServer } from 'msw/node';
export const server = setupServer(...handlers);

// test/setup.ts
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## MSW Error Handling
```typescript
it('handles API error', async () => {
  server.use(
    http.get('/api/users', () => HttpResponse.json({ error: 'Not found' }, { status: 404 }))
  );
  render(<UserList />);
  expect(await screen.findByText(/not found/i)).toBeInTheDocument();
});
```

## vi.mock (Module Mocking)
```typescript
// Mock entire module
vi.mock('@/lib/api', () => ({
  fetchUsers: vi.fn(() => Promise.resolve([{ id: 1, name: 'John' }])),
  createUser: vi.fn(() => Promise.resolve({ id: 2, name: 'Jane' })),
}));

// Mock with implementation
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 1, name: 'Test' }, isAuthenticated: true }),
}));
```

## vi.fn() (Function Mocking)
```typescript
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue({ data: 'async' });
mockFn.mockRejectedValue(new Error('fail'));
mockFn.mockImplementation((x) => x * 2);

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(2);
```

## vi.spyOn()
```typescript
const spy = vi.spyOn(console, 'log');
myFunction();
expect(spy).toHaveBeenCalledWith('expected message');
spy.mockRestore();
```

## Fake Timers
```typescript
it('debounces search', async () => {
  vi.useFakeTimers();
  render(<Search onSearch={mockSearch} />);

  await userEvent.type(screen.getByRole('textbox'), 'query');
  expect(mockSearch).not.toHaveBeenCalled();

  vi.advanceTimersByTime(300);
  expect(mockSearch).toHaveBeenCalledWith('query');

  vi.useRealTimers();
});
```

## Best Practices
- Use MSW for network requests
- Use vi.mock for internal dependencies
- Clear mocks after each test
- Avoid over-mocking
