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
                description: "Download subtitle content by file ID with format selection. Requires authentication (API key or username/password).",
                inputSchema: {
                    type: "object",
                    properties: {
                        file_id: {
                            type: "number",
                            description: "File ID from search results (found in files array of subtitle results)"
                        },
                        sub_format: {
                            type: "string",
                            description: "Subtitle format (from /infos/formats endpoint, e.g. srt, ass, vtt)"
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
                            description: "Set subtitle file headers to force download"
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