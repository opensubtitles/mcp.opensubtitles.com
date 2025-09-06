import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createOpenSubtitlesServer } from "./server.js";
import express from "express";
import cors from "cors";

async function createMCPServer() {
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

  // Create and setup the OpenSubtitles server
  const openSubtitlesServer = createOpenSubtitlesServer();
  
  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: await openSubtitlesServer.getTools(),
    };
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await openSubtitlesServer.handleToolCall(request.params);
  });

  return server;
}

async function runStdioMode() {
  const server = await createMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("OpenSubtitles MCP server running on stdio");
}

async function runHttpMode() {
  const port = parseInt(process.env.PORT || "1620");
  const app = express();
  
  // Enable CORS for all origins
  app.use(cors({
    origin: true,
    credentials: true
  }));
  
  app.use(express.json());
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'opensubtitles-mcp-server', version: '1.0.0' });
  });
  
  // Info endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'OpenSubtitles MCP Server',
      version: '1.0.0',
      description: 'MCP server for OpenSubtitles API integration',
      endpoints: {
        health: '/health',
        sse: '/sse',
        tools: 'Available via MCP protocol on /sse endpoint'
      },
      usage: {
        'Claude Desktop': 'Use stdio mode with npx @opensubtitles/mcp-server',
        'HTTP Clients': 'Connect to /sse endpoint for Server-Sent Events transport'
      }
    });
  });
  
  // SSE endpoint for MCP
  app.use('/sse', async (req, res) => {
    const server = await createMCPServer();
    const transport = new SSEServerTransport('/message', res);
    await server.connect(transport);
  });
  
  app.listen(port, () => {
    console.log(`OpenSubtitles MCP server running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`MCP SSE endpoint: http://localhost:${port}/sse`);
  });
}

async function main() {
  const mode = process.env.MCP_MODE || (process.stdin.isTTY ? 'http' : 'stdio');
  
  if (mode === 'http') {
    await runHttpMode();
  } else {
    await runStdioMode();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
}