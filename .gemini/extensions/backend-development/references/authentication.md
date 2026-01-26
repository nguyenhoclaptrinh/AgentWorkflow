# Authentication (2025)

OAuth 2.1 + Passkeys + JWT - modern auth stack.

## OAuth 2.1 (Mandatory Updates)

**Required changes from OAuth 2.0:**
- PKCE mandatory for ALL authorization code flows
- Refresh token rotation required
- Implicit grant removed
- Password grant removed

```typescript
// Authorization Code + PKCE flow
const codeVerifier = generateCodeVerifier(); // 43-128 chars
const codeChallenge = base64url(sha256(codeVerifier));

// Step 1: Authorization request
GET /authorize?response_type=code&client_id=xxx&code_challenge=xxx&code_challenge_method=S256

// Step 2: Token exchange
POST /token { grant_type: "authorization_code", code, code_verifier }
```

## Passkeys / WebAuthn

Passwordless, phishing-resistant authentication.

```typescript
// Registration
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: serverChallenge,
    rp: { name: "App", id: "example.com" },
    user: { id: userId, name: email, displayName: name },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }], // ES256
    authenticatorSelection: { residentKey: "required" }
  }
});
// Send credential.response to server for verification
```

## JWT Best Practices

```typescript
// Short-lived access token (15min)
const accessToken = jwt.sign({ sub: userId, scope: "read write" }, secret, { expiresIn: "15m" });

// Longer refresh token (7d) - rotate on use
const refreshToken = jwt.sign({ sub: userId, jti: tokenId }, secret, { expiresIn: "7d" });
```

**Rules:**
- Access tokens: 15-30 min max
- Refresh tokens: Rotate on every use
- Store refresh tokens server-side (Redis/DB)
- Use `jti` claim for revocation

## Session Management

```typescript
// Secure cookie settings
res.cookie("session", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 86400000,
  path: "/"
});
```

## Password Hashing (if needed)

```typescript
import { hash, verify } from "@node-rs/argon2"; // Argon2id
const hashed = await hash(password, { memoryCost: 65536, timeCost: 3, parallelism: 4 });
const valid = await verify(hashed, password);
```

## MFA Implementation

- TOTP (Google Authenticator) - `otpauth` library
- WebAuthn as second factor
- SMS fallback (least secure)
