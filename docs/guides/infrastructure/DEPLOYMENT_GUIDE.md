# Deployment Guide

Comprehensive guide for deploying web applications to production.

## Table of Contents

- [Deployment Platforms](#deployment-platforms)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Environment Variables](#environment-variables)
- [Preview Deployments](#preview-deployments)
- [Custom Domains](#custom-domains)
- [Deployment Checklist](#deployment-checklist)

---

## Deployment Platforms

| Platform | Best For | Free Tier | Notes |
|----------|----------|-----------|-------|
| **Vercel** | Next.js apps | Generous | Native Next.js support |
| **Netlify** | Static sites, SSG | Generous | Great for Jamstack |
| **Railway** | Full-stack apps | $5 credit/mo | Good for databases |
| **Render** | Full-stack apps | Limited | Auto-scaling |
| **AWS Amplify** | AWS ecosystem | Limited | Complex but powerful |
| **Cloudflare Pages** | Static/edge | Very generous | Fast global CDN |

---

## Vercel Deployment

### Initial Setup

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Select the repository and click "Import"

2. **Configure Project**
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: ./ (or your app directory)
   Build Command: npm run build (default)
   Output Directory: .next (default)
   Install Command: npm install (default)
   ```

3. **Add Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required variables (see [Environment Variables](#environment-variables))

### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

### Deployment via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Pull environment variables locally
vercel env pull .env.local
```

---

## Netlify Deployment

### Initial Setup

1. **Connect Repository**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "New site from Git"
   - Select your Git provider and repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next (for Next.js) or out (for static)
   ```

### netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

# Redirects
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"

# Preview deploy settings
[context.deploy-preview]
  command = "npm run build"

[context.branch-deploy]
  command = "npm run build"
```

### Deployment via CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize project
netlify init

# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## Environment Variables

### Required Variables (Example)

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# OAuth Providers
GITHUB_ID="your-github-oauth-id"
GITHUB_SECRET="your-github-oauth-secret"

# Public Variables (accessible in browser)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
```

### Environment Scopes (Vercel)

| Scope | Description | Use For |
|-------|-------------|--------|
| **Production** | Only production deployments | Secrets, prod URLs |
| **Preview** | PR and branch deployments | Test credentials |
| **Development** | Local development (`vercel dev`) | Local overrides |

### Security Best Practices

1. **Never commit secrets** - Use `.env.local` for local dev
2. **Use different secrets per environment** - Separate prod/preview/dev
3. **Rotate secrets regularly** - Especially after team changes
4. **Limit variable scope** - Only give preview what it needs
5. **Use secret references** - Vercel/Netlify support encrypted secrets

### Syncing Variables

```bash
# Vercel: Pull from cloud
vercel env pull .env.local

# Netlify: Pull from cloud  
netlify env:import .env.local
```

---

## Preview Deployments

### How Preview Deployments Work

1. Developer pushes branch or opens PR
2. Platform builds and deploys to unique URL
3. Team reviews on preview URL
4. Merge deploys to production

### Preview URLs

**Vercel:**
```
https://<project>-<unique-hash>-<org>.vercel.app
https://<project>-git-<branch>-<org>.vercel.app
```

**Netlify:**
```
https://deploy-preview-<pr-number>--<site-name>.netlify.app
https://<branch>--<site-name>.netlify.app
```

### Preview Environment Configuration

```bash
# Preview-specific variables
NEXTAUTH_URL="https://${VERCEL_URL}"  # Dynamic URL
DATABASE_URL="postgres://...staging-db..."  # Staging database
```

### Commenting on PRs

Both Vercel and Netlify automatically comment on PRs with:
- Preview URL
- Build status
- Performance metrics (Vercel)

---

## Custom Domains

### Adding a Domain (Vercel)

1. Go to Project Settings > Domains
2. Enter your domain (e.g., `example.com`)
3. Configure DNS records:

```
# For apex domain (example.com)
Type: A
Name: @
Value: 76.76.21.21

# For www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Adding a Domain (Netlify)

1. Go to Site Settings > Domain management
2. Add custom domain
3. Configure DNS:

```
# For apex domain
Type: A
Name: @
Value: 75.2.60.5

# For www
Type: CNAME
Name: www
Value: <site-name>.netlify.app
```

### SSL Certificates

Both platforms provide automatic SSL via Let's Encrypt:
- Automatically provisioned on domain add
- Auto-renewed before expiration
- Enforces HTTPS by default

### Domain Redirects

```javascript
// vercel.json - Redirect www to apex
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.example.com" }],
      "destination": "https://example.com/:path*",
      "permanent": true
    }
  ]
}
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing locally
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables documented
- [ ] Database migrations applied
- [ ] No console.logs or debug code
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (if needed)

### Environment Variables

- [ ] All required variables set in platform
- [ ] Secrets are unique per environment
- [ ] NEXTAUTH_URL matches domain
- [ ] Database URL points to correct database
- [ ] OAuth callback URLs updated

### Domain Setup

- [ ] DNS records configured
- [ ] SSL certificate provisioned
- [ ] WWW redirect configured
- [ ] Old URLs redirected (if migrating)

### Post-Deployment

- [ ] Site loads correctly
- [ ] Authentication works
- [ ] API endpoints respond
- [ ] Forms submit successfully
- [ ] Analytics tracking
- [ ] Error tracking active
- [ ] Performance acceptable

### Monitoring Setup

- [ ] Uptime monitoring configured
- [ ] Error alerts configured
- [ ] Performance monitoring active
- [ ] Log aggregation working

---

## Troubleshooting

### Build Failures

```bash
# Check build locally
npm run build

# Check for missing env vars
# Build logs will show "undefined" for missing vars

# Check Node version matches
node --version
```

### Environment Variable Issues

```typescript
// Debug: Log available env vars (remove in production!)
console.log('Env check:', {
  hasDbUrl: !!process.env.DATABASE_URL,
  hasAuthSecret: !!process.env.NEXTAUTH_SECRET,
})
```

### Database Connection Issues

```bash
# Verify connection string format
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require

# Check if IP is allowlisted (for managed databases)
# Vercel IPs change - use connection pooling or allowlist all
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `NEXTAUTH_URL` mismatch | Wrong URL in env | Set to actual domain |
| Database timeout | Cold start / pooling | Use connection pooler |
| 404 on refresh | Missing rewrites | Add catch-all rewrite |
| Build OOM | Large build | Increase memory limit |

---

## Related Documentation

- [Repo Setup Guide](REPO_SETUP_GUIDE.md) - CI/CD workflows
- [Environment Variables](DEV_ENVIRONMENT_SETUP.md) - Local env setup
- [Incident Response](INCIDENT_RESPONSE.md) - Production issues
