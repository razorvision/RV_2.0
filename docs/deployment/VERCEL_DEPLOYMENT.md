# Vercel Deployment Guide

Complete guide for deploying Next.js applications to Vercel.

## Why Vercel?

- **Native Next.js Support** - Built by the Next.js team
- **Zero Configuration** - Works out of the box
- **Preview Deployments** - Every PR gets a unique URL
- **Edge Network** - Global CDN with edge functions
- **Generous Free Tier** - 100GB bandwidth, unlimited deployments

## Prerequisites

- GitHub account
- Vercel account (sign up with GitHub at [vercel.com](https://vercel.com))
- Next.js application ready to deploy

## Quick Deploy

### Option 1: Import from GitHub (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your repository
4. Configure project settings (usually auto-detected)
5. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

## Project Configuration

### vercel.json (Optional)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/api/v1/:path*", "destination": "/api/:path*" }
  ],
  "redirects": [
    { "source": "/old-page", "destination": "/new-page", "permanent": true }
  ]
}
```

### Environment Variables

**Via Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add each variable with name and value
3. Select environments: Production, Preview, Development

**Via CLI:**
```bash
# Add environment variable
vercel env add DATABASE_URL

# Pull env to local .env file
vercel env pull .env.local
```

**Required Variables (typical Next.js app):**
```env
DATABASE_URL=postgresql://...
AUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://your-domain.vercel.app

# OAuth (if using)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Database Setup

Vercel doesn't include databases, but integrates with:

### Vercel Postgres (Built-in)

```bash
# Via CLI
vercel link
vercel env pull .env.local
```

Or connect via Dashboard → Storage → Create Database

### External Providers

| Provider | Connection String Format |
|----------|-------------------------|
| Supabase | `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres` |
| Neon | `postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require` |
| PlanetScale | `mysql://[user]:[password]@[host]/[database]?ssl={"rejectUnauthorized":true}` |

**Connection Pooling:**
For serverless, use connection pooling:
```env
# Prisma with connection pooling
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1"
```

## Build Configuration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for smaller deployments
  output: 'standalone',

  // Image optimization domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Environment variables available client-side
  env: {
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  },
}

module.exports = nextConfig
```

### Build Command Customization

```json
// package.json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postbuild": "next-sitemap"
  }
}
```

## Preview Deployments

Every PR automatically gets a preview deployment.

### Preview Environment Variables

Set variables specifically for preview deployments:
- Dashboard → Environment Variables → Select "Preview" environment
- Use different database/API keys for preview

### Branch-Specific Previews

```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "staging/*": true
    }
  }
}
```

### Comment on PRs

Enable automatic PR comments with deployment URL:
- Project Settings → Git → Enable "Deploy Previews"

## Custom Domain

### Adding a Domain

1. Project Settings → Domains
2. Enter your domain (e.g., `myapp.com`)
3. Add DNS records as shown

### DNS Configuration

**Option A: Vercel DNS (Recommended)**
- Transfer nameservers to Vercel
- Automatic SSL and configuration

**Option B: External DNS**
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### www Redirect

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/",
      "has": [{ "type": "host", "value": "www.myapp.com" }],
      "destination": "https://myapp.com",
      "permanent": true
    }
  ]
}
```

## Edge Functions & Middleware

### Middleware (Edge by default)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Runs at the edge, before the request reaches your app
  const response = NextResponse.next()

  // Add custom headers
  response.headers.set('x-custom-header', 'value')

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

### Edge API Routes

```typescript
// app/api/edge/route.ts
export const runtime = 'edge'

export async function GET() {
  return Response.json({ edge: true })
}
```

## Serverless Function Configuration

### Function Timeout

```json
// vercel.json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

**Limits by plan:**
- Hobby: 10 seconds
- Pro: 60 seconds
- Enterprise: 900 seconds

### Memory Configuration

```json
{
  "functions": {
    "api/heavy-task.ts": {
      "memory": 1024
    }
  }
}
```

## Cron Jobs

### vercel.json Configuration

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-cleanup",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/hourly-sync",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Cron Handler

```typescript
// app/api/cron/daily-cleanup/route.ts
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Perform cleanup
  await performCleanup()

  return Response.json({ success: true })
}
```

## Monitoring & Analytics

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Speed Insights

```bash
npm install @vercel/speed-insights
```

```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Logs & Debugging

```bash
# View logs
vercel logs your-project.vercel.app

# Real-time logs
vercel logs --follow
```

## CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Build Failures

**"Module not found" errors:**
```bash
# Clear cache and rebuild
vercel --force
```

**Prisma client not found:**
```json
// package.json - ensure generate runs before build
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### Environment Variable Issues

**Variables not available:**
- Check environment (Production/Preview/Development)
- Restart deployment after adding variables
- For client-side: prefix with `NEXT_PUBLIC_`

### Function Timeout

**Increase timeout or optimize:**
```json
{
  "functions": {
    "api/slow-route.ts": {
      "maxDuration": 30
    }
  }
}
```

### Cold Starts

**Reduce bundle size:**
```javascript
// Import only what you need
import { PrismaClient } from '@prisma/client'
// NOT: import * as Prisma from '@prisma/client'
```

### Database Connection Issues

**Use connection pooling for serverless:**
```env
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1"
```

## Commands Reference

```bash
# Development
vercel dev                    # Run locally with Vercel env

# Deployment
vercel                        # Deploy to preview
vercel --prod                 # Deploy to production
vercel --force                # Force rebuild

# Environment
vercel env add NAME           # Add env variable
vercel env pull               # Pull env to local
vercel env rm NAME            # Remove env variable

# Domains
vercel domains add domain.com # Add domain
vercel domains ls             # List domains

# Logs & Debugging
vercel logs                   # View logs
vercel logs --follow          # Real-time logs
vercel inspect [url]          # Inspect deployment

# Rollback
vercel rollback               # Rollback to previous
```

## Related Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Serverless Functions](https://vercel.com/docs/functions)

---

**Last Updated:** 2024-12-08
