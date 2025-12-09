# Deployment Guides

Step-by-step guides for deploying your application to various platforms.

## Available Guides

| Platform | Best For | Guide |
|----------|----------|-------|
| [Vercel](VERCEL_DEPLOYMENT.md) | Next.js, Frontend | Easiest for Next.js apps |
| [Railway](RAILWAY_DEPLOYMENT.md) | Full-stack, Databases | Quick deployments with built-in Postgres |
| [Fly.io](FLYIO_DEPLOYMENT.md) | Docker, Global Edge | Best for containers and edge deployment |

## Quick Comparison

| Feature | Vercel | Railway | Fly.io |
|---------|--------|---------|--------|
| **Free Tier** | Generous | $5 credit/mo | $5 credit/mo |
| **Next.js Support** | Native | Good | Good |
| **Database** | Via partners | Built-in Postgres | Via partners |
| **Docker** | Limited | Full | Native |
| **Edge Functions** | Yes | No | Yes |
| **Preview Deploys** | Yes | Yes | Manual |
| **GitHub Integration** | Excellent | Excellent | Good |
| **Custom Domains** | Free | Free | Free |
| **SSL** | Automatic | Automatic | Automatic |

## Choosing a Platform

### Use Vercel when:

- Building with Next.js (best-in-class support)
- You want zero-config deployments
- You need preview deployments for PRs
- Edge functions are important
- You'll use external database (Supabase, Neon, PlanetScale)

### Use Railway when:

- You need PostgreSQL included
- You have a full-stack app (frontend + backend + database)
- You want simple environment management
- Docker deployment is needed
- You're prototyping quickly

### Use Fly.io when:

- You need global edge deployment
- Docker is your primary deployment method
- You need full control over infrastructure
- You're deploying non-Node.js apps
- Multi-region redundancy is important

## Pre-Deployment Checklist

Before deploying any application:

- [ ] **Environment Variables** - All secrets configured in platform
- [ ] **Database** - Production database provisioned
- [ ] **Domain** - Custom domain ready (optional)
- [ ] **Build** - App builds successfully locally
- [ ] **Tests** - All tests passing
- [ ] **Security** - No secrets in code, proper CORS settings

## Environment Variables

### Required for Most Apps

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
AUTH_SECRET=<generate-with-openssl>
NEXTAUTH_URL=https://your-domain.com

# API Keys (if applicable)
STRIPE_SECRET_KEY=sk_live_...
RESEND_API_KEY=re_...
```

### Generating Secrets

```bash
# Generate a secure secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database Options

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| [Supabase](https://supabase.com) | 500MB | Full BaaS, Auth included |
| [Neon](https://neon.tech) | 512MB | Serverless Postgres |
| [PlanetScale](https://planetscale.com) | 5GB | MySQL, branching |
| [Railway](https://railway.app) | Shared | Quick setup |
| [Turso](https://turso.tech) | 8GB | SQLite edge |

## Continuous Deployment

All platforms support GitHub integration:

1. **Connect Repository** - Link your GitHub repo
2. **Set Production Branch** - Usually `main` or `master`
3. **Configure Build** - Set build command if needed
4. **Add Environment Variables** - Configure secrets
5. **Enable Auto-Deploy** - Pushes trigger deployments

### Preview Deployments

- **Vercel**: Automatic for all PRs
- **Railway**: Automatic with PR environments
- **Fly.io**: Manual with `fly deploy --app preview-app`

## Monitoring & Observability

After deployment, set up:

1. **Error Tracking** - Sentry, LogRocket
2. **Analytics** - Vercel Analytics, Plausible, PostHog
3. **Uptime Monitoring** - BetterUptime, Checkly
4. **Logging** - Platform logs, Axiom, Datadog

## Rollback Strategies

### Vercel
```bash
# Rollback to previous deployment
vercel rollback
```

### Railway
```bash
# Rollback via dashboard or CLI
railway rollback
```

### Fly.io
```bash
# List releases
fly releases

# Rollback to specific release
fly deploy --image registry.fly.io/app:v123
```

## Cost Optimization

### Free Tier Tips

1. **Use serverless functions** - Pay per invocation
2. **Optimize cold starts** - Smaller bundles = faster starts
3. **Cache aggressively** - Reduce function invocations
4. **Use edge caching** - Reduce origin requests

### When to Upgrade

- Consistent traffic > 100K requests/month
- Need more than 1 concurrent build
- Require advanced features (teams, SSO)
- Need guaranteed uptime SLA

## Related Documentation

- [Getting Started](../getting-started/) - Initial project setup
- [Framework Guides](../frameworks/) - Framework-specific patterns
- [Integration Guides](../integrations/) - Third-party service setup

---

**Need help?** Each guide includes troubleshooting sections for common issues.
