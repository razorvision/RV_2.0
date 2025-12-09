# Database Comparison Guide

Choose the right database solution for your application.

## Quick Comparison

| Database | Type | Best For | Free Tier | Serverless |
|----------|------|----------|-----------|------------|
| **Supabase** | Postgres | Full-stack BaaS | 500MB | Yes |
| **Neon** | Postgres | Serverless Postgres | 512MB | Yes |
| **PlanetScale** | MySQL | Branching workflow | 5GB | Yes |
| **Turso** | SQLite | Edge applications | 8GB | Yes |
| **MongoDB Atlas** | Document | Flexible schema | 512MB | Yes |
| **Railway Postgres** | Postgres | Quick setup | $5 credit | No |
| **Vercel Postgres** | Postgres | Vercel integration | 256MB | Yes |

## Database Types

### SQL (Relational)

| Database | Dialect | Key Features |
|----------|---------|--------------|
| PostgreSQL | SQL | Full-featured, JSON support, extensions |
| MySQL | SQL | Fast reads, mature ecosystem |
| SQLite | SQL | Embedded, zero config, edge-ready |

**Use SQL when**:
- Complex queries and joins
- ACID transactions required
- Structured, consistent data
- Reporting and analytics

### NoSQL (Non-relational)

| Database | Type | Key Features |
|----------|------|--------------|
| MongoDB | Document | Flexible schema, JSON-native |
| Redis | Key-Value | Caching, real-time, pub/sub |
| DynamoDB | Key-Value | AWS-native, unlimited scale |

**Use NoSQL when**:
- Unstructured/varying data
- Horizontal scaling priority
- Real-time applications
- Simple key-value patterns

## Platform Deep Dives

### Supabase

**Best for**: Full-stack apps wanting a complete backend

| Feature | Details |
|---------|---------|
| **Database** | PostgreSQL 15 |
| **Auth** | Built-in, multiple providers |
| **Storage** | S3-compatible object storage |
| **Real-time** | WebSocket subscriptions |
| **Edge Functions** | Deno-based |
| **Row Level Security** | Native Postgres RLS |

**Pricing**:
- Free: 500MB database, 1GB storage, 2GB bandwidth
- Pro: $25/mo (8GB database, 100GB storage)
- Team: $599/mo

