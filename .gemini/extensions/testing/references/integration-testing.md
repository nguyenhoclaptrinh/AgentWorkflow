# Integration & Component Testing

## Component Testing (RTL)
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('submits form with credentials', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'secret');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@test.com', password: 'secret' });
  });
});
```

## Query Priority (RTL)
```typescript
// 1. Accessible (preferred)
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);

// 2. Semantic
screen.getByText(/welcome/i);
screen.getByPlaceholderText(/search/i);

// 3. Test ID (last resort)
screen.getByTestId('custom-element');
```

## Testing with Providers
```typescript
const AllProviders = ({ children }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <ThemeProvider>{children}</ThemeProvider>
  </QueryClientProvider>
);

const renderWithProviders = (ui) => render(ui, { wrapper: AllProviders });

it('renders data', async () => {
  renderWithProviders(<UserList />);
  expect(await screen.findByText('John')).toBeInTheDocument();
});
```

## Testing User Interactions
```typescript
const user = userEvent.setup();

it('handles complex interactions', async () => {
  render(<Dropdown options={['A', 'B', 'C']} />);

  await user.click(screen.getByRole('button'));
  await user.click(screen.getByRole('option', { name: 'B' }));

  expect(screen.getByRole('button')).toHaveTextContent('B');
});
```

## Testing Forms
```typescript
it('shows validation errors', async () => {
  render(<Form />);

  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});
```

## API Integration Test
```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/users', () => HttpResponse.json([{ id: 1, name: 'John' }]))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('fetches and displays users', async () => {
  render(<UserList />);
  expect(await screen.findByText('John')).toBeInTheDocument();
});
```
