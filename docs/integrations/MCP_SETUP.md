# MCP Server Setup Guide

This repository uses Model Context Protocol (MCP) servers to enhance Claude Code's capabilities for automated testing and workflow automation.

## What is MCP?

Model Context Protocol (MCP) allows Claude Code to connect to external tools and services. For this project, we use the Playwright MCP server to enable:

- **Browser automation** for testing web interfaces
- **Automated testing workflows** for quality assurance
- **Subagent control** for complex multi-step testing scenarios
- **Screenshot capture** and visual regression testing
- **Network monitoring** and performance analysis

## Prerequisites

- [Claude Code](https://code.claude.com) installed
- Node.js and npm installed (version 16 or higher)
- Git repository cloned locally

## Quick Setup for Team Members

When you clone this repository, the `.mcp.json` configuration file is already included. Follow these steps:

### 1. First-Time Setup

```bash
# Navigate to the project directory
cd project-intake-template

# Start Claude Code
claude
```

### 2. Approve MCP Servers

On first use, Claude Code will prompt you to approve the configured MCP servers:

```
Project-scoped MCP servers detected:
- playwright
- filesystem
- git
- memory
- context7
- slack
- github
- sequential-thinking
- puppeteer
- postgres
- sqlite
- brave-search
- everything

Do you want to allow these servers? (yes/no)
```

Type `yes` to approve all servers.

### 3. Verify Installation

Within Claude Code, check that the server is configured:

```bash
# List all configured MCP servers
claude mcp list

# Get details about the Playwright server
claude mcp get playwright
```

You can also use the `/mcp` slash command within Claude Code to check server status.

## Configuration Details

### Current MCP Servers

This template includes thirteen MCP servers for enhanced development capabilities:

#### 1. Playwright MCP Server
- **Purpose:** Browser automation and automated testing
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-playwright`
- **Capabilities:**
  - Launch and control browsers (Chromium, Firefox, WebKit)
  - Navigate pages and interact with elements
  - Capture screenshots and videos
  - Monitor network traffic
  - Execute JavaScript in browser context
  - Multi-browser compatibility testing

#### 2. Filesystem MCP Server
- **Purpose:** Secure file system operations
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-filesystem ${PROJECT_ROOT}`
- **Capabilities:**
  - Read files with access controls
  - Write files with validation
  - Create and manage directories
  - Search files by content
  - File metadata operations
  - Safe file manipulation within project boundaries

#### 3. Git MCP Server
- **Purpose:** Git repository operations
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-git`
- **Capabilities:**
  - Repository status and information
  - Commit history and log viewing
  - Branch operations (create, switch, list)
  - Diff viewing
  - Staged and unstaged changes
  - Git configuration management

#### 4. Memory MCP Server
- **Purpose:** Knowledge graph-based persistent memory
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-memory`
- **Capabilities:**
  - Store and retrieve information across sessions
  - Build knowledge graphs of project context
  - Remember user preferences and patterns
  - Maintain conversation history
  - Create relationships between entities
  - Query stored knowledge

#### 5. Context7 MCP Server
- **Purpose:** Web scraping and content extraction
- **Transport:** stdio (local process)
- **Command:** `npx -y @context7/mcp`
- **Capabilities:**
  - Extract clean content from web pages
  - Scrape structured data from websites
  - Navigate and crawl web content
  - Parse HTML and extract relevant information
  - Handle dynamic content and JavaScript-rendered pages
  - Useful for research, documentation, and data gathering

#### 6. Slack MCP Server
- **Purpose:** Slack workspace integration
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-slack`
- **Environment Variables Required:**
  - `SLACK_BOT_TOKEN` - Bot user OAuth token
  - `SLACK_TEAM_ID` - Workspace/team ID
- **Capabilities:**
  - Read and post messages to channels
  - Manage conversations and threads
  - Search message history
  - User and channel management
  - File uploads and downloads
  - Automated notifications and updates

#### 7. GitHub MCP Server
- **Purpose:** GitHub repository management and automation
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-github`
- **Environment Variables Required:**
  - `GITHUB_PERSONAL_ACCESS_TOKEN` - GitHub PAT with appropriate scopes
- **Capabilities:**
  - Read and create issues, pull requests
  - Manage labels, milestones, projects
  - Search repositories and code
  - Review code and discussions
  - Autonomous repository operations
  - Workflow automation
  - **Note:** Complements GitHub CLI with direct API access for Claude

#### 8. Sequential Thinking MCP Server
- **Purpose:** Enhanced reasoning and problem-solving
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-sequential-thinking`
- **Capabilities:**
  - Extended thinking and reasoning
  - Multi-step problem decomposition
  - Detailed analysis and planning
  - Complex decision-making support
  - Thorough exploration of solutions
  - Better handling of ambiguous problems

#### 9. Puppeteer MCP Server
- **Purpose:** Alternative browser automation (Chrome/Chromium focused)
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-puppeteer`
- **Capabilities:**
  - Chrome DevTools Protocol access
  - Browser automation and testing
  - PDF generation from web pages
  - Screenshot and performance profiling
  - Network interception
  - Complementary to Playwright for Chrome-specific tasks

#### 10. PostgreSQL MCP Server
- **Purpose:** PostgreSQL database operations
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-postgres`
- **Environment Variables Required:**
  - `POSTGRES_CONNECTION_STRING` - PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/dbname`)
