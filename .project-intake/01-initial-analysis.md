# Step 1: Initial Codebase Analysis

## 🎯 Goal

Systematically explore the codebase to understand its structure, tech stack, dependencies, features, and configuration. This analysis forms the foundation for generating accurate documentation.

## 📋 Instructions for Claude Code

### Phase 1: Tech Stack Identification

Use Glob and Read tools to answer:

1. **What is the frontend framework?**
   - Look for: React, Vue, Angular, Svelte, etc.
   - Check: `package.json` dependencies
   - Evidence: Component file extensions (.jsx, .tsx, .vue, etc.)

2. **What is the build tool?**
   - Look for: Vite, Webpack, Parcel, esbuild, etc.
   - Check: `vite.config.ts`, `webpack.config.js`, etc.
   - Evidence: Build scripts in `package.json`

3. **What is the styling approach?**
   - Look for: Tailwind, CSS Modules, styled-components, Sass, etc.
   - Check: `tailwind.config.ts`, `postcss.config.js`, `*.module.css` files
   - Evidence: `import` statements in components

4. **What is the routing solution?**
   - Look for: React Router, Vue Router, Next.js routing, etc.
   - Check: Main app file, routing configuration
   - Evidence: Route definitions, navigation patterns

5. **What is the backend framework?** (if applicable)
   - Look for: Express, Fastify, Koa, Next.js API routes, etc.
   - Check: `server/` folder, API route files
   - Evidence: Server setup files

6. **What is the database?** (if applicable)
   - Look for: PostgreSQL, MySQL, MongoDB, SQLite, etc.
   - Check: `drizzle.config.ts`, `prisma.schema`, connection files
   - Evidence: Database client imports, ORM configuration

7. **What is the ORM/Query Builder?** (if database exists)
   - Look for: Drizzle, Prisma, TypeORM, Sequelize, etc.
   - Check: Schema files, migration folders
   - Evidence: Database client usage patterns

### Phase 2: Project Structure Mapping

Use Glob tool to map the folder structure:

```bash
# Look for main folders
**/ (depth 1)

# Look for source code locations
src/**, client/**, app/**, pages/**, components/**

# Look for configuration
*.config.{ts,js,json}

# Look for documentation
*.md

# Look for server code
server/**, api/**, backend/**
```

Document:
- **Top-level folders** and their purposes
- **Source code organization** (client, server, shared, etc.)
- **Component structure** (pages, components, hooks, contexts, etc.)
- **Asset locations** (public, assets, static, etc.)
- **Configuration files** (root vs nested)

### Phase 3: Key Dependencies Analysis

Read `package.json` and analyze:

1. **Production Dependencies** (`dependencies`)
   - Group by purpose:
     - UI Framework (react, vue, etc.)
     - State Management (zustand, redux, etc.)
     - Data Fetching (@tanstack/react-query, swr, etc.)
     - Routing (react-router-dom, etc.)
     - UI Components (@radix-ui, etc.)
     - Forms (react-hook-form, etc.)
     - Validation (zod, yup, etc.)
     - Backend (express, cors, etc.)
     - Database (drizzle-orm, pg, etc.)
     - Authentication (bcrypt, jsonwebtoken, etc.)

2. **Development Dependencies** (`devDependencies`)
   - Group by purpose:
     - Build Tools (vite, webpack, etc.)
     - TypeScript (@types/*, typescript)
     - Linting (eslint, prettier)
     - Testing (vitest, jest, playwright)
     - Styling (tailwindcss, postcss, autoprefixer)

3. **Package Manager**
   - Check for: `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`
   - Document version if specified in `packageManager` field

### Phase 4: Existing Features Inventory

Map out existing pages and features:

1. **Frontend Pages**
   - Use Glob: `client/pages/**/*.{tsx,jsx,ts,js,vue}`
   - List all page components
   - Document route paths (check router config)

2. **Backend API Endpoints** (if applicable)
   - Look for: Route definitions, API handlers
   - Check: `server/routes/`, `server/api/`, route registration
   - Document endpoint paths and methods

3. **Key Components**
   - Use Glob: `client/components/**/*.{tsx,jsx,ts,js,vue}`
   - Identify reusable components
   - Note any component libraries used (shadcn/ui, etc.)

4. **State Management**
   - Look for: Context providers, stores, state hooks
   - Check: `contexts/`, `store/`, `providers/`

5. **Data Layer**
   - Look for: Database schemas, models, migrations
   - Check: `server/db/schema.ts`, `migrations/`, `models/`

### Phase 5: Design System Analysis

Analyze the design system configuration:

1. **Color Palette**
   - Read: `tailwind.config.ts` (extend.colors)
   - Read: `client/global.css` or equivalent (CSS custom properties)
   - Document: Primary, secondary, accent, semantic colors
   - Note: Dark mode support (if present)

2. **Typography**
   - Read: `tailwind.config.ts` (extend.fontFamily)
   - Check: Font imports in HTML or CSS
   - Document: Heading styles, body text, font weights

3. **Spacing & Layout**
   - Check: Tailwind spacing scale
   - Note: Custom spacing values
   - Document: Container widths, breakpoints

4. **Components**
   - Check: `components.json` (for shadcn/ui)
   - Document: Component library configuration
   - Note: Custom component patterns

### Phase 6: Configuration Files Inventory

Document all configuration files and their purposes:

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build tool configuration
- `tailwind.config.ts` - Styling configuration
- `postcss.config.js` - CSS processing
- `.prettierrc` - Code formatting
- `.eslintrc.*` - Linting rules (if present)
- `drizzle.config.ts` - Database ORM (if present)
- `components.json` - UI component library (if present)
- `.env` / `.env.example` - Environment variables
- `.gitignore` - Git exclusions
- `.dockerignore` - Docker exclusions (if present)
- `docker-compose.yml` - Docker setup (if present)

For each config file, document:
- **Purpose** - What it configures
- **Key Settings** - Important configuration values
- **Dependencies** - What other configs it relates to

## 📊 Output Format

Create a comprehensive analysis document with these sections:

```markdown
# Codebase Analysis Report

## Tech Stack Summary
- Frontend: [Framework + Version]
- Build Tool: [Tool + Version]
- Styling: [Approach]
- Routing: [Solution]
- Backend: [Framework] (if applicable)
- Database: [Type + ORM] (if applicable)
- Package Manager: [pnpm/npm/yarn + version]

## Project Structure
[Folder tree with descriptions]

## Key Dependencies
### Production
[List with purposes]

### Development
[List with purposes]

## Existing Features
### Pages
[List with descriptions]

### API Endpoints (if applicable)
[List with methods and paths]

### Key Components
[List with purposes]

## Design System
### Colors
[Palette with hex values]

### Typography
[Font families and styles]

### Layout
[Breakpoints and spacing]

## Configuration Files
[List with purposes and key settings]

## Observations
- [Notable patterns]
- [Potential improvements]
- [Missing documentation]
- [Security considerations]
```

## ✅ Completion Criteria

Before moving to Step 2, ensure you have:

- ✅ Identified all major technologies
- ✅ Mapped the project structure
- ✅ Analyzed dependencies by purpose
- ✅ Inventoried all pages and features
- ✅ Documented the design system
- ✅ Listed all configuration files
- ✅ Created a comprehensive analysis report

## 🔄 Next Step

Once analysis is complete, proceed to:
**02-git-setup.md** - Install git hooks and configure version control

---

**Estimated Time:** 10-15 minutes
**Tools Used:** Glob, Read
**Output:** Comprehensive codebase analysis document
