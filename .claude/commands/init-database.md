# Initialize Database

Set up database connection and Prisma ORM.

## Usage

```
/init-database [provider]
```

## Providers

- `supabase` - Supabase PostgreSQL (recommended for beginners)
- `neon` - Neon serverless PostgreSQL (recommended for serverless)
- `planetscale` - PlanetScale MySQL
- `local` - Local PostgreSQL via Docker
- `sqlite` - SQLite for simple projects

## What This Command Does

1. **Installs Prisma** and required dependencies
2. **Copies schema template** with common models
3. **Configures connection** for chosen provider
4. **Generates Prisma client**
5. **Provides setup instructions** for the provider

## Instructions for Claude

When the user runs `/init-database`, follow these steps:

### Step 1: Check Current State

```bash
# Check if Prisma is already installed
ls prisma/schema.prisma
cat package.json | grep prisma
```

### Step 2: Ask Provider Preference

If not specified, ask:
"Which database provider would you like to use?

1. **Supabase** - Free tier, great dashboard, easy setup
2. **Neon** - Serverless, auto-scaling, branching
3. **Local Docker** - PostgreSQL container for development
4. **SQLite** - Simple file-based, good for prototyping

[Default: Supabase]"

### Step 3: Install Dependencies

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### Step 4: Initialize Prisma

```bash
npx prisma init
```

### Step 5: Copy Schema Template

```bash
cp templates/prisma-schema.prisma.template prisma/schema.prisma
```

### Step 6: Configure for Provider

**For Supabase:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Update `.env.local`:
```bash
# Get these from Supabase Dashboard > Settings > Database
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

**For Neon:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
}
```

Update `.env.local`:
```bash
# Get from Neon Dashboard > Connection Details
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

**For Local Docker:**
```bash
# Start PostgreSQL container
docker compose up -d db

# Connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp_dev"
```

**For SQLite:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Step 7: Generate Client

```bash
npx prisma generate
```

### Step 8: Push Schema

```bash
npx prisma db push
```

### Step 9: Create Prisma Client Singleton

Copy `templates/next-app/src/lib/prisma.ts.template` to `src/lib/prisma.ts`

### Step 10: Verify Setup

```bash
npx prisma studio
```

Tell user: "Database is set up! Open http://localhost:5555 to view Prisma Studio."

## Provider-Specific Instructions

### Supabase Setup Steps

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Settings > Database
4. Copy connection strings (use "Connection pooling" for serverless)

### Neon Setup Steps

1. Go to [neon.tech](https://neon.tech) and create account
2. Create new project
3. Click "Connection Details"
4. Copy the connection string

### PlanetScale Setup Steps

1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Create branch (usually `main`)
4. Get connection string from Connect button
5. Note: Add `relationMode = "prisma"` to schema (no foreign keys)
