/** Server identity and runtime configuration, read once from the environment. */

export const VERSION = "2.0.3";
export const SERVER_NAME = "opensubtitles";
export const SERVER_TITLE = "OpenSubtitles";
export const USER_AGENT = `OpenSubtitles MCP Server v${VERSION}`;

/**
 * Consumer key of the OpenSubtitles MCP application. It is not a user secret: it
 * identifies this app to the REST API (it has been public since 1.x) and is used
 * for anonymous search when no key is configured.
 */
export const APP_API_KEY = "A4grIoZ8vC7C75aE1NxShRVwbqrLMsB2";

export type Mode = "stdio" | "http";

export interface Config {
  apiBase: string;
  apiTimeoutMs: number;
  /** stdio: the user's key. http: the server key used for anonymous search. */
  apiKey: string;
  apiKeyIsDefault: boolean;
  /** stdio only. */
  username?: string;
  password?: string;
  /** http only. */
  port: number;
  host: string;
  allowedOrigins: string[];
  allowedHosts: string[];
  trustProxy: boolean;
  rateLimitPerMinute: number;
  maxBodyBytes: number;
  publicUrl: string;
  logSalt: string;
}

function int(value: string | undefined, fallback: number): number {
  const n = value === undefined || value === "" ? NaN : Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function list(value: string | undefined, fallback: string[]): string[] {
  if (value === undefined) return fallback;
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const DEFAULT_ALLOWED_ORIGINS = [
  "https://claude.ai",
  "https://claude.com",
  "https://www.claude.ai",
  "https://mcp.opensubtitles.com",
];

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.OPENSUBTITLES_API_KEY?.trim() || env.OPENSUBTITLES_USER_KEY?.trim() || "";
  return {
    apiBase: (env.OPENSUBTITLES_API_BASE?.trim() || "https://api.opensubtitles.com/api/v1").replace(/\/+$/, ""),
    apiTimeoutMs: int(env.OPENSUBTITLES_API_TIMEOUT_MS, 15_000),
    apiKey: apiKey || APP_API_KEY,
    apiKeyIsDefault: !apiKey,
    username: env.OPENSUBTITLES_USERNAME?.trim() || undefined,
    password: env.OPENSUBTITLES_PASSWORD || undefined,
    port: int(env.PORT, 1620),
    host: env.HOST?.trim() || "127.0.0.1",
    allowedOrigins: list(env.ALLOWED_ORIGINS, DEFAULT_ALLOWED_ORIGINS),
    allowedHosts: list(env.ALLOWED_HOSTS, []),
    trustProxy: env.TRUST_PROXY === "1" || env.TRUST_PROXY === "true",
    rateLimitPerMinute: int(env.RATE_LIMIT_PER_MINUTE, 120),
    maxBodyBytes: int(env.MAX_BODY_BYTES, 1024 * 1024),
    publicUrl: (env.PUBLIC_URL?.trim() || "https://mcp.opensubtitles.com").replace(/\/+$/, ""),
    logSalt: env.LOG_SALT || "opensubtitles-mcp",
  };
}
