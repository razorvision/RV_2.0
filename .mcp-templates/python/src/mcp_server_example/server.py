#!/usr/bin/env python3
"""
Example MCP Server for Python

This is a template for creating custom MCP servers that can be used with Claude Code.
MCP servers provide tools, resources, and prompts that Claude can use to interact with
external systems, APIs, databases, or any other services.
"""

import asyncio
import json
import sys
from datetime import datetime
from typing import Any

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import (
    Tool,
    TextContent,
    Resource,
    Prompt,
    PromptMessage,
    GetPromptResult,
)

# Server configuration
SERVER_NAME = "example-server"
SERVER_VERSION = "1.0.0"

# Create server instance
app = Server(SERVER_NAME)


# ============================================================================
# TOOLS
# ============================================================================
# Tools are functions that Claude can call to perform actions.
# Examples: query database, call API, read files, execute commands


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    return [
        Tool(
            name="echo",
            description="Echo back the provided message",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "The message to echo back",
                    }
                },
                "required": ["message"],
            },
        ),
        Tool(
            name="get_time",
            description="Get the current time",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="calculate",
            description="Perform basic arithmetic calculations",
            inputSchema={
                "type": "object",
                "properties": {
                    "operation": {
                        "type": "string",
                        "enum": ["add", "subtract", "multiply", "divide"],
                        "description": "The arithmetic operation to perform",
                    },
                    "a": {"type": "number", "description": "First number"},
                    "b": {"type": "number", "description": "Second number"},
                },
                "required": ["operation", "a", "b"],
            },
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """Handle tool calls."""
    try:
        if name == "echo":
            message = arguments.get("message", "")
            return [TextContent(type="text", text=str(message))]

        elif name == "get_time":
            current_time = datetime.now().isoformat()
            return [TextContent(type="text", text=current_time)]

        elif name == "calculate":
            operation = arguments.get("operation")
            a = float(arguments.get("a", 0))
            b = float(arguments.get("b", 0))

            if operation == "add":
                result = a + b
            elif operation == "subtract":
                result = a - b
            elif operation == "multiply":
                result = a * b
            elif operation == "divide":
                if b == 0:
                    raise ValueError("Division by zero")
                result = a / b
            else:
                raise ValueError(f"Unknown operation: {operation}")

            return [TextContent(type="text", text=f"Result: {result}")]

        else:
            raise ValueError(f"Unknown tool: {name}")

    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]


# ============================================================================
# RESOURCES
# ============================================================================
# Resources are data that Claude can read.
# Examples: files, database records, API responses, documentation


@app.list_resources()
async def list_resources() -> list[Resource]:
    """List available resources."""
    return [
        Resource(
            uri="example://config",
            name="Server Configuration",
            description="Current server configuration",
            mimeType="application/json",
        ),
        Resource(
            uri="example://status",
            name="Server Status",
            description="Current server status and health",
            mimeType="application/json",
        ),
    ]


@app.read_resource()
async def read_resource(uri: str) -> str:
    """Handle resource reads."""
    if uri == "example://config":
        config = {
            "name": SERVER_NAME,
            "version": SERVER_VERSION,
            "capabilities": ["tools", "resources", "prompts"],
        }
        return json.dumps(config, indent=2)

    elif uri == "example://status":
        status = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
        }
        return json.dumps(status, indent=2)

    else:
        raise ValueError(f"Unknown resource: {uri}")


# ============================================================================
# PROMPTS
# ============================================================================
# Prompts are templates that Claude can use for common tasks.
# Examples: code review templates, documentation templates, test templates


@app.list_prompts()
async def list_prompts() -> list[Prompt]:
    """List available prompts."""
    return [
        Prompt(
            name="example_prompt",
            description="An example prompt template",
            arguments=[
                {
                    "name": "topic",
                    "description": "The topic to discuss",
                    "required": True,
                }
            ],
        )
    ]


@app.get_prompt()
async def get_prompt(name: str, arguments: dict[str, str] | None = None) -> GetPromptResult:
    """Handle prompt requests."""
    if name == "example_prompt":
        topic = arguments.get("topic", "general topics") if arguments else "general topics"
        return GetPromptResult(
            messages=[
                PromptMessage(
                    role="user",
                    content=TextContent(
                        type="text",
                        text=f"Please provide information about: {topic}",
                    ),
                )
            ]
        )
    else:
        raise ValueError(f"Unknown prompt: {name}")


# ============================================================================
# MAIN
# ============================================================================


async def main() -> None:
    """Run the MCP server."""
    # Log to stderr (stdout is used for MCP protocol)
    print(f"{SERVER_NAME} v{SERVER_VERSION} running on stdio", file=sys.stderr)

    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options(),
        )


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer stopped", file=sys.stderr)
    except Exception as e:
        print(f"Fatal error: {e}", file=sys.stderr)
        sys.exit(1)
