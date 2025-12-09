# Initialize New Project

Initialize a new project from the template with the specified tech stack.

## Usage

```
/init-project [options]
```

## Options

- `--name <name>` - Project name (defaults to current directory name)
- `--stack nextjs|fastapi|express` - Tech stack (default: nextjs)
- `--database postgres|mysql|sqlite` - Database (default: postgres)
- `--auth nextauth|clerk|none` - Authentication (default: nextauth)
- `--skip-docker` - Skip Docker setup

## What This Command Does

1. **Copies starter templates** to your project
2. **Configures package.json** with your project name
3. **Sets up database schema** with Prisma
4. **Creates authentication** configuration
5. **Generates .env.example** with required variables
6. **Sets up Docker** for local development (unless skipped)

## Instructions for Claude

When the user runs `/init-project`, follow these steps:

### Step 1: Gather Information

Ask the user for any missing information:
- Project name (if not in current directory)
- Tech stack preference
- Database preference
- Authentication provider

### Step 2: Copy Templates

Based on the stack, copy appropriate templates:

**For Next.js:**
```bash
# Copy from templates/next-app/
cp templates/next-app/package.json.template package.json
cp templates/next-app/tsconfig.json.template tsconfig.json
cp templates/next-app/tailwind.config.ts.template tailwind.config.ts
cp templates/next-app/next.config.js.template next.config.js
mkdir -p src/app src/lib
cp templates/next-app/src/app/*.template src/app/
cp templates/next-app/src/lib/*.template src/lib/

# Copy shared templates
cp templates/prisma-schema.prisma.template prisma/schema.prisma
cp templates/docker-compose.yml.template docker-compose.yml
cp .env.example .env.local
```

### Step 3: Customize Files

Replace placeholders in all files:
- `YOUR_PROJECT_NAME` → actual project name
- `YOUR_APP_NAME` → display name
- `YOUR_APP_DESCRIPTION` → project description

### Step 4: Rename Template Files

Remove `.template` extension from all copied files:
```bash
for f in $(find . -name "*.template"); do mv "$f" "${f%.template}"; done
```

### Step 5: Install Dependencies

```bash
npm install
```

### Step 6: Set Up Database

```bash
# Start local database
docker compose up -d db

# Initialize Prisma
npx prisma generate
npx prisma db push
```

### Step 7: Create Auth Route

Create `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### Step 8: Final Instructions

Tell the user:
1. Edit `.env.local` with your database URL and auth secrets
2. Run `npm run dev` to start the development server
3. Visit http://localhost:3000

## Example Interaction

User: `/init-project --name my-saas-app`

Claude:
"I'll initialize a new Next.js project called 'my-saas-app'.

What authentication would you like?
1. NextAuth.js (recommended - free, flexible)
2. Clerk (fastest setup, hosted UI)
3. None (add later)

[After user responds, proceed with setup...]"
