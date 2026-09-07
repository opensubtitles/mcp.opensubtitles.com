import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createOpenSubtitlesServer } from "./server.js";
import { setTransportMode } from "./runtime.js";
import express from "express";
import cors from "cors";
import { createRequire } from 'module';

// Diagnostics: track recent initialize (handshake) per IP for helpful logs
const HANDSHAKE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const lastHandshakeByIp = new Map<string, number>();

// Protocol revision this server implements
const MCP_PROTOCOL_VERSION = '2025-06-18';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');
const serverVersion = packageJson.version;

// Helper function for HTTP response.
// The body is always a single plain JSON document. Node and Express apply chunked
// transfer-encoding themselves, so writing chunk headers here put them *inside* the
// payload (e.g. "dc6\r\n{...}") and broke JSON.parse for every client that did not
// strip them by hand.
function streamResponse(res: any, data: any, status: number = 200) {
  // Prevent double response sending
  if (res.headersSent) {
    console.error('STREAMABLE: Headers already sent, skipping response');
    return;
  }

  console.error('STREAMABLE: Sending JSON response, status:', status);
  res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'MCP-Protocol-Version': MCP_PROTOCOL_VERSION,
    'X-Transport-Type': 'streamable-http',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'false'
  });
  res.status(status).json(data);
}

// Helper: build JSON-RPC response for a single request (no streaming write)
async function dispatchJsonRpcSingle(obj: any, req: any) {
  if (!obj || obj.jsonrpc !== '2.0' || !obj.method) {
    return { jsonrpc: '2.0', id: obj?.id ?? null, error: { code: -32600, message: 'Invalid Request' } };
  }

  if (obj.method === 'initialize') {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || 'unknown';
    const ua = req.get?.('User-Agent') || '';
    lastHandshakeByIp.set(ip, Date.now());
    console.error(`HANDSHAKE OK: initialize from ip=${ip} ua="${ua}" ttl=${HANDSHAKE_TTL_MS}ms`);

    const requestedProto = obj.params?.protocolVersion;
    return {
      jsonrpc: '2.0', id: obj.id,
      result: {
        protocolVersion: requestedProto || MCP_PROTOCOL_VERSION,
        capabilities: {
          tools: { listChanged: true },
          resources: { subscribe: true, listChanged: true }
        },
        serverInfo: { name: 'opensubtitles-mcp-server', version: serverVersion }
      }
    };
  }

  try {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || 'unknown';
    const last = lastHandshakeByIp.get(ip);
    if (!last || (Date.now() - last) > HANDSHAKE_TTL_MS) {
      console.error(`HANDSHAKE MISSING: method=${obj.method} ip=${ip} (no initialize in last ${HANDSHAKE_TTL_MS}ms) – proceeding anyway`);
    }
  } catch {}

  const openSubtitlesServer = createOpenSubtitlesServer();

  if (obj.method === 'tools/list') {
    console.error('STREAMABLE: Listing tools');
    const tools = await openSubtitlesServer.getTools();
    console.error('STREAMABLE: Tools retrieved, count:', tools.length, 'names:', tools.map(t => t.name));
    return { jsonrpc: '2.0', id: obj.id, result: { tools } };
  }

  if (obj.method === 'tools/call') {
    console.error('STREAMABLE: Calling tool:', obj.params?.name);
    try {
      const headers = req.headers || {};
      const authHeader = (headers['authorization'] || headers['Authorization']) as string | undefined;
      const apiKeyHeader = (headers['api-key'] || headers['Api-Key']) as string | undefined;
      const incomingApiKey = apiKeyHeader || (authHeader && authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : undefined);
      if (incomingApiKey) {
        obj.params = obj.params || {};
        obj.params.arguments = obj.params.arguments || {};
        if (!obj.params.arguments.user_api_key) {
          obj.params.arguments.user_api_key = incomingApiKey;
          console.error('STREAMABLE: Injected user_api_key from request headers');
        }
      }
    } catch (e) {
      console.error('STREAMABLE: Failed to inject user_api_key from headers:', e);
    }
    const result = await openSubtitlesServer.handleToolCall(obj.params);
    return { jsonrpc: '2.0', id: obj.id, result };
  }

  if (obj.method === 'resources/list') {
    console.error('STREAMABLE: Listing resources');
    const resources = await openSubtitlesServer.getResources();
    return { jsonrpc: '2.0', id: obj.id, result: { resources } };
  }

  if (obj.method === 'resources/read') {
    console.error('STREAMABLE: Reading resource:', obj.params?.uri);
    const result = await openSubtitlesServer.readResource(obj.params);
    return { jsonrpc: '2.0', id: obj.id, result };
  }

  if (obj.method === 'prompts/list') {
    return { jsonrpc: '2.0', id: obj.id, result: { prompts: [] } };
  }

  if (obj.method === 'resources/templates/list') {
    return { jsonrpc: '2.0', id: obj.id, result: { resourceTemplates: [] } };
  }

  console.error('STREAMABLE: Method not found:', obj.method);
  return { jsonrpc: '2.0', id: obj.id ?? null, error: { code: -32601, message: `Method ${obj.method} is not supported` } };
}

