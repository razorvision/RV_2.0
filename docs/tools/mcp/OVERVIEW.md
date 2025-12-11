# MCP Ecosystem Overview

The Model Context Protocol (MCP) is an open standard that allows Claude Code to connect to external tools, databases, and services. Think of MCP servers as "plugins" that extend Claude's capabilities.

## What Can MCP Servers Do?

MCP servers give Claude access to:

| Category | Examples | Use Cases |
|----------|----------|-----------|
| **Browser Automation** | Playwright | UI testing, screenshots, form filling |
| **Documentation** | Context7 | Fetch up-to-date library docs |
| **Search** | Brave Search | Web research, current information |
| **Version Control** | GitHub | Manage issues, PRs, repositories |
| **Databases** | SQLite, PostgreSQL | Query and modify databases |
| **Project Management** | Atlassian (Jira) | Track issues, update tickets |
| **File Systems** | Filesystem | Access files outside project |
| **APIs** | Custom servers | Any API or service |

---

## How MCP Works

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│             │         │             │         │              │
│ Claude Code │ ◄─────► │ MCP Server  │ ◄─────► │ External     │
│    (CLI)    │   MCP   │ (Playwright)│  HTTP   │ Service      │
│             │ Protocol│             │         │ (Browser)    │
└─────────────┘         └─────────────┘         └──────────────┘
```

1. **You make a request** to Claude: "Test the login flow"
2. **Claude decides** which MCP server to use (Playwright)
3. **MCP server executes** the task (navigates browser, fills form)
4. **Results return** to Claude, who interprets them
5. **Claude responds** with human-readable output

---

## Available MCP Servers

### Core Productivity Servers

#### 1. Playwright (Browser Automation)
**What it does:** Automates Chrome/Firefox/Safari for testing and UI verification.

**Use when:**
- Testing user interfaces
- Taking screenshots
- Debugging visual issues
- Automating browser tasks

**Example:**
```
"Use Playwright to test the login flow and take a screenshot"
```

**Setup:** [MCP Setup Guide](SETUP.md#playwright)

---

#### 2. Context7 (Documentation Fetcher)
**What it does:** Fetches up-to-date documentation for libraries and frameworks.

**Use when:**
- Looking up API documentation
- Learning new libraries
- Finding code examples
- Verifying syntax

**Example:**
```
"Look up the latest Next.js App Router documentation"
"Show me Prisma migration examples"
```

**Setup:** [MCP Setup Guide](SETUP.md#context7)

---

#### 3. GitHub (Version Control)
**What it does:** Interacts with GitHub repositories, issues, and pull requests.

**Use when:**
- Creating/updating issues
- Managing pull requests
- Searching code across repos
- Repository management

**Example:**
```
"Create a GitHub issue for this bug"
"List open PRs with the 'bug' label"
"Search for authentication code in this repo"
```

**Setup:** [MCP Setup Guide](SETUP.md#github)

---

### Data & Search Servers

#### 4. Brave Search (Web Search)
**What it does:** Searches the web for current information.

**Use when:**
- Finding recent news or trends
- Looking up unfamiliar technologies
- Researching solutions to problems
- Getting real-time information

**Example:**
```
"Search for the latest React 19 features"
"Find recent discussions about Prisma performance"
```

**Setup:** [MCP Setup Guide](SETUP.md#brave-search)

---

#### 5. SQLite (Database)
**What it does:** Query and modify SQLite databases.

**Use when:**
- Inspecting database contents
- Running SQL queries
- Debugging data issues
- Testing database operations

**Example:**
```
"Query the users table and show me the schema"
"Show me the last 10 orders"
```

**Setup:** [MCP Setup Guide](SETUP.md#sqlite)

---

#### 6. PostgreSQL (Database)
**What it does:** Query and modify PostgreSQL databases.

**Use when:**
- Working with production databases
- Complex SQL queries
- Database migrations
- Performance analysis

**Example:**
```
"Explain the query plan for this slow query"
"Show me users created in the last 24 hours"
```

**Setup:** [MCP Setup Guide](SETUP.md#postgresql)

---

### Project Management Servers

#### 7. Atlassian (Jira)
**What it does:** Interact with Jira for issue tracking and project management.

**Use when:**
- Creating/updating Jira tickets
- Querying sprint progress
- Updating issue status
- Linking commits to issues

**Example:**
```
"Create a Jira ticket for this bug"
"Show me all issues in the current sprint"
"Update PROJ-123 status to 'In Progress'"
```

**Setup:** [MCP Setup Guide](SETUP.md#atlassian)

---

### Utility Servers

#### 8. Filesystem
**What it does:** Access files outside the current project directory.

**Use when:**
- Reading configuration files
- Accessing shared resources
- Working with multiple projects
- Reading logs

**Example:**
```
"Read my ~/.zshrc file"
"Show me the nginx config"
```

**Setup:** [MCP Setup Guide](SETUP.md#filesystem)

---

## Quick Decision Guide: Which Server Should I Use?

Use this flowchart to choose the right MCP server:

```
I need to...
│
├─ Test UI or take screenshots
│  └─→ Playwright
│
├─ Look up documentation or API references
│  └─→ Context7
│
├─ Manage GitHub issues/PRs
│  └─→ GitHub MCP (or gh CLI)
│
├─ Search the web for current info
│  └─→ Brave Search
│
├─ Query a database
│  ├─ SQLite file? → SQLite MCP
│  └─ PostgreSQL? → PostgreSQL MCP
│
├─ Manage Jira tickets
│  └─→ Atlassian MCP
│
└─ Access files outside project
   └─→ Filesystem MCP
