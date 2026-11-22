import { existsSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fake, mockFetch, standardRoutes } from "./helpers.js";

/**
 * End-to-end: spawn the built binary (dist/index.js) over stdio, pointed at a
 * local mock of the REST API, with credentials in the environment.
 * `npm test` builds first; run `npm run build` before running this file alone.
 */

const BIN = new URL("../dist/index.js", import.meta.url).pathname;
const SECRETS = { key: fake("key"), user: fake("user"), pass: fake("pw") };
let api: Server;
let apiBase = "";
const routes = mockFetch(standardRoutes());

beforeAll(async () => {
  api = createServer(async (req, res) => {
    if (req.url?.startsWith("/dl/")) {
      res.writeHead(200, { "content-type": "text/plain" });
      return res.end("1\n00:00:01,000 --> 00:00:02,000\nHello\n");
    }
    const chunks: Buffer[] = [];
    for await (const c of req) chunks.push(c as Buffer);
    const r = await routes(`http://127.0.0.1${req.url}`, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: chunks.length ? Buffer.concat(chunks).toString() : undefined,
    });
    // Point download links back at this mock.
    const text = (await r.text()).replace("https://dl.example.test", `http://127.0.0.1:${(api.address() as AddressInfo).port}/dl`);
    res.writeHead(r.status, { "content-type": r.headers.get("content-type") ?? "application/json" });
    res.end(text);
  });
  await new Promise<void>((r) => api.listen(0, "127.0.0.1", r));
  apiBase = `http://127.0.0.1:${(api.address() as AddressInfo).port}/api/v1`;
});
afterAll(() => new Promise<void>((r) => api.close(() => r())));

async function spawnClient(modern: boolean) {
  const stderr: string[] = [];
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [BIN],
    env: {
      PATH: process.env.PATH ?? "",
      OPENSUBTITLES_API_BASE: apiBase,
      OPENSUBTITLES_API_KEY: SECRETS.key,
      OPENSUBTITLES_USERNAME: SECRETS.user,
      OPENSUBTITLES_PASSWORD: SECRETS.pass,
      LOG_LEVEL: "debug",
    },
    stderr: "pipe",
  });
  transport.stderr?.on("data", (d: Buffer) => stderr.push(d.toString()));
  const client = new Client({ name: "stdio-e2e", version: "1" }, modern ? { versionNegotiation: { mode: "auto" } } : {});
  await client.connect(transport);
  return { client, stderr };
}

describe.skipIf(!existsSync(BIN))("stdio binary", () => {
  for (const modern of [false, true]) {
    it(`serves all tools over stdio (${modern ? "2026-07-28" : "2025 handshake"}), credentials from env, no secrets on stderr`, async () => {
      const { client, stderr } = await spawnClient(modern);
      if (modern) expect(client.getNegotiatedProtocolVersion()).toBe("2026-07-28");
      const { tools } = await client.listTools();
      expect(tools.map((t) => t.name)).toContain("calculate_file_hash");
      const s = await client.callTool({ name: "search_subtitles", arguments: { query: "The Matrix" } });
      expect((s.structuredContent as { results: unknown[] }).results.length).toBeGreaterThan(0);
      const d = await client.callTool({ name: "download_subtitle", arguments: { file_id: 30 } });
      expect(d.isError).toBeFalsy();
      expect((d.structuredContent as { content: string }).content).toContain("Hello");
      const u = await client.callTool({ name: "get_user_info", arguments: {} });
      expect((u.structuredContent as { remaining_downloads: number }).remaining_downloads).toBe(18);
      await client.close();
      const login = routes.calls.find((c) => c.url.pathname.endsWith("/login"));
      expect(login?.headers["api-key"]).toBe(SECRETS.key);
      const err = stderr.join("");
      expect(err).toContain('"event":"tool.call"');
      for (const v of Object.values(SECRETS)) expect(err).not.toContain(v);
    });
  }
  it("--version and --help write to stdout and exit", async () => {
    const { execFileSync } = await import("node:child_process");
    expect(execFileSync(process.execPath, [BIN, "--version"]).toString().trim()).toBe("2.0.0");
    expect(execFileSync(process.execPath, [BIN, "--help"]).toString()).toMatch(/OPENSUBTITLES_API_KEY/);
  });
});
