import type { AddressInfo } from "node:net";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { clearTokenCache } from "../src/api/client.js";
import { createHttpServer } from "../src/http.js";
import { setLogSink } from "../src/log.js";
import { clearLanguageCache } from "../src/tools/misc.js";
import { fake, mockFetch, path, standardRoutes, testConfig } from "./helpers.js";

/**
 * Raw HTTP tests against the real node:http server (API mocked). Every body is
 * parsed with JSON.parse exactly as received, guarding against the 1.x defect
 * where hand-written chunk markers ("dc6\r\n{...") ended up in the payload.
 */

const api = mockFetch(standardRoutes());
const logs: string[] = [];
let base = "";
let close: () => Promise<void>;

beforeAll(async () => {
  setLogSink((l) => logs.push(l));
  const cfg = testConfig({ RATE_LIMIT_PER_MINUTE: "100000", MAX_BODY_BYTES: String(64 * 1024), HOST: "127.0.0.1" });
  const s = createHttpServer({ config: cfg, fetch: api });
  close = s.close;
  await new Promise<void>((r) => s.server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${(s.server.address() as AddressInfo).port}`;
});
afterAll(async () => {
  await close();
  setLogSink((l) => process.stderr.write(l + "\n"));
});
beforeEach(() => {
  api.calls.length = 0;
  clearTokenCache();
  clearLanguageCache();
});

const INIT = { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "raw", version: "1" } } };

async function post(body: unknown, headers: Record<string, string> = {}, p = "/mcp") {
  const res = await fetch(base + p, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  const raw = await res.text();
  return { res, raw };
}

function parseBody(raw: string, contentType: string | null): any {
  if ((contentType ?? "").includes("text/event-stream")) {
    const data = raw
      .split("\n")
      .filter((l) => l.startsWith("data: "))
      .map((l) => l.slice(6));
    return JSON.parse(data[data.length - 1]!);
  }
  return JSON.parse(raw);
}

describe("Streamable HTTP framing (guards 1.x defect 1)", () => {
  for (const ua of ["Claude-User/1.0", "Cursor/1.0", "node", "n8n", "python-httpx/0.27", "Go-http-client/2.0", ""]) {
    it(`initialize answers plain JSON for User-Agent "${ua}"`, async () => {
      const { res, raw } = await post(INIT, ua ? { "User-Agent": ua } : {});
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toMatch(/^application\/json/);
      expect(raw.startsWith("{")).toBe(true);
      const body = JSON.parse(raw);
      expect(body.result.protocolVersion).toBe("2025-06-18");
      expect(body.result.serverInfo).toMatchObject({ name: "opensubtitles", version: "2.0.0" });
      // Spec-shaped: no tool list or custom fields in capabilities.
      expect(Object.keys(body.result.capabilities).sort()).toEqual(["prompts", "resources", "tools"]);
      expect(body.result.capabilities.tools).toEqual({ listChanged: false });
      expect(res.headers.get("mcp-session-id")).toBeNull();
    });
  }
  it("answers JSON when the client sends no Accept or only application/json (old n8n/HTTP configs)", async () => {
    for (const accept of [undefined, "application/json", "*/*"]) {
      const res = await fetch(base + "/message", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(accept ? { Accept: accept } : {}) },
        body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" }),
      });
      expect(res.status, String(accept)).toBe(200);
      expect(JSON.parse(await res.text()).result.tools.length).toBe(7);
    }
  });
});

describe("legacy (2025-era) MCP over HTTP, stateless", () => {
  it("tools/list works without a prior initialize and omits calculate_file_hash", async () => {
    const { raw } = await post({ jsonrpc: "2.0", id: 2, method: "tools/list" }, { "MCP-Protocol-Version": "2025-06-18" });
    const names = JSON.parse(raw).result.tools.map((t: { name: string }) => t.name);
    expect(names).not.toContain("calculate_file_hash");
    expect(names).toContain("search_subtitles");
  });
  it("tools/call returns structuredContent; old clients also get the JSON as text", async () => {
    const call = { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "guess_filename", arguments: { filename: "Synthetic.Show.S01E02.mkv" } } };
    const modern = JSON.parse((await post(call, { "MCP-Protocol-Version": "2025-06-18" })).raw).result;
    expect(modern.structuredContent).toMatchObject({ season: 1, episode: 2 });
    expect(modern.content).toHaveLength(1);
    const old = JSON.parse((await post(call)).raw).result; // no header = 2025-03-26
    expect(old.content).toHaveLength(2);
    expect(JSON.parse(old.content[1].text)).toMatchObject({ season: 1, episode: 2 });
  });
  it("notifications get 202 with no body", async () => {
    const { res, raw } = await post({ jsonrpc: "2.0", method: "notifications/initialized" });
    expect(res.status).toBe(202);
    expect(raw).toBe("");
  });
  it("protocol errors are JSON-RPC errors", async () => {
    const bad = await post("not json");
    expect(bad.res.status).toBe(400);
    expect(JSON.parse(bad.raw).error.code).toBe(-32700);
    const unknown = await post({ jsonrpc: "2.0", id: 4, method: "no/such/method" }, { "MCP-Protocol-Version": "2025-06-18" });
    expect(JSON.parse(unknown.raw).error.code).toBe(-32601);
    const version = await post({ jsonrpc: "2.0", id: 5, method: "tools/list" }, { "MCP-Protocol-Version": "1999-01-01" });
    expect(version.res.status).toBe(400);
    expect(JSON.parse(version.raw).error).toBeTruthy();
  });
  it("GET and DELETE on /mcp are 405 and echo nothing", async () => {
    for (const method of ["GET", "DELETE"]) {
      const res = await fetch(base + "/mcp", { method, headers: { "X-Probe": "echo-me" } });
      const raw = await res.text();
      expect(res.status).toBe(405);
      expect(raw).not.toContain("echo-me");
      expect(raw).not.toContain("x-probe");
    }
  });
});

describe("modern (2026-07-28) MCP over HTTP", () => {
  const meta = { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {}, "io.modelcontextprotocol/clientInfo": { name: "raw", version: "1" } };
  const modernHeaders = (method: string, name?: string) => ({ "MCP-Protocol-Version": "2026-07-28", "Mcp-Method": method, ...(name ? { "Mcp-Name": name } : {}) });

  it("server/discover advertises 2026-07-28, identity, and cache hints", async () => {
    const { raw, res } = await post({ jsonrpc: "2.0", id: 1, method: "server/discover", params: { _meta: meta } }, modernHeaders("server/discover"));
    const body = parseBody(raw, res.headers.get("content-type"));
    expect(body.result.supportedVersions).toContain("2026-07-28");
    expect(body.result.capabilities.tools).toBeTruthy();
  });
  it("tools/list carries resultType and public cache hints", async () => {
    const { raw, res } = await post({ jsonrpc: "2.0", id: 1, method: "tools/list", params: { _meta: meta } }, modernHeaders("tools/list"));
    const r = parseBody(raw, res.headers.get("content-type")).result;
    expect(r).toMatchObject({ resultType: "complete", cacheScope: "public", ttlMs: 3_600_000 });
    expect(r.tools.map((t: { name: string }) => t.name)).not.toContain("calculate_file_hash");
  });
  it("rejects a missing or mismatched Mcp-Method/Mcp-Name with -32020", async () => {
    const missing = await post({ jsonrpc: "2.0", id: 1, method: "tools/list", params: { _meta: meta } }, { "MCP-Protocol-Version": "2026-07-28" });
    expect(missing.res.status).toBe(400);
    expect(parseBody(missing.raw, missing.res.headers.get("content-type")).error.code).toBe(-32020);
    const mismatch = await post(
      { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "list_languages", arguments: {}, _meta: meta } },
      modernHeaders("tools/call", "guess_filename"),
    );
    expect(parseBody(mismatch.raw, mismatch.res.headers.get("content-type")).error.code).toBe(-32020);
  });
  it("unknown method: 404 with -32601", async () => {
    const { res, raw } = await post({ jsonrpc: "2.0", id: 1, method: "foo/bar", params: { _meta: meta } }, modernHeaders("foo/bar"));
    expect(res.status).toBe(404);
    expect(parseBody(raw, res.headers.get("content-type")).error.code).toBe(-32601);
  });
  it("the SDK client connects, lists and calls tools with structured output", async () => {
    const seen: string[] = [];
    const transport = new StreamableHTTPClientTransport(new URL(base + "/mcp"), {
      fetch: async (url, init) => {
        seen.push(new Headers(init?.headers).get("mcp-protocol-version") ?? "");
        return fetch(url, init);
      },
    });
    const client = new Client({ name: "sdk", version: "1" }, { versionNegotiation: { mode: "auto" } });
    await client.connect(transport);
    expect(client.getNegotiatedProtocolVersion()).toBe("2026-07-28");
    const { tools } = await client.listTools();
    expect(tools.length).toBe(7);
    const r = await client.callTool({ name: "search_subtitles", arguments: { query: "The Matrix", languages: ["en"] } });
    expect(r.isError).toBeFalsy();
    expect((r.structuredContent as { resolved_feature: { feature_id: number } }).resolved_feature.feature_id).toBe(100);
    await client.close();
    expect(seen).toContain("2026-07-28");
  });
});

describe("credentials from connection headers", () => {
  const dl = { jsonrpc: "2.0", id: 9, method: "tools/call", params: { name: "download_subtitle", arguments: { file_id: 30 } } };
  const H = { "MCP-Protocol-Version": "2025-06-18" };
  it("anonymous: search works, download explains how to configure a key", async () => {
    const r = JSON.parse((await post(dl, H)).raw).result;
    expect(r.isError).toBe(true);
    expect(r.content[0].text).toMatch(/--header "Api-Key: YOUR_KEY"/);
  });
  it("Api-Key header is used for the API call", async () => {
    const hdrKey = fake("key");
    const r = JSON.parse((await post(dl, { ...H, "Api-Key": hdrKey })).raw).result;
    expect(r.isError).toBeFalsy();
    expect(api.calls.find((c) => path("/download")(c))!.headers["api-key"]).toBe(hdrKey);
  });
  it("X-OpenSubtitles-Token is forwarded as Bearer to the REST API", async () => {
    const jwt = "aaa.bbb.ccc";
    await post(dl, { ...H, "Api-Key": "K-synthetic", "X-OpenSubtitles-Token": jwt });
    expect(api.calls.find((c) => path("/download")(c))!.headers.authorization).toBe(`Bearer ${jwt}`);
  });
  it("username/password headers log in once and reuse the token", async () => {
    const h = { ...H, "Api-Key": "K-synthetic", "X-OpenSubtitles-Username": fake("user"), "X-OpenSubtitles-Password": fake("pw") };
    await post(dl, h);
    await post(dl, h);
    expect(api.calls.filter((c) => path("/login")(c))).toHaveLength(1);
  });
  it("legacy Authorization: Bearer still works (JWT = token, otherwise API key)", async () => {
    const legacyKey = fake("key");
    await post(dl, { ...H, Authorization: `Bearer ${legacyKey}` });
    expect(api.calls.find((c) => path("/download")(c))!.headers["api-key"]).toBe(legacyKey);
  });
});

describe("HTTP surface", () => {
  it("/health returns exactly {status, version}", async () => {
    const res = await fetch(base + "/health");
    expect(await res.json()).toEqual({ status: "ok", version: "2.0.0" });
  });
  it("/debug, /proxy, /sse and other paths are gone", async () => {
    for (const p of ["/debug", "/proxy", "/sse", "/tools"]) {
      expect((await fetch(base + p)).status, p).toBe(404);
    }
  });
  it("serves llms.txt", async () => {
    const res = await fetch(base + "/llms.txt");
    expect(res.headers.get("content-type")).toMatch(/text\/plain/);
    expect(await res.text()).toMatch(/search_subtitles/);
  });
  it("/message and /json are deprecated aliases of /mcp", async () => {
    for (const p of ["/message", "/json"]) {
      const { res, raw } = await post({ jsonrpc: "2.0", id: 1, method: "tools/list" }, { "MCP-Protocol-Version": "2025-06-18" }, p);
      expect(res.headers.get("deprecation")).toBe("true");
      expect(res.headers.get("link")).toMatch(/\/mcp>; rel="successor-version"/);
      expect(JSON.parse(raw).result.tools.length).toBe(7);
    }
  });
  it("rejects a foreign Origin with 403; allows claude.ai with CORS incl. Mcp-Method", async () => {
    const evil = await post(INIT, { Origin: "https://evil.example" });
    expect(evil.res.status).toBe(403);
    const pre = await fetch(base + "/mcp", { method: "OPTIONS", headers: { Origin: "https://claude.ai" } });
    expect(pre.status).toBe(204);
    expect(pre.headers.get("access-control-allow-origin")).toBe("https://claude.ai");
    expect(pre.headers.get("access-control-allow-headers")).toMatch(/Mcp-Method/);
    expect(pre.headers.get("access-control-allow-headers")).toMatch(/X-OpenSubtitles-Token/);
    const ok = await post(INIT, { Origin: "https://claude.ai" });
    expect(ok.res.status).toBe(200);
  });
  it("rejects a body over the limit with 413", async () => {
    const { res } = await post({ jsonrpc: "2.0", id: 1, method: "tools/list", params: { pad: "x".repeat(70 * 1024) } });
    expect(res.status).toBe(413);
  });
});

describe("rate limiting", () => {
  it("answers 429 with Retry-After once a client exceeds its budget", async () => {
    const s = createHttpServer({ config: testConfig({ RATE_LIMIT_PER_MINUTE: "1" }), fetch: api });
    await new Promise<void>((r) => s.server.listen(0, "127.0.0.1", r));
    const url = `http://127.0.0.1:${(s.server.address() as AddressInfo).port}/mcp`;
    const statuses: number[] = [];
    let retry: string | null = null;
    for (let i = 0; i < 12; i++) {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(INIT) });
      statuses.push(res.status);
      if (res.status === 429) {
        retry = res.headers.get("retry-after");
        expect(JSON.parse(await res.text()).error.message).toMatch(/Too many requests/);
      } else await res.text();
    }
    await s.close();
    expect(statuses.slice(0, 10).every((x) => x === 200)).toBe(true);
    expect(statuses[11]).toBe(429);
    expect(Number(retry)).toBeGreaterThan(0);
  });
});

