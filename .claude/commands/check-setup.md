# Check Setup

Validate that your development environment is properly configured.

## Usage

```
/check-setup
```

## What This Command Checks

1. **Required files** - package.json, .env.local, etc.
2. **Environment variables** - All required vars are set
3. **Database connection** - Can connect to database
4. **Dependencies** - All packages installed
5. **TypeScript** - No type errors
6. **Auth configuration** - Auth routes work

## Instructions for Claude

When the user runs `/check-setup`, perform these checks:

### Check 1: Required Files

```bash
# Check for required files
ls -la package.json
ls -la .env.local || ls -la .env
ls -la tsconfig.json
ls -la prisma/schema.prisma
ls -la src/app/layout.tsx
```

Report missing files:
- [ ] `package.json` - Required
- [ ] `.env.local` - Required for environment variables
- [ ] `tsconfig.json` - Required for TypeScript
- [ ] `prisma/schema.prisma` - Required if using database
- [ ] `src/app/layout.tsx` - Required for Next.js App Router

### Check 2: Environment Variables

```bash
# Read .env.local and check for required variables
cat .env.local
```

**Required variables:**
- [ ] `DATABASE_URL` - Database connection string
- [ ] `AUTH_SECRET` or `NEXTAUTH_SECRET` - Auth encryption key

**Recommended variables:**
- [ ] `NEXTAUTH_URL` - Should be set to app URL
- [ ] OAuth credentials (if using OAuth)

Report:
```
Environment Variables:
✅ DATABASE_URL is set
❌ AUTH_SECRET is missing - Run: openssl rand -base64 32
✅ NEXTAUTH_URL is set
⚠️  GITHUB_CLIENT_ID is empty (optional)
```

### Check 3: Dependencies

```bash
# Check if node_modules exists and key packages are installed
ls node_modules/.prisma/client 2>/dev/null || echo "Prisma client not generated"
ls node_modules/next 2>/dev/null || echo "Next.js not installed"
```

If issues found:
```bash
npm install
npx prisma generate
```

### Check 4: Database Connection

```bash
# Test database connection
npx prisma db pull --print
```

Or create a test script:
```typescript
// scripts/check-db.ts
import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
    const userCount = await prisma.user.count()
    console.log(`   Found ${userCount} users`)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
```

### Check 5: TypeScript

```bash
# Run type check
npx tsc --noEmit
```

Report any type errors found.

### Check 6: Auth Routes

```bash
# Check if auth routes exist
ls src/app/api/auth/\[...nextauth\]/route.ts
```

If using NextAuth, verify:
- Auth config file exists (`src/lib/auth.ts`)
- API route exists
- Prisma adapter is configured

### Check 7: Lint

```bash
npm run lint
```

### Summary Report

Generate a summary:

```
╔══════════════════════════════════════════════════════════════╗
║                    SETUP CHECK RESULTS                       ║
╠══════════════════════════════════════════════════════════════╣
║ Required Files                                               ║
║   ✅ package.json                                            ║
║   ✅ .env.local                                              ║
║   ✅ tsconfig.json                                           ║
║   ✅ prisma/schema.prisma                                    ║
║                                                              ║
║ Environment Variables                                        ║
║   ✅ DATABASE_URL                                            ║
║   ✅ AUTH_SECRET                                             ║
║   ⚠️  GITHUB_CLIENT_ID (optional, empty)                     ║
║                                                              ║
║ Services                                                     ║
║   ✅ Database connected (PostgreSQL)                         ║
║   ✅ Prisma client generated                                 ║
║   ✅ Auth routes configured                                  ║
║                                                              ║
║ Code Quality                                                 ║
║   ✅ TypeScript: No errors                                   ║
║   ✅ ESLint: No errors                                       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ STATUS: ✅ Ready for development                             ║
║                                                              ║
║ Next steps:                                                  ║
║   npm run dev                                                ║
╚══════════════════════════════════════════════════════════════╝
```

### If Issues Found

Provide specific fix instructions:

```
Issues Found:

1. ❌ AUTH_SECRET is missing
   Fix: Add to .env.local:
   AUTH_SECRET="$(openssl rand -base64 32)"

2. ❌ Prisma client not generated
   Fix: Run:
   npx prisma generate

3. ❌ Database connection failed
   Fix: Check DATABASE_URL in .env.local
   Current: postgresql://localhost:5432/myapp
   Is your database running? Try: docker compose up -d db
```

## Quick Fixes

If the user wants to fix all issues automatically:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Install missing dependencies
npm install
```
