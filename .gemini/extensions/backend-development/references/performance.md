# Performance Optimization (2025)

Caching, query optimization, scaling patterns.

## Caching Strategy

| Cache Type | Use Case | TTL |
|------------|----------|-----|
| HTTP/CDN | Static assets, API responses | Hours-Days |
| Application | Computed data, sessions | Minutes-Hours |
| Database | Query results | Seconds-Minutes |

```typescript
// Multi-level caching
async function getUser(id: string) {
  // L1: Memory cache
  let user = memoryCache.get(`user:${id}`);
  if (user) return user;

  // L2: Redis cache
  user = await redis.get(`user:${id}`);
  if (user) {
    memoryCache.set(`user:${id}`, user, 60);
    return JSON.parse(user);
  }

  // L3: Database
  user = await db.user.findUnique({ where: { id } });
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
  memoryCache.set(`user:${id}`, user, 60);
  return user;
}
```

## Cache Invalidation

```typescript
// Write-through pattern
async function updateUser(id: string, data: UserUpdate) {
  const user = await db.user.update({ where: { id }, data });
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
  memoryCache.del(`user:${id}`);
  return user;
}

// Event-based invalidation
eventBus.on("user.updated", async ({ userId }) => {
  await redis.del(`user:${userId}`);
});
```

## Database Optimization

```sql
-- Explain analyze for query optimization
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = $1;

-- Covering index (all columns in index)
CREATE INDEX idx_orders_covering ON orders(user_id) INCLUDE (status, total);

-- Batch operations
INSERT INTO logs (data) VALUES ($1), ($2), ($3) -- Batch insert
```

## Connection Pooling

```typescript
// Pool configuration
const pool = new Pool({
  max: 20,                    // Max connections
  min: 5,                     // Min connections
  idleTimeoutMillis: 30000,   // Close idle connections
  connectionTimeoutMillis: 5000
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await pool.end();
});
```

## Scaling

**Horizontal:** K8s HPA (minReplicas: 2, maxReplicas: 10, CPU: 70%)
**Load Balancing:** Round-robin (stateless), health checks, circuit breakers