// Handle JSON-RPC MCP requests
async function handleJsonRpcRequest(req: any, res: any) {
  try {
    // Parse JSON body from raw buffer
    let body: any;
    try {
      let rawBody: string;
      
      if (Buffer.isBuffer(req.body)) {
        rawBody = req.body.toString('utf8');
      } else if (typeof req.body === 'string') {
        rawBody = req.body;
      } else if (req.body && typeof req.body === 'object') {
        // Already parsed by Express
        body = req.body;
        rawBody = JSON.stringify(req.body);
      } else {
        rawBody = '';
      }
      
      console.error('STREAMABLE: Raw body received (first 100 chars):', rawBody.substring(0, 100));
      
      if (!body && rawBody) {
        body = JSON.parse(rawBody);
      } else if (!body) {
        throw new Error('Empty request body');
      }
    } catch (parseError) {
      console.error('STREAMABLE: JSON parse error:', parseError);
      streamResponse(res, {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error',
          data: parseError instanceof Error ? parseError.message : 'Invalid JSON'
        }
      }, 400);
      return;
    }
    
    console.error('STREAMABLE: Handling JSON-RPC request:', Array.isArray(body) ? `batch(${body.length})` : body.method, 'id:', Array.isArray(body) ? 'batch' : body.id);
    if (!Array.isArray(body)) {
      console.error('STREAMABLE: Request details - method:', body.method, 'params:', JSON.stringify(body.params));
    }

    // Batch support
    if (Array.isArray(body)) {
      const results: any[] = [];
      for (const item of body) {
        const reply = await dispatchJsonRpcSingle(item, req);
        results.push(reply);
      }
      streamResponse(res, results);
      return;
    }
    
    // Validate JSON-RPC structure
    if (!body.jsonrpc || body.jsonrpc !== '2.0' || !body.method) {
      streamResponse(res, {
        jsonrpc: '2.0',
        id: body.id || null,
        error: {
          code: -32600,
          message: 'Invalid Request',
          data: 'Missing jsonrpc, method, or invalid format'
        }
      }, 400);
      return;
    }

    // Notifications carry no id and get no response body
    if (body.method.startsWith('notifications/')) {
      console.error('STREAMABLE: Received notification:', body.method);
      res.status(204).end();
      return;
    }

    if (body.method === 'initialize') {
      // Session id for clients that keep one across requests
      try {
        const sid = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        res.set({ 'Mcp-Session-Id': sid });
      } catch {}
    }

    const reply = await dispatchJsonRpcSingle(body, req);
    streamResponse(res, reply);
    return;

  } catch (error) {
    const ip = (req.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || 'unknown';
    console.error('STREAMABLE: Error handling JSON-RPC request:', error, ` ip=${ip}`);
    streamResponse(res, {
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32603,
        message: 'Internal error',
        data: error instanceof Error ? error.message : 'Unknown error'
      }
    }, 500);
  }
}

