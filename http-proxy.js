#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const REMOTE_SERVER_URL = "http://localhost:1620";

async function createHttpProxyServer() {
  console.error("DEBUG: Creating HTTP proxy server");
  
  const server = new Server(
    {
      name: "opensubtitles-http-proxy",
      version: "1.3.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List tools handler - get tools from HTTP server
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("DEBUG: ListTools request - forwarding to HTTP server");
    try {
      const axiosInstance = axios.create({
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Get tools from the HTTP server
      const response = await axiosInstance.get(`${REMOTE_SERVER_URL}/tools`);
      console.error("DEBUG: HTTP server tools response:", response.data);

      return response.data;
    } catch (error) {
      console.error("ERROR: Failed to connect to HTTP server:", error.message);
      throw new Error(`HTTP server unavailable: ${error.message}`);
    }
  });

  // Call tool handler - forward to HTTP server via proxy endpoint
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error("DEBUG: CallTool request - forwarding to HTTP server:", request.params.name);
    try {
      const axiosInstance = axios.create({
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Forward the tool call to the HTTP server's proxy endpoint
      const response = await axiosInstance.post(`${REMOTE_SERVER_URL}/proxy`, {
        tool: request.params.name,
        arguments: request.params.arguments
      });
      
      console.error("DEBUG: HTTP server response status:", response.status);
      
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response format from HTTP server");
      }
    } catch (error) {
      console.error("ERROR: HTTP tool call failed:", error.message);
      if (error.response) {
        console.error("ERROR: Response status:", error.response.status);
        console.error("ERROR: Response data:", error.response.data);
      }
      throw new Error(`HTTP server error: ${error.message}`);
    }
  });

  return server;
}

async function main() {
  try {
    console.error("Starting OpenSubtitles HTTP Proxy...");
    console.error("Connecting to HTTP server:", REMOTE_SERVER_URL);
    
    const server = await createHttpProxyServer();
    const transport = new StdioServerTransport();
    
    console.error("Connecting to stdio transport...");
    await server.connect(transport);
    console.error("HTTP proxy successfully connected!");
  } catch (error) {
    console.error("FATAL: HTTP proxy startup failed:", error);
    process.exit(1);
  }
}

main();