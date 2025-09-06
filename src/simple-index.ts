import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

console.error("SIMPLE: Starting simple MCP server");
console.error("SIMPLE: Process args:", process.argv);
console.error("SIMPLE: Working directory:", process.cwd());
console.error("SIMPLE: Node version:", process.version);

async function main() {
  console.error("SIMPLE: Entered main function");
  
  try {
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
  
  // Keep the process alive with multiple approaches
  console.error("SIMPLE: Setting up keep-alive mechanisms");
  
  // Method 1: Signal handlers
  process.on('SIGINT', () => {
    console.error("SIMPLE: Received SIGINT, shutting down gracefully");
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.error("SIMPLE: Received SIGTERM, shutting down gracefully");  
    process.exit(0);
  });
  
  // Method 2: Prevent event loop from exiting
  const keepAlive = setInterval(() => {
    // Do nothing, just keep event loop alive
  }, 60000); // Every minute
  
  // Method 3: Explicitly keep process running
  process.on('beforeExit', (code) => {
    console.error("SIMPLE: Process about to exit with code:", code);
    console.error("SIMPLE: Keeping process alive");
  });
  
  console.error("SIMPLE: Keep-alive mechanisms set up");
  } catch (error) {
    console.error("SIMPLE: Error in main function:", error);
    throw error;
  }
}

console.error("SIMPLE: Checking entry point condition...");
console.error("SIMPLE: import.meta.url:", import.meta.url);
console.error("SIMPLE: process.argv[1]:", process.argv[1]);
console.error("SIMPLE: file:// + process.argv[1]:", `file://${process.argv[1]}`);

// Always call main - don't rely on ES module entry point check
console.error("SIMPLE: Starting main function regardless of entry point check");
main().catch((error) => {
  console.error("SIMPLE: Error:", error);
  process.exit(1);
});