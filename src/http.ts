import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { Readable } from "node:stream";
import {
  createMcpHandler,
  isLegacyRequest,
  WebStandardStreamableHTTPServerTransport,
  type AuthInfo,
} from "@modelcontextprotocol/server";
import type { Credentials, FetchFn } from "./api/client.js";
import { VERSION, type Config } from "./config.js";
import { llmsTxt } from "./llms.js";
import { clientId, log, registerSecret } from "./log.js";
import { RateLimiter } from "./ratelimit.js";
import { buildServer } from "./server.js";

/** /message and /json are removed on this date (RFC 8594 Sunset header). */
export const LEGACY_SUNSET = "Mon, 01 Mar 2027 00:00:00 GMT";

const MCP_PATHS = new Set(["/mcp", "/message", "/json"]);
const DEPRECATED_PATHS = new Set(["/message", "/json"]);
const ALLOW_HEADERS = [
  "Content-Type",
  "Accept",
  "Authorization",
  "Api-Key",
  "MCP-Protocol-Version",
  "Mcp-Session-Id",
  "Last-Event-ID",
  "Mcp-Method",
  "Mcp-Name",
  "X-OpenSubtitles-Token",
  "X-OpenSubtitles-Username",
  "X-OpenSubtitles-Password",
].join(", ");

function header(req: IncomingMessage, name: string): string | undefined {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] : v;
}

/**
 * OpenSubtitles credentials from connection-level headers configured in the MCP
 * client. These are credentials for the OpenSubtitles REST API (which validates
 * them), not MCP authorization tokens:
 * - `Api-Key: <key>` — the user's API key;
 * - `X-OpenSubtitles-Token: <jwt>` — a token from /login;
 * - `X-OpenSubtitles-Username` + `X-OpenSubtitles-Password` — the server logs in
 *   and caches the token;
 * - `Authorization: Bearer <jwt or key>` — deprecated fallback for 1.x configs and
 *   clients that only offer "Bearer"; `Authorization` is reserved for MCP OAuth.
 */
export function credentialsFromHeaders(req: IncomingMessage): Credentials {
  const creds: Credentials = {};
  const apiKey = header(req, "api-key")?.trim();
  if (apiKey) creds.apiKey = apiKey;
  const token = header(req, "x-opensubtitles-token")?.trim();
  if (token) creds.token = token;
  const auth = header(req, "authorization")?.trim();
  const m = auth?.match(/^Bearer\s+(.+)$/i);
  if (m?.[1]) {
    const value = m[1].trim();
    if (value.split(".").length === 3) creds.token ??= value;
    else if (!creds.apiKey) creds.apiKey = value;
  }
  const username = header(req, "x-opensubtitles-username")?.trim();
  const password = header(req, "x-opensubtitles-password");
  if (username && password) {
    creds.username = username;
    creds.password = password;
  }
  registerSecret(creds.apiKey);
  registerSecret(creds.token);
  registerSecret(creds.password);
  return creds;
}

export function clientIp(req: IncomingMessage, trustProxy: boolean): string {
  if (trustProxy) {
    const cf = header(req, "cf-connecting-ip");
    if (cf) return cf.trim();
    const xff = header(req, "x-forwarded-for");
    if (xff) return xff.split(",")[0]!.trim();
  }
  return req.socket.remoteAddress ?? "unknown";
}

function originAllowed(origin: string | undefined, cfg: Config): boolean {
  if (!origin) return true; // non-browser MCP clients send no Origin
  if (cfg.allowedOrigins.includes("*")) return true;
  let host: string;
  try {
    host = new URL(origin).hostname;
  } catch {
    return false;
  }
  if (cfg.allowedOrigins.includes(origin)) return true;
  // Local development tools (MCP Inspector) only when we are bound to loopback.
  const loopback = ["127.0.0.1", "localhost", "::1"].includes(cfg.host);
  return loopback && ["localhost", "127.0.0.1", "[::1]"].includes(host);
}

function hostAllowed(req: IncomingMessage, cfg: Config): boolean {
  if (cfg.allowedHosts.length === 0) return true;
  const host = (header(req, "host") ?? "").replace(/:\d+$/, "").toLowerCase();
  return cfg.allowedHosts.includes(host);
}

