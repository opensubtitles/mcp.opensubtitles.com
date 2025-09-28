import axios from "axios";
import { z } from "zod";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
// Read version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf-8"));
const VERSION = packageJson.version;
// Zod schemas for API responses
export const SubtitleFileSchema = z.object({
    file_id: z.number(),
    file_name: z.string(),
    cd_number: z.number().optional(),
});
export const SubtitleAttributesSchema = z.object({
    subtitle_id: z.string(),
    language: z.string().nullable(),
    download_count: z.number().optional().default(0),
    new_download_count: z.number().optional().default(0),
    hearing_impaired: z.boolean().nullable().optional().default(false),
    hd: z.boolean().nullable().optional().default(false),
    fps: z.number().nullable().optional(),
    votes: z.number().optional().nullable().default(0),
    points: z.number().optional().default(0),
    ratings: z.number().optional().nullable().default(0),
    from_trusted: z.boolean().nullable().optional().default(false),
    foreign_parts_only: z.boolean().nullable().optional().default(false),
    ai_translated: z.boolean().nullable().optional().default(false),
    machine_translated: z.boolean().nullable().optional().default(false),
    upload_date: z.string().optional().default(""),
    release: z.string().optional().default(""),
    comments: z.string().nullable().optional().default(""),
    legacy_subtitle_id: z.number().nullable().optional(),
    legacy_uploader_id: z.number().nullable().optional(),
    nb_cd: z.number().optional(),
    slug: z.string().optional(),
    uploader: z.object({
        uploader_id: z.number().nullable().optional(),
        name: z.string().optional().default(""),
        rank: z.string().optional().default(""),
    }).optional().default({ name: "", rank: "" }),
    feature_details: z.object({
        feature_id: z.number().optional(),
        feature_type: z.string().optional().default(""),
        year: z.number().optional(),
        title: z.string().optional().default(""),
        movie_name: z.string().optional().default(""),
        imdb_id: z.number().optional(),
        tmdb_id: z.number().nullable().optional(),
        season_number: z.number().nullable().optional(),
        episode_number: z.number().nullable().optional(),
        parent_imdb_id: z.number().nullable().optional(),
        parent_title: z.string().nullable().optional(),
        parent_tmdb_id: z.number().nullable().optional(),
        parent_feature_id: z.number().nullable().optional(),
    }).optional().default({}),
    url: z.string().optional().default(""),
    related_links: z.array(z.any()).optional().default([]),
    files: z.array(SubtitleFileSchema).optional().default([]),
});
export const SubtitleSchema = z.object({
    id: z.string(),
    type: z.string(),
    attributes: SubtitleAttributesSchema,
});
export const SearchResponseSchema = z.object({
    total_pages: z.number(),
    total_count: z.number(),
    per_page: z.number(),
    page: z.number(),
    data: z.array(SubtitleSchema),
});
export const DownloadResponseSchema = z.object({
    link: z.string(),
    file_name: z.string(),
    requests: z.number(),
    remaining: z.number(),
    message: z.string(),
    reset_time: z.string(),
    reset_time_utc: z.string(),
});
export class OpenSubtitlesKongClient {
    client;
    baseURL;
    defaultApiKey = "A4grIoZ8vC7C75aE1NxShRVwbqrLMsB2";
    constructor(baseURL = "https://api.opensubtitles.com") {
        this.baseURL = baseURL;
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                "User-Agent": `OpenSubtitles MCP Server v${VERSION} (+https://mcp.opensubtitles.com)`,
                "Accept": "application/json",
                // Axios sets Content-Type automatically for JSON bodies; for GET it won't send it
            },
            timeout: 30000,
            maxRedirects: 5, // Follow up to 5 redirects
            validateStatus: (status) => status >= 200 && status < 400, // Accept 2xx and 3xx status codes
            paramsSerializer: {
                serialize: (params) => {
                    // Use URLSearchParams with custom space encoding for OpenSubtitles optimization
                    const searchParams = new URLSearchParams();
                    Object.keys(params).forEach(key => {
                        if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
                            searchParams.append(key, params[key].toString());
                        }
                    });
                    // Replace %20 with + for spaces as OpenSubtitles prefers
                    return searchParams.toString().replace(/%20/g, '+');
                }
            },
        });
        // Request interceptor for logging
        this.client.interceptors.request.use((config) => {
            const queryString = config.params ? new URLSearchParams(config.params).toString() : '';
            const fullUrl = `${config.baseURL}${config.url}${queryString ? '?' + queryString : ''}`;
            console.error(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
            console.error(`Full URL with params: ${fullUrl}`);
            console.error(`Headers:`, JSON.stringify(config.headers, null, 2));
            console.error(`Params:`, JSON.stringify(config.params, null, 2));
            return config;
        });
        // Response interceptor for error handling and redirect debugging
        this.client.interceptors.response.use((response) => {
            console.error(`Response status: ${response.status} for ${response.config.url}`);
            return response;
        }, (error) => {
            if (error.response) {
                console.error(`API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
                console.error(`Error URL: ${error.response.config?.url}`);
                console.error(`Error headers:`, error.response.headers);
                // Handle specific Kong/OpenSubtitles error codes
                switch (error.response.status) {
                    case 429:
                        throw new Error("Download limit reached. Get your free API key at opensubtitles.com/api or upgrade to premium at mcp.opensubtitles.com/premium");
                    case 401:
                        throw new Error("Invalid API key. Please check your OpenSubtitles API key or get one at opensubtitles.com/api");
                    case 403:
                        throw new Error("Access forbidden. This may be due to API rate limits or invalid API key. Please check your OpenSubtitles API key or try again later.");
                    case 503:
                        throw new Error("OpenSubtitles API is temporarily unavailable. Please try again later.");
                    default:
                        throw new Error(`API request failed: ${error.response.data?.message || error.response.statusText}`);
                }
            }
            else if (error.request) {
                throw new Error("Network error: Unable to reach OpenSubtitles API");
            }
            else {
                throw new Error(`Request setup error: ${error.message}`);
            }
        });
    }
    async searchSubtitles(params, userApiKeyOrToken, isToken = false) {
        const headers = {};
        // Always include API key (either default or user-provided)
        if (userApiKeyOrToken && !isToken) {
            // User provided their own API key - use it instead of default
            headers["Api-Key"] = userApiKeyOrToken;
        }
        else {
            // Use default API key
            headers["Api-Key"] = this.defaultApiKey;
        }
        // Add Authorization header only if we have a login token
        if (userApiKeyOrToken && isToken) {
            headers["Authorization"] = `Bearer ${userApiKeyOrToken}`;
        }
        // If languages are specified, hint preferred language via Accept-Language
        if (params.languages && typeof params.languages === 'string' && params.languages.trim().length > 0) {
            headers["Accept-Language"] = params.languages;
        }
        // Clean up params - remove undefined values and add nocache for testing
        const cleanParams = Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== null && value !== "")
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        // Add nocache=1 for testing purposes to avoid caching
        cleanParams.nocache = "1";
        // Sort parameters alphabetically and process values for OpenSubtitles optimization
        const sortedParams = Object.keys(cleanParams)
            .sort()
            .reduce((acc, key) => {
            let value = cleanParams[key];
            if (typeof value === 'string') {
                // Lowercase string values
                value = value.toLowerCase();
                // Remove "tt" from IMDB IDs
                if (key === 'imdb_id' && value.startsWith('tt')) {
                    value = value.slice(2);
                }
                // Remove leading zeros from ID parameters
                if (key.includes('_id') && /^\d+$/.test(value)) {
                    value = parseInt(value, 10).toString();
                }
            }
            else if (typeof value === 'number') {
                // Convert number IDs to string without leading zeros
                if (key.includes('_id')) {
                    value = value.toString();
                }
            }
            return { ...acc, [key]: value };
        }, {});
        console.error("DEBUG: Using sorted params with lowercase strings:", sortedParams);
        const response = await this.client.get("/api/v1/subtitles", {
            params: sortedParams,
            headers,
        });
        return SearchResponseSchema.parse(response.data);
    }
    async downloadSubtitle(params, userApiKeyOrToken, isToken = false) {
        const headers = {};
        // Always include API key (either default or user-provided)
        if (userApiKeyOrToken && !isToken) {
            // User provided their own API key - use it instead of default
            headers["Api-Key"] = userApiKeyOrToken;
        }
        else {
            // Use default API key
            headers["Api-Key"] = this.defaultApiKey;
        }
        // Add Authorization header only if we have a login token
        if (userApiKeyOrToken && isToken) {
            headers["Authorization"] = `Bearer ${userApiKeyOrToken}`;
        }
        // Build query parameters - file_id is required as query param
        const queryParams = {
            file_id: params.file_id,
        };
        if (params.sub_format)
            queryParams.sub_format = params.sub_format;
        if (params.file_name)
            queryParams.file_name = params.file_name;
        if (params.in_fps !== undefined)
            queryParams.in_fps = params.in_fps;
        if (params.out_fps !== undefined)
            queryParams.out_fps = params.out_fps;
        if (params.timeshift !== undefined)
            queryParams.timeshift = params.timeshift;
        if (params.force_download !== undefined)
            queryParams.force_download = params.force_download;
        const response = await this.client.post("/api/v1/download", {}, // Empty body
        {
            params: queryParams,
            headers: {
                ...headers,
                "User-Agent": `OpenSubtitles MCP Server v${VERSION} (+https://mcp.opensubtitles.com)`,
                // Remove Content-Type for download requests since there's no body
                "Content-Type": undefined,
            }
        });
        return DownloadResponseSchema.parse(response.data);
    }
    async downloadSubtitleContent(downloadUrl) {
        const response = await axios.get(downloadUrl, {
            responseType: "text",
            timeout: 30000,
        });
        return response.data;
    }
    // Login with username and password to get a token
    async login(params) {
        // Login endpoint should also include the API key
        const response = await this.client.post("/api/v1/login", {
            username: params.username,
            password: params.password,
        }, {
            headers: {
                "Api-Key": this.defaultApiKey,
            }
        });
        return response.data;
    }
    // Health check method
    async healthCheck() {
        try {
            const response = await this.client.get("/api/v1/infos/formats");
            return response.status === 200;
        }
        catch (error) {
            console.error("Health check failed:", error);
            return false;
        }
    }
}
//# sourceMappingURL=api-client.js.map