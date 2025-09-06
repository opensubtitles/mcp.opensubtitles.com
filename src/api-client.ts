import axios, { AxiosInstance, AxiosResponse } from "axios";
import { z } from "zod";

// Zod schemas for API responses
export const SubtitleFileSchema = z.object({
  file_id: z.number(),
  file_name: z.string(),
});

export const SubtitleAttributesSchema = z.object({
  subtitle_id: z.string(),
  language: z.string(),
  download_count: z.number(),
  new_download_count: z.number(),
  hearing_impaired: z.boolean(),
  hd: z.boolean(),
  fps: z.number().nullable(),
  votes: z.number(),
  points: z.number(),
  ratings: z.number(),
  from_trusted: z.boolean(),
  foreign_parts_only: z.boolean(),
  ai_translated: z.boolean(),
  machine_translated: z.boolean(),
  upload_date: z.string(),
  release: z.string(),
  comments: z.string(),
  legacy_subtitle_id: z.number().nullable(),
  uploader: z.object({
    uploader_id: z.number().nullable(),
    name: z.string(),
    rank: z.string(),
  }),
  feature_details: z.object({
    feature_id: z.number(),
    feature_type: z.string(),
    year: z.number(),
    title: z.string(),
    movie_name: z.string(),
    imdb_id: z.number(),
    tmdb_id: z.number().nullable(),
    season_number: z.number().nullable(),
    episode_number: z.number().nullable(),
    parent_imdb_id: z.number().nullable(),
    parent_title: z.string().nullable(),
    parent_tmdb_id: z.number().nullable(),
    parent_feature_id: z.number().nullable(),
  }),
  url: z.string(),
  related_links: z.array(z.any()),
  files: z.array(SubtitleFileSchema),
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

// Types
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type DownloadResponse = z.infer<typeof DownloadResponseSchema>;
export type Subtitle = z.infer<typeof SubtitleSchema>;

export interface SearchParams {
  query?: string;
  imdb_id?: number;
  tmdb_id?: number;
  parent_imdb_id?: number;
  parent_tmdb_id?: number;
  season_number?: number;
  episode_number?: number;
  year?: number;
  moviehash?: string;
  moviebytesize?: number;
  languages?: string;
  machine_translated?: string;
  ai_translated?: string;
  hearing_impaired?: string;
  foreign_parts_only?: string;
  trusted_sources?: string;
  order_by?: string;
  order_direction?: string;
}

export interface DownloadParams {
  file_id: number;
  sub_format?: string;
}

export class OpenSubtitlesKongClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = "https://api.opensubtitles.com") {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "MCP OpenSubtitles Server v1.0.0",
      },
      timeout: 30000,
    });

    // Request interceptor for logging
    this.client.interceptors.request.use((config) => {
      console.error(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          console.error(`API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
          
          // Handle specific Kong/OpenSubtitles error codes
          switch (error.response.status) {
            case 429:
              throw new Error(
                "Download limit reached. Get your free API key at opensubtitles.com/api or upgrade to premium at mcp.opensubtitles.com/premium"
              );
            case 401:
              throw new Error(
                "Invalid API key. Please check your OpenSubtitles API key or get one at opensubtitles.com/api"
              );
            case 503:
              throw new Error("OpenSubtitles API is temporarily unavailable. Please try again later.");
            default:
              throw new Error(`API request failed: ${error.response.data?.message || error.response.statusText}`);
          }
        } else if (error.request) {
          throw new Error("Network error: Unable to reach OpenSubtitles API");
        } else {
          throw new Error(`Request setup error: ${error.message}`);
        }
      }
    );
  }

  async searchSubtitles(params: SearchParams, userApiKey?: string): Promise<SearchResponse> {
    const headers: Record<string, string> = {};
    
    if (userApiKey) {
      headers["Authorization"] = `Bearer ${userApiKey}`;
    } else {
      headers["X-Anonymous-Request"] = "true";
    }

    // Clean up params - remove undefined values
    const cleanParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== "")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const response = await this.client.get("/api/v1/subtitles", {
      params: cleanParams,
      headers,
    });

    return SearchResponseSchema.parse(response.data);
  }

  async downloadSubtitle(params: DownloadParams, userApiKey?: string): Promise<DownloadResponse> {
    const headers: Record<string, string> = {};
    
    if (userApiKey) {
      headers["Authorization"] = `Bearer ${userApiKey}`;
    } else {
      headers["X-Anonymous-Request"] = "true";
    }

    const response = await this.client.post(
      "/api/v1/download",
      {
        file_id: params.file_id,
        sub_format: params.sub_format || "srt",
      },
      { headers }
    );

    return DownloadResponseSchema.parse(response.data);
  }

  async downloadSubtitleContent(downloadUrl: string): Promise<string> {
    const response = await axios.get(downloadUrl, {
      responseType: "text",
      timeout: 30000,
    });

    return response.data;
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get("/api/v1/infos/formats");
      return response.status === 200;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }
}