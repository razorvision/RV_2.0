# MCP Quick Start

**Get Claude Code's MCP servers running in 5 minutes.**

For detailed documentation, see [MCP_SETUP.md](MCP_SETUP.md).

---

## What Are MCP Servers?

MCP (Model Context Protocol) servers give Claude Code additional capabilities like browser automation, database access, and GitHub integration. Most work out-of-the-box with zero configuration.

---

## Quick Setup

### Step 1: Start Claude Code

```bash
cd your-project
claude
```

### Step 2: Approve Servers

When prompted, type `yes` to approve MCP servers. That's it for most servers!

### Step 3: Verify

```bash
# In Claude Code, run:
/mcp
```

You should see a list of available MCP servers.

---

## Server Tiers

### Tier 1: Zero Setup (Just Approve)

These servers work immediately after approval:

| Server | What It Does | Example Use |
|--------|--------------|-------------|
| **Filesystem** | Read/write project files | "Read src/index.ts" |
| **Git** | Git operations | "Show recent commits" |
| **Memory** | Persistent context | "Remember this API pattern" |
| **Sequential Thinking** | Complex reasoning | "Plan this feature" |
| **Playwright** | Browser automation | "Test the login flow" |
| **Context7** | Documentation search | "Find React hooks docs" |

### Tier 2: Minimal Setup

| Server | Setup Required | One-Time Command |
|--------|----------------|------------------|
| **Puppeteer** | Chrome installed | Usually pre-installed |
| **SQLite** | None | Creates DB automatically |
| **Everything** | Windows only | Install from [voidtools.com](https://www.voidtools.com/) |

### Tier 3: API Key Required

| Server | Required Variables | Get Credentials |
|--------|-------------------|-----------------|
| **GitHub** | `GITHUB_PERSONAL_ACCESS_TOKEN` | [GitHub Settings](https://github.com/settings/tokens) |
| **Slack** | `SLACK_BOT_TOKEN`, `SLACK_TEAM_ID` | [Slack Apps](https://api.slack.com/apps) |
| **Brave Search** | `BRAVE_API_KEY` | [Brave API](https://brave.com/search/api/) (2K free/month) |
| **PostgreSQL** | `POSTGRES_CONNECTION_STRING` | Your database URL |
| **Sentry** | Sentry account | [Sentry.io](https://sentry.io) |
| **Docker** | Docker Desktop running | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |

---

## Environment Variables

Add these to your shell profile (`~/.bashrc`, `~/.zshrc`, or PowerShell profile):

```bash
# === MCP Server Environment Variables ===

# GitHub (recommended - enables GitHub MCP features)
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# Slack (optional - for Slack integration)
export SLACK_BOT_TOKEN="xoxb-xxxxxxxxxxxx"
export SLACK_TEAM_ID="T12345678"

# Brave Search (optional - 2,000 free queries/month)
export BRAVE_API_KEY="BSAxxxxxxxxxxxxxxxxxxxx"

# PostgreSQL (optional - if different from project DATABASE_URL)
export POSTGRES_CONNECTION_STRING="postgresql://user:pass@host:5432/db"
```

**Reload your shell after adding:**
```bash
source ~/.bashrc  # or ~/.zshrc
```

---

## Most Useful Servers

### For Daily Development

1. **Filesystem** - File operations (always enabled)
2. **Git** - Commits, branches, history
3. **Playwright** - Test UIs, take screenshots
4. **Memory** - Remember context across sessions

### For Code Quality

1. **GitHub** - PRs, issues, code search
2. **Sentry** - Error tracking integration

### For Research

1. **Brave Search** - Web search
2. **Context7** - Documentation lookup

---

## Common Commands

Once MCP servers are configured:

```
# Browser automation
"Open localhost:3000 and take a screenshot"
"Test the signup flow"

# Git operations
"Show me the last 5 commits"
"Create a branch called feature/new-thing"

# Database
"Show me the users table schema"
"Run a query to find active users"

# GitHub
"Create an issue for this bug"
"Show open PRs"
```

---

## Troubleshooting

### "Server not available"

1. Run `/mcp` to check server status
2. Restart Claude Code: `Ctrl+C` then `claude`
3. Check environment variables are set

### "GitHub server failing"

```bash
# Verify token is set
echo $GITHUB_PERSONAL_ACCESS_TOKEN

# Test token works
curl -H "Authorization: token $GITHUB_PERSONAL_ACCESS_TOKEN" https://api.github.com/user
```

### "Playwright can't connect"

```bash
# Install browsers
npx playwright install

# If still failing, install with dependencies
npx playwright install --with-deps
```

### "Docker server not working"

1. Ensure Docker Desktop is running
2. Check Docker is accessible: `docker ps`
3. Restart Docker Desktop if needed

---

## Full Documentation

- [MCP_SETUP.md](MCP_SETUP.md) - Complete setup guide with all options
- [MCP_SERVERS_GUIDE.md](MCP_SERVERS_GUIDE.md) - Detailed server documentation
- [MCP_TROUBLESHOOTING.md](MCP_TROUBLESHOOTING.md) - In-depth troubleshooting
- [MCP_SECURITY.md](../security/MCP_SECURITY.md) - Security best practices
