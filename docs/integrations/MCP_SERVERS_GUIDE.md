# MCP Servers Guide

Guide to setting up and using Model Context Protocol (MCP) servers with Claude Code. MCP servers extend Claude's capabilities with specialized tools.

## What is MCP?

MCP (Model Context Protocol) is a standard for connecting AI assistants to external tools and services. MCP servers provide Claude with:

- **Tools**: Actions Claude can perform (browser automation, file operations, API calls)
- **Resources**: Data Claude can access (files, database records, documentation)
- **Prompts**: Pre-defined templates for common tasks

## Configuration

### Config File Location

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Linux:** `~/.config/claude/claude_desktop_config.json`

### Basic Structure

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@package/server-name"],
      "env": {
        "API_KEY": "your-key"
      }
    }
  }
}
```

## Essential MCP Servers

### 1. Playwright (Browser Automation)

Automate browsers for testing, screenshots, and web interaction.

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-playwright"]
    }
  }
}
```

**Key Tools:**
- `browser_navigate` - Go to URL
- `browser_snapshot` - Get accessibility tree (for interaction)
- `browser_take_screenshot` - Capture page image
- `browser_click` - Click elements
- `browser_type` - Type into fields
- `browser_close` - Close browser session

**Best Practices:**
- Always call `browser_close` when done
- Use `browser_snapshot` over screenshots for interaction
- See [MCP Troubleshooting](./MCP_TROUBLESHOOTING.md) for session issues

### 2. GitHub (Repository Operations)

Interact with GitHub repositories, issues, and pull requests.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_personal_access_token"
      }
    }
  }
}
```

**Getting a GitHub Token:**
1. Go to **GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)**
2. Generate new token with scopes:
   - `repo` (full repository access)
   - `read:org` (organization access)
   - `read:project` (project board access)

**Key Tools:**
- `create_issue` - Create GitHub issues
- `create_pull_request` - Open PRs
- `get_file_contents` - Read repo files
- `push_files` - Commit files to repo
- `search_code` - Search across repositories
- `list_commits` - View commit history
- `merge_pull_request` - Merge PRs

### 3. Context7 (Documentation Lookup)

Fetch up-to-date documentation for libraries and frameworks.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    }
  }
}
```

**Key Tools:**
- `resolve-library-id` - Find library ID for documentation
- `get-library-docs` - Fetch documentation for a library

**Usage Pattern:**
1. First resolve the library: `resolve-library-id("react")`
2. Then fetch docs: `get-library-docs("/facebook/react", topic="hooks")`

### 4. Brave Search (Web Search)

Search the web for current information.

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-brave-api-key"
      }
    }
  }
}
```

**Getting a Brave API Key:**
1. Go to [Brave Search API](https://brave.com/search/api/)
2. Sign up for free tier (2,000 queries/month)
3. Copy API key

**Key Tools:**
- `brave_web_search` - General web search
- `brave_local_search` - Local business search

### 5. Filesystem (File Operations)

Direct filesystem access for reading and writing files.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    }
  }
}
```

**Note:** Specify allowed directories as arguments for security.

### 6. Sequential Thinking (Complex Reasoning)

Structured multi-step reasoning for complex problems.

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-sequential-thinking"]
    }
  }
}
```

**When to Use:**
- Multi-step problem solving
- Complex debugging
- Architectural decisions
- Planning implementations

## Full Configuration Example

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-playwright"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-brave-search"],
      "env": {
        "BRAVE_API_KEY": "BSA_xxxxxxxxxxxx"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-sequential-thinking"]
    }
  }
}
```

## Verifying MCP Servers

After configuring, restart Claude Code and check available tools:

1. Start Claude Code: `claude`
2. Ask: "What MCP tools do you have available?"
3. Claude will list all connected servers and their tools

## Troubleshooting

### Server Not Loading

1. Check JSON syntax is valid
2. Verify paths and commands are correct
3. Check environment variables are set
4. Restart Claude Code

### Permission Errors

```bash
# macOS/Linux: Make sure npx is in PATH
which npx

# Windows: Use full path if needed
"command": "C:\\Program Files\\nodejs\\npx.cmd"
```

### API Key Issues

- Ensure tokens haven't expired
- Verify scopes are sufficient
- Check for extra whitespace in config

### Server Crashes

Check logs:
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp-*.log

# Linux
tail -f ~/.config/claude/logs/mcp-*.log
```

## Creating Custom MCP Servers

For team-specific tools, you can create custom MCP servers:

```typescript
// simple-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = new Server(
  { name: 'my-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'my_tool',
      description: 'Does something useful',
      inputSchema: {
        type: 'object',
        properties: {
          input: { type: 'string', description: 'Input value' }
        },
        required: ['input']
      }
    }
  ]
}))

server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'my_tool') {
    const input = request.params.arguments?.input
    return { content: [{ type: 'text', text: `Processed: ${input}` }] }
  }
  throw new Error('Unknown tool')
})

const transport = new StdioServerTransport()
await server.connect(transport)
```

## Security Considerations

1. **Limit filesystem access** - Only allow specific directories
2. **Use minimal token scopes** - Grant only needed permissions
3. **Rotate secrets** - Update tokens periodically
4. **Review server code** - Understand what third-party servers do
5. **Network access** - Be aware of what servers can reach

---

## Related Guides

- [MCP Troubleshooting](./MCP_TROUBLESHOOTING.md) - Common issues and fixes
- [Dev Environment Setup](../guides/DEV_ENVIRONMENT_SETUP.md) - Full setup guide
- [Visual Development Workflow](../workflows/VISUAL_DEVELOPMENT_WORKFLOW.md) - Using Playwright for UI work
