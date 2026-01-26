# Code Patterns (for Planners)

## Unit Test
```typescript
describe('UserService', () => {
  const mockRepo = { findById: vi.fn(), save: vi.fn() };
  const service = new UserService(mockRepo);
  beforeEach(() => vi.clearAllMocks());

  it('returns user by id', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1, name: 'John' });
    const user = await service.getUser(1);
    expect(user).toEqual({ id: 1, name: 'John' });
  });

  it('throws when not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getUser(999)).rejects.toThrow('User not found');
  });
});
```

## Component Test
```typescript
describe('Button', () => {
  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button', { name: /click/i }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Integration Test (MSW)
```typescript
const server = setupServer(
  http.get('/api/users', () => HttpResponse.json([{ id: 1, name: 'John' }]))
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('renders users', async () => {
  render(<UserList />, { wrapper: Providers });
  expect(await screen.findByText('John')).toBeInTheDocument();
});

it('shows error on failure', async () => {
  server.use(http.get('/api/users', () => HttpResponse.error()));
  render(<UserList />, { wrapper: Providers });
  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

## E2E Test
```typescript
test('completes purchase', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill('[name="email"]', 'test@test.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success')).toContainText('Order confirmed');
});
```

## Hook Test
```typescript
it('toggles state', () => {
  const { result } = renderHook(() => useToggle(false));
  expect(result.current[0]).toBe(false);
  act(() => result.current[1]());
  expect(result.current[0]).toBe(true);
});
```

## Test Setup
```typescript
// test/setup.ts
import '@testing-library/jest-dom/vitest';
import { server } from './mocks/server';
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => { server.resetHandlers(); vi.clearAllMocks(); });
afterAll(() => server.close());
```
