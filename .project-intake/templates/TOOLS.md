# Development Tools Documentation

Comprehensive guide to all development tools, scripts, and CLI commands used in this project.

## Table of Contents

- [Package Manager Commands](#package-manager-commands)
- [Development Scripts](#development-scripts)
- [Testing Commands](#testing-commands)
- [Build and Deploy](#build-and-deploy)
- [Database Tools](#database-tools)
- [Code Quality Tools](#code-quality-tools)
- [Git Workflow Tools](#git-workflow-tools)
- [CI/CD Tools](#cicd-tools)
- [Debugging Tools](#debugging-tools)

---

## Package Manager Commands

### npm / pnpm / yarn

**Install dependencies:**
```bash
npm install          # Install from package.json
pnpm install        # Faster alternative
yarn install        # Yarn alternative
```

**Add new dependency:**
```bash
npm install <package>              # Production dependency
npm install -D <package>           # Dev dependency
npm install -g <package>           # Global install
```

**Update dependencies:**
```bash
npm update                         # Update all packages
npm update <package>              # Update specific package
npm outdated                      # Check for outdated packages
```

**Remove dependency:**
```bash
npm uninstall <package>
npm uninstall -D <package>       # Remove dev dependency
```

---

## Development Scripts

### Start Development Server

```bash
npm run dev
```

**What it does:**
- Starts development server with hot reload
- Usually runs on `http://localhost:3000`
- Watches for file changes
- Shows compilation errors in terminal

**Options:**
```bash
npm run dev -- --port 4000       # Custom port
npm run dev -- --host 0.0.0.0    # Expose to network
```

---

### Build for Production

```bash
npm run build
```

**What it does:**
- Compiles TypeScript to JavaScript
- Bundles and minifies code
- Optimizes assets (images, fonts)
- Generates source maps
- Outputs to `dist/` or `build/` directory

**Environment-specific builds:**
```bash
NODE_ENV=production npm run build    # Production build
NODE_ENV=staging npm run build       # Staging build
```

---

### Preview Production Build

```bash
npm run preview
```

**What it does:**
- Serves the production build locally
- Allows testing before deployment
- Usually runs on `http://localhost:4173`

---

### Type Checking

```bash
npm run typecheck
```

**What it does:**
- Runs TypeScript compiler without emitting files
- Checks for type errors
- Validates `tsconfig.json` configuration

**Watch mode:**
```bash
npm run typecheck -- --watch
```

---

## Testing Commands

### Run All Tests

```bash
npm test
npm run test
```

**What it does:**
- Runs all test files
- Shows pass/fail summary
- Generates coverage report

---

### Run Tests in Watch Mode

```bash
npm run test:watch
```

**What it does:**
- Watches for file changes
- Re-runs affected tests automatically
- Interactive mode with filtering options

---

### Run Specific Tests

```bash
# Run specific test file
npm test src/components/Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="Button"

# Run tests in specific directory
npm test src/components/
```

---

### Coverage Report

```bash
npm run test:coverage
```

**What it does:**
- Runs all tests
- Generates coverage report
- Creates HTML report in `coverage/` directory
- Shows coverage percentage for files

**View coverage:**
```bash
open coverage/index.html          # macOS
xdg-open coverage/index.html      # Linux
start coverage/index.html         # Windows
```

---

### E2E Tests

```bash
npm run test:e2e
```

**What it does:**
- Runs end-to-end tests with Playwright
- Tests full user workflows
- Takes screenshots on failure

**Options:**
```bash
npm run test:e2e -- --headed      # Show browser
npm run test:e2e -- --debug       # Debug mode
npm run test:e2e -- --project=chromium  # Specific browser
```

---

## Build and Deploy

### Production Build

```bash
npm run build
```

**Build artifacts location:**
- Vite: `dist/`
- Next.js: `.next/`
- Create React App: `build/`

---

### Analyze Bundle Size

```bash
npm run analyze
```

**What it does:**
- Generates bundle size visualization
- Shows largest dependencies
- Helps identify optimization opportunities

---

### Deploy Commands

**Vercel:**
```bash
npm run deploy              # Deploy to production
npm run deploy:preview      # Deploy preview
```

**Netlify:**
```bash
netlify deploy              # Deploy to draft
netlify deploy --prod       # Deploy to production
```

**Custom deploy:**
```bash
npm run deploy:staging      # Deploy to staging
npm run deploy:prod         # Deploy to production
```

---

## Database Tools

### Drizzle ORM

**Generate migrations:**
```bash
npm run db:generate
```

**Push schema changes:**
```bash
npm run db:push
```

**Open Drizzle Studio:**
```bash
npm run db:studio
```
Opens at `https://local.drizzle.studio`

**Seed database:**
```bash
npm run db:seed
```

**Reset database:**
```bash
npm run db:reset
```

---

### Prisma

**Generate Prisma Client:**
```bash
npm run prisma:generate
npx prisma generate
```

**Create migration:**
```bash
npm run prisma:migrate:dev
npx prisma migrate dev --name init
```

**Apply migrations:**
```bash
npm run prisma:migrate:deploy
npx prisma migrate deploy
```

**Open Prisma Studio:**
```bash
npm run prisma:studio
npx prisma studio
```

**Seed database:**
```bash
npm run prisma:seed
npx prisma db seed
```

---

## Code Quality Tools

### Format Code (Prettier)

```bash
npm run format              # Format all files
npm run format:check        # Check without modifying
```

**Format specific files:**
```bash
npx prettier --write src/components/Button.tsx
npx prettier --write "src/**/*.{ts,tsx}"
```

---

### Lint Code (ESLint)

```bash
npm run lint                # Lint all files
npm run lint:fix            # Auto-fix issues
```

**Lint specific files:**
```bash
npx eslint src/components/
npx eslint src/ --ext .ts,.tsx
```

---

### Type Check (TypeScript)

```bash
npm run typecheck           # Check types
npm run typecheck -- --watch  # Watch mode
```

---

### Run All Quality Checks

```bash
npm run check               # Run all checks
```

**Typically runs:**
1. `npm run format:check` - Check formatting
2. `npm run lint` - Check linting
3. `npm run typecheck` - Check types
4. `npm test` - Run tests

---

## Git Workflow Tools

### Pre-commit Hooks

**Install hooks:**
```bash
npm run prepare             # Install git hooks
npx husky install          # Install husky
```

**Skip hooks (emergency only):**
```bash
git commit --no-verify -m "message"
```

---

### Conventional Commits

**Commit message format:**
```bash
git commit -m "type(scope): subject"
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

**Examples:**
```bash
git commit -m "feat(auth): add OAuth2 support"
git commit -m "fix(api): resolve timeout issue"
git commit -m "docs: update README"
```

---

### Create Release

```bash
npm run release             # Create release
npm version patch           # Bump patch version (0.0.1)
npm version minor           # Bump minor version (0.1.0)
npm version major           # Bump major version (1.0.0)
```

---

## CI/CD Tools

### GitHub CLI

**Create PR:**
```bash
gh pr create --title "Feature" --body "Description"
```

**View PR:**
```bash
gh pr view 123
gh pr list
```

**Merge PR:**
```bash
gh pr merge 123 --squash
gh pr merge 123 --merge
gh pr merge 123 --rebase
```

**Create issue:**
```bash
gh issue create --title "Bug" --body "Description"
```

**View issues:**
```bash
gh issue list
gh issue view 456
```

---

### GitHub Actions

**View workflow runs:**
```bash
gh run list
gh run view <run-id>
```

**View workflow logs:**
```bash
gh run view <run-id> --log
```

**Re-run failed jobs:**
```bash
gh run rerun <run-id>
```

---

## Debugging Tools

### Development Tools

**Chrome DevTools:**
- `Cmd+Opt+I` (Mac) or `F12` (Windows/Linux)
- Network tab for API calls
- Console for errors
- Sources for debugging

**React DevTools:**
```bash
npm install -g react-devtools
react-devtools
```

**Redux DevTools:**
- Install browser extension
- View state changes
- Time-travel debugging

---

### Node.js Debugging

**Debug with Chrome DevTools:**
```bash
node --inspect server.js
node --inspect-brk server.js  # Break on first line
```

Open `chrome://inspect` in Chrome

**VS Code debugging:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/server.js",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

### Environment Variables

**View environment:**
```bash
echo $NODE_ENV              # Current environment
printenv                    # All environment variables
```

**Set environment for command:**
```bash
NODE_ENV=production npm run build
DEBUG=* npm run dev         # Enable debug logs
```

**Load from .env file:**
```bash
npm install -g dotenv-cli
dotenv npm run dev
```

---

## Monitoring and Performance

### Bundle Analysis

**Webpack Bundle Analyzer:**
```bash
npm run analyze
```

**Source Map Explorer:**
```bash
npm install -g source-map-explorer
source-map-explorer dist/main.*.js
```

---

### Lighthouse Performance

```bash
npm install -g lighthouse
lighthouse https://your-site.com --view
```

---

### Performance Profiling

**React Profiler:**
```tsx
import { Profiler } from 'react';

<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

---

## Utility Scripts

### Generate Component

```bash
npm run generate:component Button
```

**Creates:**
```
src/components/Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts
```

---

### Clean Build Artifacts

```bash
npm run clean               # Remove dist/, build/, coverage/
```

---

### Check for Security Vulnerabilities

```bash
npm audit                   # Check for vulnerabilities
npm audit fix               # Auto-fix vulnerabilities
npm audit fix --force       # Force update (may break)
```

---

## Docker Tools

**Build image:**
```bash
docker build -t my-app .
```

**Run container:**
```bash
docker run -p 3000:3000 my-app
```

**Docker Compose:**
```bash
docker-compose up           # Start services
docker-compose up -d        # Start in background
docker-compose down         # Stop services
docker-compose logs -f      # View logs
```

---

## Quick Reference

### Most Common Commands

```bash
# Development
npm install                 # Install dependencies
npm run dev                 # Start dev server
npm run build               # Build for production

# Code Quality
npm run lint                # Lint code
npm run format              # Format code
npm run typecheck           # Type check

# Testing
npm test                    # Run tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage

# Database
npm run db:generate         # Generate migrations
npm run db:push             # Push schema changes
npm run db:studio           # Open database GUI

# Git
git status                  # Check status
git add .                   # Stage changes
git commit -m "message"     # Commit
git push                    # Push to remote
```

---

## Troubleshooting

### Common Issues

**Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Cache issues:**
```bash
npm cache clean --force
rm -rf .next         # Next.js
rm -rf dist          # Vite
rm -rf build         # CRA
```

**Port already in use:**
```bash
# Find process using port
lsof -i :3000        # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>        # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Permission errors:**
```bash
sudo chown -R $USER ~/.npm
sudo chown -R $USER node_modules
```

---

**Last Updated:** 2024-01-15
**Package Manager:** npm / pnpm / yarn
