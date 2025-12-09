# Environment Variables Reference

Complete reference for all environment variables used in this template.

---

## Quick Reference Table

| Variable | Required | Category | Description |
|----------|----------|----------|-------------|
| `DATABASE_URL` | Yes | Database | Database connection string |
| `AUTH_SECRET` | Yes* | Auth | NextAuth.js secret key |
| `NEXTAUTH_URL` | Yes* | Auth | Application URL for auth callbacks |
| `NODE_ENV` | No | App | Environment (development/production) |

*Required if using authentication

---

## Application Variables

### Core

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `3000` | Server port |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Public app URL |

```bash
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Database Variables

### Primary Database

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Main database connection string |
| `DIRECT_URL` | No | Direct connection (for migrations in serverless) |

**PostgreSQL:**
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

**MySQL:**
```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
```

**SQLite:**
```bash
DATABASE_URL="file:./dev.db"
```

**MongoDB:**
```bash
DATABASE_URL="mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DATABASE"
```

### Where to Get Database Credentials

| Provider | How to Get |
|----------|------------|
| **Local** | Use your local DB credentials |
| **Supabase** | Dashboard > Settings > Database > Connection string |
| **Neon** | Dashboard > Connection Details |
| **PlanetScale** | Dashboard > Connect > Create password |
| **Vercel Postgres** | Vercel Dashboard > Storage > Connect |
| **Railway** | Project > Variables tab |

---

## Authentication Variables

### NextAuth.js

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | Secret for signing tokens |
| `NEXTAUTH_URL` | Yes | App URL for callbacks |
| `NEXTAUTH_SECRET` | Alias | Same as AUTH_SECRET |

```bash
# Generate secret: openssl rand -base64 32
AUTH_SECRET="K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols="
NEXTAUTH_URL="http://localhost:3000"
```

### OAuth Providers

#### GitHub

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_CLIENT_ID` | Yes* | OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | Yes* | OAuth App Client Secret |

**How to get:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and generate Client Secret

```bash
GITHUB_CLIENT_ID="Iv1.abc123def456"
GITHUB_CLIENT_SECRET="abc123def456ghi789jkl012mno345pqr678stu901"
```

#### Google

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_CLIENT_ID` | Yes* | OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Yes* | OAuth Client Secret |

**How to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID (Web application)
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret

```bash
GOOGLE_CLIENT_ID="123456789-abc123def456.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123def456"
```

#### Discord

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_CLIENT_ID` | Yes* | Application ID |
| `DISCORD_CLIENT_SECRET` | Yes* | Client Secret |

**How to get:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application
3. OAuth2 > Add redirect: `http://localhost:3000/api/auth/callback/discord`
4. Copy Client ID and Secret

```bash
DISCORD_CLIENT_ID="123456789012345678"
DISCORD_CLIENT_SECRET="abc123def456ghi789"
```

### Alternative Auth Providers

