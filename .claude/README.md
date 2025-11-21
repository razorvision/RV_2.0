# Claude Code Configuration

This directory contains configuration files for Claude Code to enhance your development workflow.

## Files

### `settings.json.template`

Template for project-scoped Claude Code settings. Copy this to `settings.json` to customize:

```bash
cp .claude/settings.json.template .claude/settings.json
```

**Note:** `.claude/settings.json` should be added to `.gitignore` if it contains project-specific or sensitive configurations. The template is committed to provide a starting point for team members.

### `settings.local.json`

Machine-specific settings that override project and user settings. This file is git-ignored by default and should never be committed.

**Precedence:** Local > Project > User

### `commands/`

Custom slash commands for common development tasks. See [commands/README.md](commands/README.md) for details.

## Configuration Options

### Permissions

Control which tools Claude Code can use automatically:

```json
{
  "permissions": {
    "allow": ["Bash", "Read", "Edit", "Write", "Glob", "Grep"],
    "deny": [],
    "ask": ["WebFetch", "WebSearch"]
  }
}
```

**Permission Levels:**
- `allow` - Tools that can be used without asking
- `ask` - Tools that require confirmation (default for most tools)
- `deny` - Tools that are completely blocked

**Common Tools:**
- `Bash` - Execute shell commands
- `Read` - Read files
- `Edit` - Edit files
- `Write` - Create new files
- `Glob` - Find files by pattern
- `Grep` - Search file contents
- `WebFetch` - Fetch web content
- `WebSearch` - Search the web

**Wildcard Patterns:**
```json
{
  "permissions": {
    "allow": [
      "Bash(*)",           // Allow all bash commands
      "Bash(git *)",       // Allow only git commands
      "Bash(npm *)",       // Allow only npm commands
      "Read(*)"            // Allow reading any file
    ]
  }
}
```

### MCP Servers

Configure Model Context Protocol servers:

```json
{
  "mcpServers": {
    "custom-server": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@your-org/mcp-server"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

**Note:** Project-wide MCP servers should be configured in `.mcp.json` at the repository root. Use `settings.json` for machine-specific or personal servers.

### Custom Instructions

Add project-specific context for Claude Code:

```json
{
  "customInstructions": "This is a React + TypeScript project using Vite. Follow the patterns in CODING_STANDARDS.md. Always run tests before committing."
}
```

## Configuration Scopes

### User-Level (~/.claude/settings.json)

Applies to all projects by default. Good for:
- Personal tool preferences
- Global permissions
- Personal MCP servers

**Location:**
- **Mac/Linux:** `~/.claude/settings.json`
- **Windows:** `%USERPROFILE%\.claude\settings.json`

### Project-Level (.claude/settings.json)

Applies to this repository. Good for:
- Team-shared settings
- Project-specific permissions
- Project conventions

**Committed to git:** Use the template and customize per project.

### Local-Level (.claude/settings.local.json)

Machine-specific overrides. Good for:
- Personal overrides
- Machine-specific paths
- Local development servers

**Git-ignored:** Never committed.

## Best Practices

### For Individual Developers

1. **Start with template:**
   ```bash
   cp .claude/settings.json.template .claude/settings.json
   ```

2. **Customize permissions** based on trust level and project needs

3. **Use wildcards carefully** - Be specific with allowed commands:
   ```json
   {
     "allow": [
       "Bash(git *)",      // Good - specific
       "Bash(*)"           // Risky - allows everything
     ]
   }
   ```

4. **Keep sensitive configs local** - Use `settings.local.json` for:
   - API keys
   - Local paths
   - Personal preferences

### For Teams

1. **Commit the template** - Provides consistent starting point

2. **Document project conventions** - Add custom instructions:
   ```json
   {
     "customInstructions": "Follow CODING_STANDARDS.md. Use conventional commits. Run 'npm test' before committing."
   }
   ```

3. **Review changes to `.claude/settings.json`** in PRs - Ensure appropriate permissions

4. **Use `.mcp.json` for MCP servers** - Project-level servers go in root `.mcp.json`

### Security Considerations

1. **Never commit secrets:**
   - Don't put API keys in `settings.json`
   - Use environment variables: `"${API_KEY}"`
   - Add `.claude/settings.json` to `.gitignore` if needed

2. **Be cautious with `allow` permissions:**
   - Start restrictive, expand as needed
   - Use specific patterns over wildcards
   - Review regularly

3. **Audit wildcard permissions:**
   ```json
   {
     "allow": [
       "Bash(rm *)",      // Dangerous!
       "Bash(curl *)",    // Potential security risk
       "Write(*)"         // Can overwrite any file
     ]
   }
   ```

4. **Use `ask` for potentially dangerous operations:**
   ```json
   {
     "ask": [
       "WebFetch",        // External requests
       "WebSearch",       // Search queries
       "Bash(docker *)"   // Container operations
     ]
   }
   ```

## Example Configurations

### Restrictive (High Security)

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep"
    ],
    "ask": [
      "Bash",
      "Edit",
      "Write",
      "WebFetch",
      "WebSearch"
    ]
  }
}
```

