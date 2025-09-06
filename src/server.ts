import { Tool, CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { searchSubtitles } from "./tools/search-subtitles.js";
import { downloadSubtitle } from "./tools/download-subtitle.js";
import { calculateFileHash } from "./tools/calculate-file-hash.js";

export interface OpenSubtitlesServer {
  getTools(): Promise<Tool[]>;
  handleToolCall(params: CallToolRequest["params"]): Promise<any>;
}

export function createOpenSubtitlesServer(): OpenSubtitlesServer {
  const tools: Tool[] = [
    {
      name: "search_subtitles",
      description: "Search for subtitles using OpenSubtitles API with comprehensive parameter support",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Text search query"
          },
          imdb_id: {
            type: "number",
            description: "IMDB ID for exact movie/series matching"
          },
          tmdb_id: {
            type: "number", 
            description: "TMDB ID for exact movie/series matching"
          },
          parent_imdb_id: {
            type: "number",
            description: "Parent IMDB ID for TV series"
          },
          parent_tmdb_id: {
            type: "number",
            description: "Parent TMDB ID for TV series"
          },
          season_number: {
            type: "number",
            description: "Season number for TV episodes"
          },
          episode_number: {
            type: "number", 
            description: "Episode number for TV episodes"
          },
          year: {
            type: "number",
            description: "Release year"
          },
          moviehash: {
            type: "string",
            description: "OpenSubtitles file hash for exact matching"
          },
          moviebytesize: {
            type: "number",
            description: "File size in bytes for hash matching"
          },
          languages: {
            type: "string",
            description: "Comma-separated language codes (e.g., 'en,es,fr')"
          },
          machine_translated: {
            type: "string",
            description: "Include machine translated subtitles (exclude, include, only)"
          },
          ai_translated: {
            type: "string", 
            description: "Include AI translated subtitles (exclude, include, only)"
          },
          hearing_impaired: {
            type: "string",
            description: "Include hearing impaired subtitles (exclude, include, only)"
          },
          foreign_parts_only: {
            type: "string",
            description: "Include foreign parts only subtitles (exclude, include, only)"
          },
          trusted_sources: {
            type: "string",
            description: "Only trusted sources (exclude, include, only)"
          },
          order_by: {
            type: "string", 
            description: "Sort order (language, download_count, new, rating)"
          },
          order_direction: {
            type: "string",
            description: "Sort direction (asc, desc)"
          }
        },
        additionalProperties: false
      }
    },
    {
      name: "download_subtitle",
      description: "Download subtitle content by ID with format selection",
      inputSchema: {
        type: "object",
        properties: {
          subtitle_id: {
            type: "string",
            description: "Subtitle ID from search results"
          },
          format: {
            type: "string",
            enum: ["srt", "ass", "vtt"],
            description: "Subtitle format (srt, ass, vtt)"
          },
          user_api_key: {
            type: "string",
            description: "Optional user API key for authenticated downloads"
          }
        },
        required: ["subtitle_id"],
        additionalProperties: false
      }
    },
    {
      name: "calculate_file_hash",
      description: "Calculate OpenSubtitles hash for local movie files",
      inputSchema: {
        type: "object",
        properties: {
          file_path: {
            type: "string",
            description: "Path to the movie file"
          }
        },
        required: ["file_path"],
        additionalProperties: false
      }
    }
  ];

  return {
    async getTools(): Promise<Tool[]> {
      return tools;
    },

    async handleToolCall(params: CallToolRequest["params"]): Promise<any> {
      const { name, arguments: args } = params;

      try {
        switch (name) {
          case "search_subtitles":
            return await searchSubtitles(args);
          
          case "download_subtitle":
            return await downloadSubtitle(args);
          
          case "calculate_file_hash":
            return await calculateFileHash(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
            }
          ]
        };
      }
    }
  };
}