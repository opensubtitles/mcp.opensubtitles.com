import { McpServer } from "@modelcontextprotocol/server";
import { OpenSubtitlesClient, type Credentials, type FetchFn } from "./api/client.js";
import { SERVER_NAME, SERVER_TITLE, VERSION, type Config, type Mode } from "./config.js";
import { registerPrompts } from "./prompts.js";
import { registerResources } from "./resources.js";
import type { ToolDeps } from "./tools/common.js";
import { registerSubtitleDetails } from "./tools/details.js";
import { registerDownloadSubtitle } from "./tools/download-subtitle.js";
import { registerSearchFeatures } from "./tools/features.js";
import {
  registerCalculateFileHash,
  registerGetUserInfo,
  registerGuessFilename,
  registerListLanguages,
} from "./tools/misc.js";
import { registerSearchSubtitles } from "./tools/search-subtitles.js";

export const INSTRUCTIONS =
  "Find and download subtitles from OpenSubtitles.com. Start with search_subtitles (by filename, title, IMDb/TMDB id with season/episode, or moviehash) and pass languages. " +
  "Use search_features to disambiguate titles, get_subtitle_details to inspect a result for free, and download_subtitle only for the file you want: each download uses the user's daily quota. " +
  "Credentials are configured in the client, never passed as tool arguments; never ask the user for a password in chat. Guide: opensubtitles://guide/intelligent-search.";

export const ICON = { src: "https://www.opensubtitles.com/favicon.ico", mimeType: "image/x-icon" };
const LIST_CACHE = { ttlMs: 3_600_000, cacheScope: "public" as const };

export interface BuildOptions {
  mode: Mode;
  config: Config;
  credentials: Credentials;
  client: string;
  fetch?: FetchFn;
  /** HTTP: the request's MCP-Protocol-Version header (stateless serving has no handshake). */
  protocolHeader?: string;
}

/** One server instance per HTTP request (stateless) or per stdio connection. */
export function buildServer(o: BuildOptions): McpServer {
  const api = new OpenSubtitlesClient(
    { apiBase: o.config.apiBase, defaultApiKey: o.config.apiKey, timeoutMs: o.config.apiTimeoutMs, fetch: o.fetch },
    o.credentials,
  );
  const deps: ToolDeps = { mode: o.mode, config: o.config, api, client: o.client };
  const server = new McpServer(
    {
      name: SERVER_NAME,
      title: SERVER_TITLE,
      version: VERSION,
      websiteUrl: "https://mcp.opensubtitles.com",
      icons: [ICON],
    },
    {
      instructions: INSTRUCTIONS,
      maxToolInputElements: 200,
      // The tool/prompt/resource lists never change at runtime and do not vary by caller.
      capabilities: { tools: { listChanged: false }, resources: { listChanged: false }, prompts: { listChanged: false } },
      cacheHints: {
        "tools/list": LIST_CACHE,
        "prompts/list": LIST_CACHE,
        "resources/list": LIST_CACHE,
        "server/discover": LIST_CACHE,
      },
    },
  );
  deps.protocolVersion = () => server.server.getNegotiatedProtocolVersion() ?? o.protocolHeader;
  registerSearchSubtitles(server, deps);
  registerSubtitleDetails(server, deps);
  registerDownloadSubtitle(server, deps);
  registerSearchFeatures(server, deps);
  registerListLanguages(server, deps);
  registerGuessFilename(server, deps);
  registerCalculateFileHash(server, deps);
  registerGetUserInfo(server, deps);
  registerResources(server, deps);
  registerPrompts(server);
  return server;
}
