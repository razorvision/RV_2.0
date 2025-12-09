# Hosting Platform Comparison

Choose the right hosting platform for your application.

## Quick Comparison

| Platform | Best For | Free Tier | Starting Price | Docker |
|----------|----------|-----------|----------------|--------|
| **Vercel** | Next.js apps | Generous | $20/mo | Limited |
| **Railway** | Full-stack + DB | $5 credit | Usage-based | Yes |
| **Fly.io** | Global edge | $5 credit | Usage-based | Native |
| **Render** | Simple deploys | 750 hours | $7/mo | Yes |
| **AWS** | Enterprise | 12 months | Variable | Yes |
| **Cloudflare** | Edge/Workers | Generous | $5/mo | No |

## Platform Deep Dives

### Vercel

**Best for**: Next.js applications, frontend-heavy apps

| Feature | Details |
|---------|---------|
| **Frameworks** | Next.js (native), React, Vue, Nuxt |
| **Serverless Functions** | Yes, 10s timeout (free), 60s (pro) |
| **Edge Functions** | Yes, global |
| **Database** | Vercel Postgres, or external |
| **CDN** | Global, automatic |
| **Preview Deploys** | Every PR |
| **Custom Domains** | Free with SSL |

**Pricing**:
- Hobby: Free (100GB bandwidth, 100 builds/day)
- Pro: $20/user/mo (1TB bandwidth, unlimited builds)
- Enterprise: Custom

**Pros**:
- Zero-config Next.js deployments
- Excellent DX and documentation
- Automatic preview deployments
- Built-in analytics

**Cons**:
- Limited backend flexibility
- No built-in database (use external)
- Function timeouts on free tier
- Can get expensive at scale

---

### Railway

**Best for**: Full-stack apps needing database

| Feature | Details |
|---------|---------|
| **Frameworks** | Any (auto-detected) |
| **Databases** | PostgreSQL, MySQL, Redis, MongoDB |
| **Docker** | Full support |
| **CDN** | No built-in |
| **Preview Deploys** | PR environments |
| **Custom Domains** | Free with SSL |

**Pricing**:
- Free: $5 credit/month
- Usage-based: ~$0.000463/vCPU-min, $0.000231/GB-min
- Typical small app: $5-15/month

**Pros**:
- Built-in databases (no external setup)
- Simple environment management
- Docker support
- PR preview environments

**Cons**:
- No global CDN
- Credit system can be confusing
- Less mature than Vercel
- No edge functions

---

### Fly.io

**Best for**: Global deployment, Docker containers

| Feature | Details |
|---------|---------|
| **Frameworks** | Any (via Docker) |
| **Databases** | Fly Postgres, or external |
| **Docker** | Native support |
| **CDN** | Global anycast |
| **Multi-region** | Easy replication |
| **Volumes** | Persistent storage |

**Pricing**:
- Free: 3 shared VMs, 160GB transfer
- Shared CPU: $1.94/mo per machine
- Dedicated: Starting $29/mo

**Pros**:
- True global edge deployment
- Multi-region made easy
- Full Docker control
- Persistent volumes

**Cons**:
- Steeper learning curve
- More configuration needed
- No preview deployments by default
- Database requires more setup

---

### Render

**Best for**: Simple, predictable deployments

| Feature | Details |
|---------|---------|
| **Frameworks** | Any (auto-detected) |
| **Databases** | PostgreSQL |
| **Docker** | Yes |
| **Background Workers** | Yes |
| **Cron Jobs** | Yes |
| **Static Sites** | Free |

**Pricing**:
- Free: 750 hours/month (sleeps after inactivity)
- Starter: $7/mo (always on)
- Standard: $25/mo

**Pros**:
- Simple pricing
- Good free tier for static sites
- Easy PostgreSQL setup
- Background workers included

**Cons**:
- Free tier sleeps (cold starts)
- No edge functions
- Less performant than Vercel for Next.js
- Limited regions

---

### AWS (App Runner / ECS / Lambda)

**Best for**: Enterprise, existing AWS infrastructure

| Feature | Details |
|---------|---------|
| **Services** | App Runner, ECS, Lambda, Amplify |
| **Databases** | RDS, DynamoDB, Aurora |
| **Scaling** | Unlimited |
| **Compliance** | All certifications |
| **Regions** | 25+ |

**Pricing**:
- Free tier: 12 months for many services
- Highly variable based on usage
- Reserved instances save 30-60%

**Pros**:
- Unlimited scale
- Full AWS ecosystem
- Enterprise compliance
- Extensive customization

**Cons**:
- Complexity overhead
- Steep learning curve
- Unpredictable costs
- Requires more management

---

### Cloudflare Pages/Workers

**Best for**: Edge-first, static sites

| Feature | Details |
|---------|---------|
| **Frameworks** | Next.js (edge), static sites |
| **Workers** | Edge functions |
| **KV Storage** | Key-value store |
| **D1** | SQLite at edge |
| **R2** | Object storage |

**Pricing**:
- Free: 500 builds/month, unlimited requests
- Pro: $20/mo (20K workers/day)
- Paid Workers: $5/mo + usage

**Pros**:
- Incredible free tier
- True edge computing
- Fast static sites
- D1 database

**Cons**:
- Limited Next.js compatibility
- Workers have constraints
- Less traditional hosting
- D1 is still maturing

## Decision Matrix

### Choose Vercel if:
- Building with Next.js
- Need preview deployments
- Want zero-config setup
- Frontend-focused app
- Team collaboration important

### Choose Railway if:
- Need database included
- Building full-stack app
- Want Docker flexibility
- Simple environment management
- Rapid prototyping

### Choose Fly.io if:
- Need global edge deployment
- Docker is your standard
- Multi-region is required
- Want infrastructure control
- Running non-Node.js apps

### Choose Render if:
- Want simple, predictable pricing
- Building traditional web app
- Need background workers
- Static sites primary use
- PostgreSQL needed

### Choose AWS if:
- Enterprise requirements
- Need full customization
- Have AWS expertise
- Compliance requirements
- Massive scale expected

### Choose Cloudflare if:
- Edge-first architecture
- Static sites primary
- Want to minimize costs
- Building APIs/workers
- Already using Cloudflare

## Cost Comparison (Typical Small App)

| Platform | Monthly Cost | Includes |
|----------|--------------|----------|
| Vercel | $0-20 | Hosting, CDN |
| Railway | $5-15 | Hosting, Postgres |
| Fly.io | $5-15 | Hosting (global) |
| Render | $7-25 | Hosting, Postgres |
| AWS | $20-50+ | Everything |
| Cloudflare | $0-5 | Hosting, edge |

*Note: Costs vary significantly based on traffic and features used*

## Migration Paths

### From Local Development:
1. **Start with**: Vercel (Next.js) or Railway (full-stack)
2. **As you grow**: Stay or move based on needs
3. **At scale**: Consider Fly.io or AWS

### From Heroku:
- **Most similar**: Railway or Render
- **More control**: Fly.io
- **If Next.js**: Vercel

### From Vercel:
- **Need database**: Railway
- **Need Docker**: Fly.io
- **Need control**: AWS

## Platform-Specific Guides

- [Vercel Deployment Guide](../../deployment/VERCEL_DEPLOYMENT.md)
- [Railway Deployment Guide](../../deployment/RAILWAY_DEPLOYMENT.md)
- [Fly.io Deployment Guide](../../deployment/FLYIO_DEPLOYMENT.md)

---

**Last Updated:** 2024-12-08
