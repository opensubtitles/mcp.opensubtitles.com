import { createHash } from "node:crypto";
import * as z from "zod/v4";
import { USER_AGENT } from "../config.js";
import { log, registerSecret } from "../log.js";
import {
  ApiDownload,
  ApiFeature,
  ApiFormats,
  ApiLanguages,
  ApiLogin,
  ApiSearchEnvelope,
  ApiSubtitle,
  ApiUserInfo,
  parseEach,
} from "./schemas.js";

/** Credentials for one caller. Never logged; never part of a tool's arguments. */
export interface Credentials {
  /** The caller's own API key (consumer key). Absent: the server/app key is used. */
  apiKey?: string;
  /** An OpenSubtitles JWT from /login. */
  token?: string;
  username?: string;
  password?: string;
}

export type FetchFn = (input: string | URL, init?: RequestInit) => Promise<Response>;

/** An error from the REST API, already turned into a message an agent can act on. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly resetTime?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ClientOptions {
  apiBase: string;
  /** Key used when the caller has none of their own. */
  defaultApiKey: string;
  timeoutMs: number;
  fetch?: FetchFn;
}

interface CachedToken {
  token: string;
  baseUrl: string | null;
  expiresAt: number;
}

/** Login cache shared by all callers of one process, keyed by a hash of the login. */
const tokenCache = new Map<string, CachedToken>();
export const DEFAULT_API_BASE = "https://api.opensubtitles.com/api/v1";
const MAX_TOKENS = 5000;

export function clearTokenCache(): void {
  tokenCache.clear();
}

function jwtExpiry(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8")) as { exp?: number };
    if (typeof payload.exp === "number") return payload.exp * 1000;
  } catch {
    /* not a JWT we can read */
  }
  return Date.now() + 12 * 3600 * 1000;
}

type Params = Record<string, string | number | boolean | undefined | null>;

/**
 * Query string the way the API wants it (best practices): keys sorted, values
 * lowercased, no empty values, "tt" and leading zeros stripped from ids. Any
 * other form is answered with a 301 to this canonical one.
 */
export function canonicalQuery(params: Params): string {
  const sp = new URLSearchParams();
  for (const key of Object.keys(params).sort()) {
    const raw = params[key];
    if (raw === undefined || raw === null || raw === "") continue;
    let value = String(raw).toLowerCase();
    if (key.endsWith("_id") || key === "id") value = value.replace(/^tt/, "").replace(/^0+(?=\d)/, "");
    sp.append(key, value);
  }
  return sp.toString().replace(/%2C/gi, ",");
}

export class OpenSubtitlesClient {
  private readonly fetchFn: FetchFn;
  private signal?: AbortSignal;

  constructor(
    private readonly opts: ClientOptions,
    private readonly creds: Credentials = {},
  ) {
    this.fetchFn = opts.fetch ?? ((i, init) => fetch(i, init));
    registerSecret(creds.apiKey);
    registerSecret(creds.token);
    registerSecret(creds.password);
  }

  /** A view of this client whose requests also abort when `signal` does (request cancelled). */
  withSignal(signal: AbortSignal | undefined): OpenSubtitlesClient {
    const c = new OpenSubtitlesClient(this.opts, this.creds);
    c.signal = signal;
    return c;
  }

  private timeoutSignal(): AbortSignal {
    const t = AbortSignal.timeout(this.opts.timeoutMs);
    return this.signal ? AbortSignal.any([t, this.signal]) : t;
  }

  /** True when the caller brought their own key or login (not just the app/server key). */
  get hasUserCredentials(): boolean {
    return Boolean(this.creds.apiKey || this.creds.token || (this.creds.username && this.creds.password));
  }

  get canLogin(): boolean {
    return Boolean(this.creds.token || (this.creds.username && this.creds.password));
  }

  private get apiKey(): string {
    return this.creds.apiKey || this.opts.defaultApiKey;
  }

  private loginCacheKey(): string {
    return createHash("sha256")
      .update(this.apiKey)
      .update("\0")
      .update(this.creds.username ?? "")
      .update("\0")
      .update(this.creds.password ?? "")
      .digest("hex");
  }