async function createMCPServer() {
  console.error("DEBUG: Creating MCP server");
  
  const server = new Server(
    {
      name: "opensubtitles-mcp-server",
      version: serverVersion,
    },
    {
      capabilities: {
        tools: {
          listChanged: true
        },
        resources: {
          subscribe: true,
          listChanged: true
        },
      },
    }
  );

  console.error("DEBUG: Server instance created");

  // Create and setup the OpenSubtitles server
  const openSubtitlesServer = createOpenSubtitlesServer();
  console.error("DEBUG: OpenSubtitles server created");
  
  const isTestMode = process.env.MCP_TEST_MODE === 'true';
  
  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("DEBUG: ListTools request received");
    try {
      const tools = await openSubtitlesServer.getTools();
      console.error("DEBUG: Returning tools:", tools.map(t => t.name));
      
      if (isTestMode) {
        console.error("DEBUG: Test mode - exiting after ListTools");
        setTimeout(() => process.exit(0), 100);
      }
      
      return { tools };
    } catch (error) {
      console.error("DEBUG: Error in ListTools handler:", error);
      throw error;
    }
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error("DEBUG: CallTool request received");
    try {
      const result = await openSubtitlesServer.handleToolCall(request.params);
      
      if (isTestMode) {
        console.error("DEBUG: Test mode - exiting after CallTool");
        setTimeout(() => process.exit(0), 100);
      }
      
      return result;
    } catch (error) {
      console.error("DEBUG: Error in CallTool handler:", error);
      throw error;
    }
  });

  // List resources handler
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    console.error("DEBUG: ListResources request received");
    try {
      const resources = await openSubtitlesServer.getResources();
      console.error("DEBUG: Returning resources:", resources.map(r => r.name));
      
      if (isTestMode) {
        console.error("DEBUG: Test mode - exiting after ListResources");
        setTimeout(() => process.exit(0), 100);
      }
      
      return { resources };
    } catch (error) {
      console.error("DEBUG: Error in ListResources handler:", error);
      throw error;
    }
  });

  // Read resource handler
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    console.error("DEBUG: ReadResource request received");
    try {
      const result = await openSubtitlesServer.readResource(request.params);
      
      if (isTestMode) {
        console.error("DEBUG: Test mode - exiting after ReadResource");
        setTimeout(() => process.exit(0), 100);
      }
      
      return result;
    } catch (error) {
      console.error("DEBUG: Error in ReadResource handler:", error);
      throw error;
    }
  });

  console.error("DEBUG: Request handlers set up");
  return server;
}

