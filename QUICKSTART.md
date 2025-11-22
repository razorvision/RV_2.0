# Quick Start Guide

Get your project up and running with this template in **10 minutes**.

## Step 1: Create from Template (1 minute)

1. Click the **"Use this template"** button at the top of this repository
2. Name your new repository
3. Choose public or private
4. Click **"Create repository"**

## Step 2: Clone and Setup (2 minutes)

```bash
# Clone your new repository
git clone https://github.com/your-username/your-new-repo.git
cd your-new-repo

# Install pre-commit hooks (optional but recommended)
npm install -D pre-commit      # Node.js projects
# OR
pip install pre-commit         # Python projects

# Install git hooks
npx pre-commit install
```

## Step 3: Create GitHub Labels (2 minutes)

```bash
# Mac/Linux/Git Bash
bash scripts/setup-labels.sh

# Windows
scripts\setup-labels.bat
```

This creates:
- ✅ Priority labels (high, medium, low)
- ✅ Type labels (feature, bug, docs, refactor, test)
- ✅ Status labels (blocked, in-progress, needs-review, ready)
- ✅ Effort labels (small, medium, large)
- ✅ Phase labels (1, 2, 3)

## Step 4: Optional Enhancements

### MCP Servers (Highly Recommended)

Configure 16 MCP servers for enhanced Claude Code capabilities:

1. Start Claude Code in your repository:
   ```bash
   claude
   ```

2. Approve MCP servers when prompted (type `yes`)

3. Configure environment variables for optional servers:
   ```bash
   # Slack (optional)
   export SLACK_BOT_TOKEN="xoxb-..."
   export SLACK_TEAM_ID="T12345678"

   # GitHub (optional)
   export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_..."

   # PostgreSQL (optional)
   export POSTGRES_CONNECTION_STRING="postgresql://user:pass@localhost:5432/db"

   # Brave Search (optional - 2K free queries/month)
   export BRAVE_API_KEY="your-key"
   ```

**See [MCP_SETUP.md](docs/integrations/MCP_SETUP.md) for complete guide.**

### Testing Template (For Django/Docker Projects)

If using Django with Docker:

1. Copy files from `testing-template-packet/` to your project
2. Follow `testing-template-packet/START-HERE.md`
3. Customize container name and test paths
4. Use `/test` slash command for auto-discovery testing

**Time savings: 1-2 hours → 15 minutes**

## Step 5: Customize for Your Project (5 minutes)

1. **Update README.md:**
   - Project name and description
   - Installation instructions
   - Tech stack
   - Remove template-specific content

2. **Configure for your stack:**
   - Update [CODING_STANDARDS.md](docs/guides/CODING_STANDARDS.md) with your tech
   - Modify [BRANCH_STRATEGY.md](docs/guides/BRANCH_STRATEGY.md) if needed
   - Customize issue templates in `.github/ISSUE_TEMPLATE/`

3. **Review and customize:**
   - `.pre-commit-config.yaml` - Add/remove hooks
   - `.github/workflows/` - Adjust CI/CD pipelines
   - `.claude/commands/` - Customize slash commands

## Daily Workflow

### Common Commands

```bash
# Check project status
gh issue list

# Create new issue
gh issue create

# Open project board
gh project view [NUMBER] --owner [OWNER] --web

# Check for PRs
gh pr list

# Run tests (with Docker MCP)
# In Claude Code:
/test

# Security review (with slash command)
# In Claude Code:
/review-security
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push -u origin feature/your-feature
gh pr create
```

## Quick Reference

### File Locations

| What | Where |
|------|-------|
| Documentation | `docs/` |
| Scripts | `scripts/` |
| Templates | `templates/` |
| Testing setup | `testing-template-packet/` |
| MCP config | `.mcp.json` |
| Slash commands | `.claude/commands/` |
| GitHub workflows | `.github/workflows/` |
| Issue templates | `.github/ISSUE_TEMPLATE/` |

### Key Documentation

- **[POST_TEMPLATE_CHECKLIST.md](docs/getting-started/POST_TEMPLATE_CHECKLIST.md)** - Complete setup checklist
- **[TEMPLATE_USAGE.md](docs/getting-started/TEMPLATE_USAGE.md)** - Detailed usage guide
- **[MCP_SETUP.md](docs/integrations/MCP_SETUP.md)** - MCP server configuration
- **[CODING_STANDARDS.md](docs/guides/CODING_STANDARDS.md)** - Code quality guide
- **[PROJECT_MANAGEMENT_GUIDE.md](.github/PROJECT_MANAGEMENT_GUIDE.md)** - PM workflows

### MCP Servers (16 Total)

**Browser Automation:** Playwright, Puppeteer
**Database:** PostgreSQL, SQLite
**Containers:** Docker
**Web Research:** Brave Search, Context7
**Files:** Filesystem, Everything
**Collaboration:** Slack, GitHub, Git
**Intelligence:** Memory, Sequential Thinking
**Monitoring:** Sentry
**Knowledge:** AWS KB

## Troubleshooting

### "gh: command not found"

Install GitHub CLI: https://cli.github.com/

### Pre-commit hooks not running

```bash
# Reinstall hooks
npx pre-commit install

# Test hooks
npx pre-commit run --all-files
```

### MCP servers not available

1. Ensure Claude Code is running in the project directory
2. Approve servers when prompted
3. Check `claude mcp list` to verify configuration

### Docker MCP can't connect

```bash
# Verify Docker is running
docker ps

# Restart Docker Desktop if needed
```

## What's Next?

1. **Review the checklist:** [POST_TEMPLATE_CHECKLIST.md](docs/getting-started/POST_TEMPLATE_CHECKLIST.md)
2. **Set up project board:** [PROJECT_VIEWS_GUIDE.md](.github/PROJECT_VIEWS_GUIDE.md)
3. **Configure MCP servers:** [MCP_SETUP.md](docs/integrations/MCP_SETUP.md)
4. **Start coding:** You're ready to build!

---

**Total Setup Time:** ~10 minutes (or 65 minutes for complete customization)

**Need Help?** Check the [README.md](README.md) or open an issue.
