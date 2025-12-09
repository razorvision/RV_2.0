# Railway Deployment Guide

Complete guide for deploying full-stack applications to Railway.

## Why Railway?

- **Built-in Databases** - PostgreSQL, MySQL, Redis, MongoDB included
- **Simple Pricing** - Pay for what you use, $5 free credit/month
- **Docker Support** - Deploy any containerized application
- **GitHub Integration** - Automatic deployments on push
- **Preview Environments** - PR-based environments

## Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Application ready to deploy

## Quick Deploy

### Option 1: GitHub Import (Recommended)

1. Go to [railway.app/new](https://railway.app/new)
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects framework and configures build
5. Click "Deploy Now"

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project (in your repo)
railway init

# Deploy
railway up
```

### Option 3: Template

```bash
# Deploy from template
railway init --template nextjs-prisma
```

## Project Structure

Railway projects contain **services**:

```
Project
├── Web Service (your app)
├── PostgreSQL (database)
├── Redis (cache)
└── Worker (background jobs)
```

## Adding a Database

### PostgreSQL

1. In your project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway creates and provisions the database
4. Copy `DATABASE_URL` to your service variables

**Or via CLI:**
```bash
railway add --database postgres
```

### Redis

1. Click "New Service" → "Database" → "Redis"
2. Copy `REDIS_URL` to your service variables

### Connecting Services

Railway automatically provides connection variables:
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

Link them in your service:
1. Go to your web service
2. Click "Variables"
3. Click "Add Reference" → Select database
4. Choose the variable to reference

## Environment Variables

### Via Dashboard

1. Select your service
2. Go to "Variables" tab
3. Add key-value pairs
4. Changes trigger new deployment

### Via CLI

```bash
# Set variable
railway variables set DATABASE_URL=postgresql://...

# Set from local .env
railway variables set --from-env

# View all variables
railway variables
```

### Required Variables (typical app)

```env
# Auto-provided by Railway
PORT=3000
DATABASE_URL=postgresql://...

# You must add
AUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://your-app.railway.app

# OAuth (if using)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## Configuration

### railway.json (Optional)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Procfile (Alternative)

```procfile
web: npm start
worker: npm run worker
```

### Dockerfile

If you need custom configuration:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Start
EXPOSE 3000
CMD ["npm", "start"]
```

## Build Configuration

### Nixpacks (Default)

Railway uses Nixpacks to auto-detect and build your app. It supports:
- Node.js (package.json)
- Python (requirements.txt, pyproject.toml)
- Go (go.mod)
- Rust (Cargo.toml)
- And more...

### Custom Build Commands

**Via Dashboard:**
Settings → Build Command

**Via railway.json:**
```json
{
  "build": {
    "buildCommand": "prisma generate && npm run build"
  }
}
```

### Build Environment Variables

Some variables only needed at build time:
- Settings → Variables → Add variable → Select "Build" environment

## Custom Domain

### Adding a Domain

1. Select your service
2. Go to "Settings" → "Networking"
3. Click "Generate Domain" (free `.railway.app` domain)
4. Or click "Custom Domain" → Enter your domain

### DNS Configuration

Railway provides the target for your CNAME:
```
Type    Name    Value
CNAME   @       your-service.railway.app
CNAME   www     your-service.railway.app
```

## Preview Environments

### Enable PR Environments

1. Project Settings → Environments
2. Enable "PR Environments"
3. Each PR gets isolated environment with its own database

### Environment Variables for PRs

Set different variables for PR environments:
- Variables → Select "PR" environment type
- Add preview-specific values

## Background Workers

### Separate Service for Workers

1. Add new service from same repo
2. Configure different start command:
```json
{
  "deploy": {
    "startCommand": "npm run worker"
  }
}
```

### Cron Jobs

Use a scheduled service:

1. Add new service
2. Settings → Deploy → Enable "Cron Schedule"
3. Set cron expression: `0 * * * *` (hourly)

```typescript
// worker/cron.ts
async function main() {
  console.log('Running scheduled task...')
  await performTask()
  process.exit(0)
}

main()
```

## Monorepo Support

### Specify Root Directory

Settings → Source → Root Directory

```
my-monorepo/
├── apps/
│   ├── web/          # Root: apps/web
│   └── api/          # Root: apps/api
└── packages/
```

### Watch Paths

Only deploy when specific paths change:

Settings → Source → Watch Paths
```
apps/web/**
packages/shared/**
```

## Scaling & Resources

### Horizontal Scaling

```json
{
  "deploy": {
    "numReplicas": 2
  }
}
```

### Vertical Scaling

Adjust resources via Dashboard:
- Settings → Resource Limits
- Set memory (up to 32GB)
- Set vCPU (up to 8)

### Auto-scaling (Pro plan)

- Enable in Settings → Scaling
- Configure min/max replicas
- Set CPU threshold

## Monitoring

### Logs

```bash
# View logs
railway logs

# Follow logs
railway logs -f

# Filter by service
railway logs --service web
```

### Metrics

Dashboard shows:
- CPU usage
- Memory usage
- Network I/O
- Deployment history

### Health Checks

```json
{
  "deploy": {
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100
  }
}
```

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'healthy', timestamp: Date.now() })
}
```

## CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
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

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: web
```

## Database Migrations

### Run Migrations on Deploy

**Option 1: Build command**
```json
{
  "build": {
    "buildCommand": "npm run build && npx prisma migrate deploy"
  }
}
```

**Option 2: Pre-deploy command**
Settings → Deploy → Pre-deploy Command
```
npx prisma migrate deploy
```

### Manual Migrations

```bash
# Connect to database
railway connect postgres

# Run migration locally against Railway DB
railway run npx prisma migrate deploy
```

## Troubleshooting

### Build Failures

**Check build logs:**
```bash
railway logs --build
```

**Common issues:**
- Missing `engines` field in package.json
- Build command not specified
- Missing environment variables at build time

### Application Crashes

**Check runtime logs:**
```bash
railway logs
```

**Common issues:**
- Port not set (use `process.env.PORT`)
- Database connection failing
- Missing runtime environment variables

### Database Connection Issues

**Verify connection:**
```bash
# Get connection info
railway variables

# Test connection locally
railway run npx prisma db pull
```

**Use connection pooling:**
```env
DATABASE_URL="postgresql://...?connection_limit=5"
```

### Memory Issues

**Increase memory:**
Settings → Resource Limits → Memory

**Optimize app:**
- Reduce bundle size
- Implement proper garbage collection
- Use streaming for large responses

## Commands Reference

```bash
# Project Management
railway init              # Initialize new project
railway link              # Link to existing project
railway up                # Deploy current directory
railway down              # Remove deployment

# Environment
railway variables         # List variables
railway variables set K=V # Set variable
railway run <cmd>         # Run command with env

# Database
railway add               # Add service
railway connect postgres  # Connect to database

# Logs
railway logs              # View logs
railway logs -f           # Follow logs
railway logs --build      # Build logs

# Other
railway open              # Open dashboard
railway status            # Show project status
railway whoami            # Show current user
```

## Cost Estimation

Railway uses usage-based pricing:

| Resource | Price |
|----------|-------|
| vCPU | $0.000463/min |
| Memory | $0.000231/GB/min |
| Network Egress | $0.10/GB |
| Postgres | Included in compute |

**Free tier:** $5 credit/month (enough for small apps)

**Typical costs:**
- Small Next.js app: $5-10/month
- App + Database + Redis: $15-25/month

## Related Documentation

- [Railway Documentation](https://docs.railway.app/)
- [Railway Templates](https://railway.app/templates)
- [Nixpacks](https://nixpacks.com/)
- [Railway CLI Reference](https://docs.railway.app/reference/cli-api)

---

**Last Updated:** 2024-12-08