async function runStdioMode() {
  console.error("STDIO MODE: Starting stdio mode");
  try {
    const server = await createMCPServer();
    console.error("STDIO MODE: Server created successfully");
    const transport = new StdioServerTransport();
    console.error("STDIO MODE: Transport created");
    await server.connect(transport);
    console.error("STDIO MODE: Connected successfully - OpenSubtitles MCP server running on stdio");
  } catch (error) {
    console.error("STDIO MODE: Error in runStdioMode:", error);
    process.exit(1);
  }
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
    res.json({ status: 'ok', service: 'opensubtitles-mcp-server', version: serverVersion });
  });
  
  // Info endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'OpenSubtitles MCP Server',
      version: serverVersion,
      description: 'MCP server for OpenSubtitles API integration',
      endpoints: {
        health: '/health',
        mcp: '/mcp',
        message: '/message',
        proxy: '/proxy',
        debug: '/debug'
      },
      usage: {
        'Claude Desktop (stdio)': 'Use stdio mode with npx @opensubtitles/mcp-server',
        'Claude Desktop (remote)': 'Use remote proxy with npx mcp-opensubtitles-remote',
        'MCP Clients (Streamable)': 'Connect to /mcp (or /message) for Streamable HTTP transport'
      }
    });
  });

  // Debug endpoint for testing JSON responses
  app.get('/debug', (req, res) => {
    const userAgent = req.get('User-Agent') || '';
    const testData = {
      jsonrpc: '2.0',
      id: 999,
      result: {
        message: 'Debug test response',
        userAgent: userAgent,
        timestamp: new Date().toISOString()
      }
    };

    streamResponse(res, testData);
  });

  // HTTP Proxy endpoint for direct tool calls
  app.post('/proxy', async (req, res) => {
    try {
      console.error('PROXY: Incoming POST request to /proxy endpoint');

      const { tool, arguments: args } = req.body;

      if (!tool) {
        return res.status(400).json({
          error: 'Missing tool parameter',
          usage: 'POST {"tool": "search_subtitles", "arguments": {...}}'
        });
      }

      console.error('PROXY: Tool call:', tool, 'with args:', args);

      // Create OpenSubtitles server to handle the tool call
      const openSubtitlesServer = createOpenSubtitlesServer();

      // Call the tool using the same pattern as the MCP tools/call method
      const result = await openSubtitlesServer.handleToolCall({
        name: tool,
        arguments: args || {}
      });

      console.error('PROXY: Tool result:', result);

      // Return the result directly as JSON
      res.json(result);

    } catch (error) {
      console.error('PROXY: Error in /proxy endpoint:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // MCP Streamable HTTP endpoint.
  // Raw body middleware, so express.json() cannot consume or reshape the payload.
  app.all(['/message', '/mcp'], express.raw({ type: '*/*' }), async (req, res) => {
    try {
      console.error('STREAMABLE: Incoming request to', req.path, 'method:', req.method);
      
      // Handle CORS preflight
      if (req.method === 'OPTIONS') {
        res.set({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept, MCP-Session-Id, MCP-Protocol-Version, Authorization, Api-Key, X-Requested-With',
          'Access-Control-Allow-Credentials': 'false',
          'Access-Control-Max-Age': '86400'
        });
        res.status(204).end();
        return;
      }
      
      // Handle GET requests - status probe, or 405 for clients opening an SSE stream
      if (req.method === 'GET') {
        console.error('STREAMABLE: Handling GET request');
        const userAgent = req.get('User-Agent') || '';
        console.error('STREAMABLE: User-Agent:', userAgent);

        // This endpoint has no server-initiated stream; the spec wants 405 so the
        // client stops waiting for one and keeps using POST.
        if ((req.get('Accept') || '').includes('text/event-stream')) {
          console.error('STREAMABLE: GET asked for SSE stream - not supported here');
          streamResponse(res, {
            jsonrpc: '2.0',
            id: null,
            error: { code: -32601, message: 'SSE stream not supported on this endpoint, use POST' }
          }, 405);
          return;
        }

        streamResponse(res, {
          jsonrpc: '2.0',
          id: null,
          result: {
            status: 'ok',
            transport: 'streamable-http',
            endpoint: req.path,
            service: 'opensubtitles-mcp-server',
            version: serverVersion,
            headers: req.headers // Debug info
          }
        });
        return;
      }
      
      // Handle HEAD requests - allow simple connectivity checks
      if (req.method === 'HEAD') {
        res.set({
          'Access-Control-Allow-Origin': '*',
          'MCP-Protocol-Version': MCP_PROTOCOL_VERSION,
          'X-Transport-Type': 'streamable-http'
        });
        res.status(204).end();
        return;
      }
      
      // Handle POST requests - JSON-RPC MCP requests
      if (req.method === 'POST') {
        console.error('STREAMABLE: Handling POST request');
        const userAgent = req.get('User-Agent') || '';
        const acceptHeader = req.get('Accept') || '';
        console.error('STREAMABLE: User-Agent:', userAgent);
        console.error('STREAMABLE: Accept header:', acceptHeader);
        await handleJsonRpcRequest(req, res);
        return;
      }
      
      // Method not allowed
      console.error('STREAMABLE: Method not allowed:', req.method);
      streamResponse(res, {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32601,
          message: `Method ${req.method} not allowed`
        }
      }, 405);
      
    } catch (error) {
      console.error('STREAMABLE: Error in /message endpoint:', error);
      if (!res.headersSent) {
        streamResponse(res, {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32603,
            message: 'Internal error',
            data: error instanceof Error ? error.message : 'Unknown error'
          }
        }, 500);
      }
    }
  });

  // Alias kept for clients configured with the WordPress/Woo MCP endpoint shape
  app.all('/wp-json/wp/v2/wpmcp/streamable', express.raw({ type: '*/*' }), async (req, res) => {
    try {
      console.error('STREAMABLE (alias): Incoming request to /wp-json/wp/v2/wpmcp/streamable, method:', req.method);

      // CORS preflight
      if (req.method === 'OPTIONS') {
        res.set({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept, MCP-Session-Id, MCP-Protocol-Version, Authorization, Api-Key, X-Requested-With',
          'Access-Control-Allow-Credentials': 'false',
          'Access-Control-Max-Age': '86400'
        });
        res.status(204).end();
        return;
      }

      // Health-check style GET
      if (req.method === 'GET') {
        const ua = req.get('User-Agent') || '';
        console.error('STREAMABLE (alias): Handling GET; UA:', ua);
        streamResponse(res, {
          jsonrpc: '2.0',
          id: null,
          result: {
            status: 'ok',
            transport: 'streamable-http',
            endpoint: '/wp-json/wp/v2/wpmcp/streamable',
            service: 'opensubtitles-mcp-server',
            version: serverVersion,
            headers: req.headers
          }
        });
        return;
      }

      // HEAD probe
      if (req.method === 'HEAD') {
        res.set({
          'Access-Control-Allow-Origin': '*',
          'MCP-Protocol-Version': MCP_PROTOCOL_VERSION,
          'X-Transport-Type': 'streamable-http'
        });
        res.status(204).end();
        return;
      }

      // POST JSON-RPC
      if (req.method === 'POST') {
        const ua = req.get('User-Agent') || '';
        const accept = req.get('Accept') || '';
        console.error('STREAMABLE (alias): Handling POST; UA:', ua);
        console.error('STREAMABLE (alias): Accept header:', accept);
        await handleJsonRpcRequest(req, res);
        return;
      }

      // Not allowed
      console.error('STREAMABLE (alias): Method not allowed:', req.method);
      streamResponse(res, {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32601, message: `Method ${req.method} not allowed` }
      }, 405);

    } catch (error) {
      console.error('STREAMABLE (alias): Error in endpoint:', error);
      if (!res.headersSent) {
        streamResponse(res, {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32603,
            message: 'Internal error',
            data: error instanceof Error ? error.message : 'Unknown error'
          }
        }, 500);
      }
    }
  });
  
  app.listen(port, () => {
    console.log(`OpenSubtitles MCP server running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`MCP Streamable endpoint: http://localhost:${port}/mcp`);
    console.log(`MCP Streamable endpoint (alias): http://localhost:${port}/message`);
    console.log(`HTTP Proxy endpoint: http://localhost:${port}/proxy`);
    console.log(`Debug info: http://localhost:${port}/debug`);
  });
}

