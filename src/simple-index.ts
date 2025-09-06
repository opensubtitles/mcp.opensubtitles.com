import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

console.error("SIMPLE: Starting simple MCP server");

async function main() {
  console.error("SIMPLE: Creating server");
  
  const server = new Server(
    {
      name: "opensubtitles-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  console.error("SIMPLE: Setting up handlers");
  
  // Simple tools list
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("SIMPLE: ListTools called");
    return {
      tools: [
        {
          name: "test_tool",
          description: "A simple test tool",
          inputSchema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "A test message"
              }
            },
            required: ["message"]
          }
        }
      ]
    };
  });

  // Simple tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error("SIMPLE: CallTool called with:", request.params.name);
    return {
      content: [
        {
          type: "text",
          text: "Simple MCP server is working!"
        }
      ]
    };
  });

  console.error("SIMPLE: Connecting transport");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SIMPLE: Connected successfully");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("SIMPLE: Error:", error);
    process.exit(1);
  });
}