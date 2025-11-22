# MCP Server Template - Node.js

Template for creating custom Model Context Protocol (MCP) servers in Node.js/TypeScript.

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
cp -r .mcp-templates/nodejs my-mcp-server
cd my-mcp-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Customize

Edit `src/index.ts` to add your custom tools, resources, and prompts.

### 4. Build

```bash
npm run build
```

### 5. Test Locally

```bash
npm run dev
```

### 6. Configure Claude Code

Add to `.mcp.json` in your project root:

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

Or use with npx after publishing:

```json
{
  "mcpServers": {
    "my-server": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@your-org/mcp-server-example"],
      "env": {}
    }
  }
}
```

## Template Structure

```
nodejs/
├── src/
│   └── index.ts          # Main server implementation
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Implementing Tools

Tools are functions Claude can call. Add them in `src/index.ts`:

```typescript
// In ListToolsRequestSchema handler
{
  name: 'my_tool',
  description: 'What this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Parameter description',
      },
    },
    required: ['param1'],
  },
}

// In CallToolRequestSchema handler
case 'my_tool':
  const { param1 } = args as { param1: string };
  // Implement tool logic
  return {
    content: [
      {
        type: 'text',
        text: 'Result',
      },
    ],
  };
```

## Implementing Resources

Resources are data Claude can read:

```typescript
// In ListResourcesRequestSchema handler
{
  uri: 'myserver://data',
  name: 'Data Resource',
  description: 'Description of the data',
  mimeType: 'application/json',
}

// In ReadResourceRequestSchema handler
case 'myserver://data':
  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({ key: 'value' }),
      },
    ],
  };
```

## Implementing Prompts

Prompts are templates for common tasks:

```typescript
// In ListPromptsRequestSchema handler
{
  name: 'my_prompt',
  description: 'Prompt description',
  arguments: [
    {
      name: 'arg1',
      description: 'Argument description',
      required: true,
    },
  ],
}

// In GetPromptRequestSchema handler
case 'my_prompt':
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Template using ${args?.arg1}`,
        },
      },
    ],
  };
```

## Error Handling

Always handle errors gracefully:

```typescript
try {
  // Tool logic
  return {
    content: [{ type: 'text', text: 'Success' }],
  };
} catch (error) {
  return {
    content: [
      {
        type: 'text',
        text: `Error: ${error.message}`,
      },
    ],
    isError: true,
  };
}
```

## Environment Variables

Access environment variables from Claude Code configuration:

```typescript
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable not set');
}
```

Configure in `.mcp.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "transport": "stdio",
      "command": "node",
      "args": ["dist/index.js"],
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
npm test

# Run in watch mode
npm run dev

# Test with Claude Code
claude mcp test my-server
```

## Publishing

### To npm

1. Update `package.json` with your details
2. Build the server: `npm run build`
3. Publish: `npm publish --access public`

### To GitHub

1. Create repository
2. Push code
3. Users can install with npx:
   ```bash
   npx github:your-org/your-repo
   ```

## Examples

### Database Query Tool

```typescript
{
  name: 'query_database',
  description: 'Query the database',
  inputSchema: {
    type: 'object',
    properties: {
      sql: {
        type: 'string',
        description: 'SQL query to execute',
      },
    },
    required: ['sql'],
  },
}

case 'query_database':
  const { sql } = args as { sql: string };
  const results = await db.query(sql);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(results, null, 2),
      },
    ],
  };
```

### API Call Tool

```typescript
{
  name: 'call_api',
  description: 'Call external API',
  inputSchema: {
    type: 'object',
    properties: {
      endpoint: { type: 'string' },
      method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
      data: { type: 'object' },
    },
    required: ['endpoint', 'method'],
  },
}

case 'call_api':
  const { endpoint, method, data } = args;
  const response = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });
  return {
    content: [
      {
        type: 'text',
        text: await response.text(),
      },
    ],
  };
```

## Best Practices

1. **Validate inputs** - Always validate tool arguments
2. **Handle errors** - Return meaningful error messages
3. **Log to stderr** - stdout is for MCP protocol
4. **Document thoroughly** - Clear descriptions help Claude use tools correctly
5. **Version your server** - Use semantic versioning
6. **Test extensively** - Test all tools, resources, and prompts
7. **Secure secrets** - Never hardcode credentials
8. **Rate limit** - Implement rate limiting for external APIs
9. **Cache when possible** - Cache expensive operations
10. **Monitor usage** - Log tool usage for debugging

## Security

- Never commit secrets to version control
- Validate all inputs
- Sanitize outputs
- Use environment variables for credentials
- Implement rate limiting
- Log security events
- Follow least privilege principle
- Review [MCP_SECURITY.md](../../docs/security/MCP_SECURITY.md)

## Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Claude Code Documentation](https://code.claude.com/docs)
- [Example MCP Servers](https://github.com/modelcontextprotocol/servers)

## Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Ask questions in discussions
- **Documentation**: Check [MCP_SETUP.md](../../docs/integrations/MCP_SETUP.md)

---

**Template Version:** 1.0.0
**Last Updated:** 2025-11-21
