# Observability (2025)

OpenTelemetry standard for logs, metrics, traces.

## OpenTelemetry Setup (Node.js)

```typescript
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: "http://otel-collector:4318/v1/traces" }),
  instrumentations: [getNodeAutoInstrumentations()]
});
sdk.start();
```

## Structured Logging

```typescript
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label })
  },
  redact: ["password", "token", "authorization"]
});

// Contextual logging
logger.info({ userId, action: "login", ip: req.ip }, "User logged in");
```

## Custom Metrics

```typescript
import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("app");
const requestCounter = meter.createCounter("http_requests_total");
const requestDuration = meter.createHistogram("http_request_duration_ms");

// Record metrics
requestCounter.add(1, { method: "GET", path: "/api/users", status: 200 });
requestDuration.record(duration, { method, path });
```

## Distributed Tracing

```typescript
import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("app");

async function processOrder(orderId: string) {
  return tracer.startActiveSpan("processOrder", async (span) => {
    try {
      span.setAttribute("order.id", orderId);
      const result = await db.query("...");
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

## Health Checks

```typescript
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/ready", async (req, res) => {
  const checks = {
    db: await checkDb(),
    redis: await checkRedis(),
    external: await checkExternalService()
  };
  const healthy = Object.values(checks).every(Boolean);
  res.status(healthy ? 200 : 503).json(checks);
});
```

## Alerting Rules

```yaml
# Prometheus alerting rule example
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
  for: 5m
  labels: { severity: critical }
```
