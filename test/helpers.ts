import { randomUUID } from "node:crypto";
import { Client, InMemoryTransport, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createMcpHandler } from "@modelcontextprotocol/server";
import type { FetchFn } from "../src/api/client.js";
import { clearTokenCache } from "../src/api/client.js";
import { loadConfig, type Mode } from "../src/config.js";
import { buildServer } from "../src/server.js";
import type { Credentials } from "../src/api/client.js";
import { clearLanguageCache } from "../src/tools/misc.js";

/* Synthetic API data only: no real user data. Titles are public catalogue facts. */

export function subtitle(id: number, over: Record<string, unknown> = {}, feature: Record<string, unknown> = {}) {
  return {
    id: String(id),
    type: "subtitle",
    attributes: {
      subtitle_id: String(id),
      language: "en",
      download_count: 1000 - id,
      new_download_count: 1,
      hearing_impaired: false,
      hd: true,
      fps: 23.976,
      votes: 0,
      ratings: 0,
      from_trusted: false,
      foreign_parts_only: false,
      upload_date: "2024-01-01T00:00:00Z",
      ai_translated: false,
      machine_translated: false,
      release: `Synthetic.Release.${id}`,
      comments: null,
      uploader: { uploader_id: 1, name: "tester", rank: "member" },
      feature_details: {
        feature_id: 100,
        feature_type: "Movie",
        year: 1999,
        title: "The Matrix",
        movie_name: "1999 - The Matrix",
        imdb_id: 133093,
        tmdb_id: 603,
        ...feature,
      },
      url: `https://www.opensubtitles.com/en/subtitles/${id}`,
      related_links: [],
      files: [{ file_id: id * 10, cd_number: 1, file_name: `synthetic-${id}.srt` }],
      ...over,
    },
  };
}

export function feature(id: number, title: string, year: number, type = "Movie", over: Record<string, unknown> = {}) {
  return {
    id: String(id),
    type: "feature",
    attributes: {
      title: title.toLowerCase(),
      original_title: title,
      year: String(year),
      subtitles_count: 100,
      seasons_count: 0,
      subtitles_counts: { en: 50 },
      feature_type: type,
      imdb_id: id + 1000,
      tmdb_id: id + 2000,
      feature_id: String(id),
      title_aka: [],
      url: `https://www.opensubtitles.com/en/movies/${id}`,
      seasons: [],
      ...over,
    },
  };
}

export interface Call {
  method: string;
  url: URL;
  headers: Record<string, string>;
  body: unknown;
}

export type Route = (call: Call) => { status?: number; body?: unknown; headers?: Record<string, string>; text?: string } | undefined;

/** A fetch() stand-in that records calls and answers from routes. */
export function mockFetch(routes: Route[]): FetchFn & { calls: Call[] } {
  const calls: Call[] = [];
  const fn = (async (input: string | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    const headers: Record<string, string> = {};
    new Headers(init?.headers).forEach((v, k) => (headers[k] = v));
    const call: Call = { method: init?.method ?? "GET", url, headers, body: init?.body ? JSON.parse(String(init.body)) : undefined };
    calls.push(call);
    for (const r of routes) {
      const out = r(call);
      if (out) {
        const text = out.text ?? JSON.stringify(out.body ?? {});
        return new Response(text, { status: out.status ?? 200, headers: { "content-type": "application/json", ...(out.headers ?? {}) } });
      }
    }
    return new Response(JSON.stringify({ message: "no route" }), { status: 404 });
  }) as FetchFn & { calls: Call[] };
  fn.calls = calls;
  return fn;
}

export const path = (p: string) => (c: Call) => c.url.pathname.endsWith(p);

