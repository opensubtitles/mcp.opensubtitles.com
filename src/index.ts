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
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');
const serverVersion = packageJson.version;

async function createMCPServer() {
  console.error("DEBUG: Creating MCP server");
  
  const server = new Server(
    {
      name: "opensubtitles-mcp-server",
      version: serverVersion,
    },
    {
      capabilities: {
        tools: {},
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
        sse: '/sse',
        tools: '/tools',
        proxy: '/proxy',
        web: '/web'
      },
      usage: {
        'Claude Desktop (stdio)': 'Use stdio mode with npx @opensubtitles/mcp-server',
        'Claude Desktop (remote)': 'Use remote proxy with npx mcp-opensubtitles-remote',
        'HTTP Clients': 'Connect to /sse endpoint for Server-Sent Events transport',
        'Web Interface': 'Use /web for browser-based access',
        'Direct API': 'POST to /proxy with tool calls'
      }
    });
  });

  // Web interface endpoint
  app.get('/web', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>OpenSubtitles MCP Server - Web Interface</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 10px; }
        .subtitle { color: #666; margin-bottom: 30px; }
        .tool-section { margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #007bff; }
        .tool-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .tool-desc { color: #666; margin-bottom: 15px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: 500; color: #333; }
        input, select, textarea { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; }
        button:hover { background: #0056b3; }
        .result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px; border: 1px solid #e9ecef; }
        .error { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        .success { background: #d4edda; border-color: #c3e6cb; color: #155724; }
        pre { white-space: pre-wrap; word-wrap: break-word; margin: 0; }
        .loading { display: none; color: #007bff; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 OpenSubtitles MCP Server</h1>
        <p class="subtitle">Web interface for subtitle search and download</p>
        
        <div class="tool-section">
            <div class="tool-title">🔍 Search Subtitles</div>
            <div class="tool-desc">Search for subtitles by movie title, IMDB ID, or other criteria</div>
            <form onsubmit="callTool(event, 'search_subtitles')">
                <div class="form-group">
                    <label>Movie Title:</label>
                    <input type="text" name="query" placeholder="e.g., The Matrix" />
                </div>
                <div class="form-group">
                    <label>Year:</label>
                    <input type="number" name="year" placeholder="e.g., 1999" />
                </div>
                <div class="form-group">
                    <label>Languages:</label>
                    <input type="text" name="languages" placeholder="e.g., en,es,fr" />
                </div>
                <div class="form-group">
                    <label>IMDB ID:</label>
                    <input type="number" name="imdb_id" placeholder="e.g., 133093" />
                </div>
                <button type="submit">Search Subtitles</button>
                <span class="loading">Searching...</span>
            </form>
            <div class="result" id="search-result" style="display:none;"></div>
        </div>

        <div class="tool-section">
            <div class="tool-title">💾 Download Subtitle</div>
            <div class="tool-desc">Download subtitle by file ID (get file ID from search results)</div>
            <form onsubmit="callTool(event, 'download_subtitle')">
                <div class="form-group">
                    <label>File ID:</label>
                    <input type="number" name="file_id" placeholder="e.g., 123456" required />
                </div>
                <div class="form-group">
                    <label>API Key (optional):</label>
                    <input type="text" name="user_api_key" placeholder="Your OpenSubtitles API key" />
                </div>
                <button type="submit">Download Subtitle</button>
                <span class="loading">Downloading...</span>
            </form>
            <div class="result" id="download-result" style="display:none;"></div>
        </div>

        <div class="tool-section">
            <div class="tool-title">🔢 Calculate File Hash</div>
            <div class="tool-desc">Calculate OpenSubtitles hash for a local movie file</div>
            <form onsubmit="callTool(event, 'calculate_file_hash')">
                <div class="form-group">
                    <label>File Path:</label>
                    <input type="text" name="file_path" placeholder="/path/to/movie.mkv" required />
                </div>
                <button type="submit">Calculate Hash</button>
                <span class="loading">Calculating...</span>
            </form>
            <div class="result" id="hash-result" style="display:none;"></div>
        </div>
    </div>

    <script>
        async function callTool(event, toolName) {
            event.preventDefault();
            
            const form = event.target;
            const formData = new FormData(form);
            const loading = form.querySelector('.loading');
            const resultDiv = document.getElementById(toolName.replace('_', '-') + '-result');
            
            // Show loading
            loading.style.display = 'inline';
            resultDiv.style.display = 'none';
            
            // Build arguments object
            const args = {};
            for (let [key, value] of formData.entries()) {
                if (value.trim() !== '') {
                    // Convert numeric fields
                    if (['year', 'imdb_id', 'tmdb_id', 'file_id', 'season_number', 'episode_number', 'moviebytesize', 'in_fps', 'out_fps', 'timeshift'].includes(key)) {
                        args[key] = parseInt(value);
                    } else if (key === 'force_download') {
                        args[key] = value === 'true';
                    } else {
                        args[key] = value;
                    }
                }
            }
            
            try {
                const response = await fetch('/proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tool: toolName,
                        arguments: args
                    })
                });
                
                const result = await response.json();
                
                loading.style.display = 'none';
                resultDiv.style.display = 'block';
                
                if (response.ok) {
                    resultDiv.className = 'result success';
                    resultDiv.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                } else {
                    resultDiv.className = 'result error';
                    resultDiv.innerHTML = '<pre>Error: ' + (result.error || 'Unknown error') + '</pre>';
                }
            } catch (error) {
                loading.style.display = 'none';
                resultDiv.style.display = 'block';
                resultDiv.className = 'result error';
                resultDiv.innerHTML = '<pre>Network Error: ' + error.message + '</pre>';
            }
        }
    </script>
</body>
</html>
    `);
  });

  // Direct HTTP API proxy endpoint
  app.post('/proxy', async (req, res) => {
    try {
      const { tool, arguments: args } = req.body;
      
      if (!tool) {
        return res.status(400).json({ error: 'Tool name is required' });
      }

      console.error(`HTTP Proxy: Calling tool ${tool} with args:`, JSON.stringify(args, null, 2));
      
      const openSubtitlesServer = createOpenSubtitlesServer();
      const result = await openSubtitlesServer.handleToolCall({
        name: tool,
        arguments: args || {}
      });
      
      console.error(`HTTP Proxy: Tool ${tool} completed successfully`);
      res.json(result);
      
    } catch (error) {
      console.error(`HTTP Proxy: Tool call failed:`, error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      });
    }
  });

  // List available tools
  app.get('/tools', async (req, res) => {
    try {
      const openSubtitlesServer = createOpenSubtitlesServer();
      const tools = await openSubtitlesServer.getTools();
      res.json({ tools });
    } catch (error) {
      console.error('Error listing tools:', error);
      res.status(500).json({ error: 'Failed to list tools' });
    }
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
  console.error("MAIN: Starting main function");
  console.error("MAIN: Process args:", process.argv);
  console.error("MAIN: Environment MCP_MODE:", process.env.MCP_MODE);
  console.error("MAIN: Environment MCP_TEST_MODE:", process.env.MCP_TEST_MODE);
  console.error("MAIN: stdin.isTTY:", process.stdin.isTTY);
  
  const mode = process.env.MCP_MODE || (process.stdin.isTTY ? 'http' : 'stdio');
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