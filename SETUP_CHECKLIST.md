# Setup Checklist

**Single source of truth for getting your development environment ready.**

Time estimate: 15-30 minutes (depending on what you already have installed)

---

## Prerequisites Checklist

### Required Software

- [ ] **Node.js 18+** - [Download](https://nodejs.org/) or use nvm
  ```bash
  node --version  # Should show v18.x.x or higher
  ```

- [ ] **Git** - [Download](https://git-scm.com/)
  ```bash
  git --version  # Should show git version 2.x.x
  ```

- [ ] **GitHub Account** with SSH key configured
  ```bash
  ssh -T git@github.com  # Should show "Hi username!"
  ```

### Recommended Software

- [ ] **VS Code** - [Download](https://code.visualstudio.com/)
- [ ] **GitHub CLI** - [Download](https://cli.github.com/)
  ```bash
  gh auth login  # Authenticate with GitHub
  ```
- [ ] **Claude Code** - [Install guide](https://claude.ai/code)
  ```bash
  claude --version  # Verify installation
  ```

---

## Quick Setup (5 minutes)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone git@github.com:YOUR_ORG/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install
```

### Step 2: Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Open and fill in required values
code .env.local  # or your preferred editor
```

**Minimum required variables:**
| Variable | Where to get it |
|----------|-----------------|
| `DATABASE_URL` | Your database connection string (see below) |
| `AUTH_SECRET` | Generate: `openssl rand -base64 32` |

### Step 3: Database Setup

```bash
# Push schema to database (creates tables)
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Step 4: Verify Setup

```bash
# Start the development server
npm run dev

# Visit http://localhost:3000 - you should see the app running
```

**You're ready to code!**

---

## Full Setup (30 minutes)

Complete these additional steps for the best development experience.

### VS Code Extensions

Install these extensions (copy ID into VS Code extensions search):

| Extension | ID | Purpose |
|-----------|-----|---------|
| ESLint | `dbaeumer.vscode-eslint` | Linting |
| Prettier | `esbenp.prettier-vscode` | Formatting |
| Tailwind CSS | `bradlc.vscode-tailwindcss` | CSS IntelliSense |
| Prisma | `Prisma.prisma` | Database schema |
| GitLens | `eamodio.gitlens` | Git history |

### Pre-commit Hooks

```bash
# Install pre-commit
npm install -D pre-commit
# OR
pip install pre-commit

# Install hooks
npx pre-commit install

# Test hooks work
npx pre-commit run --all-files
```

### GitHub Labels

```bash
# Mac/Linux/Git Bash
bash scripts/setup-labels.sh

# Windows PowerShell
.\scripts\setup-labels.bat
```

### Claude Code & MCP Servers

```bash
# Start Claude Code in your project
cd YOUR_REPO
claude

# When prompted, approve MCP servers (type 'yes')
# Most servers work without additional setup!
```

For servers requiring API keys, see [MCP Quick Start](docs/integrations/MCP_QUICKSTART.md).

---

## Environment Variables Reference

### Required Variables

| Variable | Description | How to Get |
|----------|-------------|------------|
| `DATABASE_URL` | PostgreSQL connection string | Create DB locally or use cloud provider |
| `AUTH_SECRET` | NextAuth.js secret | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL | `http://localhost:3000` for dev |

### Database Connection Strings

**Local PostgreSQL:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/myapp_dev
```

**Local MySQL:**
```
DATABASE_URL=mysql://root:password@localhost:3306/myapp_dev
```

**Local SQLite (simplest for getting started):**
```
DATABASE_URL=file:./dev.db
```

**Cloud Providers:**
- [Supabase](https://supabase.com) - Free PostgreSQL
- [PlanetScale](https://planetscale.com) - Free MySQL
- [Neon](https://neon.tech) - Free PostgreSQL

### OAuth Providers (Optional)

If using social login:

| Provider | Where to Get Credentials |
|----------|-------------------------|
| GitHub | [GitHub Developer Settings](https://github.com/settings/developers) |
| Google | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| Discord | [Discord Developer Portal](https://discord.com/developers/applications) |

---

## Verification Checklist

Run through this checklist to ensure everything is working:

- [ ] `npm run dev` starts without errors
- [ ] App loads at http://localhost:3000
- [ ] `npm run lint` passes
- [ ] `npm run build` completes successfully
- [ ] `npx prisma studio` opens database GUI
- [ ] Git commits work (pre-commit hooks run)
- [ ] Can create a branch and push to GitHub

---

## Common Issues

### "Database connection failed"

1. Check `DATABASE_URL` is correct in `.env.local`
2. Ensure database server is running
3. Try `npx prisma db push` to sync schema

### "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 already in use"

```bash
# Find and kill process on port 3000
# Mac/Linux:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows PowerShell:
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

### "Prisma schema out of sync"

```bash
npx prisma generate
npx prisma db push
```

---

## Next Steps

After setup is complete:

1. **Read the codebase** - Explore `src/` to understand the structure
2. **Check the docs** - Review [CLAUDE.md](CLAUDE.md) for development guidelines
3. **Pick up a task** - Look for "good first issue" labels in GitHub Issues
4. **Ask questions** - Post in Slack #engineering or ask your onboarding buddy

---

## Related Documentation

- [Dev Environment Setup](docs/guides/DEV_ENVIRONMENT_SETUP.md) - Detailed environment guide
- [MCP Quick Start](docs/integrations/MCP_QUICKSTART.md) - Claude Code MCP servers
- [Coding Standards](docs/guides/development/CODING_STANDARDS.md) - Code quality guidelines
- [Branch Strategy](docs/guides/team/BRANCH_STRATEGY.md) - Git workflow
- [Onboarding Checklist](docs/guides/team/ONBOARDING_CHECKLIST.md) - Full onboarding process
