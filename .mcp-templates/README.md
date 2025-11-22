# MCP Server Templates

Templates for creating custom Model Context Protocol (MCP) servers in Node.js/TypeScript and Python.

## What are MCP Servers?

MCP servers extend Claude Code's capabilities by providing:
- **Tools**: Functions Claude can call (APIs, databases, commands)
- **Resources**: Data Claude can read (files, configs, documentation)
- **Prompts**: Templates for common tasks (code review, testing)

## Available Templates

### Node.js / TypeScript
**Location:** `nodejs/`

**Features:**
- Full TypeScript support
- MCP SDK integration
- Example tools, resources, and prompts
- Development scripts
- Testing setup

**Use for:**
- JavaScript/TypeScript projects
- npm package distribution
- npx-based execution

[View Node.js Template →](nodejs/README.md)

### Python
**Location:** `python/`

**Features:**
- Modern Python (3.10+)
- Type hints and mypy
- Async/await support
- Example tools, resources, and prompts
- Testing with pytest

**Use for:**
- Python projects
- PyPI package distribution
- pipx-based execution

[View Python Template →](python/README.md)

## Quick Start

### 1. Choose Template

```bash
# Node.js
cp -r .mcp-templates/nodejs my-mcp-server

# Python
cp -r .mcp-templates/python my-mcp-server
```

### 2. Install Dependencies

```bash
# Node.js
cd my-mcp-server
npm install

# Python
cd my-mcp-server
python -m venv venv
source venv/bin/activate
pip install -e ".[dev]"
```

### 3. Customize

Edit the server implementation to add your custom tools, resources, and prompts.

### 4. Configure Claude Code

Add to `.mcp.json` in your project root:

**Node.js:**
```json
{
  "mcpServers": {
    "my-server": {
      "transport": "stdio",
      "command": "node",
      "args": ["/path/to/my-mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

**Python:**
```json
{
  "mcpServers": {
    "my-server": {
      "transport": "stdio",
      "command": "python",
      "args": ["-m", "mcp_server_example"],
      "env": {}
    }
  }
}
```

## Template Structure

Both templates include:

### Tools
Functions Claude can call to perform actions:
- Query databases
- Call APIs
- Read/write files
- Execute commands
- Custom business logic

### Resources
Data Claude can read:
- Configuration files
- Database records
- API responses
- Documentation
- Status information

### Prompts
Templates for common tasks:
- Code review
- Documentation generation
- Test creation
- Bug analysis
- Refactoring guides

## Use Cases

### Development Tools
- Custom linters and formatters
- Project scaffolding
- Code generation
- Build automation

### Data Access
- Database queries
- File system operations
- API integrations
- Configuration management

### Business Logic
- Domain-specific operations
- Workflow automation
- Data validation
- Report generation

### Testing
- Test execution
- Coverage reporting
- Performance benchmarking
- Integration testing

## Publishing

### npm (Node.js)
```bash
npm publish --access public
```

Users install with:
```bash
npx @your-org/mcp-server-example
```

### PyPI (Python)
```bash
python -m build
twine upload dist/*
```

Users install with:
```bash
pipx run mcp-server-example
```

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Validate inputs** - Check all tool arguments
3. **Sanitize outputs** - Prevent data leaks
4. **Rate limiting** - Protect external services
5. **Error handling** - Return safe error messages
6. **Logging** - Log to stderr, not stdout
7. **Least privilege** - Request minimum permissions
8. **Audit dependencies** - Keep packages updated

See [MCP_SECURITY.md](../docs/security/MCP_SECURITY.md) for comprehensive security guidelines.

## Example Servers

### Database Server (Node.js)
```typescript
Tool(
  name: 'query',
  description: 'Query database',
  inputSchema: {
    type: 'object',
    properties: {
      sql: { type: 'string' }
    }
  }
)
```

### API Server (Python)
```python
Tool(
    name="fetch_data",
    description="Fetch data from API",
    inputSchema={
        "type": "object",
        "properties": {
            "endpoint": {"type": "string"}
        }
    }
)
```

### File Server (Node.js)
```typescript
Resource(
  uri: 'file://config',
  name: 'Configuration',
  mimeType: 'application/json'
)
```

## Testing

### Node.js
```bash
npm test
npm run dev  # Watch mode
```

### Python
```bash
pytest
pytest --cov  # With coverage
mypy src  # Type checking
```

## Documentation

Each template includes:
- Comprehensive README
- Code examples
- API documentation
- Best practices guide
- Security guidelines

## Resources

### Official Documentation
- [MCP Specification](https://modelcontextprotocol.io)
- [MCP SDK (Node.js)](https://github.com/modelcontextprotocol/sdk)
- [MCP SDK (Python)](https://github.com/modelcontextprotocol/python-sdk)
- [Claude Code Documentation](https://code.claude.com/docs)

### Example Servers
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- Playwright (browser automation)
- Filesystem (file operations)
- Git (repository operations)
- Memory (knowledge graphs)

### Project Documentation
- [MCP_SETUP.md](../docs/integrations/MCP_SETUP.md) - Setup guide
- [MCP_SECURITY.md](../docs/security/MCP_SECURITY.md) - Security guide
- [CLAUDE_CODE_WORKFLOWS.md](../docs/workflows/CLAUDE_CODE_WORKFLOWS.md) - Workflows guide

## Support

- **Questions**: Open a GitHub Discussion
- **Issues**: Report bugs via GitHub Issues
- **Security**: See [SECURITY.md](../docs/security/SECURITY.md) for reporting vulnerabilities

## Contributing

Improvements to these templates are welcome! To contribute:

1. Test changes thoroughly
2. Update documentation
3. Follow existing patterns
4. Submit pull request

## Version History

- **1.0.0** (2025-11-21) - Initial templates
  - Node.js/TypeScript template
  - Python template
  - Example tools, resources, prompts
  - Comprehensive documentation

---

**Templates Version:** 1.0.0
**Last Updated:** 2025-11-21
**Maintained By:** Development Team
