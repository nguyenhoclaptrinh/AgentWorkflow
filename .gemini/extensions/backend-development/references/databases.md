# Database Patterns (2025)

PostgreSQL 17 + MongoDB + Redis patterns.

## PostgreSQL 17 Best Practices

```sql
-- Connection pooling (use PgBouncer or built-in)
-- Recommended: 10-20 connections per CPU core

-- Indexing strategy
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- Partial index for common queries
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- JSON indexing (PostgreSQL 17+)
CREATE INDEX idx_data_gin ON events USING GIN (data jsonb_path_ops);
```

## pgvector for AI/Embeddings

```sql
-- Enable extension
CREATE EXTENSION vector;

-- Create table with vector column
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding vector(1536) -- OpenAI ada-002 dimension
);

-- Create index for similarity search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Similarity search
SELECT * FROM documents ORDER BY embedding <=> $1 LIMIT 10;
```

## MongoDB Patterns

```typescript
// Schema with validation
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  profile: { type: Object, default: {} }
}, { timestamps: true });

// Compound index
userSchema.index({ status: 1, createdAt: -1 });

// Aggregation pipeline
const result = await User.aggregate([
  { $match: { status: "active" } },
  { $group: { _id: "$role", count: { $sum: 1 } } }
]);
```

## Redis Patterns

```typescript
// Caching with TTL
await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
const cached = await redis.get(`user:${id}`);

// Rate limiting (sliding window)
const key = `ratelimit:${ip}:${minute}`;
const count = await redis.incr(key);
if (count === 1) await redis.expire(key, 60);

// Session storage
await redis.hset(`session:${sid}`, { userId, role, expiresAt });

// Pub/Sub for real-time
await redis.publish("notifications", JSON.stringify(event));
```

## Connection Pooling

```typescript
// PostgreSQL with pg-pool
const pool = new Pool({ max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 2000 });

// Prisma connection pooling
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
  relationMode = "prisma"
}
```

## Migrations

Use versioned migrations: Prisma Migrate, Drizzle Kit, golang-migrate.
