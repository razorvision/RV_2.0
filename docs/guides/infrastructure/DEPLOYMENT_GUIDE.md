# Deployment Guide

Complete guide for deploying applications to production, including CI/CD setup, hosting configuration, and environment management.

## Table of Contents

- [Deployment Platforms](#deployment-platforms)
- [Environment Variables](#environment-variables)
- [CI/CD Pipeline](#cicd-pipeline)
- [Preview Deployments](#preview-deployments)
- [Domain Configuration](#domain-configuration)
- [Monitoring & Alerts](#monitoring--alerts)
- [Rollback Procedures](#rollback-procedures)

## Deployment Platforms

### Vercel (Recommended for Next.js)

#### Initial Setup

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

#### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, max-age=0" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

### Netlify

#### netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### Self-Hosted (Docker)

#### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Environment Variables

### Variable Categories

| Category | Example | Where to Set |
|----------|---------|--------------|
| **Secrets** | `DATABASE_URL`, `NEXTAUTH_SECRET` | Platform secrets, never in code |
| **Config** | `NEXT_PUBLIC_API_URL` | Platform env vars |
| **Build-time** | `NEXT_PUBLIC_*` | Build environment |
| **Runtime** | Server-only vars | Runtime environment |

### Environment File Structure

```bash
# .env.local (local development, never committed)
DATABASE_URL="postgresql://localhost:5432/myapp"
NEXTAUTH_SECRET="local-dev-secret"
NEXTAUTH_URL="http://localhost:3000"

# .env.example (committed, shows required vars)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"

# .env.test (for test environment)
DATABASE_URL="postgresql://localhost:5432/myapp_test"
```

### Vercel Environment Variables

```bash
# Set via CLI
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# Or via dashboard: Project Settings → Environment Variables
```

### Validation at Build Time

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

// Validate on import
export const env = envSchema.parse(process.env);

// Usage: import { env } from '@/lib/env'
// env.DATABASE_URL is now typed and validated
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

  e2e:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Branch Protection Rules

Configure in GitHub repository settings:

1. Require pull request reviews before merging
2. Require status checks to pass:
   - `lint`
   - `test`
   - `build`
3. Require branches to be up to date
4. Do not allow bypassing the above settings

## Preview Deployments

### Vercel Preview Deployments

Automatically created for every PR. Configure in `vercel.json`:

```json
{
  "github": {
    "enabled": true,
    "autoAlias": true,
    "silent": false
  }
}
```

### Preview Environment Variables

Set preview-specific variables:

```bash
# Different database for previews
vercel env add DATABASE_URL preview
# Enter: postgresql://preview-db.example.com/myapp
```

### PR Comments with Preview URL

```yaml
# .github/workflows/preview-comment.yml
name: Preview Comment

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const prNumber = context.payload.pull_request.number;
            const previewUrl = `https://myapp-git-pr-${prNumber}-myteam.vercel.app`;

            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: prNumber,
              body: `🚀 Preview deployment available at: ${previewUrl}`
            });
```

## Domain Configuration

### DNS Setup

| Record Type | Name | Value | Purpose |
|-------------|------|-------|---------|
| A | @ | 76.76.21.21 | Root domain (Vercel) |
| CNAME | www | cname.vercel-dns.com | www subdomain |
| CNAME | api | cname.vercel-dns.com | API subdomain |

### SSL/TLS

Both Vercel and Netlify provide automatic SSL certificates. For custom certificates:

```bash
# Vercel
vercel certs add your-domain.com

# Netlify
# Upload via dashboard: Domain settings → HTTPS → Custom certificate
```

### Redirect Configuration

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "www.example.com" }],
      "destination": "https://example.com/$1",
      "permanent": true
    }
  ]
}
```

## Monitoring & Alerts

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'connected',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'disconnected',
        },
      },
      { status: 503 }
    );
  }
}
```

### Uptime Monitoring

Configure external monitoring (e.g., Better Uptime, Pingdom):

- Monitor: `https://your-domain.com/api/health`
- Interval: 1 minute
- Alert channels: Slack, email, PagerDuty

### Error Tracking

```typescript
// lib/monitoring.ts
// Example with Sentry
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out certain errors
    if (event.exception?.values?.[0]?.type === 'NetworkError') {
      return null;
    }
    return event;
  },
});
```

## Rollback Procedures

### Vercel Rollback

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]

# Or via dashboard:
# Deployments → Select deployment → "..." menu → "Promote to Production"
```

### Database Rollback

```bash
# If using Prisma migrations
npx prisma migrate resolve --rolled-back "migration_name"

# Then apply previous migration
npx prisma migrate deploy
```

### Emergency Rollback Checklist

1. **Identify the issue** - Check error logs, monitoring alerts
2. **Communicate** - Notify team in incident channel
3. **Rollback deployment** - Use platform's rollback feature
4. **Verify** - Check health endpoint and key user flows
5. **Investigate** - Root cause analysis after service is restored
6. **Document** - Create incident report

See [Incident Response](INCIDENT_RESPONSE.md) for detailed procedures.

## Related Resources

- [Incident Response](INCIDENT_RESPONSE.md)
- [Dev Environment Setup](DEV_ENVIRONMENT_SETUP.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
