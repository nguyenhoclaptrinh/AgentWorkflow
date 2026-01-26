# Testing Strategy (2025)

70-20-10 pyramid: Unit → Integration → E2E.

## Testing Pyramid

| Level | Coverage | Tools |
|-------|----------|-------|
| Unit | 70% | Vitest, Jest |
| Integration | 20% | Supertest, Testcontainers |
| E2E | 10% | Playwright, Cypress |

## Unit Testing (Vitest - 50% faster than Jest)

```typescript
import { describe, it, expect, vi } from "vitest";

describe("UserService", () => {
  it("creates user with hashed password", async () => {
    const mockHash = vi.fn().mockResolvedValue("hashed");
    const service = new UserService({ hash: mockHash });

    const user = await service.create({ email: "test@test.com", password: "secret" });

    expect(mockHash).toHaveBeenCalledWith("secret");
    expect(user.password).toBe("hashed");
  });
});
```

## Integration Testing

```typescript
import { describe, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { db } from "../src/db";

describe("POST /api/users", () => {
  beforeAll(async () => { await db.migrate(); });
  afterAll(async () => { await db.close(); });

  it("creates user and returns 201", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "test@test.com", name: "Test" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("test@test.com");
  });
});
```

## Testcontainers (Real DB Testing)

```typescript
import { PostgreSqlContainer } from "@testcontainers/postgresql";

let container: StartedPostgreSqlContainer;

beforeAll(async () => {
  container = await new PostgreSqlContainer().start();
  process.env.DATABASE_URL = container.getConnectionUri();
});

afterAll(async () => { await container.stop(); });
```

## Contract Testing (Pact)

```typescript
const interaction = { state: "user exists", withRequest: { method: "GET", path: "/users/1" }, willRespondWith: { status: 200 } };
```

## Load Testing

```javascript
// k6 load test
import http from "k6/http";
import { check, sleep } from "k6";

export const options = { vus: 100, duration: "30s" };

export default function() {
  const res = http.get("http://localhost:3000/api/users");
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(1);
}
```

## CI Integration

```yaml
test:
  script: [npm run test:unit, npm run test:integration, npm run test:e2e]
  coverage: { report: coverage/lcov.info, threshold: 80% }
```