**Connection String**:
```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Pros**:
- Complete backend solution
- Great developer experience
- Real-time built-in
- Self-hostable

**Cons**:
- Free tier limitations
- Can be expensive at scale
- Some features in beta
- Learning curve for RLS

---

### Neon

**Best for**: Serverless-first PostgreSQL

| Feature | Details |
|---------|---------|
| **Database** | PostgreSQL 15/16 |
| **Branching** | Git-like database branches |
| **Scaling** | Scale to zero |
| **Pooling** | Built-in connection pooling |
| **Regions** | Multiple AWS regions |

**Pricing**:
- Free: 512MB storage, 10 branches
- Launch: $19/mo (10GB, 100 branches)
- Scale: $69/mo (50GB, unlimited)

**Connection String**:
```
postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require
```

**Pros**:
- True serverless (scale to zero)
- Database branching for dev/preview
- Fast cold starts
- Generous free tier

**Cons**:
- Postgres only
- Newer platform
- No built-in auth/storage
- Some query latency

---

### PlanetScale

**Best for**: MySQL with Git-like workflow

| Feature | Details |
|---------|---------|
| **Database** | MySQL (Vitess) |
| **Branching** | Schema changes via branches |
| **Deploy Requests** | PR-like schema changes |
| **Insights** | Query analytics |
| **Scaling** | Horizontal sharding |

**Pricing**:
- Free: 5GB storage, 1 billion reads/mo
- Scaler: $29/mo (10GB, 100B reads)
- PS-10: $39/mo (per GB pricing)

**Connection String**:
```
mysql://[user]:[password]@[host]/[database]?ssl={"rejectUnauthorized":true}
```

**Pros**:
- Excellent branching workflow
- No foreign key constraints (can be pro)
- Infinite scale potential
- Great DevEx

**Cons**:
- MySQL only
- No foreign keys (design choice)
- Can be expensive
- Learning curve for Vitess

---

### Turso

**Best for**: Edge-first SQLite applications

| Feature | Details |
|---------|---------|
| **Database** | LibSQL (SQLite fork) |
| **Edge** | Global edge replication |
| **Embedded** | Can embed in apps |
| **Sync** | Local-first support |

**Pricing**:
- Free: 8GB storage, 1B rows read
- Scaler: $29/mo (24GB, more reads)
- Enterprise: Custom

**Connection String**:
```
libsql://[database]-[org].turso.io?authToken=[token]
```

**Pros**:
- SQLite compatibility
- Edge deployment
- Great for local-first
- Generous free tier

**Cons**:
- Limited advanced SQL features
- Newer platform
- Different from Postgres/MySQL
- Smaller ecosystem

---

### MongoDB Atlas

**Best for**: Flexible schema, document storage

| Feature | Details |
|---------|---------|
| **Database** | MongoDB |
| **Search** | Atlas Search built-in |
| **Charts** | Built-in visualization |
| **Triggers** | Database triggers |
| **Data API** | REST/GraphQL access |

**Pricing**:
- Free: 512MB (shared cluster)
- Serverless: $0.10/million reads
- Dedicated: $57/mo+

**Connection String**:
```
mongodb+srv://[user]:[password]@[cluster].mongodb.net/[database]
```

**Pros**:
- Flexible schema
- Good for unstructured data
- Built-in search
- Mature ecosystem

**Cons**:
- Different query language
- Not great for complex joins
- Can be expensive
- Less type-safe

---

### Railway Postgres

**Best for**: Quick setup alongside Railway hosting

| Feature | Details |
|---------|---------|
| **Database** | PostgreSQL 15 |
| **Setup** | One-click from Railway |
| **Backups** | Point-in-time recovery |
| **Connection** | Auto-linked to apps |

**Pricing**:
- Usage-based (part of $5/mo credit)
- ~$0.000231/GB-min

**Pros**:
- Instant setup
- Automatic env vars
- Good for prototyping
- Simple pricing

**Cons**:
- Limited to Railway
- Fewer features than managed DBs
- No connection pooling by default
- Tied to Railway pricing

## ORM Compatibility

| Database | Prisma | Drizzle | TypeORM | Mongoose |
|----------|--------|---------|---------|----------|
| Supabase (PG) | Yes | Yes | Yes | No |
| Neon (PG) | Yes | Yes | Yes | No |
| PlanetScale (MySQL) | Yes | Yes | Yes | No |
| Turso (SQLite) | Yes | Yes | Limited | No |
| MongoDB | No | No | No | Yes |

## Decision Matrix

### Choose Supabase if:
- Want complete backend (auth, storage, real-time)
- Building full-stack app quickly
- Need real-time subscriptions
- Want to self-host eventually

### Choose Neon if:
- Need serverless PostgreSQL
- Want database branching
- Building preview environments
- Using Vercel/serverless

### Choose PlanetScale if:
- Prefer MySQL
- Want Git-like schema changes
- Need horizontal scaling
- Large-scale application

### Choose Turso if:
- Building edge-first app
- Need SQLite compatibility
- Local-first architecture
- Simple data requirements

### Choose MongoDB if:
- Flexible/varying schema
- Document-oriented data
- Need full-text search
- Rapid prototyping

### Choose Railway Postgres if:
- Already using Railway
- Quick prototype needed
- Simple requirements
- Budget-conscious

## Performance Considerations

### Connection Pooling

For serverless, always use connection pooling:

```typescript
// Prisma with connection pooling
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add pooling params
  // ?pgbouncer=true&connection_limit=1
}
```

### Cold Starts

| Database | Cold Start |
|----------|------------|
| Neon | ~500ms (first query) |
| PlanetScale | ~100ms |
| Supabase | Minimal (always on) |
| Turso | ~50ms (edge) |

### Query Performance

| Database | Strength | Weakness |
|----------|----------|----------|
| PostgreSQL | Complex queries | Simple lookups |
| MySQL | Read-heavy | Complex joins |
| SQLite | Simple CRUD | High concurrency |
| MongoDB | Flexible reads | Complex joins |

## Data Migration

### PostgreSQL to PostgreSQL
```bash
# Export from source
pg_dump -h source-host -U user dbname > backup.sql

# Import to target
psql -h target-host -U user dbname < backup.sql
```

### Prisma Migrations
```bash
# Generate migration
npx prisma migrate dev --name init

# Deploy migration
npx prisma migrate deploy
```

### MongoDB to PostgreSQL
Consider tools like:
- [pgloader](https://pgloader.io/)
- Custom ETL scripts
- Prisma with both connections

## Security Checklist

- [ ] Use connection pooling in production
- [ ] Enable SSL/TLS connections
- [ ] Implement Row Level Security (if applicable)
- [ ] Use environment variables for credentials
- [ ] Regular backups configured
- [ ] Monitor query performance
- [ ] Set up alerts for unusual activity

## Related Documentation

- [Supabase Patterns](../../frameworks/SUPABASE_PATTERNS.md)
- [Prisma Patterns](../../frameworks/PRISMA_PATTERNS.md)
- [Database Patterns](../../frameworks/DATABASE_PATTERNS.md)
- [Deployment Guides](../../deployment/) - Database hosting options

---

**Last Updated:** 2024-12-08
