#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { createOpenSubtitlesServer } from "./server.js";
import express from "express";
import cors from "cors";
async function createMCPServer() {
    console.error("DEBUG: Creating MCP server");
    const server = new Server({
        name: "opensubtitles-mcp-server",
        version: "1.0.0",
    }, {
        capabilities: {
            tools: {},
        },
    });
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
        }
        catch (error) {
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
        }
        catch (error) {
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
    }
    catch (error) {
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
    }
    else {
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
//# sourceMappingURL=index.js.map