**Use case:** Sensitive codebases, initial setup

### Balanced (Recommended)

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(node *)",
      "Read",
      "Edit",
      "Glob",
      "Grep"
    ],
    "ask": [
      "Write",
      "WebFetch",
      "WebSearch",
      "Bash"
    ]
  }
}
```

**Use case:** Most projects, good security/convenience balance

### Permissive (Fast Development)

```json
{
  "permissions": {
    "allow": [
      "Bash(*)",
      "Read(*)",
      "Edit(*)",
      "Write(*)",
      "Glob(*)",
      "Grep(*)"
    ],
    "ask": [
      "WebFetch",
      "WebSearch"
    ]
  }
}
```

**Use case:** Personal projects, prototypes, trusted environments

**⚠️ Warning:** Permissive settings reduce security. Only use in trusted environments.

### Development with MCP

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Read",
      "Edit",
      "Write",
      "Glob",
      "Grep"
    ],
    "ask": ["Bash", "WebFetch"]
  },
  "mcpServers": {
    "local-db": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@local/db-mcp-server"],
      "env": {
        "DB_URL": "${DATABASE_URL}"
      }
    }
  },
  "customInstructions": "React 18 + TypeScript 5 + Vite 5. Follow patterns in CODING_STANDARDS.md. Always run tests before committing. Use conventional commits."
}
```

## Troubleshooting

### Settings Not Applied

1. **Check file location:**
   ```bash
   ls -la .claude/settings.json
   ```

2. **Validate JSON syntax:**
   ```bash
   cat .claude/settings.json | jq .
   ```

3. **Check precedence:**
   - Local overrides project
   - Project overrides user
   - Is there a conflicting higher-precedence file?

### Permission Denied

1. **Check `allow` list** - Is the tool/pattern included?

2. **Check `deny` list** - Is it explicitly denied?

3. **Use `ask` temporarily** - Debug permission issues:
   ```json
   {
     "ask": ["Bash"]
   }
   ```

### MCP Server Not Connecting

1. **Use `.mcp.json` for project servers** - `settings.json` is for personal servers

2. **Check command path** - Verify `npx` or full paths work

3. **Test server manually:**
   ```bash
   npx -y @modelcontextprotocol/server-playwright
   ```

## Resources

- [Claude Code Documentation](https://code.claude.com/docs)
- [MCP Setup Guide](../MCP_SETUP.md)
- [MCP Security Guide](../MCP_SECURITY.md)
- [Slash Commands](commands/README.md)

## Getting Help

- **Configuration issues:** Check this README
- **Permission questions:** Review [MCP_SECURITY.md](../MCP_SECURITY.md)
- **Command usage:** See [commands/README.md](commands/README.md)
- **General Claude Code:** [Claude Code Documentation](https://code.claude.com/docs)

---

**Configuration Version:** 1.0.0
**Last Updated:** 2025-11-21
**Maintained By:** Development Team
