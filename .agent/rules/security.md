---
trigger: model_decision
description: Always apply when writing code that involves data handling, authentication, user input, or external integrations.
---

# Security Rules

> [!IMPORTANT]
> **MANDATORY**: Security is NOT an afterthought. It must be built-in by design.

## 1. Secrets Management (CRITICAL)

- **NEVER** hardcode secrets (API keys, passwords, tokens) in code.
- **ALWAYS** use Environment Variables (`process.env.VARIABLE`).
- **MUST** include `.env` in `.gitignore`.
- **CHECK** `package.json` scripts to ensure no secrets are exposed in commands.

## 2. Input Validation (OWASP A03:2021-Injection)

- **NEVER** trust user input (params, body, headers, cookies).
- **ALWAYS** validate input using a strict schema library (e.g., Zod, Valibot, Joi).
- **SANITIZE** data before rendering in HTML to prevent XSS.
- **PARAMETERIZE** SQL queries to prevent SQL Injection (use ORM or Prepared Statements).

## 3. Authentication & Authorization

- **VERIFY** authentication on ALL private routes/endpoints.
- **CHECK** permissions (Authorization) *after* authentication (e.g., "Can this user actually access this resource?").
- **NEVER** implement custom crypto. Use standard libraries (bcrypt, argon2, web-crypto).

## 4. Dependencies

- **AVOID** adding unnecessary dependencies.
- **AUDIT** dependencies regularly for vulnerabilities.

## 5. Defensive Coding

- **FAIL SAFE**: Systems should fail closed (deny access) rather than open.
- **ERROR MESSAGES**: Do NOT expose sensitive stack traces or internal paths to end-users ( Production vs Dev logic).

## Decision Flow

```
┌─────────────────────────────────────────────────────────────┐
│ WHEN writing a function that handles data:                  │
│ 1. Is it getting input from outside?                        │
│    YES → Add Zod validation schema.                         │
│ 2. Is it accessing a database?                              │
│    YES → Use ORM/Parameterized query. Check permissions.    │
│ 3. Is it calling an external API?                           │
│    YES → Use env vars for keys. Handle timeouts/errors.     │
└─────────────────────────────────────────────────────────────┘
```
