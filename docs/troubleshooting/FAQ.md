# Frequently Asked Questions (FAQ)

Quick answers to common questions. Use Ctrl+F to search for your question.

## Table of Contents

- [Getting Started](#getting-started)
- [Claude Code](#claude-code)
- [MCP Servers](#mcp-servers)
- [Development](#development)
- [Git & GitHub](#git--github)
- [Database](#database)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### How do I set up a new project?

**Quick start:**
```bash
# 1. Clone repository
git clone [repo-url]
cd project-name

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your config

# 4. Set up database
npx prisma db push
npx prisma generate

# 5. Start development
npm run dev
```

**See:** [Project Setup Guide](../getting-started/PROJECT_SETUP.md)

---

### What goes in the CLAUDE.md file?

Include:
- Tech stack and versions
- Key commands (dev, test, build)
- Code style guidelines
- Branch naming conventions
- Project-specific patterns

**Example:** See [CLAUDE.md](../../CLAUDE.md) in project root

---

### What's the difference between .claude/ and CLAUDE.md?

- **CLAUDE.md** - Human-readable project context and guidelines
- **.claude/** directory - Machine configuration (settings.json, slash commands)

Both are important but serve different purposes.

---

## Claude Code

### How do I install Claude Code?

Download from [claude.com/code](https://code.claude.com) and follow the installation wizard for your platform.

---

### Claude isn't seeing my project context. Why?

**Check:**
1. Is `CLAUDE.md` in the project root?
2. Are you running `claude` from the project directory?
3. Try restarting Claude Code

**Fix:**
```bash
cd /path/to/your/project
claude
```

---

### How do I give Claude permission to use tools?

**Option 1: Interactive**
Claude will ask when it needs a tool. Click "Allow" or "Allow Always".

**Option 2: Settings file**
Edit `.claude/settings.json`:
```json
{
  "permissions": {
    "allow": ["Read", "Edit", "Bash(git:*)"],
    "ask": ["Write", "Bash"]
  }
}
```

**Option 3: Command**
```bash
/permissions add Edit
/permissions add "Bash(git:*)"
```

**See:** [Getting Started Guide](../tools/claude-code/GETTING_STARTED.md#permissions---control-what-claude-can-do)

---

### Can Claude commit directly to main/master?

**Technically yes, but DON'T.** Follow the feature branch workflow:

```bash
# Always work on a feature branch
git checkout -b feature/my-feature

# Make changes, then push and create PR
git push -u origin feature/my-feature
gh pr create --fill
```

**See:** [Branch Strategy](../guides/team/BRANCH_STRATEGY.md)

---

### How do I create custom slash commands?

Create a file in `.claude/commands/`:

**Example:** `.claude/commands/new-feature.md`
```markdown
---
description: Create a new feature with tests
---

Create a feature for: $ARGUMENTS

Steps:
1. Create feature branch
2. Create feature file
3. Create test file
4. Create GitHub issue
```

**Use:** `/new-feature user-dashboard`

**See:** [Slash Commands Guide](../tools/claude-code/SLASH_COMMANDS.md)

---

## MCP Servers

### What are MCP servers and why do I need them?

MCP servers extend Claude's capabilities:
- **Playwright** - Browser automation
- **Context7** - Documentation fetching
- **GitHub** - Issue/PR management
- **SQLite/PostgreSQL** - Database queries

**You don't *need* them, but they're very useful.**

**See:** [MCP Overview](../tools/mcp/OVERVIEW.md)

---

### How do I install MCP servers?

**Quick start (5 minutes):**
```bash
# Install essential servers
npm install -g @modelcontextprotocol/server-playwright
npm install -g @modelcontextprotocol/server-context7
npm install -g @modelcontextprotocol/server-github
```

Then configure in `~/.claude/settings.json` or VS Code settings.

**See:** [MCP Quick Start](../tools/mcp/QUICKSTART.md)

---

### MCP server won't start. What do I do?

**Check:**
1. Is Node.js installed? (`node --version`)
2. Is the server installed? (`npm list -g @modelcontextprotocol/server-[name]`)
3. Check `/mcp` status in Claude Code

**Fix:**
```bash
# Reinstall server
npm uninstall -g @modelcontextprotocol/server-[name]
npm install -g @modelcontextprotocol/server-[name]

# Restart Claude Code
```

**See:** [MCP Troubleshooting](../tools/mcp/TROUBLESHOOTING.md)

---

### Where should I configure MCP servers - global or project?

**Global (`~/.claude/settings.json`)** for most servers:
- Playwright, Context7, GitHub, Brave Search
- Available in all projects

**Project (`.mcp.json`)** only for:
- Project-specific databases
- Custom internal tools

**Most users only need global configuration.**

---

## Development

### How do I run the development server?

```bash
npm run dev
```

Opens on `http://localhost:3000` (for Next.js projects).

**If port 3000 is in use:**
```bash
# Find and kill process
lsof -i :3000
kill -9 [PID]

# Or use different port
PORT=3001 npm run dev
```

---

### How do I run tests?

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/file.test.ts

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

**See:** [Testing Guide](../guides/development/TESTING_GUIDE.md)

---

### How do I lint and format code?

```bash
# Lint
npm run lint

# Lint and fix
npm run lint -- --fix

# Format (if using Prettier)
npm run format
```

---

### What's the recommended commit message format?

Use conventional commits:

```
type(scope): description

feat: add user dashboard
fix: resolve login timeout
docs: update README
refactor: simplify auth logic
test: add user validation tests
chore: update dependencies
```

**See:** [Branch Strategy](../guides/team/BRANCH_STRATEGY.md#commit-messages)

---

### Should I commit package-lock.json?

**Yes, always commit package-lock.json** (or yarn.lock, pnpm-lock.yaml).

This ensures everyone uses the same dependency versions.

---

## Git & GitHub

### How do I create a feature branch?

```bash
# From main branch
git checkout main
git pull

# Create feature branch
git checkout -b feature/user-dashboard

# Make changes, then push
git push -u origin feature/user-dashboard
```

**See:** [Git Commands Cheat Sheet](../tools/cheat-sheets/GIT_COMMANDS.md)

---

### How do I create a pull request?

**Option 1: GitHub CLI (recommended)**
```bash
gh pr create --fill
```

**Option 2: GitHub web interface**
1. Push your branch: `git push -u origin feature/name`
2. Go to GitHub repository
3. Click "Compare & pull request"

**See:** [PR Management Guide](../tools/github-cli/PR_MANAGEMENT.md)

---

### How do I resolve merge conflicts?

```bash
# See conflicted files
git status

# Edit files to resolve conflicts
# Look for:
# <<<<<<< HEAD
# (your changes)
# =======
# (their changes)
# >>>>>>> branch-name

# After resolving, stage files
git add resolved-file.ts

# Continue merge/rebase
git merge --continue    # For merge
git rebase --continue   # For rebase
```

**See:** [Git Commands - Merge Conflicts](../tools/cheat-sheets/GIT_COMMANDS.md#handling-merge-conflicts)

---

### Can I undo my last commit?

```bash
# Undo commit, keep changes
git reset --soft HEAD~1

# Undo commit, discard changes
git reset --hard HEAD~1  # ⚠️ DESTRUCTIVE

# Or if already pushed, use revert
git revert HEAD
git push
```

**See:** [Git Commands - Undoing Changes](../tools/cheat-sheets/GIT_COMMANDS.md#undoing-changes)

---

## Database

### How do I set up the database?

```bash
# Create database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed database (if seed script exists)
npx prisma db seed
```

**See:** [Prisma Guide](../frameworks/PRISMA_GUIDE.md)

---

### How do I create a database migration?

```bash
# Create migration
npx prisma migrate dev --name add_user_profile

# Apply migrations
npx prisma migrate deploy
```

**See:** [Database Patterns](../frameworks/DATABASE_PATTERNS.md)

---

### Database connection refused. What do I do?

**Check:**
1. Is the database running? (`docker ps` or check service)
2. Is `DATABASE_URL` set correctly in `.env`?
3. Can you connect manually? (`psql` for PostgreSQL)

**Fix:**
```bash
# Check .env
cat .env | grep DATABASE_URL

# Test connection
psql [DATABASE_URL]

# Restart database (if Docker)
docker compose restart db
```

**See:** [Database Issues](DATABASE_ISSUES.md#connection-failures)

---

### How do I reset the database?

```bash
# ⚠️ DESTRUCTIVE - Deletes all data
npx prisma db push --force-reset

# Regenerate client and seed
npx prisma generate
npx prisma db seed
```

---

### How do I view the database?

**Option 1: Prisma Studio**
```bash
npx prisma studio
```
Opens at `http://localhost:5555`

**Option 2: Database client**
- TablePlus
- pgAdmin (PostgreSQL)
- DBeaver

**Option 3: MCP**
```
"Query the users table and show me the last 10 entries"
```

---

## Testing

### What testing frameworks do you use?

Typically:
- **Unit/Integration:** Jest or Vitest
- **Component:** React Testing Library
- **E2E:** Playwright

Check `package.json` for your project's setup.

---

### How do I write a test?

**Example unit test:**
```typescript
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const result = formatDate(new Date('2024-01-01'))
    expect(result).toBe('2024-01-01')
  })
})
```

**See:** [Testing Guide](../guides/development/TESTING_GUIDE.md)

---

### Test fails locally but passes in CI (or vice versa). Why?

**Common causes:**
1. **Environment differences** - Check Node version, dependencies
2. **Timezone issues** - Tests using dates without UTC
3. **Missing environment variables** - Check CI environment
4. **Order dependency** - Tests not isolated properly

**Fix:**
```bash
# Match CI Node version
nvm use 20

# Clear cache
npm ci  # Clean install

# Run in same environment
docker run -it node:20 bash
```

---

## Deployment

### How do I deploy to production?

Depends on your platform. Common pattern:

1. **Merge to main** (via PR)
2. **CI runs** tests and builds
3. **Auto-deploy** to production (or manual trigger)

**See platform-specific guides:**
- [Vercel Deployment](../deployment/VERCEL_DEPLOYMENT.md)
- [Railway Deployment](../deployment/RAILWAY_DEPLOYMENT.md)
- [Fly.io Deployment](../deployment/FLYIO_DEPLOYMENT.md)

---

### Build succeeds locally but fails in CI. Why?

**Common causes:**
1. **Missing environment variables** in CI
2. **Different Node versions**
3. **Build cache issues**
4. **Dependency installation issues**

**Fix:**
1. Check CI logs for specific error
2. Verify environment variables are set
3. Match Node version locally: `nvm use 20`
4. Clear build cache in CI settings

**See:** [Build Errors](BUILD_ERRORS.md#works-locally-fails-ci)

---

### How do I check deployment status?

**GitHub CLI:**
```bash
# Get PR commit SHA
gh pr view --json headRefOid

# Check CI status
curl -s "https://api.github.com/repos/OWNER/REPO/commits/{SHA}/check-runs" | jq -r '.check_runs[] | "\(.status) \(.conclusion) - \(.name)"'
```

**See:** [CI Monitoring Guide](../workflows/CI_MONITORING_GUIDE.md)

---

### How do I roll back a deployment?

**Vercel:**
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

**Railway:**
Use Railway dashboard to rollback to previous deployment.

**See:** [Incident Response](../guides/infrastructure/INCIDENT_RESPONSE.md)

---

## Troubleshooting

### "Module not found" error. How do I fix it?

**Try:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear build cache (Next.js)
rm -rf .next

# Regenerate Prisma client
npx prisma generate
```

---

### TypeScript errors after pulling changes. What do I do?

```bash
# Reinstall dependencies
npm install

# Regenerate types (if using Prisma)
npx prisma generate

# Restart TypeScript server (in VS Code)
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

### Environment variable is not defined. Why?

**Check:**
1. Is it in `.env`?
2. Did you restart the dev server after adding it?
3. Is it prefixed correctly? (Next.js: `NEXT_PUBLIC_` for client-side)

**Fix:**
```bash
# Verify .env
cat .env

# Restart dev server
npm run dev
```

**See:** [Environment Variables](ENVIRONMENT_VARIABLES.md)

---

### Port already in use. How do I fix it?

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 [PID]

# Or use different port
PORT=3001 npm run dev
```

---

### "Cannot connect to database" error. What do I do?

**See:** [Database Issues](DATABASE_ISSUES.md#connection-failures)

---

### Login/authentication not working. How do I debug?

**See:** [Authentication Debugging](AUTH_DEBUGGING.md)

---

## Still Have Questions?

- **Check guides:** Browse [Documentation Index](../README.md)
- **Search codebase:** Use Claude Code to search for examples
- **Ask team:** Post in team chat
- **Create issue:** [GitHub Issues](https://github.com/your-org/your-repo/issues)

---

**Last Updated:** 2024-12-11