```

**See [When to Use What](WHEN_TO_USE_WHAT.md) for detailed decision matrix.**

---

## Getting Started with MCP

### Option 1: Quick Start (5 minutes)

Follow the [5-Minute Quick Start](QUICKSTART.md) to install essential servers:
- Playwright (browser automation)
- Context7 (documentation)
- GitHub (version control)

### Option 2: Complete Setup (15 minutes)

Follow the [Complete Setup Guide](SETUP.md) to install all 16 recommended servers.

---

## MCP Configuration Locations

MCP servers are configured in:

1. **Global settings** (`~/.claude/settings.json` or VS Code settings)
   - Available in all projects
   - **Recommended** for most servers

2. **Project settings** (`.mcp.json` in project root)
   - Project-specific servers only
   - Example: project-specific database connections

**Most users only need global MCP configuration.**

---

## Understanding MCP Permissions

When Claude uses an MCP server for the first time, you'll be asked to approve it:

```
Claude wants to use the Playwright MCP server to:
- Navigate to https://example.com
- Take a screenshot

[Allow Once] [Allow Always] [Deny]
```

**Recommendations:**
- **Allow Always:** Trusted servers (Playwright, Context7, GitHub)
- **Allow Once:** Testing new servers
- **Deny:** Unknown or suspicious requests

**Reset approvals:**
```bash
claude mcp reset-project-choices
```

---

## Monitoring MCP Status

### Check Server Status

```
/mcp
```

Shows:
- Which servers are running
- Connection status
- Recent errors

### List Available Servers

```bash
claude mcp list
```

### View Server Logs

Most MCP servers log to:
- `~/.claude/logs/mcp-[server-name].log`

---

## Security Best Practices

### 1. Only Install Trusted Servers

- Prefer official MCP servers from Anthropic
- Review code for community servers
- Check server permissions

### 2. Use Environment Variables for Secrets

Never hardcode API keys in MCP configuration:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### 3. Scope Permissions Appropriately

Grant MCP servers minimal required permissions:
- Use read-only tokens when possible
- Limit database access to specific schemas
- Use repository-scoped GitHub tokens

**See [Security Considerations](SECURITY.md) for comprehensive security guide.**

---

## Troubleshooting Common Issues

### Server won't start

**Check:**
1. Is Node.js installed? (`node --version`)
2. Are dependencies installed? (`npm install -g [package]`)
3. Check logs: `~/.claude/logs/mcp-[server].log`

**Fix:**
```bash
# Reinstall server
npm uninstall -g @modelcontextprotocol/server-[name]
npm install -g @modelcontextprotocol/server-[name]
```

### "Server not responding"

**Fix:**
1. Check `/mcp` status
2. Restart Claude Code
3. Reset approvals: `claude mcp reset-project-choices`

### Environment variables not working

**Check:**
- Are variables set in your shell? (`echo $GITHUB_TOKEN`)
- Did you restart Claude Code after setting them?
- Are they exported? (`export GITHUB_TOKEN=...`)

**See [MCP Troubleshooting](TROUBLESHOOTING.md) for comprehensive troubleshooting.**

---

## Building Custom MCP Servers

You can build custom MCP servers to integrate with any API or service.

**Example use cases:**
- Internal company APIs
- Custom databases
- Specialized tools
- Proprietary services

**Resources:**
- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

---

## Next Steps

1. **Set up essential servers** → [5-Minute Quick Start](QUICKSTART.md)
2. **Learn when to use each server** → [When to Use What](WHEN_TO_USE_WHAT.md)
3. **See practical examples** → [Servers Guide](SERVERS_GUIDE.md)
4. **Troubleshoot issues** → [Troubleshooting](TROUBLESHOOTING.md)

---

## Additional Resources

- [Model Context Protocol Official Site](https://modelcontextprotocol.io)
- [MCP GitHub Repository](https://github.com/modelcontextprotocol)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Community MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)

---

**Last Updated:** 2024-12-11
