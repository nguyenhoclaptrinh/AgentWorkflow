# DevOps & CI/CD (2025)

Docker, Kubernetes, deployment strategies.

## Dockerfile Best Practices

```dockerfile
# Multi-stage build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Docker Compose (Development)

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
    depends_on: [db, redis]

  db:
    image: postgres:17-alpine
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
```

## Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }
  template:
    spec:
      containers:
        - name: api
          image: app:latest
          ports: [{ containerPort: 3000 }]
          resources:
            requests: { memory: "256Mi", cpu: "250m" }
            limits: { memory: "512Mi", cpu: "500m" }
          readinessProbe:
            httpGet: { path: /health, port: 3000 }
          livenessProbe:
            httpGet: { path: /health, port: 3000 }
```

## CI/CD Pipeline (GitHub Actions)

```yaml
jobs:
  test: { runs-on: ubuntu-latest, steps: [checkout, setup-node, "npm ci && npm test"] }
  deploy: { needs: test, if: "main", steps: [docker build, docker push, kubectl set image] }
```

## Deployment Strategies

| Strategy | Risk | Rollback |
|----------|------|----------|
| Rolling | Low | Automatic |
| Blue-Green | None | Instant |
| Canary | Lowest | Instant |

## Feature Flags & Monitoring

```typescript
// Feature flags (Unleash)
if (unleash.isEnabled("new-checkout-flow")) return newCheckoutFlow();
```

**Monitoring:** Prometheus + Grafana (metrics), Loki/ELK (logs), Jaeger/Tempo (traces)