#### Clerk

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"
```

**How to get:** [Clerk Dashboard](https://dashboard.clerk.com) > API Keys

#### Auth0

```bash
AUTH0_SECRET="generate-with-openssl-rand-hex-32"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://YOUR_TENANT.auth0.com"
AUTH0_CLIENT_ID="xxx"
AUTH0_CLIENT_SECRET="xxx"
```

**How to get:** [Auth0 Dashboard](https://manage.auth0.com) > Applications

---

## External Services

### AI Services

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | No | OpenAI API key |
| `ANTHROPIC_API_KEY` | No | Anthropic/Claude API key |

**Where to get:**
- OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Anthropic: [console.anthropic.com](https://console.anthropic.com)

```bash
OPENAI_API_KEY="sk-xxx"
ANTHROPIC_API_KEY="sk-ant-xxx"
```

### Payments (Stripe)

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes* | Server-side secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes* | Webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes* | Client-side publishable key |

**Where to get:** [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

```bash
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
```

### Email (Resend)

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | No | Resend API key |

**Where to get:** [Resend Dashboard](https://resend.com/api-keys)

```bash
RESEND_API_KEY="re_xxx"
```

### File Uploads (Uploadthing)

| Variable | Required | Description |
|----------|----------|-------------|
| `UPLOADTHING_SECRET` | No | Uploadthing secret |
| `UPLOADTHING_APP_ID` | No | Uploadthing app ID |

**Where to get:** [Uploadthing Dashboard](https://uploadthing.com/dashboard)

```bash
UPLOADTHING_SECRET="sk_live_xxx"
UPLOADTHING_APP_ID="xxx"
```

---

## Monitoring & Error Tracking

### Sentry

![Sentry - Application Performance Monitoring & Error Tracking](../assets/screenshots/sentry-landing.png)

| Variable | Required | Description |
|----------|----------|-------------|
| `SENTRY_DSN` | No | Sentry Data Source Name |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Client-side Sentry DSN |
| `SENTRY_AUTH_TOKEN` | No | For source map uploads |

**Where to get:** [Sentry Project Settings](https://sentry.io) > Client Keys (DSN)

```bash
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
SENTRY_AUTH_TOKEN="sntrys_xxx"
```

---

## Cloud Storage

### AWS S3

| Variable | Required | Description |
|----------|----------|-------------|
| `AWS_ACCESS_KEY_ID` | No | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | No | AWS secret key |
| `AWS_REGION` | No | AWS region |
| `AWS_BUCKET_NAME` | No | S3 bucket name |

**Where to get:** [AWS IAM Console](https://console.aws.amazon.com/iam)

```bash
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="my-bucket"
```

### Cloudflare R2

| Variable | Required | Description |
|----------|----------|-------------|
| `R2_ACCESS_KEY_ID` | No | R2 access key |
| `R2_SECRET_ACCESS_KEY` | No | R2 secret key |
| `R2_BUCKET_NAME` | No | R2 bucket name |
| `R2_ACCOUNT_ID` | No | Cloudflare account ID |

**Where to get:** [Cloudflare Dashboard](https://dash.cloudflare.com) > R2

```bash
R2_ACCESS_KEY_ID="xxx"
R2_SECRET_ACCESS_KEY="xxx"
R2_BUCKET_NAME="my-bucket"
R2_ACCOUNT_ID="xxx"
```

---

## Caching (Redis)

| Variable | Required | Description |
|----------|----------|-------------|
| `REDIS_URL` | No | Redis connection URL |
| `UPSTASH_REDIS_REST_URL` | No | Upstash REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash REST token |

**Where to get:**
- Local: `redis://localhost:6379`
- Upstash: [Upstash Console](https://console.upstash.com)

```bash
REDIS_URL="redis://localhost:6379"
# OR
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"
```

---

## MCP Servers (Claude Code)

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | No | GitHub API access |
| `SLACK_BOT_TOKEN` | No | Slack bot token |
| `SLACK_TEAM_ID` | No | Slack workspace ID |
| `BRAVE_API_KEY` | No | Brave Search API |
| `POSTGRES_CONNECTION_STRING` | No | PostgreSQL for MCP |

**Where to get:**
- GitHub: [Personal Access Tokens](https://github.com/settings/tokens)
- Slack: [Slack Apps](https://api.slack.com/apps)
- Brave: [Brave Search API](https://brave.com/search/api/)

```bash
GITHUB_PERSONAL_ACCESS_TOKEN="ghp_xxx"
SLACK_BOT_TOKEN="xoxb-xxx"
SLACK_TEAM_ID="T12345678"
BRAVE_API_KEY="BSAxxx"
```

See [MCP Quick Start](../integrations/MCP_QUICKSTART.md) for setup details.

---

## Development-Only Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DEBUG` | `false` | Enable debug logging |
| `DISABLE_HTTPS_REDIRECT` | `false` | Skip HTTPS in dev |
| `SKIP_EMAIL_VERIFICATION` | `false` | Skip email verify in dev |

```bash
DEBUG=true
DISABLE_HTTPS_REDIRECT=true
SKIP_EMAIL_VERIFICATION=true
```

---

## Best Practices

### 1. Never Commit Secrets

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Use Different Values Per Environment

```
.env.local         # Local development (git-ignored)
.env.development   # Development defaults
.env.production    # Production defaults (no secrets!)
```

### 3. Document Required vs Optional

In your project's `.env.example`:

```bash
# [REQUIRED] Database
DATABASE_URL=

# [REQUIRED] Auth
AUTH_SECRET=

# [OPTIONAL] AI Features
OPENAI_API_KEY=
```

### 4. Validate at Startup

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

export const env = envSchema.parse(process.env)
```

### 5. Use 1Password or Similar for Team Secrets

Store secrets in a shared vault rather than sharing via Slack/email.

---

## Related Documentation

- [Setup Checklist](../../SETUP_CHECKLIST.md) - Quick setup guide
- [MCP Quick Start](../integrations/MCP_QUICKSTART.md) - MCP configuration
- [Auth Implementation](../frameworks/AUTH_IMPLEMENTATION_GUIDE.md) - Auth setup
- [Database Setup](../guides/infrastructure/DATABASE_SETUP.md) - Database configuration