- **Capabilities:**
  - Execute SQL queries and commands
  - Schema inspection and management
  - Database performance analysis
  - Table and index operations
  - Perfect for Django projects using PostgreSQL
  - Database migrations and debugging

#### 11. SQLite MCP Server
- **Purpose:** SQLite database operations
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-sqlite`
- **Capabilities:**
  - Lightweight local database operations
  - Query execution and data inspection
  - Schema management
  - Perfect for Django development (default database)
  - Testing database operations
  - No configuration required for local .db files

#### 12. Brave Search MCP Server
- **Purpose:** Web search for research and documentation
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-brave-search`
- **Environment Variables Required:**
  - `BRAVE_API_KEY` - Brave Search API key
- **Capabilities:**
  - Web search for current information
  - Documentation lookup
  - Error message research
  - Library and framework documentation finding
  - Complements Context7 for comprehensive web research
  - Privacy-focused search results

#### 13. Everything MCP Server
- **Purpose:** Fast file search across entire system
- **Transport:** stdio (local process)
- **Command:** `npx -y @modelcontextprotocol/server-everything`
- **Capabilities:**
  - Lightning-fast file search (Windows only)
  - Search across multiple projects
  - Find files by name or pattern
  - Locate configuration files
  - Cross-project file discovery
  - Complements filesystem server with broader scope

### Configuration File

The `.mcp.json` file in the repository root contains:

```json
{
  "mcpServers": {
    "playwright": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {}
    },
    "filesystem": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${PROJECT_ROOT}"],
      "env": {
        "PROJECT_ROOT": "${PWD}"
      }
    },
    "git": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"],
      "env": {}
    },
    "memory": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {}
    },
    "context7": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@context7/mcp"],
      "env": {}
    },
    "slack": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "",
        "SLACK_TEAM_ID": ""
      }
    },
    "github": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": ""
      }
    },
    "sequential-thinking": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    },
    "puppeteer": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {}
    },
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": ""
      }
    },
    "sqlite": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite"],
      "env": {}
    },
    "brave-search": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": ""
      }
    },
    "everything": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-everything"],
      "env": {}
    }
  }
}
```

**Configuration Notes:**
- `-y` flag automatically installs packages without prompting
- `${PROJECT_ROOT}` and `${PWD}` are environment variables expanded at runtime
- Each server runs as a separate process via `stdio` transport

### Setting Up Slack MCP Server

To use the Slack MCP server, you need to create a Slack app and obtain credentials:

1. **Create a Slack App:**
   - Go to https://api.slack.com/apps
   - Click "Create New App" → "From scratch"
   - Name your app and select your workspace

2. **Configure Bot Token Scopes:**
   - Navigate to "OAuth & Permissions"
   - Add required bot token scopes:
     - `channels:history` - Read messages from public channels
     - `channels:read` - View basic channel info
     - `channels:write` - Post messages to channels
     - `chat:write` - Send messages as the bot
     - `users:read` - View users in workspace
     - `files:write` - Upload files
     - `files:read` - Read files

