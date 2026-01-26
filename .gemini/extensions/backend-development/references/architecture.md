# Architecture Patterns (2025)

Microservices, serverless, event-driven patterns.

## Architecture Decision

| Pattern | Use When |
|---------|----------|
| Monolith | MVP, small team, simple domain |
| Microservices | Large team, independent scaling, complex domain |
| Serverless | Event-driven, variable load, cost optimization |
| Edge | Global latency requirements, CDN integration |

## Microservices Patterns

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ API GW  │────▶│ User    │────▶│ Order   │
└─────────┘     │ Service │     │ Service │
                └────┬────┘     └────┬────┘
                     │               │
                ┌────▼────┐     ┌────▼────┐
                │ User DB │     │Order DB │
                └─────────┘     └─────────┘
```

**Key Principles:**
- Single responsibility per service
- Database per service
- API gateway for routing
- Service mesh for communication (Istio, Linkerd)

## Event-Driven Architecture

```typescript
// Event publishing
await eventBus.publish("order.created", {
  orderId: "123",
  userId: "456",
  items: [...]
});

// Event handling
eventBus.subscribe("order.created", async (event) => {
  await inventoryService.reserveItems(event.items);
  await notificationService.sendConfirmation(event.userId);
});
```

## CQRS Pattern

```typescript
// Command (write)
class CreateOrderCommand { constructor(public userId: string, public items: Item[]) {} }

// Query (read) - optimized read model
class GetOrdersQuery { constructor(public userId: string, public limit: number) {} }

// Separate handlers
const commandHandler = new CreateOrderHandler(writeDb);
const queryHandler = new GetOrdersHandler(readDb);
```

## Saga Pattern (Distributed Transactions)

```typescript
// Orchestration saga
class OrderSaga {
  async execute(order: Order) {
    try {
      await paymentService.charge(order);
      await inventoryService.reserve(order);
      await shippingService.schedule(order);
    } catch (error) {
      await this.compensate(order); // Rollback
    }
  }
}
```

## Serverless & Edge

```typescript
// AWS Lambda
export const handler = async (event) => ({ statusCode: 200, body: JSON.stringify(await process(event)) });

// Hono (Edge)
import { Hono } from "hono";
const app = new Hono();
app.get("/api/data", (c) => c.json({ data: await c.env.KV.get("key") }));
export default app;
```
