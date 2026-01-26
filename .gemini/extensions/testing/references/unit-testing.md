# Unit Testing

## Vitest (Recommended)
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Calculator', () => {
  it('adds numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('handles edge cases', () => {
    expect(add(0, 0)).toBe(0);
    expect(add(-1, 1)).toBe(0);
  });
});
```

## AAA Pattern (Arrange-Act-Assert)
```typescript
it('formats price correctly', () => {
  // Arrange
  const amount = 1000;
  const currency = 'USD';

  // Act
  const result = formatPrice(amount, currency);

  // Assert
  expect(result).toBe('$1,000.00');
});
```

## Setup/Teardown
```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates user', () => { /* ... */ });
});
```

## Testing Errors
```typescript
it('throws on invalid input', () => {
  expect(() => validate(null)).toThrow('Invalid input');
});

it('throws specific error type', () => {
  expect(() => parse('')).toThrowError(ValidationError);
});
```

## Matchers
```typescript
expect(value).toBe(exact);           // Strict equality
expect(value).toEqual(obj);          // Deep equality
expect(arr).toContain(item);         // Array contains
expect(obj).toHaveProperty('key');   // Object property
expect(fn).toHaveBeenCalled();       // Function called
expect(fn).toHaveBeenCalledWith(arg);// Called with args
expect(value).toBeTruthy();          // Truthy check
expect(value).toBeNull();            // Null check
```

## Vitest Config
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: { reporter: ['text', 'lcov'], threshold: { global: 80 } },
  },
});
```

## When to Unit Test
- Pure functions and utilities
- Business logic and calculations
- Data transformations
- Validation functions
- State management reducers
