# Code Patterns (for Planners)

Latest approach snippets for backend implementation.

## NestJS Setup (Node.js)

```typescript
// main.ts
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";

const app = await NestFactory.create(AppModule);
app.use(helmet());
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
await app.listen(3000);
```

## FastAPI Setup (Python)

```python
from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI()
class UserCreate(BaseModel): email: str; name: str

@app.post("/users")
async def create_user(user: UserCreate, db = Depends(get_db)): return await db.users.create(user.dict())
```

## Hono Setup (Edge/Serverless)

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";

const app = new Hono();
app.use("*", cors());
app.use("/api/*", jwt({ secret: env.JWT_SECRET }));

app.get("/api/users", async (c) => {
  const users = await c.env.DB.prepare("SELECT * FROM users").all();
  return c.json(users);
});

export default app;
```

## Database Query (Drizzle ORM)

```typescript
const db = drizzle(sql);
const result = await db.select().from(users).where(eq(users.status, "active")).limit(10);

// Transaction
await db.transaction(async (tx) => {
  await tx.update(users).set({ balance: sql`balance - 100` }).where(eq(users.id, senderId));
  await tx.update(users).set({ balance: sql`balance + 100` }).where(eq(users.id, receiverId));
});
```

## Error Handling

```typescript
class AppError extends Error {
  constructor(public code: string, message: string, public statusCode = 400) {
    super(message);
  }
}

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
  }
  logger.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
});
```

## Repository + Service Layer

```typescript
// Repository interface
interface UserRepository { findById(id: string): Promise<User | null>; create(data: CreateUserDto): Promise<User>; }

// Service with caching
class UserService {
  async getUser(id: string) {
    const cached = await this.cache.get(`user:${id}`);
    if (cached) return cached;
    const user = await this.repo.findById(id);
    if (!user) throw new AppError("USER_NOT_FOUND", "User not found", 404);
    return user;
  }
}
```
