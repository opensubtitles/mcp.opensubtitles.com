#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const REMOTE_SERVER_URL = "http://mcp.opensubtitles.com";

async function createProxyServer() {
  console.error("DEBUG: Creating remote proxy server");
  
  const server = new Server(
    {
      name: "opensubtitles-remote-proxy",
      version: "1.2.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List tools handler - get tools from remote server via HTTP
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("DEBUG: ListTools request - forwarding to remote server");
    try {
      // Create a minimal HTTP client to get tools from remote server
      const axiosInstance = axios.create({
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // First, try to get server info to verify it's running
      const healthResponse = await axiosInstance.get(`${REMOTE_SERVER_URL}/health`);
      console.error("DEBUG: Remote server health check:", healthResponse.data);

      // Since the remote server is HTTP mode, we need to create tools manually based on what we know
      const tools = [
        {
          name: "search_subtitles",
          description: "Search for subtitles using OpenSubtitles API with comprehensive parameter support",
          inputSchema: {
            type: "object",
            properties: {
              query: { type: "string", description: "Text search query" },
              imdb_id: { type: "number", description: "IMDB ID for exact movie/series matching" },
              tmdb_id: { type: "number", description: "TMDB ID for exact movie/series matching" },
              parent_imdb_id: { type: "number", description: "Parent IMDB ID for TV series" },
              parent_tmdb_id: { type: "number", description: "Parent TMDB ID for TV series" },
              season_number: { type: "number", description: "Season number for TV episodes" },
              episode_number: { type: "number", description: "Episode number for TV episodes" },
              year: { type: "number", description: "Release year" },
              moviehash: { type: "string", description: "OpenSubtitles file hash for exact matching" },
              moviebytesize: { type: "number", description: "File size in bytes for hash matching" },
              languages: { type: "string", description: "Comma-separated language codes (e.g., 'en,es,fr')" },
              machine_translated: { type: "string", description: "Include machine translated subtitles (exclude, include, only)" },
              ai_translated: { type: "string", description: "Include AI translated subtitles (exclude, include, only)" },
              hearing_impaired: { type: "string", description: "Include hearing impaired subtitles (exclude, include, only)" },
              foreign_parts_only: { type: "string", description: "Include foreign parts only subtitles (exclude, include, only)" },
              trusted_sources: { type: "string", description: "Only trusted sources (exclude, include, only)" },
              order_by: { type: "string", description: "Sort order (language, download_count, new, rating)" },
              order_direction: { type: "string", description: "Sort direction (asc, desc)" },
              username: { type: "string", description: "OpenSubtitles.com username for authentication" },
              password: { type: "string", description: "OpenSubtitles.com password for authentication" }
            },
            additionalProperties: false
          }
        },
        {
          name: "download_subtitle",
          description: "Download subtitle content by file ID. Downloads in original format with force_download=true by default for direct file download.",
          inputSchema: {
            type: "object",
            properties: {
              file_id: { type: "number", description: "File ID from search results (found in files array of subtitle results)" },
              file_name: { type: "string", description: "Desired file name for the downloaded subtitle" },
              in_fps: { type: "number", description: "Input FPS for subtitle conversion (must use with out_fps)" },
              out_fps: { type: "number", description: "Output FPS for subtitle conversion (must use with in_fps)" },
              timeshift: { type: "number", description: "Time shift in seconds to add/remove (e.g. 2.5 or -1)" },
              force_download: { type: "boolean", description: "Set subtitle file headers to 'application/force-download' for direct file download (default: true)" },
              user_api_key: { type: "string", description: "Your OpenSubtitles API key for authenticated downloads" },
              username: { type: "string", description: "OpenSubtitles.com username (alternative to API key)" },
              password: { type: "string", description: "OpenSubtitles.com password (use with username)" }
            },
            required: ["file_id"],
            additionalProperties: false
          }
        },
        {
          name: "calculate_file_hash",
          description: "Calculate OpenSubtitles hash for local movie files",
          inputSchema: {
            type: "object",
            properties: {
              file_path: { type: "string", description: "Path to the movie file" }
            },
            required: ["file_path"],
            additionalProperties: false
          }
        }
      ];

      console.error("DEBUG: Returning tools:", tools.map(t => t.name));
      return { tools };
    } catch (error) {
      console.error("ERROR: Failed to connect to remote server:", error.message);
      throw new Error(`Remote server unavailable: ${error.message}`);
    }
  });

  // Call tool handler - forward to remote server via HTTP POST
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error("DEBUG: CallTool request - forwarding to remote server:", request.params.name);
    try {
      const axiosInstance = axios.create({
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Forward the tool call to the remote server's /proxy endpoint
      const response = await axiosInstance.post(`${REMOTE_SERVER_URL}/proxy`, {
        tool: request.params.name,
        arguments: request.params.arguments
      });
      
      console.error("DEBUG: Remote server response status:", response.status);
      
      // The /proxy endpoint returns the result directly
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response format from remote server");
      }
    } catch (error) {
      console.error("ERROR: Remote tool call failed:", error.message);
      if (error.response) {
        console.error("ERROR: Response status:", error.response.status);
        console.error("ERROR: Response data:", error.response.data);
      }
      throw new Error(`Remote server error: ${error.message}`);
    }
  });

  return server;
}

async function main() {
  try {
    console.error("Starting OpenSubtitles Remote Proxy...");
    console.error("Connecting to remote server:", REMOTE_SERVER_URL);
    
    const server = await createProxyServer();
    const transport = new StdioServerTransport();
    
    console.error("Connecting to stdio transport...");
    await server.connect(transport);
    console.error("Remote proxy successfully connected!");
  } catch (error) {
    console.error("FATAL: Proxy startup failed:", error);
    process.exit(1);
  }
}

main();