  /**
   * The API host assigned at login (VIP users get their own). Credentials only ever
   * go to an opensubtitles.com host, and never when the API base is overridden
   * (staging, tests).
   */
  private assignedBase(raw: string | null): string | null {
    if (!raw || this.opts.apiBase !== DEFAULT_API_BASE) return null;
    const host = raw.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
    if (!/^([a-z0-9-]+\.)*opensubtitles\.com$/.test(host)) return null;
    return `https://${host}/api/v1`;
  }

  /** The caller's JWT and the base URL the API assigned them (VIP users get their own). */
  private async session(forceRefresh = false): Promise<CachedToken | null> {
    if (this.creds.token) return { token: this.creds.token, baseUrl: null, expiresAt: jwtExpiry(this.creds.token) };
    if (!this.creds.username || !this.creds.password) return null;
    const key = this.loginCacheKey();
    const cached = tokenCache.get(key);
    if (!forceRefresh && cached && cached.expiresAt - Date.now() > 5 * 60 * 1000) return cached;

    const body = await this.request("POST", "/login", {
      body: { username: this.creds.username, password: this.creds.password },
      auth: false,
    });
    const parsed = ApiLogin.parse(body);
    registerSecret(parsed.token);
    const entry: CachedToken = { token: parsed.token, baseUrl: this.assignedBase(parsed.base_url), expiresAt: jwtExpiry(parsed.token) };
    if (tokenCache.size >= MAX_TOKENS) tokenCache.clear();
    tokenCache.set(key, entry);
    return entry;
  }

  private async request(
    method: "GET" | "POST",
    path: string,
    o: { query?: Params; body?: unknown; auth?: boolean; base?: string | null; retried?: boolean } = {},
  ): Promise<unknown> {
    const qs = o.query ? canonicalQuery(o.query) : "";
    const url = `${o.base ?? this.opts.apiBase}${path}${qs ? `?${qs}` : ""}`;
    const headers: Record<string, string> = {
      "Api-Key": this.apiKey,
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    };
    if (o.body !== undefined) headers["Content-Type"] = "application/json";
    let session: CachedToken | null = null;
    if (o.auth) {
      session = await this.session();
      if (session) headers.Authorization = `Bearer ${session.token}`;
    }

    const started = Date.now();
    let res: Response;
    try {
      res = await this.fetchFn(session?.baseUrl && o.base === undefined ? url.replace(this.opts.apiBase, session.baseUrl) : url, {
        method,
        headers,
        body: o.body === undefined ? undefined : JSON.stringify(o.body),
        signal: this.timeoutSignal(),
        redirect: "follow",
      });
    } catch (err) {
      if (this.signal?.aborted) throw new ApiError("Request cancelled by the client.", 499);
      const timeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
      log("warn", "api request failed", { event: "api.error", path, reason: timeout ? "timeout" : "network" });
      throw new ApiError(
        timeout
          ? `The OpenSubtitles API did not answer within ${Math.round(this.opts.timeoutMs / 1000)} s. Try again in a moment.`
          : "Could not reach the OpenSubtitles API (network error). Try again in a moment.",
        0,
      );
    }
    log("debug", "api request", { event: "api.request", path, http_status: res.status, duration_ms: Date.now() - started });

    const text = await res.text();
    let json: unknown = undefined;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      /* non-JSON error page */
    }

