# Next.js App Router Starter Templates

Production-ready templates for Next.js 14+ applications with TypeScript, Tailwind CSS, Prisma, and NextAuth.js.

## Quick Start

```bash
# 1. Copy all templates to your project
cp -r templates/next-app/* your-project/

# 2. Rename .template files
cd your-project
for f in $(find . -name "*.template"); do mv "$f" "${f%.template}"; done

# 3. Install dependencies
npm install

# 4. Set up database
npx prisma db push
npx prisma generate

# 5. Start development
npm run dev
```

## Template Files

| File | Purpose |
|------|---------|
| `package.json.template` | Dependencies and scripts (Next.js, Prisma, NextAuth, Tailwind) |
| `tsconfig.json.template` | TypeScript configuration with strict mode |
| `tailwind.config.ts.template` | Tailwind with custom colors and animations |
| `next.config.js.template` | Next.js config with security headers, images, standalone output |
| `src/app/layout.tsx.template` | Root layout with metadata, fonts, SEO |
| `src/app/providers.tsx.template` | Client providers (SessionProvider, ThemeProvider) |
| `src/app/globals.css.template` | Global styles with utility classes |
| `src/app/page.tsx.template` | Homepage with hero and feature cards |
| `src/lib/prisma.ts.template` | Prisma client singleton |
| `src/lib/auth.ts.template` | NextAuth.js configuration |

## Customization Checklist

After copying the templates:

- [ ] Update `package.json` → Change `name` field
- [ ] Update `layout.tsx` → Replace `YOUR_APP_NAME`, `YOUR_APP_DESCRIPTION`
- [ ] Update `page.tsx` → Customize homepage content
- [ ] Update `tailwind.config.ts` → Adjust brand colors
- [ ] Update `next.config.js` → Add your image domains
- [ ] Create `.env.local` from `.env.example`

## Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
AUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (pick providers you need)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Directory Structure

After setup, your project should look like:

```
your-project/
├── prisma/
│   └── schema.prisma        # Copy from templates/prisma-schema.prisma.template
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/          # Your components
│   └── lib/
│       ├── auth.ts
│       └── prisma.ts
├── public/
├── .env.local
├── docker-compose.yml       # Copy from templates/docker-compose.yml.template
├── Dockerfile               # Copy from templates/Dockerfile.template
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Related Templates

- [`templates/api-route.ts.template`](../api-route.ts.template) - API route pattern with validation
- [`templates/prisma-schema.prisma.template`](../prisma-schema.prisma.template) - Database schema
- [`templates/docker-compose.yml.template`](../docker-compose.yml.template) - Local dev services
- [`templates/Dockerfile.template`](../Dockerfile.template) - Production container

## Documentation

- [Next.js Patterns](../../docs/frameworks/NEXTJS_PATTERNS.md)
- [Prisma Patterns](../../docs/frameworks/PRISMA_PATTERNS.md)
- [Auth Implementation Guide](../../docs/frameworks/AUTH_IMPLEMENTATION_GUIDE.md)
- [Database Setup](../../docs/guides/infrastructure/DATABASE_SETUP.md)
