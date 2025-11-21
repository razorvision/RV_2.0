# MCP Server Template - Python

Template for creating custom Model Context Protocol (MCP) servers in Python.

## What is an MCP Server?

An MCP server provides tools, resources, and prompts that Claude Code can use to interact with external systems. This allows Claude to:
- Call APIs
- Query databases
- Read files
- Execute system commands
- Access custom business logic
- And more!

## Quick Start

### 1. Copy Template

```bash
cp -r .mcp-templates/python my-mcp-server
cd my-mcp-server
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -e ".[dev]"
```

### 4. Customize

Edit `src/mcp_server_example/server.py` to add your custom tools, resources, and prompts.

### 5. Run

```bash
python -m mcp_server_example
```

### 6. Configure Claude Code

Add to `.mcp.json` in your project root:

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

Or use with pipx after publishing:

```json
{
  "mcpServers": {
    "my-server": {
      "transport": "stdio",
      "command": "pipx",
      "args": ["run", "mcp-server-example"],
      "env": {}
    }
  }
}
```

## Template Structure

```
python/
├── src/
│   └── mcp_server_example/
│       ├── __init__.py      # Package initialization
│       └── server.py         # Main server implementation
├── pyproject.toml           # Project configuration
└── README.md               # This file
```

## Implementing Tools

Tools are async functions Claude can call. Add them in `server.py`:

```python
# Add to list_tools()
Tool(
    name="my_tool",
    description="What this tool does",
    inputSchema={
        "type": "object",
        "properties": {
            "param1": {
                "type": "string",
                "description": "Parameter description",
            }
        },
        "required": ["param1"],
    },
)

# Add to call_tool()
elif name == "my_tool":
    param1 = arguments.get("param1")
    # Implement tool logic
    result = do_something(param1)
    return [TextContent(type="text", text=str(result))]
```

## Implementing Resources

Resources are data Claude can read:

```python
# Add to list_resources()
Resource(
    uri="myserver://data",
    name="Data Resource",
    description="Description of the data",
    mimeType="application/json",
)

# Add to read_resource()
elif uri == "myserver://data":
    data = {"key": "value"}
    return json.dumps(data, indent=2)
```

## Implementing Prompts

Prompts are templates for common tasks:

```python
# Add to list_prompts()
Prompt(
    name="my_prompt",
    description="Prompt description",
    arguments=[
        {
            "name": "arg1",
            "description": "Argument description",
            "required": True,
        }
    ],
)

# Add to get_prompt()
elif name == "my_prompt":
    arg1 = arguments.get("arg1") if arguments else "default"
    return GetPromptResult(
        messages=[
            PromptMessage(
                role="user",
                content=TextContent(
                    type="text",
                    text=f"Template using {arg1}",
                ),
            )
        ]
    )
```

## Error Handling

Always handle errors gracefully:

```python
try:
    # Tool logic
    result = perform_operation()
    return [TextContent(type="text", text=str(result))]
except Exception as e:
    return [TextContent(type="text", text=f"Error: {str(e)}")]
```

## Environment Variables

Access environment variables from Claude Code configuration:

```python
import os

api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("API_KEY environment variable not set")
```

Configure in `.mcp.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "transport": "stdio",
      "command": "python",
      "args": ["-m", "mcp_server_example"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

Then set in your shell:
```bash
export API_KEY="your-api-key"
```

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=mcp_server_example

# Type checking
mypy src

# Linting
ruff check src

# Formatting
black src
```

## Publishing

### To PyPI

1. Update `pyproject.toml` with your details
2. Build: `python -m build`
3. Publish: `python -m twine upload dist/*`

### To GitHub

1. Create repository
2. Push code
3. Users can install with pipx:
   ```bash
   pipx run mcp-server-example
   ```

## Examples

### Database Query Tool

```python
import sqlite3

Tool(
    name="query_database",
    description="Query the database",
    inputSchema={
        "type": "object",
        "properties": {
            "sql": {
                "type": "string",
                "description": "SQL query to execute",
            }
        },
        "required": ["sql"],
    },
)

elif name == "query_database":
    sql = arguments.get("sql")
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute(sql)
    results = cursor.fetchall()
    conn.close()
    return [TextContent(type="text", text=json.dumps(results, indent=2))]
```

### API Call Tool

```python
import httpx

Tool(
    name="call_api",
    description="Call external API",
    inputSchema={
        "type": "object",
        "properties": {
            "endpoint": {"type": "string"},
            "method": {"type": "string", "enum": ["GET", "POST", "PUT", "DELETE"]},
            "data": {"type": "object"},
        },
        "required": ["endpoint", "method"],
    },
)

elif name == "call_api":
    endpoint = arguments.get("endpoint")
    method = arguments.get("method")
    data = arguments.get("data")

    async with httpx.AsyncClient() as client:
        response = await client.request(method, endpoint, json=data)
        return [TextContent(type="text", text=response.text)]
```

### File Read Tool

```python
from pathlib import Path

Tool(
    name="read_file",
    description="Read a file",
    inputSchema={
        "type": "object",
        "properties": {
            "path": {
                "type": "string",
                "description": "Path to the file",
            }
        },
        "required": ["path"],
    },
)

elif name == "read_file":
    path = Path(arguments.get("path"))
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")
    content = path.read_text()
    return [TextContent(type="text", text=content)]
```

## Best Practices

1. **Type hints** - Use type hints for better code quality
2. **Async/await** - Use async functions for I/O operations
3. **Error handling** - Return meaningful error messages
4. **Logging** - Log to stderr (stdout is for MCP protocol)
5. **Documentation** - Clear descriptions help Claude use tools correctly
6. **Version your server** - Use semantic versioning
7. **Test extensively** - Write tests for all tools
8. **Secure secrets** - Never hardcode credentials
9. **Validate inputs** - Check and sanitize all inputs
10. **Rate limit** - Implement rate limiting for external APIs

## Security

- Never commit secrets to version control
- Validate all inputs
- Sanitize outputs
- Use environment variables for credentials
- Implement rate limiting
- Log security events
- Follow least privilege principle
- Review [MCP_SECURITY.md](../../MCP_SECURITY.md)

## Type Checking

Enable strict type checking with mypy:

```bash
mypy src --strict
```

Fix type errors before publishing.

## Dependencies

Keep dependencies minimal and up-to-date:

```bash
# Check for updates
pip list --outdated

# Update dependencies
pip install --upgrade mcp
```

## Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Claude Code Documentation](https://code.claude.com/docs)
- [Example MCP Servers](https://github.com/modelcontextprotocol/servers)

## Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Ask questions in discussions
- **Documentation**: Check [MCP_SETUP.md](../../MCP_SETUP.md)

---

**Template Version:** 1.0.0
**Last Updated:** 2025-11-21