async function main() {
  console.error("MAIN: Starting main function");
  console.error("MAIN: Process args:", process.argv);
  console.error("MAIN: Environment MCP_MODE:", process.env.MCP_MODE);
  console.error("MAIN: Environment MCP_TEST_MODE:", process.env.MCP_TEST_MODE);
  console.error("MAIN: stdin.isTTY:", process.stdin.isTTY);
  
  const mode = process.env.MCP_MODE || (process.stdin.isTTY ? 'http' : 'stdio');
  setTransportMode(mode === 'http' ? 'http' : 'stdio');
  const isTestMode = process.env.MCP_TEST_MODE === 'true';
  console.error("MAIN: Selected mode:", mode);
  console.error("MAIN: Test mode:", isTestMode);
  
  if (mode === 'http') {
    console.error("MAIN: Running HTTP mode");
    await runHttpMode();
  } else {
    console.error("MAIN: Running STDIO mode");
    await runStdioMode();
  }
  
  // Keep the process alive with multiple approaches for stdio mode
  if (mode === 'stdio') {
    console.error("MAIN: Setting up keep-alive mechanisms for stdio mode");
    
    // Signal handlers
    process.on('SIGINT', () => {
      console.error("MAIN: Received SIGINT, shutting down gracefully");
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.error("MAIN: Received SIGTERM, shutting down gracefully");  
      process.exit(0);
    });
    
    // Prevent event loop from exiting
    const keepAlive = setInterval(() => {
      // Do nothing, just keep event loop alive
    }, 60000); // Every minute
    
    // Explicitly keep process running
    process.on('beforeExit', (code) => {
      console.error("MAIN: Process about to exit with code:", code);
      console.error("MAIN: Keeping process alive");
    });
    
    console.error("MAIN: Keep-alive mechanisms set up");
  }
}

// Always call main - don't rely on ES module entry point check
console.error("OPENSUBTITLES-MCP: Starting main function regardless of entry point check");
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