export function standardRoutes(extra: Route[] = []): Route[] {
  return [
    ...extra,
    (c) =>
      path("/features")(c)
        ? { body: { data: [feature(200, "The Matrix Revisited", 2001), feature(100, "The Matrix", 1999), feature(300, "The Matrix Reloaded", 2003)] } }
        : undefined,
    (c) =>
      path("/subtitles")(c)
        ? {
            body: {
              total_pages: 1,
              total_count: 3,
              per_page: 50,
              page: 1,
              data: [
                subtitle(1, {}, { feature_id: 200, title: "The Matrix Revisited", year: 2001 }),
                subtitle(2),
                subtitle(3, { release: "The.Matrix.1999.1080p.BluRay.x264-GROUP" }),
              ],
            },
          }
        : undefined,
    (c) =>
      path("/download")(c)
        ? {
            body: {
              link: "https://dl.example.test/file/abc.srt",
              file_name: "synthetic.srt",
              requests: 3,
              remaining: 97,
              message: "ok",
              reset_time: "23 hours and 59 minutes",
              reset_time_utc: "2026-11-23T06:00:00.000Z",
            },
          }
        : undefined,
    (c) => (c.url.hostname === "dl.example.test" ? { text: "1\n00:00:01,000 --> 00:00:02,000\nHello\n", headers: { "content-type": "text/plain" } } : undefined),
    (c) => (path("/infos/languages")(c) ? { body: { data: [{ language_code: "en", language_name: "English" }, { language_code: "pt-BR", language_name: "Portuguese (BR)" }] } } : undefined),
    (c) => (path("/infos/formats")(c) ? { body: { data: { output_formats: ["srt", "webvtt"] } } } : undefined),
    (c) =>
      path("/login")(c)
        ? { body: { token: fakeJwt(), base_url: "api.opensubtitles.com", user: { allowed_downloads: 20, level: "Sub leecher", user_id: 42, vip: false } } }
        : undefined,
    (c) =>
      path("/infos/user")(c)
        ? c.headers.authorization
          ? { body: { data: { allowed_downloads: 20, allowed_translations: 1, level: "Sub leecher", user_id: 42, ext_installed: false, vip: false, downloads_count: 2, remaining_downloads: 18 } } }
          : { status: 401, body: { errors: ["No token in request"], status: 401 } }
        : undefined,
  ];
}

/**
 * A throwaway credential-like value made at runtime, so test files contain no
 * literal that looks like a password or key (secret scanners flag those).
 */
export function fake(label: string): string {
  return `test-${label}-${randomUUID()}`;
}

export function fakeJwt(expSeconds = Math.floor(Date.now() / 1000) + 86400): string {
  const b = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${b({ alg: "HS256" })}.${b({ exp: expSeconds, sub: "synthetic" })}.c2lnbmF0dXJl`;
}

export function testConfig(env: Record<string, string> = {}) {
  return loadConfig({ OPENSUBTITLES_API_BASE: "https://api.test/api/v1", ...env });
}

/**
 * A client connected to fresh server instances. Default: 2025 handshake over an
 * in-memory transport. MCP_TEST_ERA=modern: protocol 2026-07-28 through the SDK's
 * stateless per-request handler (a new server per request, as in production).
 */
export async function connect(opts: { mode?: Mode; credentials?: Credentials; fetch: FetchFn; env?: Record<string, string> }) {
  clearTokenCache();
  clearLanguageCache();
  const make = () =>
    buildServer({
      mode: opts.mode ?? "stdio",
      config: testConfig(opts.env),
      credentials: opts.credentials ?? {},
      client: "test-client",
      fetch: opts.fetch,
    });
  if (process.env.MCP_TEST_ERA === "modern") {
    const handler = createMcpHandler(() => make(), { legacy: "reject" });
    const transport = new StreamableHTTPClientTransport(new URL("http://mcp.test/mcp"), {
      fetch: (url, init) => handler.fetch(new Request(url, init)),
    });
    const client = new Client({ name: "test", version: "1.0.0" }, { versionNegotiation: { mode: { pin: "2026-07-28" } } });
    await client.connect(transport);
    if (client.getNegotiatedProtocolVersion() !== "2026-07-28") throw new Error("modern era not negotiated");
    return { client, close: async () => { await client.close(); await handler.close(); } };
  }
  const server = make();
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await server.connect(st);
  const client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(ct);
  return { client, close: async () => { await client.close(); await server.close(); } };
}
