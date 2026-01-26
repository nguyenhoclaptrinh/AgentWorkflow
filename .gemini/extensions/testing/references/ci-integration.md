# CI/CD Integration

## GitHub Actions
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
```

## Package Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:ci": "vitest run && playwright test"
  }
}
```

## Coverage Config
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: { global: { lines: 80, branches: 80, functions: 80 } },
      exclude: ['**/*.test.ts', '**/mocks/**'],
    },
  },
});
```

## Pre-commit Hook
```bash
# .husky/pre-commit
npm run test:coverage -- --run
```

## Parallel Execution
```typescript
// vitest
export default defineConfig({ test: { pool: 'threads' } });

// playwright
export default defineConfig({ fullyParallel: true, workers: process.env.CI ? 2 : undefined });
```

## Coverage Goals
| Type | Target |
|------|--------|
| Lines | 80%+ |
| Branches | 80%+ |
| Functions | 80%+ |
| Critical | 100% |

## Best Practices
- Run tests on every PR
- Block merge on failure
- Fast feedback (<5 min)
- Parallel execution
- Cache dependencies