3. **Install App to Workspace:**
   - Click "Install to Workspace"
   - Authorize the app
   - Copy the "Bot User OAuth Token" (starts with `xoxb-`)

4. **Get Team ID:**
   - In Slack, click workspace name → "Settings & administration" → "Workspace settings"
   - Team ID is in the URL: `https://app.slack.com/client/T12345678/...`
   - Copy the T12345678 value

5. **Set Environment Variables:**
   ```bash
   export SLACK_BOT_TOKEN="xoxb-your-token-here"
   export SLACK_TEAM_ID="T12345678"
   ```

### Setting Up GitHub MCP Server

To use the GitHub MCP server, you need a Personal Access Token (PAT):

1. **Create a Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name your token (e.g., "Claude Code MCP")
   - Select scopes based on your needs:
     - `repo` - Full repository access (required for private repos)
     - `read:org` - Read organization data
     - `write:discussion` - Access discussions
     - `admin:repo_hook` - Manage repository webhooks
     - `project` - Access projects

2. **Generate and Copy Token:**
   - Click "Generate token"
   - Copy the token immediately (you won't see it again)

3. **Set Environment Variable:**
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token_here"
   ```

**Security Note:** Store tokens securely. Never commit them to repositories. Consider using a password manager or environment management tools like `direnv`.

### Setting Up PostgreSQL MCP Server

To use the PostgreSQL MCP server, configure your database connection:

1. **Set Connection String:**
   ```bash
   export POSTGRES_CONNECTION_STRING="postgresql://username:password@localhost:5432/dbname"
   ```

2. **Connection String Format:**
   ```
   postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&...]
   ```

3. **Common Examples:**
   - Local development: `postgresql://myuser:mypassword@localhost:5432/mydb`
   - Docker container: `postgresql://postgres:postgres@db:5432/django_db`
   - SSL connection: `postgresql://user:pass@host:5432/db?sslmode=require`

### Setting Up Brave Search MCP Server

To use the Brave Search MCP server, you need a Brave Search API key:

1. **Get API Key:**
   - Go to https://brave.com/search/api/
   - Sign up for a free or paid plan
   - Free tier includes 2,000 queries/month
   - Navigate to your dashboard and copy your API key

2. **Set Environment Variable:**
   ```bash
   export BRAVE_API_KEY="your-brave-api-key-here"
   ```

3. **Use Cases:**
   - Research current libraries and frameworks
   - Find error message solutions
   - Look up API documentation
   - Discover best practices and tutorials

### Setting Up Everything MCP Server

The Everything MCP server requires the Everything search engine (Windows only):

1. **Install Everything:**
   - Download from https://www.voidtools.com/
   - Install and run Everything
   - Let it index your drives (happens automatically)

2. **No Configuration Required:**
   - The MCP server automatically connects to Everything
   - Works immediately after Everything is running
   - Provides instant file search across all indexed drives

3. **Note:** This server only works on Windows. For macOS/Linux, use the filesystem server or standard find tools.

## Using MCP Servers with Claude Code

Once configured, you can ask Claude Code to use these servers:

### Example Use Cases

#### Playwright Server

**1. Test a web application:**
```
Open the staging site and test the login flow
```

**2. Capture screenshots:**
```
Navigate to the homepage and take a screenshot of the hero section
```

**3. Run automated tests:**
```
Use Playwright to test the checkout process and verify all validation works
```

**4. Debug UI issues:**
```
Open the app in multiple browsers and compare how the navbar renders
```

#### Filesystem Server

**1. Search project files:**
```
Search for all files containing "authentication" logic
```

**2. Analyze directory structure:**
```
Show me the directory structure of the src/components folder
```

**3. Safe file operations:**
```
Create a new component file following the project structure
```

#### Git Server

**1. View repository status:**
```
Show me the current git status and recent commit history
```

**2. Branch operations:**
```
Create a new feature branch for user authentication
```

**3. Review changes:**
```
Show me the diff between my current changes and main branch
```

