# Development Tools Guide

Welcome to the RV 2.0 development tools ecosystem! This section teaches you how to use all the tools that make modern development efficient and enjoyable.

## 🎯 Quick Start: Which Tool Should I Use?

Use this decision matrix to quickly find the right tool for your task:

| I want to... | Use this tool | Guide |
|-------------|---------------|-------|
| **Write code with AI assistance** | Claude Code CLI | [Getting Started](claude-code/GETTING_STARTED.md) |
| **Automate browser testing** | Playwright MCP | [Playwright Guide](playwright/GETTING_STARTED.md) |
| **Fetch documentation** | Context7 MCP | [MCP Servers Guide](mcp/SERVERS_GUIDE.md#context7) |
| **Manage GitHub issues/PRs** | GitHub CLI (`gh`) or GitHub MCP | [GitHub CLI Guide](github-cli/SETUP.md) |
| **Search the web** | Brave Search MCP | [MCP Servers Guide](mcp/SERVERS_GUIDE.md#brave-search) |
| **Query databases** | SQLite MCP | [MCP Servers Guide](mcp/SERVERS_GUIDE.md#sqlite) |
| **Interact with Jira** | Atlassian MCP | [MCP Servers Guide](mcp/SERVERS_GUIDE.md#atlassian) |
| **Execute commands** | Bash (built-in) | [Cheat Sheets](cheat-sheets/) |

---

## 📚 Tool Categories

### 1. Claude Code - Your AI Development Partner

Claude Code is the CLI tool that powers your AI-assisted development workflow.

**What it does:**
- Reads, edits, and creates files
- Executes commands
- Searches codebases
- Uses MCP servers for extended functionality
- Manages tasks with built-in todo tracking

**Start here:**
- [Getting Started with Claude Code](claude-code/GETTING_STARTED.md) ← **Start here if new!**
- [Common Workflows](claude-code/WORKFLOWS.md)
- [Slash Commands](claude-code/SLASH_COMMANDS.md)
- [Tips & Tricks](claude-code/TIPS_AND_TRICKS.md)

---

### 2. MCP (Model Context Protocol) - Extend Claude's Capabilities

MCP servers give Claude Code access to external tools and data sources.

**What it does:**
- Connect Claude to databases, APIs, and services
- Automate browser interactions
- Fetch up-to-date documentation
- Interact with GitHub, Jira, and more

**Start here:**
- [MCP Overview](mcp/OVERVIEW.md) ← **Understand the ecosystem**
- [5-Minute Quick Start](mcp/QUICKSTART.md)
- [Complete Setup Guide](mcp/SETUP.md)
- [When to Use What](mcp/WHEN_TO_USE_WHAT.md) - Decision guide
- [Servers Guide](mcp/SERVERS_GUIDE.md) - Detailed per-server docs
- [Security Considerations](mcp/SECURITY.md)
- [Troubleshooting](mcp/TROUBLESHOOTING.md)

**Available MCP servers:**
- **Browser Automation:** Playwright
- **Documentation:** Context7
- **Search:** Brave Search
- **Version Control:** GitHub
- **Databases:** SQLite, PostgreSQL
- **Project Management:** Atlassian (Jira)
- **File System:** Filesystem access
- **And more...**

---

### 3. Playwright - Browser Automation & Testing

Automate browser interactions for testing, debugging, and visual verification.

**What it does:**
- Navigate websites programmatically
- Take screenshots
- Fill forms and click buttons
- Verify UI behavior
- Debug visual issues

**Start here:**
- [Getting Started with Playwright](playwright/GETTING_STARTED.md)
- [Practical Examples](playwright/PRACTICAL_EXAMPLES.md)
- [Session Management](playwright/SESSION_MANAGEMENT.md)

**Common use cases:**
- Visual verification after UI changes
- E2E testing
- Debugging authentication flows
- Automating repetitive browser tasks

---

### 4. GitHub CLI - Command-Line GitHub Management

Manage repositories, issues, PRs, and more without leaving the terminal.

**What it does:**
- Create and manage issues
- Create and review pull requests
- Manage repositories
- View CI/CD status
- Automate GitHub workflows

**Start here:**
- [Setup Guide](github-cli/SETUP.md)
- [Common Workflows](github-cli/COMMON_WORKFLOWS.md)
- [PR Management](github-cli/PR_MANAGEMENT.md)

**Common commands:**
```bash
gh issue list                    # List issues
gh pr create --fill              # Create PR with auto-filled template
gh pr view --web                 # View PR in browser
gh pr checks                     # Check CI status
```

---

### 5. Command Cheat Sheets - Quick Reference

Quick lookup for common commands across all tools.

**Available cheat sheets:**
- [Git Commands](cheat-sheets/GIT_COMMANDS.md)
- [NPM Scripts](cheat-sheets/NPM_SCRIPTS.md)
- [Prisma CLI](cheat-sheets/PRISMA_CLI.md)
- [Playwright CLI](cheat-sheets/PLAYWRIGHT_CLI.md)

---

## 🎓 Learning Paths

New to these tools? Follow these guided learning paths:

### For Developers New to Claude Code
1. [Getting Started with Claude Code](claude-code/GETTING_STARTED.md)
2. [MCP 5-Minute Quick Start](mcp/QUICKSTART.md)
3. [Common Claude Code Workflows](claude-code/WORKFLOWS.md)
4. [When to Use Which MCP Server](mcp/WHEN_TO_USE_WHAT.md)

### For Testers & QA Engineers
1. [Getting Started with Playwright](playwright/GETTING_STARTED.md)
2. [Practical Playwright Examples](playwright/PRACTICAL_EXAMPLES.md)
3. [Complete Setup Guide](mcp/SETUP.md) (for Playwright MCP)

### For Project Managers
1. [GitHub CLI Setup](github-cli/SETUP.md)
2. [Common GitHub Workflows](github-cli/COMMON_WORKFLOWS.md)
3. [MCP Servers Guide](mcp/SERVERS_GUIDE.md) (Atlassian/Jira section)

---

## 🔧 Tool Integration Examples

### Example 1: Fix a Bug End-to-End
```bash
# 1. Find the bug with Claude Code
claude-code "Debug the authentication timeout issue"

# 2. Create an issue to track it
gh issue create --title "Fix: Auth timeout after 24h" --label bug

# 3. Create a branch
git checkout -b fix/auth-timeout

# 4. Make changes with Claude Code
# (interactive session)

# 5. Test visually with Playwright MCP
# (via Claude Code's MCP integration)

# 6. Commit and create PR
git add . && git commit -m "fix: resolve auth timeout issue"
gh pr create --fill
```

### Example 2: Add a New Feature
```bash
# 1. Research with Claude Code + Context7 MCP
claude-code "Show me best practices for implementing rate limiting"

# 2. Create feature branch
git checkout -b feature/rate-limiting

# 3. Implement with Claude Code
# (interactive session)

# 4. Verify visually with Playwright
# (screenshot and test the UI)

# 5. Create PR and track
gh pr create --fill
gh pr checks  # Monitor CI
```

---

## 🚨 Troubleshooting

Having issues with tools? Check these resources:

- **MCP not working?** → [MCP Troubleshooting](mcp/TROUBLESHOOTING.md)
- **Playwright session issues?** → [Session Management](playwright/SESSION_MANAGEMENT.md)
- **GitHub CLI auth?** → [GitHub CLI Setup](github-cli/SETUP.md#authentication)
- **General issues?** → [Troubleshooting FAQ](../troubleshooting/FAQ.md)

---

## 📖 Additional Resources

- [Common Tasks Reference](../COMMON_TASKS.md) - Quick commands for daily work
- [Development Workflows](../workflows/) - Team processes
- [Code Quality Standards](../guides/development/CODING_STANDARDS.md)
- [Learning Paths](../learning-paths/) - Progressive skill building

---

## 🤝 Contributing

Found a tool or workflow that works well? Document it!

1. Add examples to the relevant tool guide
2. Update cheat sheets with new commands
3. Share tips in `claude-code/TIPS_AND_TRICKS.md`
4. Submit a PR with your improvements

See [Documentation Guidelines](../guides/team/DOCUMENTATION.md) for style standards.

---

**Last Updated:** 2024-12-11