function corsHeaders(origin: string | undefined): Record<string, string> {
  if (!origin) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": ALLOW_HEADERS,
    "Access-Control-Expose-Headers": "Mcp-Session-Id, MCP-Protocol-Version, Retry-After, Deprecation, Sunset, Link",
    "Access-Control-Max-Age": "600",
  };
}

function sendJson(res: ServerResponse, status: number, body: unknown, extra: Record<string, string> = {}): void {
  const text = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(text), ...extra });
  res.end(text);
}

function jsonRpcError(res: ServerResponse, status: number, code: number, message: string, extra: Record<string, string> = {}): void {
  sendJson(res, status, { jsonrpc: "2.0", id: null, error: { code, message } }, extra);
}

class BodyTooLarge extends Error {}

async function readBody(req: IncomingMessage, limit: number): Promise<Buffer> {
  const declared = Number(header(req, "content-length") ?? "0");
  if (declared > limit) throw new BodyTooLarge();
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > limit) throw new BodyTooLarge();
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

export interface HttpServerOptions {
  config: Config;
  fetch?: FetchFn;
}

export function createHttpServer({ config, fetch: fetchFn }: HttpServerOptions): { server: Server; close: () => Promise<void> } {
  const limiter = new RateLimiter(config.rateLimitPerMinute);

  const factory = (authInfo?: AuthInfo) => {
    const extra = (authInfo?.extra ?? {}) as { credentials?: Credentials; protocolHeader?: string };
    return buildServer({
      mode: "http",
      config,
      credentials: extra.credentials ?? {},
      client: authInfo?.clientId ?? "unknown",
      fetch: fetchFn,
      protocolHeader: extra.protocolHeader,
    });
  };

  // Modern (2026-07-28) traffic: the SDK's stateless per-request handler.
  const handler = createMcpHandler(({ authInfo }) => factory(authInfo), {
      legacy: "reject",
      maxRequestBodySize: config.maxBodyBytes,
      onerror: (err) => log("warn", "mcp handler error", { event: "mcp.error", reason: err.name }),
  });

  /**
   * 2025-era traffic (initialize handshake): served statelessly by a fresh
   * instance per request, answering plain JSON (the spec lets the server choose
   * JSON over SSE). No session is kept, so any replica can serve any request.
   */
  async function serveLegacy(request: Request, parsedBody: unknown, authInfo: AuthInfo): Promise<Response> {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32000, message: "Method not allowed: this server is stateless, use POST." } }), {
        status: 405,
        headers: { "Content-Type": "application/json", Allow: "POST" },
      });
    }
    const server = factory(authInfo);
    const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    await server.connect(transport);
    try {
      return await transport.handleRequest(request, { parsedBody, authInfo });
    } finally {
      void transport.close().catch(() => undefined);
      void server.close().catch(() => undefined);
    }
  }

  const server = createServer(async (req, res) => {
    const started = Date.now();
    const url = new URL(req.url ?? "/", "http://localhost");
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const origin = header(req, "origin");
    let client = "-";
    res.on("finish", () => {
      if (path !== "/health")
        log("info", "http", { event: "http.request", method: req.method, path, http_status: res.statusCode, duration_ms: Date.now() - started, client });
    });

    try {
      if (!hostAllowed(req, config)) return jsonRpcError(res, 403, -32000, "Host not allowed");
      if (!originAllowed(origin, config)) return jsonRpcError(res, 403, -32000, "Origin not allowed");
      const cors = corsHeaders(origin);

      if (req.method === "OPTIONS") {
        res.writeHead(204, cors);
        return res.end();
      }

      if (req.method === "GET" && path === "/health") return sendJson(res, 200, { status: "ok", version: VERSION }, { "Cache-Control": "no-store" });
      if (req.method === "GET" && path === "/llms.txt") {
        const body = llmsTxt(config.publicUrl);
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" });
        return res.end(body);
      }
      if (req.method === "GET" && path === "/") {
        return sendJson(
          res,
          200,
          {
            name: "OpenSubtitles MCP Server",
            version: VERSION,
            mcp: `${config.publicUrl}/mcp`,
            transport: "streamable-http",
            docs: "https://github.com/opensubtitles/mcp.opensubtitles.com#readme",
            llms_txt: `${config.publicUrl}/llms.txt`,
          },
          cors,
        );
      }

      if (!MCP_PATHS.has(path)) return jsonRpcError(res, 404, -32601, "Not found. The MCP endpoint is /mcp.", cors);

      const credentials = credentialsFromHeaders(req);
      const identity = credentials.apiKey || credentials.token || credentials.username || `ip:${clientIp(req, config.trustProxy)}`;
      client = clientId(config.logSalt, identity);

      const rl = limiter.take(client);
      if (!rl.ok) {
        return jsonRpcError(res, 429, -32000, `Too many requests; retry after ${rl.retryAfter} s.`, {
          ...cors,
          "Retry-After": String(rl.retryAfter),
        });
      }

      let body: Buffer | undefined;
      if (req.method === "POST") {
        try {
          body = await readBody(req, config.maxBodyBytes);
        } catch (err) {
          if (err instanceof BodyTooLarge) return jsonRpcError(res, 413, -32600, `Request body over ${config.maxBodyBytes} bytes`, cors);
          throw err;
        }
      }

      const abort = new AbortController();
      res.on("close", () => abort.abort());
      const headers = new Headers();
      for (const [k, v] of Object.entries(req.headers)) {
        if (v === undefined) continue;
        if (Array.isArray(v)) v.forEach((x) => headers.append(k, x));
        else headers.set(k, v);
      }
      // Lenient Accept: clients that send none, */* or only application/json
      // (plain HTTP callers of /message) get JSON instead of a 406.
      if (req.method === "POST") {
        const accept = headers.get("accept") ?? "";
        if (!accept.includes("text/event-stream") || !accept.includes("application/json")) {
          headers.set("accept", "application/json, text/event-stream");
        }
      }
      let parsedBody: unknown = undefined;
      if (body && body.length) {
        try {
          parsedBody = JSON.parse(body.toString("utf8"));
        } catch {
          return jsonRpcError(res, 400, -32700, "Parse error: request body is not valid JSON", cors);
        }
      }
      const request = new Request(new URL(req.url ?? "/mcp", `http://${header(req, "host") ?? "localhost"}`), {
        method: req.method,
        headers,
        body: body && body.length ? new Uint8Array(body) : undefined,
        signal: abort.signal,
      });
      // Spec: a request without MCP-Protocol-Version may be treated as 2025-03-26.
      const protocolHeader = header(req, "mcp-protocol-version") ?? "2025-03-26";
      const authInfo: AuthInfo = { token: "", clientId: client, scopes: [], extra: { credentials, protocolHeader } };
      const legacy = await isLegacyRequest(request, parsedBody, { maxRequestBodySize: config.maxBodyBytes });
      const response = legacy
        ? await serveLegacy(request, parsedBody, authInfo)
        : await handler.fetch(request, { authInfo, parsedBody });

      const outHeaders: Record<string, string> = { ...cors };
      response.headers.forEach((v, k) => {
        outHeaders[k] = v;
      });
      if (DEPRECATED_PATHS.has(path)) {
        outHeaders.Deprecation = "true";
        outHeaders.Sunset = LEGACY_SUNSET;
        outHeaders.Link = `<${config.publicUrl}/mcp>; rel="successor-version"`;
      }
      res.writeHead(response.status, outHeaders);
      if (!response.body) return res.end();
      if ((response.headers.get("content-type") ?? "").includes("text/event-stream")) res.flushHeaders();
      Readable.fromWeb(response.body as import("node:stream/web").ReadableStream).pipe(res);
    } catch (err) {
      log("error", "http handler failed", { event: "http.error", path, reason: err instanceof Error ? err.name : "unknown" });
      if (!res.headersSent) jsonRpcError(res, 500, -32603, "Internal error");
      else res.end();
    }
  });

  server.requestTimeout = 120_000;
  server.headersTimeout = 30_000;

  return {
    server,
    close: async () => {
      await handler.close();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
}
