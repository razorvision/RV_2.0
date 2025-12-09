# Initialize Authentication

Set up authentication with your chosen provider.

## Usage

```
/init-auth [provider]
```

## Providers

- `nextauth` - NextAuth.js (recommended - free, flexible)
- `clerk` - Clerk (fastest setup, hosted UI)
- `supabase` - Supabase Auth (if using Supabase database)

## What This Command Does

1. **Installs auth dependencies**
2. **Creates auth configuration**
3. **Sets up API routes**
4. **Creates session provider**
5. **Generates required env variables**

## Instructions for Claude

When the user runs `/init-auth`, follow these steps:

### Step 1: Check Prerequisites

```bash
# Check if database is set up (required for NextAuth with Prisma)
ls prisma/schema.prisma
```

If no database, suggest running `/init-database` first.

### Step 2: Ask Provider Preference

If not specified:
"Which auth provider would you like?

1. **NextAuth.js** - Free, open source, full control
   - Best for: Custom auth flows, multiple providers

2. **Clerk** - Hosted UI, 5-minute setup
   - Best for: Fastest setup, don't want to manage auth UI

3. **Supabase Auth** - Integrated with Supabase
   - Best for: Already using Supabase database

[Default: NextAuth.js]"

### Step 3: Install Dependencies

**For NextAuth.js:**
```bash
npm install next-auth @auth/prisma-adapter
```

**For Clerk:**
```bash
npm install @clerk/nextjs
```

**For Supabase Auth:**
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Step 4: Create Configuration

**For NextAuth.js:**

Copy `templates/next-app/src/lib/auth.ts.template` to `src/lib/auth.ts`

Create `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

**For Clerk:**

Create `src/middleware.ts`:
```typescript
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

Wrap app in `src/app/layout.tsx`:
```typescript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### Step 5: Update Environment Variables

**For NextAuth.js:**
```bash
# Required
AUTH_SECRET=          # Run: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (add the ones you want)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**For Clerk:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Step 6: Update Prisma Schema (NextAuth only)

Ensure schema has NextAuth models:
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  // ... (full schema in templates/prisma-schema.prisma.template)
}

model Session { ... }
model User { ... }
model VerificationToken { ... }
```

Run:
```bash
npx prisma db push
npx prisma generate
```

### Step 7: Ask About OAuth Providers

"Which OAuth providers do you want to set up?

1. GitHub (easiest to set up)
2. Google
3. Both
4. I'll add them later

[Default: GitHub]"

### Step 8: Provide OAuth Setup Instructions

**For GitHub:**
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and generate Client Secret

**For Google:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Set callback URL: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret

### Step 9: Create Sign-In Page (Optional)

Ask: "Would you like me to create a sign-in page? (y/n)"

If yes, create `src/app/auth/signin/page.tsx`:
```typescript
'use client'

import { signIn } from 'next-auth/react'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <div className="mt-6 space-y-4">
          <button
            onClick={() => signIn('github')}
            className="btn-primary w-full"
          >
            Continue with GitHub
          </button>
          <button
            onClick={() => signIn('google')}
            className="btn-outline w-full"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Step 10: Test Authentication

```bash
npm run dev
# Visit http://localhost:3000/api/auth/signin
```

Tell user: "Authentication is set up! Visit /api/auth/signin to test."