**4. Commit history:**
```
Find all commits related to the payment processing feature
```

#### Memory Server

**1. Remember project context:**
```
Remember that this project uses Zod for validation and Drizzle for database
```

**2. Recall preferences:**
```
What were the coding conventions we established for this project?
```

**3. Track decisions:**
```
Remember that we decided to use JWT tokens with 7-day expiration
```

**4. Build knowledge graph:**
```
What relationships exist between the User, Post, and Comment entities?
```

### Subagent Control

When working with complex testing scenarios, Claude Code can spawn subagents that use the Playwright MCP server to:

- Run parallel tests across multiple browsers
- Execute multi-step test scenarios
- Perform visual regression testing
- Monitor and report test results

## Troubleshooting

### Server Not Found

If you see "Playwright server not found":

```bash
# Verify npx is available
npx --version

# Test Playwright server manually
npx @modelcontextprotocol/server-playwright --version
```

### Permission Denied

If you see permission errors:

```bash
# Reset project server approvals
claude mcp reset-project-choices

# Restart Claude Code and re-approve when prompted
```

### Server Connection Issues

```bash
# Check server status
claude mcp list

# Remove and re-add the server if needed
claude mcp remove playwright
claude mcp add --transport stdio playwright "npx" "@modelcontextprotocol/server-playwright" --scope project
```

### Browser Installation

Playwright may need to download browser binaries:

```bash
# Install Playwright browsers
npx playwright install
```

## Security Considerations

### Trust and Approval

- MCP servers run with the same permissions as your user account
- Only approve servers from trusted sources
- Review `.mcp.json` changes in pull requests carefully
- The Playwright server has access to:
  - File system (for screenshots, downloads)
  - Network access (to navigate websites)
  - System resources (to launch browser processes)

### Environment Variables

If your tests require authentication or API keys:

1. **Never commit credentials to `.mcp.json`**
2. Use environment variables instead:

```json
{
  "mcpServers": {
    "playwright": {
      "transport": "stdio",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-playwright"],
      "env": {
        "TEST_USER": "${TEST_USER}",
        "TEST_PASSWORD": "${TEST_PASSWORD}"
      }
    }
  }
}
```

3. Set environment variables in your shell:

```bash
export TEST_USER="your-username"
export TEST_PASSWORD="your-password"
```

## Advanced Configuration

### Adding Additional MCP Servers

To add more MCP servers for the project:

```bash
# Example: Add a database MCP server
claude mcp add --transport http database https://db-mcp-server.com --scope project
```

### Local vs User vs Project Scope

- **Project scope** (`.mcp.json`): Shared with team, version controlled
- **User scope**: Personal, applies to all your projects
- **Local scope**: Machine-specific overrides

Precedence: local > project > user

### Custom Playwright Configuration

Create a `playwright.config.ts` in the repository root for custom browser settings:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

## Best Practices

### For Developers

1. **Always run tests locally** before pushing changes
2. **Document test scenarios** in issue descriptions
3. **Use consistent naming** for test files and screenshots
4. **Review test results** in PR descriptions
5. **Report flaky tests** as issues with the `type: test` label

### For Team Leads

1. **Review MCP changes** in pull requests carefully
2. **Document new servers** in this guide
3. **Set up CI/CD integration** for automated test runs
4. **Monitor test coverage** and success rates
5. **Train team members** on MCP capabilities

## Additional Resources

- [Claude Code Documentation](https://code.claude.com/docs)
- [MCP Specification](https://modelcontextprotocol.io)
- [Playwright Documentation](https://playwright.dev)
- [Model Context Protocol GitHub](https://github.com/modelcontextprotocol)

## Getting Help

- **Claude Code issues:** https://github.com/anthropics/claude-code/issues
- **MCP protocol questions:** Model Context Protocol documentation
- **Playwright testing:** Playwright Discord or GitHub issues
- **Project-specific questions:** Open an issue in this repository

## Changelog

### 2025-11-21
- Initial MCP setup documentation
- Added Playwright MCP server configuration
- Created team onboarding guide

---

**Maintained by:** Project Team
**Last Updated:** 2025-11-21