describe("logs", () => {
  it("contain no credentials, arguments or headers, even when secrets are sent", async () => {
    logs.length = 0;
    const secrets = [fake("key"), fake("pw"), `${fake("a")}.${fake("b")}.${fake("c")}`, fake("user")];
    const h = {
      "MCP-Protocol-Version": "2025-06-18",
      "Api-Key": secrets[0]!,
      "X-OpenSubtitles-Username": secrets[3]!,
      "X-OpenSubtitles-Password": secrets[1]!,
      "X-OpenSubtitles-Token": secrets[2]!,
    };
    await post({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "search_subtitles", arguments: { query: "Secret Query Synthetic Title" } } }, h);
    await post({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "download_subtitle", arguments: { file_id: 30 } } }, h);
    await post({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_user_info", arguments: {} } }, { ...h, "X-OpenSubtitles-Token": "" });
    const all = logs.join("\n");
    expect(logs.length).toBeGreaterThan(3);
    for (const s of secrets) expect(all).not.toContain(s);
    expect(all.toLowerCase()).not.toContain("secret query synthetic");
    expect(all).not.toMatch(/api-key|authorization/i);
    // Each line is structured JSON with tool, duration and an anonymised client id.
    const toolLines = logs.map((l) => JSON.parse(l)).filter((l) => l.event === "tool.call");
    expect(toolLines.length).toBeGreaterThanOrEqual(3);
    for (const l of toolLines) {
      expect(l).toMatchObject({ tool: expect.any(String), duration_ms: expect.any(Number), client: expect.stringMatching(/^[0-9a-f]{12}$/) });
    }
    expect(logs.some((l) => l.includes('"event":"audit.download"'))).toBe(true);
  });
});
