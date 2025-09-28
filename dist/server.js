import { searchSubtitles } from "./tools/search-subtitles.js";
import { downloadSubtitle } from "./tools/download-subtitle.js";
import { calculateFileHash } from "./tools/calculate-file-hash.js";
export function createOpenSubtitlesServer() {
    console.error("DEBUG: Creating OpenSubtitles server - defining tools");
    let tools;
    try {
        tools = [
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
                        },
                        username: {
                            type: "string",
                            description: "OpenSubtitles.com username for authentication"
                        },
                        password: {
                            type: "string",
                            description: "OpenSubtitles.com password for authentication"
                        }
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
                        file_id: {
                            type: "number",
                            description: "File ID from search results (found in files array of subtitle results)"
                        },
                        file_name: {
                            type: "string",
                            description: "Desired file name for the downloaded subtitle"
                        },
                        in_fps: {
                            type: "number",
                            description: "Input FPS for subtitle conversion (must use with out_fps)"
                        },
                        out_fps: {
                            type: "number",
                            description: "Output FPS for subtitle conversion (must use with in_fps)"
                        },
                        timeshift: {
                            type: "number",
                            description: "Time shift in seconds to add/remove (e.g. 2.5 or -1)"
                        },
                        force_download: {
                            type: "boolean",
                            description: "Set subtitle file headers to 'application/force-download' for direct file download (default: true)"
                        },
                        user_api_key: {
                            type: "string",
                            description: "Your OpenSubtitles API key for authenticated downloads"
                        },
                        username: {
                            type: "string",
                            description: "OpenSubtitles.com username (alternative to API key)"
                        },
                        password: {
                            type: "string",
                            description: "OpenSubtitles.com password (use with username)"
                        }
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
        console.error("DEBUG: Tools array created successfully, length:", tools.length);
    }
    catch (error) {
        console.error("DEBUG: Error creating tools array:", error);
        tools = [];
    }
    console.error("DEBUG: About to return server object");
    return {
        async getTools() {
            console.error("DEBUG: getTools() called, returning", tools.length, "tools");
            return tools;
        },
        async getResources() {
            console.error("DEBUG: getResources() called");
            return [
                {
                    uri: "opensubtitles://guide/intelligent-search",
                    name: "OpenSubtitles Intelligent Search Guide",
                    description: "Universal guide for AI assistants on how to perform intelligent subtitles searches using the available tools",
                    mimeType: "text/markdown"
                }
            ];
        },
        async readResource(params) {
            console.error("DEBUG: readResource called with:", JSON.stringify(params, null, 2));
            const { uri } = params;
            if (uri === "opensubtitles://guide/intelligent-search") {
                return {
                    contents: [
                        {
                            uri: uri,
                            mimeType: "text/markdown",
                            text: `# OpenSubtitles Intelligent Search Guide

## Overview
This guide helps AI assistants perform intelligent subtitle searches using the OpenSubtitles MCP server tools. The server provides three core tools for comprehensive subtitle management.

## Available Tools

### 1. search_subtitles
**Purpose**: Find subtitles using various search criteria
**Best Practices**:
- Start with specific criteria (IMDB ID, year) for better results
- Use \`query\` for general text search (movie/TV show titles)
- Combine multiple parameters for precise matching
- Always specify \`languages\` when user has language preferences

**Smart Search Strategies**:
- **For Movies**: Use \`query + year + imdb_id\` if available
- **For TV Shows**: Use \`parent_imdb_id + season_number + episode_number\`
- **For Local Files**: Calculate hash first, then search with \`moviehash + moviebytesize\`
- **Quality Control**: Use \`trusted_sources: "only"\` for verified subtitles

**Parameter Combinations**:
\`\`\`json
// Best accuracy - IMDB + specific details
{
  "imdb_id": 133093,
  "year": 1999,
  "languages": "en"
}

// TV Series episode
{
  "parent_imdb_id": 944947,
  "season_number": 1,
  "episode_number": 5,
  "languages": "en,es"
}

// File-based matching (most accurate)
{
  "moviehash": "8e245d9679d31e12",
  "moviebytesize": 735934464,
  "languages": "en"
}
\`\`\`

### 2. download_subtitle
**Purpose**: Download subtitle files by ID
**Requirements**: 
- \`file_id\` from search results (found in \`files\` array)
- Optional API key for authenticated downloads (higher rate limits)

**Smart Usage**:
- Always get \`file_id\` from search results first
- Use \`force_download: true\` for direct file downloads
- Apply \`timeshift\` or FPS conversion when needed
- Provide meaningful \`file_name\` for organization

### 3. calculate_file_hash
**Purpose**: Generate OpenSubtitles hash for local movie files
**When to Use**:
- User has local movie file and wants exact subtitle matches
- Before searching with moviehash parameter
- For highest accuracy subtitle matching

## Intelligent Search Workflow

### Step 1: Identify Search Type
1. **User has movie/show name**: Use \`query\` + \`year\` 
2. **User has IMDB/TMDB ID**: Use exact ID search
3. **User has local file**: Calculate hash first
4. **User wants specific episode**: Use series + season/episode

### Step 2: Execute Search
- Start with most specific criteria available
- If no results, gradually broaden search
- Always include language preferences when specified

### Step 3: Present Results Intelligently
- Show top 3-5 most relevant results
- Highlight download counts and ratings
- Group by language if multiple languages found
- Provide download links and file IDs for easy access

### Step 4: Download Process
- Use file_id from selected result
- Apply any requested modifications (timeshift, FPS)
- Provide clear download confirmation

## Error Handling
- **No results**: Suggest broader search terms or alternative search methods
- **Authentication required**: Explain API key benefits for downloads
- **File not found**: Verify file_id from latest search results
- **Hash calculation failed**: Check file path and permissions

## Language Codes
Common language codes: \`en\` (English), \`es\` (Spanish), \`fr\` (French), \`de\` (German), \`it\` (Italian), \`pt\` (Portuguese), \`ru\` (Russian), \`ja\` (Japanese), \`zh\` (Chinese), \`ko\` (Korean)

## Rate Limiting
- Search: Unlimited for all users
- Download: Limited for anonymous users, higher limits with API key
- Encourage users to get free API key from OpenSubtitles.com for better experience

## Tips for AI Assistants
1. **Always ask for language preferences** if not specified
2. **Combine search criteria** for better accuracy  
3. **Explain search strategy** to users for transparency
4. **Handle TV shows carefully** - distinguish between series and episodes
5. **Suggest file hash calculation** for local files
6. **Provide context** about subtitle quality and source
7. **Respect rate limits** and suggest API keys when appropriate

This guide enables intelligent, context-aware subtitle searches that provide the best user experience.`
                        }
                    ]
                };
            }
            throw new Error(`Resource not found: ${uri}`);
        },
        async handleToolCall(params) {
            console.error("DEBUG: handleToolCall called with:", JSON.stringify(params, null, 2));
            const { name, arguments: args } = params;
            try {
                console.error(`DEBUG: Executing tool ${name} with args:`, JSON.stringify(args, null, 2));
                switch (name) {
                    case "search_subtitles":
                        console.error("DEBUG: Calling searchSubtitles");
                        return await searchSubtitles(args);
                    case "download_subtitle":
                        console.error("DEBUG: Calling downloadSubtitle");
                        return await downloadSubtitle(args);
                    case "calculate_file_hash":
                        console.error("DEBUG: Calling calculateFileHash");
                        return await calculateFileHash(args);
                    default:
                        console.error(`DEBUG: Unknown tool: ${name}`);
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                console.error(`DEBUG: Error executing tool ${name}:`, error);
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
//# sourceMappingURL=server.js.map