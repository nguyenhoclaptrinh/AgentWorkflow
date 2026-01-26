# E2E Testing

## Playwright (Recommended)
```typescript
import { test, expect } from '@playwright/test';

test('user login flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@test.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

## Playwright Config
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: { command: 'npm run dev', port: 3000 },
});
```

## Page Object Model
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// usage
test('login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.login('user@test.com', 'pass');
});
```

## Cypress Alternative
```typescript
describe('Login', () => {
  it('logs in successfully', () => {
    cy.visit('/login');
    cy.get('[data-cy="email"]').type('user@test.com');
    cy.get('[data-cy="password"]').type('password123');
    cy.get('[data-cy="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });
});
```

## API Mocking (Playwright)
```typescript
test('handles API error', async ({ page }) => {
  await page.route('/api/users', route =>
    route.fulfill({ status: 500, body: 'Server Error' })
  );
  await page.goto('/users');
  await expect(page.locator('.error')).toContainText('Failed to load');
});
```

## Best Practices
- Test critical user journeys only
- Use data-testid for stable selectors
- Isolate test data (seed/cleanup)
- Run in CI with headless mode
- Parallel execution for speed
- Screenshot/trace on failure
