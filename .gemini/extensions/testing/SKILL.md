---
name: testing
description: Comprehensive testing skill for validating code changes. Covers unit testing (Vitest, Jest), integration testing, E2E testing (Playwright, Cypress), component testing, mocking (MSW, vi.mock), async/hook testing, CI/CD integration, and code coverage. Use after code changes or code-executor to ensure quality.
license: MIT
version: 1.0.0
---

# Testing Skill

Validate code changes with 2025-2026 testing best practices.

## When to Use

- After code changes or code-executor completes
- Before committing or pushing code
- When adding new features or fixing bugs
- During code review validation

## Quick Decision Matrix

| Need | Tool |
|------|------|
| Unit tests | Vitest (fast) / Jest (mature) |
| Component tests | Testing Library + Vitest |
| E2E tests | Playwright / Cypress |
| API mocking | MSW |
| Module mocking | vi.mock / jest.mock |
| Hook testing | renderHook + act |

## Testing Pyramid

| Level | Coverage | Focus |
|-------|----------|-------|
| Unit | 70% | Functions, utils, logic |
| Integration | 20% | Components, API calls |
| E2E | 10% | Critical user journeys |

## Core Principles

1. **Test behavior, not implementation**
2. **Arrange-Act-Assert (AAA) pattern**
3. **Fast, isolated, repeatable tests**
4. **Mock external dependencies**
5. **CI/CD integration mandatory**

## Reference Files

| Topic | File |
|-------|------|
| Unit testing | `references/unit-testing.md` |
| Integration | `references/integration-testing.md` |
| E2E | `references/e2e-testing.md` |
| Mocking | `references/mocking.md` |
| Async/Hooks | `references/async-testing.md` |
| CI/CD | `references/ci-integration.md` |
| Code patterns | `references/code-patterns.md` |

## Quick Validation Checklist

```
[ ] Run unit tests: npm test
[ ] Run integration tests: npm run test:integration
[ ] Check coverage: npm run test:coverage
[ ] Run E2E (critical paths): npm run test:e2e
[ ] Verify CI pipeline passes
```

## Quick Start

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('MyFunction', () => {
  it('returns expected result', () => {
    // Arrange
    const input = 'test';
    // Act
    const result = myFunction(input);
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Resources

- Vitest: https://vitest.dev/
- Testing Library: https://testing-library.com/
- Playwright: https://playwright.dev/
- MSW: https://mswjs.io/
