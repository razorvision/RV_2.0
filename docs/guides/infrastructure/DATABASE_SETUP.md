# Database Setup Guide

Guide for setting up databases with various providers and ORMs. This template primarily uses Prisma with PostgreSQL, but this guide covers alternatives.

---

## Quick Start Decision Tree

```
                    Which database?
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   PostgreSQL          MySQL            SQLite
   (recommended)    (alternative)     (dev only)
        │                 │                 │
        ▼                 ▼                 ▼
   - Supabase        - PlanetScale    - Local file
   - Neon            - Railway        - No setup
   - Railway         - AWS RDS        - Great for
   - Vercel Postgres                    prototyping
```

---

## PostgreSQL (Recommended)

### Why PostgreSQL?

- Most feature-rich open-source database
- Excellent Prisma support
- Great for production workloads
- Many free hosting options

### Local Development

**Option 1: Docker (Recommended)**

```bash
# Start PostgreSQL container
docker run --name postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp_dev \
  -p 5432:5432 \
  -d postgres:15-alpine

# Connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp_dev"
```

**Option 2: Native Installation**

```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb myapp_dev

# Connection string
DATABASE_URL="postgresql://localhost:5432/myapp_dev"
```

**Option 3: Postgres.app (macOS)**

Download from [postgresapp.com](https://postgresapp.com/), install, and start.

### Cloud Providers (Free Tiers)

#### Supabase (Recommended for beginners)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Settings > Database**
4. Copy connection string (use "Connection pooling" for serverless)

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

#### Neon (Recommended for serverless)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string from dashboard

```bash
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"
```

#### Vercel Postgres

1. In Vercel dashboard, go to **Storage**
2. Create Postgres database
3. Copy `POSTGRES_URL` to your `.env.local`

```bash
DATABASE_URL="postgres://..."  # Provided by Vercel
```

#### Railway

1. Create account at [railway.app](https://railway.app)
2. New Project > Provision PostgreSQL
3. Copy connection string from Variables tab

---

## MySQL

### When to Use MySQL

- Existing MySQL infrastructure
- Specific MySQL features needed
- Team familiarity with MySQL

### Local Development

**Docker:**

```bash
docker run --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=myapp_dev \
  -p 3306:3306 \
  -d mysql:8

# Connection string
DATABASE_URL="mysql://root:password@localhost:3306/myapp_dev"
```

### Cloud Providers

#### PlanetScale (Recommended for MySQL)

1. Create account at [planetscale.com](https://planetscale.com)
2. Create new database
3. Create branch (main)
4. Get connection string from **Connect** button

```bash
DATABASE_URL="mysql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslaccept=strict"
```

**Note:** PlanetScale doesn't support foreign keys by default. Use `relationMode = "prisma"` in schema:

```prisma
// prisma/schema.prisma
datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}
```

---

## SQLite

### When to Use SQLite

- Local development only
- Prototyping
- Simple applications
- No external dependencies needed

### Setup

No installation required! Just set the connection string:

```bash
DATABASE_URL="file:./dev.db"
```

Prisma will create the file automatically.

### Limitations

- Not recommended for production web apps
- No concurrent writes
- Limited to single server
- Some Prisma features unavailable

---

## MongoDB

### When to Use MongoDB

- Document-based data model
- Flexible schema requirements
- Existing MongoDB infrastructure

### Setup with Prisma

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  email String @unique
  name  String?
}
```

### Local Development

**Docker:**

```bash
docker run --name mongo-dev \
  -p 27017:27017 \
  -d mongo:7

# Connection string
DATABASE_URL="mongodb://localhost:27017/myapp_dev"
```

### Cloud Providers

#### MongoDB Atlas (Free tier)

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string from **Connect**

```bash
DATABASE_URL="mongodb+srv://[USER]:[PASSWORD]@[CLUSTER].mongodb.net/[DATABASE]"
```

---

## Prisma Setup

### Installation

```bash
npm install prisma @prisma/client
npx prisma init
```

### Schema Example

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // or "mysql", "sqlite", "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Common Commands

```bash
# Push schema to database (development)
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Create migration (production)
npx prisma migrate dev --name init

# Deploy migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (GUI)
npx prisma studio

# Reset database
npx prisma migrate reset
```

---

## Alternative ORMs

### Drizzle ORM

Lighter weight, SQL-like syntax:

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

```typescript
// db/schema.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### Kysely

Type-safe SQL query builder:

```bash
npm install kysely pg
```

```typescript
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  }),
})
```

---

## Environment Variables Summary

```bash
# PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# MySQL
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"

# SQLite
DATABASE_URL="file:./dev.db"

# MongoDB
DATABASE_URL="mongodb://HOST:27017/DATABASE"
# or MongoDB Atlas
DATABASE_URL="mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DATABASE"

# Connection pooling (for serverless - Prisma)
DATABASE_URL="postgresql://...?pgbouncer=true"
DIRECT_URL="postgresql://..."  # For migrations
```

---

## Troubleshooting

### "Can't reach database server"

1. Check connection string format
2. Verify database is running: `docker ps` or check cloud dashboard
3. Check firewall/network access (cloud providers)
4. Ensure SSL settings are correct

### "Schema drift detected"

```bash
# Reset and resync
npx prisma db push --force-reset

# Or create migration to fix
npx prisma migrate dev
```

### "Prisma Client not generated"

```bash
npx prisma generate
```

### "Connection timeout" (Serverless)

Use connection pooling:

```bash
# With Prisma Accelerate or PgBouncer
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1"
```

---

## Related Documentation

- [Prisma Patterns](../../frameworks/PRISMA_PATTERNS.md) - Advanced Prisma usage
- [Database Patterns](../../frameworks/DATABASE_PATTERNS.md) - Query patterns
- [Environment Management](./ENVIRONMENT_MANAGEMENT.md) - Managing env vars
