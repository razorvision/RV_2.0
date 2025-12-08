# Environment Management Guide

Managing environment variables, secrets, and configuration across development, staging, and production environments.

## Table of Contents

- [Overview](#overview)
- [Environment Files](#environment-files)
- [Secret Management](#secret-management)
- [Dev Containers](#dev-containers)
- [Environment Validation](#environment-validation)
- [CI/CD Environments](#cicd-environments)
- [Secrets Rotation](#secrets-rotation)

## Overview

### Environment Types

| Environment | Purpose | Secrets Source |
|-------------|---------|----------------|
| **Local** | Developer machines | `.env.local` or 1Password CLI |
| **Dev Container** | Containerized dev | `.env.local` (copied into container) |
| **Preview** | PR preview deployments | Vercel Preview env vars |
| **Staging** | Pre-production testing | Vercel/Platform env vars |
| **Production** | Live application | Vercel/Platform env vars |

### Principles

1. **Never commit secrets** - Use `.gitignore` for all `.env*.local` files
2. **Validate early** - Check environment variables at build/startup
3. **Fail fast** - Missing required vars should crash, not silently fail
4. **Document everything** - Keep `.env.example` updated

## Environment Files

### File Hierarchy

```
.env                  # Shared defaults (committed)
.env.local            # Local overrides with secrets (NOT committed)
.env.development      # Development defaults (committed)
.env.development.local # Development secrets (NOT committed)
.env.production       # Production defaults (committed)
.env.production.local # Production secrets (NOT committed - rarely used)
.env.test             # Test environment (committed)
.env.test.local       # Test secrets (NOT committed)
```

### Load Order (Next.js)

1. `.env` (lowest priority)
2. `.env.local`
3. `.env.[environment]`
4. `.env.[environment].local` (highest priority)

### Example Files

```bash
# .env.example (committed - template for developers)
# Copy to .env.local and fill in values

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Third-party Services
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
SENTRY_DSN=""

# Feature Flags (optional)
ENABLE_NEW_DASHBOARD="false"
```

```bash
# .env (committed - safe defaults)
NODE_ENV="development"
NEXT_PUBLIC_APP_NAME="MyApp"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

```bash
# .env.local (NOT committed - actual secrets)
DATABASE_URL="postgresql://myuser:actualpassword@localhost:5432/myapp"
NEXTAUTH_SECRET="my-actual-secret-key-here"
GOOGLE_CLIENT_ID="123456789.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-actualSecret"
```

### Gitignore Configuration

```gitignore
# .gitignore
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## Secret Management

### Option 1: Manual .env.local

Best for: Small teams, simple projects

```bash
# Developer copies template and fills in values
cp .env.example .env.local
# Edit .env.local with actual values
```

**Pros:** Simple, no additional tooling
**Cons:** Manual syncing, easy to have stale values

### Option 2: 1Password CLI

Best for: Teams already using 1Password

```bash
# Install 1Password CLI
# macOS
brew install 1password-cli

# Windows
winget install 1Password.1PasswordCLI

# Authenticate
op signin

# Create .env.local from 1Password
op inject -i .env.1password -o .env.local
```

**.env.1password template:**
```bash
DATABASE_URL="op://Development/MyApp Database/connection_string"
NEXTAUTH_SECRET="op://Development/MyApp Auth/secret"
GOOGLE_CLIENT_ID="op://Development/Google OAuth/client_id"
GOOGLE_CLIENT_SECRET="op://Development/Google OAuth/client_secret"
```

**Pros:** Centralized secrets, easy rotation, team sync
**Cons:** Requires 1Password subscription, doesn't work in containers

### Option 3: Doppler

Best for: Larger teams, multiple environments

```bash
# Install Doppler CLI
brew install dopplerhq/cli/doppler

# Login and setup
doppler login
doppler setup

# Run with injected secrets
doppler run -- npm run dev

# Or export to .env.local
doppler secrets download --no-file --format env > .env.local
```

**Pros:** Environment-specific configs, audit logs, integrations
**Cons:** Additional service cost, learning curve

### Option 4: 1Password MCP Server

Best for: Teams using Claude Code with 1Password

The 1Password MCP server can inject secrets during development sessions, but has limitations:

```json
// .claude/settings.json
{
  "mcpServers": {
    "1password": {
      "command": "op",
      "args": ["mcp", "server"],
      "env": {
        "OP_SERVICE_ACCOUNT_TOKEN": "your-service-account-token"
      }
    }
  }
}
```

**Limitation:** MCP servers cannot connect to dev containers. For containerized development, you must:
1. Export secrets to `.env.local` before starting container
2. Mount `.env.local` into the container

## Dev Containers

### The Container Challenge

Dev containers provide isolated, reproducible environments but complicate secret management:

- 1Password CLI needs re-authentication inside container
- MCP servers run on host, can't reach container
- SSH agent forwarding is tricky

### Recommended Approach

**Before starting dev container:**

```bash
# Option A: Export from 1Password to .env.local
op inject -i .env.1password -o .env.local

# Option B: Copy from your existing .env.local
# (if you manage secrets manually)
```

**In devcontainer.json:**

```json
{
  "name": "My Project",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",

  // Mount .env.local into container
  "mounts": [
    "source=${localWorkspaceFolder}/.env.local,target=/workspaces/${localWorkspaceFolderBasename}/.env.local,type=bind"
  ],

  // Or use Docker Compose
  "dockerComposeFile": "docker-compose.yml",
  "service": "app",

  // Post-create verification
  "postCreateCommand": "node scripts/verify-env.js"
}
```

**docker-compose.yml for dev containers:**

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: .devcontainer/Dockerfile
    volumes:
      - .:/workspaces/myapp
      - ./.env.local:/workspaces/myapp/.env.local:ro
    environment:
      - NODE_ENV=development
    ports:
      - "3000:3000"

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: localdev
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Script to Prepare Container Secrets

```bash
#!/bin/bash
# scripts/prepare-container-secrets.sh

echo "Preparing secrets for dev container..."

# Check if 1Password CLI is available
if command -v op &> /dev/null; then
    echo "Using 1Password to inject secrets..."
    op inject -i .env.1password -o .env.local
elif [ -f ".env.local.encrypted" ]; then
    echo "Decrypting secrets..."
    # Use your preferred decryption method
    gpg --decrypt .env.local.encrypted > .env.local
else
    echo "⚠️  No secret source found!"
    echo "Please create .env.local manually from .env.example"
    exit 1
fi

echo "✅ Secrets prepared. You can now start the dev container."
```

## Environment Validation

### Zod Schema Validation

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // OAuth (optional in development)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Public vars (must start with NEXT_PUBLIC_)
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate at module load
function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.format());
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

export const env = validateEnv();
```

### Build-time Validation

```typescript
// next.config.js
const { z } = require('zod');

// Validate required env vars at build time
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

module.exports = {
  // ... your config
};
```

### Verification Script

```typescript
// scripts/verify-env.ts
import { config } from 'dotenv';
import { z } from 'zod';

config({ path: '.env.local' });

const schema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  // ... other vars
});

const result = schema.safeParse(process.env);

if (!result.success) {
  console.log('\n❌ Environment validation failed:\n');

  for (const issue of result.error.issues) {
    console.log(`  ${issue.path.join('.')}: ${issue.message}`);
  }

  console.log('\n📋 Check .env.example for required variables\n');
  process.exit(1);
}

console.log('✅ Environment variables validated successfully');
```

## CI/CD Environments

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

env:
  # Non-secret defaults
  NODE_ENV: test
  NEXT_PUBLIC_APP_URL: http://localhost:3000

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Run tests
        env:
          # Secrets from GitHub
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
        run: npm test
```

### Vercel Environment Variables

```bash
# Set via CLI
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# Or via dashboard
# Project → Settings → Environment Variables
```

**Environment scoping:**
- **Production:** Only production deployments
- **Preview:** PR preview deployments
- **Development:** `vercel dev` local development

### Environment-Specific Values

```bash
# Production
DATABASE_URL=postgresql://prod-host/prod-db

# Preview (use branch-specific databases if needed)
DATABASE_URL=postgresql://staging-host/preview-db

# Development
DATABASE_URL=postgresql://localhost/dev-db
```

## Secrets Rotation

### When to Rotate

- **Immediately:** If a secret is compromised or committed to git
- **Regularly:** Every 90 days for high-security secrets
- **On personnel changes:** When team members leave

### Rotation Process

1. **Generate new secret**
2. **Update in secret manager** (1Password, Vercel, etc.)
3. **Deploy with new secret**
4. **Verify application works**
5. **Revoke old secret**

### Rotation Checklist

```markdown
## Secret Rotation: [SECRET_NAME]

- [ ] Generate new secret value
- [ ] Update in 1Password/secret manager
- [ ] Update in Vercel (production)
- [ ] Update in Vercel (preview)
- [ ] Update local .env.local (or re-inject from 1Password)
- [ ] Deploy to staging
- [ ] Verify staging works
- [ ] Deploy to production
- [ ] Verify production works
- [ ] Revoke old secret (if applicable)
- [ ] Update team on new secret
```

### Automating Rotation

```bash
# Example: Rotate NEXTAUTH_SECRET

# 1. Generate new secret
NEW_SECRET=$(openssl rand -base64 32)

# 2. Update in 1Password
op item edit "MyApp Auth" "secret=$NEW_SECRET"

# 3. Update in Vercel
vercel env rm NEXTAUTH_SECRET production
echo "$NEW_SECRET" | vercel env add NEXTAUTH_SECRET production

# 4. Trigger deployment
vercel --prod
```

## Troubleshooting

### Common Issues

**"Environment variable not found"**
- Check file is named correctly (`.env.local` not `.env.local.txt`)
- Verify variable name matches exactly (case-sensitive)
- Restart dev server after changing `.env` files

**"Works locally but not in production"**
- Verify variable is set in Vercel/hosting platform
- Check if variable needs `NEXT_PUBLIC_` prefix for client access
- Ensure production environment is selected

**"Dev container can't access secrets"**
- Run `scripts/prepare-container-secrets.sh` before starting container
- Check `.env.local` is mounted correctly
- Verify file permissions inside container

## Related Resources

- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Dev Environment Setup](../DEV_ENVIRONMENT_SETUP.md)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
