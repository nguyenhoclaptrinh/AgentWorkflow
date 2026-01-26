# API Design Patterns (2025)

Multi-modal API strategy: REST + GraphQL + gRPC + tRPC.

## When to Use

| Pattern | Use Case |
|---------|----------|
| REST | Public APIs, CRUD, simple integrations |
| GraphQL | Complex data, mobile apps, flexible queries |
| gRPC | Microservices, high-performance, streaming |
| tRPC | TypeScript monorepos, end-to-end type safety |

## REST Best Practices

```
GET    /api/v1/users          # List
GET    /api/v1/users/:id      # Read
POST   /api/v1/users          # Create
PUT    /api/v1/users/:id      # Replace
PATCH  /api/v1/users/:id      # Update
DELETE /api/v1/users/:id      # Delete
```

**Rules:** Plural nouns, HTTP verbs, URI versioning, HATEOAS links, proper status codes.

## GraphQL Pattern

```graphql
type Query {
  user(id: ID!): User
  users(filter: UserFilter, limit: Int): [User!]!
}
type Mutation {
  createUser(input: CreateUserInput!): User!
}
```

**Rules:** DataLoader for N+1, depth limiting, query complexity analysis, persisted queries.

## gRPC Pattern

```protobuf
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (stream User);
}
```

**Rules:** Protocol Buffers, HTTP/2, bidirectional streaming, deadline propagation.

## tRPC Pattern (TypeScript)

```typescript
const appRouter = router({
  user: router({
    get: publicProcedure.input(z.string()).query(({ input }) => getUser(input)),
    create: protectedProcedure.input(createUserSchema).mutation(({ input }) => createUser(input)),
  }),
});
export type AppRouter = typeof appRouter;
```

**Rules:** Zod validation, procedure types (query/mutation), middleware chains.

## Common Patterns

**Pagination:**
```json
{ "data": [], "meta": { "page": 1, "limit": 20, "total": 100 } }
```

**Error Response:**
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }
```

**Rate Limiting Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## API Documentation

- OpenAPI 3.1 for REST
- GraphQL introspection + GraphiQL
- gRPC reflection + grpcurl
- tRPC panel for debugging
