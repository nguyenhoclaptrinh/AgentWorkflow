# Security (2025)

OWASP Top 10 2025 + Zero Trust Architecture.

## OWASP Top 10 2025 Mitigations

| Risk | Mitigation |
|------|------------|
| Broken Access Control | RBAC/ABAC, validate on every request |
| Cryptographic Failures | TLS 1.3, AES-256-GCM, Argon2id |
| Injection | Parameterized queries, input validation |
| Insecure Design | Threat modeling, security requirements |
| Security Misconfiguration | Automated hardening, minimal permissions |
| Vulnerable Components | Dependabot, regular updates, SBOM |
| Auth Failures | MFA, rate limiting, secure sessions |
| Data Integrity Failures | Signed updates, CI/CD security |
| Logging Failures | Centralized logging, audit trails |
| SSRF | Allowlist URLs, network segmentation |

## Zero Trust Principles

```
1. Never trust, always verify
2. Assume breach
3. Verify explicitly
4. Use least privilege access
5. Micro-segmentation
```

## Input Validation

```typescript
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100).regex(/^[\w\s-]+$/),
  age: z.number().int().min(0).max(150).optional()
});

// Validate all inputs
const validated = userSchema.parse(req.body);
```

## SQL Injection Prevention

```typescript
// ALWAYS use parameterized queries
const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

// NEVER string concatenation
// const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`); // VULNERABLE
```

## Security Headers

```typescript
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));
```

## Rate Limiting

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // requests per window
  standardHeaders: true,
  keyGenerator: (req) => req.ip || req.headers["x-forwarded-for"]
});
```

## Secrets Management

- Environment variables (never commit)
- Vault/AWS Secrets Manager for production
- Rotate secrets regularly
- Audit secret access
