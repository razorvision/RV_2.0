#!/usr/bin/env node

/**
 * Example MCP Server for Node.js
 *
 * This is a template for creating custom MCP servers that can be used with Claude Code.
 * MCP servers provide tools, resources, and prompts that Claude can use to interact with
 * external systems, APIs, databases, or any other services.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Server configuration
const SERVER_NAME = 'example-server';
const SERVER_VERSION = '1.0.0';

// Create MCP server instance
const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},      // This server provides tools
      resources: {},  // This server provides resources
      prompts: {},    // This server provides prompts
    },
  }
);

/**
 * TOOLS
 *
 * Tools are functions that Claude can call to perform actions.
 * Examples: query database, call API, read files, execute commands
 */

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'echo',
        description: 'Echo back the provided message',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The message to echo back',
            },
          },
          required: ['message'],
        },
      },
      {
        name: 'get_time',
        description: 'Get the current time',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'calculate',
        description: 'Perform basic arithmetic calculations',
        inputSchema: {
          type: 'object',
          properties: {
            operation: {
              type: 'string',
              enum: ['add', 'subtract', 'multiply', 'divide'],
              description: 'The arithmetic operation to perform',
            },
            a: {
              type: 'number',
              description: 'First number',
            },
            b: {
              type: 'number',
              description: 'Second number',
            },
          },
          required: ['operation', 'a', 'b'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'echo':
        return {
          content: [
            {
              type: 'text',
              text: args.message as string,
            },
          ],
        };

      case 'get_time':
        return {
          content: [
            {
              type: 'text',
              text: new Date().toISOString(),
            },
          ],
        };

      case 'calculate': {
        const { operation, a, b } = args as { operation: string; a: number; b: number };
        let result: number;

        switch (operation) {
          case 'add':
            result = a + b;
            break;
          case 'subtract':
            result = a - b;
            break;
          case 'multiply':
            result = a * b;
            break;
          case 'divide':
            if (b === 0) {
              throw new Error('Division by zero');
            }
            result = a / b;
            break;
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: `Result: ${result}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * RESOURCES
 *
 * Resources are data that Claude can read.
 * Examples: files, database records, API responses, documentation
 */

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'example://config',
        name: 'Server Configuration',
        description: 'Current server configuration',
        mimeType: 'application/json',
      },
      {
        uri: 'example://status',
        name: 'Server Status',
        description: 'Current server status and health',
        mimeType: 'application/json',
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'example://config':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                name: SERVER_NAME,
                version: SERVER_VERSION,
                capabilities: ['tools', 'resources', 'prompts'],
              },
              null,
              2
            ),
          },
        ],
      };

    case 'example://status':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                status: 'healthy',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
              },
              null,
              2
            ),
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

/**
 * PROMPTS
 *
 * Prompts are templates that Claude can use for common tasks.
 * Examples: code review templates, documentation templates, test templates
 */

// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'example_prompt',
        description: 'An example prompt template',
        arguments: [
          {
            name: 'topic',
            description: 'The topic to discuss',
            required: true,
          },
        ],
      },
    ],
  };
});

// Handle prompt requests
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'example_prompt':
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please provide information about: ${args?.topic || 'general topics'}`,
            },
          },
        ],
      };

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

/**
 * START SERVER
 */

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is used for MCP protocol)
  console.error(`${SERVER_NAME} v${SERVER_VERSION} running on stdio`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
