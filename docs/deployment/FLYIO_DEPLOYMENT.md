# Fly.io Deployment Guide

Complete guide for deploying containerized applications to Fly.io.

## Why Fly.io?

- **Global Edge Network** - Deploy close to users worldwide
- **Native Docker** - Full control with containers
- **Multi-region** - Easy replication across regions
- **Generous Free Tier** - 3 shared VMs, 160GB bandwidth
- **Persistent Storage** - Volumes for stateful apps

## Prerequisites

- Fly.io account (sign up at [fly.io](https://fly.io))
- Docker installed locally (for builds)
- flyctl CLI installed

## Installation

```bash
# macOS
brew install flyctl

# Windows
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Linux
curl -L https://fly.io/install.sh | sh

# Verify installation
fly version

# Login
fly auth login
```

## Quick Deploy

### Option 1: Launch Wizard (Recommended)

```bash
# From your project directory
fly launch

# Follow prompts:
# - App name
# - Region
# - Database (optional)
# - Deploy now (yes/no)
```

### Option 2: Manual Configuration

```bash
# Create app
fly apps create my-app

# Create fly.toml manually
fly launch --no-deploy

# Deploy
fly deploy
```

## Configuration

### fly.toml

```toml
# fly.toml
app = "my-app"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

  [http_service.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256

[checks]
  [checks.health]
    grace_period = "30s"
    interval = "15s"
    method = "GET"
    path = "/api/health"
    port = 3000
    timeout = "10s"
    type = "http"
```

### Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

### next.config.js (for Next.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Other config...
}

module.exports = nextConfig
```

## Environment Variables

### Setting Secrets

```bash
# Set single secret
fly secrets set DATABASE_URL=postgresql://...

# Set multiple secrets
fly secrets set AUTH_SECRET=xxx GITHUB_CLIENT_ID=yyy

# Set from file
fly secrets import < .env.production

# List secrets
fly secrets list

# Unset secret
fly secrets unset SECRET_NAME
```

### Required Variables

```bash
fly secrets set \
  DATABASE_URL="postgresql://..." \
  AUTH_SECRET="your-32-char-secret" \
  NEXTAUTH_URL="https://my-app.fly.dev"
```

### Environment Variables (non-sensitive)

```toml
# fly.toml
[env]
  NODE_ENV = "production"
  LOG_LEVEL = "info"
```

## Database Setup

### Fly Postgres

```bash
# Create Postgres cluster
fly postgres create

# Attach to your app
fly postgres attach --app my-app my-database

# This sets DATABASE_URL automatically
```

### External Database

```bash
# Use external database
fly secrets set DATABASE_URL="postgresql://user:pass@host:5432/db"
```

### Connecting to Database

```bash
# Direct connection
fly postgres connect -a my-database

# Proxy for local tools
fly proxy 5432 -a my-database
# Then connect to localhost:5432
```

## Scaling

### Horizontal Scaling

```bash
# Scale to 3 machines
fly scale count 3

# Scale in specific regions
fly scale count 2 --region iad
fly scale count 2 --region cdg
```

### Vertical Scaling

```bash
# View available VM sizes
fly platform vm-sizes

# Scale up
fly scale vm shared-cpu-2x

# Scale memory
fly scale memory 512
```

### Auto-scaling

```toml
# fly.toml
[http_service]
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1  # Always keep 1 running

  [http_service.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20
```

## Multi-Region Deployment

### Add Regions

```bash
# List available regions
fly platform regions

# Add machines in regions
fly scale count 1 --region iad  # US East
fly scale count 1 --region cdg  # Paris
fly scale count 1 --region sin  # Singapore
```

### Primary Region

```toml
# fly.toml
primary_region = "iad"

[env]
  PRIMARY_REGION = "iad"
```

### Read Replicas (Postgres)

```bash
# Add read replica
fly postgres create --region cdg --name my-database-replica

# Configure app to use replica
fly secrets set DATABASE_URL_READ="..."
```

## Persistent Storage

### Create Volume

```bash
# Create volume
fly volumes create data --size 10 --region iad

# List volumes
fly volumes list
```

### Mount Volume

```toml
# fly.toml
[mounts]
  source = "data"
  destination = "/data"
```

### Volume Best Practices

- Volumes are per-machine (not shared)
- Back up important data
- Use managed databases for critical data
- Volumes survive deployments

## Custom Domain

### Add Domain

```bash
# Add domain
fly certs create myapp.com

# Add www subdomain
fly certs create www.myapp.com
```

### DNS Configuration

Fly provides IPv4 and IPv6 addresses:
```bash
fly ips list
```

Configure DNS:
```
Type    Name    Value
A       @       <IPv4 from fly ips list>
AAAA    @       <IPv6 from fly ips list>
CNAME   www     myapp.fly.dev
```

### SSL Certificates

Fly automatically provisions Let's Encrypt certificates.

```bash
# Check certificate status
fly certs show myapp.com
```

## Continuous Deployment

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Fly.io

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Deploy
        run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Get API Token

```bash
fly tokens create deploy -x 999999h
# Add to GitHub secrets as FLY_API_TOKEN
```

## Health Checks

### HTTP Health Check

```toml
# fly.toml
[checks]
  [checks.health]
    grace_period = "30s"
    interval = "15s"
    method = "GET"
    path = "/api/health"
    port = 3000
    timeout = "10s"
    type = "http"
```

### Health Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      region: process.env.FLY_REGION,
    })
  } catch (error) {
    return Response.json({ status: 'unhealthy' }, { status: 500 })
  }
}
```

## Monitoring

### Logs

```bash
# View logs
fly logs

# Follow logs
fly logs -f

# Filter by region
fly logs --region iad
```

### Metrics

```bash
# View app status
fly status

# View machine status
fly machine list
```

### Dashboard

```bash
# Open dashboard
fly dashboard
```

## Debugging

### SSH into Machine

```bash
# SSH into running machine
fly ssh console

# SSH with specific app
fly ssh console -a my-app
```

### Run One-off Commands

```bash
# Run migration
fly ssh console -C "npx prisma migrate deploy"

# Run seed
fly ssh console -C "npm run db:seed"
```

### Local Development with Fly

```bash
# Proxy database locally
fly proxy 5432 -a my-database

# Then use localhost:5432 in your local app
```

## Blue-Green Deployments

### Immediate Deployment

```bash
# Deploy with no downtime (default)
fly deploy
```

### Canary Deployment

```bash
# Deploy to subset of machines
fly deploy --strategy canary
```

### Rollback

```bash
# List releases
fly releases

# Rollback to previous
fly deploy --image registry.fly.io/my-app:v123
```

## Troubleshooting

### Deployment Failures

```bash
# View build logs
fly logs --build

# Check machine status
fly machine list

# Restart machines
fly machine restart
```

### Health Check Failures

```bash
# Check health manually
fly ssh console -C "curl localhost:3000/api/health"

# View check results
fly checks list
```

### Memory Issues

```toml
# fly.toml - increase memory
[[vm]]
  memory_mb = 512
```

### Connection Issues

```bash
# Check connectivity
fly ping my-app

# View IPs
fly ips list
```

### Database Connection Issues

```bash
# Verify DATABASE_URL
fly secrets list

# Test connection
fly ssh console -C "psql $DATABASE_URL -c 'SELECT 1'"
```

## Commands Reference

```bash
# Apps
fly launch              # Create and deploy new app
fly deploy              # Deploy to existing app
fly status              # Show app status
fly apps list           # List all apps
fly apps destroy        # Delete app

# Machines
fly machine list        # List machines
fly machine restart     # Restart machine
fly machine stop        # Stop machine
fly machine start       # Start machine

# Scaling
fly scale count N       # Scale to N machines
fly scale vm SIZE       # Change VM size
fly scale memory MB     # Change memory

# Secrets
fly secrets set K=V     # Set secret
fly secrets list        # List secrets
fly secrets unset K     # Remove secret

# Postgres
fly postgres create     # Create database
fly postgres connect    # Connect to database
fly postgres attach     # Attach to app

# Domains
fly certs create DOMAIN # Add domain
fly certs show DOMAIN   # Show certificate status
fly ips list           # List IP addresses

# Debugging
fly logs               # View logs
fly ssh console        # SSH into machine
fly proxy PORT         # Proxy port locally
fly doctor             # Diagnose issues
```

## Cost Estimation

| Resource | Free Tier | After Free |
|----------|-----------|------------|
| Shared CPU VMs | 3 | $1.94/mo each |
| Bandwidth | 160GB | $0.02/GB |
| Postgres | - | $0.50/GB/mo |
| Volumes | 3GB | $0.15/GB/mo |

**Typical costs:**
- Small app (1 machine): Free
- Production app (2 machines + DB): $10-20/mo
- Multi-region (6 machines + DB): $30-50/mo

## Related Documentation

- [Fly.io Documentation](https://fly.io/docs/)
- [flyctl Reference](https://fly.io/docs/flyctl/)
- [Fly Postgres](https://fly.io/docs/postgres/)
- [Deploy Next.js](https://fly.io/docs/js/frameworks/nextjs/)

---

**Last Updated:** 2024-12-08