    // A stale token: log in again once.
    if (res.status === 401 && o.auth && session && !o.retried && !this.creds.token && this.creds.username) {
      tokenCache.delete(this.loginCacheKey());
      await this.session(true);
      return this.request(method, path, { ...o, retried: true });
    }
    if (!res.ok) throw this.toError(res, json, path);
    return json;
  }

  private toError(res: Response, json: unknown, path: string): ApiError {
    const body = (json ?? {}) as { message?: unknown; errors?: unknown; reset_time?: unknown; reset_time_utc?: unknown };
    const apiMessage =
      typeof body.message === "string"
        ? body.message
        : Array.isArray(body.errors)
          ? body.errors.map(String).join("; ")
          : res.statusText;
    const reset =
      typeof body.reset_time_utc === "string"
        ? body.reset_time_utc
        : typeof body.reset_time === "string"
          ? body.reset_time
          : undefined;
    const retryAfter = res.headers.get("retry-after") ?? res.headers.get("ratelimit-reset");
    log("warn", "api error", { event: "api.error", path, http_status: res.status });

    switch (res.status) {
      case 400:
        return new ApiError(`The OpenSubtitles API rejected the request: ${apiMessage}.`, 400);
      case 401:
        return new ApiError(
          path === "/login"
            ? "OpenSubtitles login failed: wrong username or password in the MCP server configuration."
            : `Not authorised (401): ${apiMessage}. This needs a logged-in user: configure OPENSUBTITLES_USERNAME/OPENSUBTITLES_PASSWORD (stdio) or an X-OpenSubtitles-Token / X-OpenSubtitles-Username+Password header (HTTP) in the MCP client.`,
          401,
        );
      case 403:
        return new ApiError(
          `Access denied (403): ${apiMessage}. The API key is invalid or not allowed to use this service; check the key configured in the MCP client (free keys: https://www.opensubtitles.com/consumers).`,
          403,
        );
      case 406:
        return new ApiError(
          `${apiMessage}${reset ? ` Quota resets at ${reset}.` : ""}`.trim(),
          406,
          reset,
        );
      case 429:
        return new ApiError(
          `Rate limit reached at the OpenSubtitles API${retryAfter ? `; retry after ${retryAfter} s` : ""}${reset ? ` (resets ${reset})` : ""}. ${apiMessage}`.trim(),
          429,
          reset,
        );
      default:
        if (res.status >= 500)
          return new ApiError(`The OpenSubtitles API is temporarily unavailable (${res.status}). Try again later.`, res.status);
        return new ApiError(`OpenSubtitles API error ${res.status}: ${apiMessage}`, res.status);
    }
  }

  async searchSubtitles(params: Params) {
    const raw = await this.request("GET", "/subtitles", { query: params, auth: this.canLogin });
    const env = ApiSearchEnvelope.parse(raw);
    const { items, skipped } = parseEach(ApiSubtitle, env.data);
    if (skipped) log("warn", "skipped malformed records", { event: "api.skipped", path: "/subtitles", count: skipped });
    return {
      total_count: env.total_count ?? items.length,
      total_pages: env.total_pages ?? 1,
      per_page: env.per_page ?? 50,
      page: env.page ?? 1,
      data: items,
    };
  }

  async searchFeatures(params: Params) {
    const raw = await this.request("GET", "/features", { query: params });
    const env = z.object({ data: z.array(z.unknown()).nullish() }).parse(raw);
    const { items, skipped } = parseEach(ApiFeature, env.data ?? []);
    if (skipped) log("warn", "skipped malformed records", { event: "api.skipped", path: "/features", count: skipped });
    return items;
  }

  async download(body: Record<string, unknown>): Promise<ApiDownload> {
    const raw = await this.request("POST", "/download", { body, auth: this.canLogin });
    return ApiDownload.parse(raw);
  }

  /** Fetch the subtitle file from the temporary link the API returned. */
  async fetchFile(link: string, maxBytes: number): Promise<{ text: string; bytes: number; truncated: boolean }> {
    let res: Response;
    try {
      res = await this.fetchFn(link, { headers: { "User-Agent": USER_AGENT }, signal: this.timeoutSignal() });
    } catch {
      throw new ApiError("Downloading the subtitle file failed (network error or timeout). Try again.", 0);
    }
    if (!res.ok) throw new ApiError(`Downloading the subtitle file failed (${res.status}).`, res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    const truncated = buf.length > maxBytes;
    return { text: buf.subarray(0, maxBytes).toString("utf8"), bytes: buf.length, truncated };
  }

  async userInfo() {
    if (!this.canLogin) {
      throw new ApiError(
        "get_user_info needs a logged-in user. Configure OPENSUBTITLES_USERNAME and OPENSUBTITLES_PASSWORD (stdio) or send an X-OpenSubtitles-Token header, or X-OpenSubtitles-Username + X-OpenSubtitles-Password headers (HTTP).",
        401,
      );
    }
    const raw = await this.request("GET", "/infos/user", { auth: true });
    return ApiUserInfo.parse(raw).data;
  }

  async languages() {
    return ApiLanguages.parse(await this.request("GET", "/infos/languages")).data;
  }

  async formats() {
    return ApiFormats.parse(await this.request("GET", "/infos/formats")).data.output_formats;
  }
}
