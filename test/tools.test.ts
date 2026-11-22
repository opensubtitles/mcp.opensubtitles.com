import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { setLogSink } from "../src/log.js";
import { connect, feature, mockFetch, path, standardRoutes, subtitle, type Route } from "./helpers.js";

type Conn = Awaited<ReturnType<typeof connect>>;
let conn: Conn | undefined;
afterEach(async () => {
  await conn?.close();
  conn = undefined;
});

async function call(name: string, args: Record<string, unknown>, opts: Parameters<typeof connect>[0]) {
  conn = await connect(opts);
  return conn.client.callTool({ name, arguments: args }) as Promise<{
    isError?: boolean;
    content: Array<Record<string, unknown> & { type: string; text?: string }>;
    structuredContent?: Record<string, unknown> & { results?: Array<Record<string, unknown>> };
  }>;
}
const text = (r: { content: Array<{ type: string; text?: string }> }) => r.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");
const searchCall = (f: ReturnType<typeof mockFetch>) => f.calls.find((c) => path("/subtitles")(c))!;

describe("tools/list", () => {
  it("lists the 8 tools in a fixed order in stdio mode, each with title, annotations and output schema", async () => {
    conn = await connect({ fetch: mockFetch(standardRoutes()) });
    const { tools } = await conn.client.listTools();
    expect(tools.map((t) => t.name)).toEqual([
      "search_subtitles",
      "get_subtitle_details",
      "download_subtitle",
      "search_features",
      "list_languages",
      "guess_filename",
      "calculate_file_hash",
      "get_user_info",
    ]);
    for (const t of tools) {
      expect(t.title, t.name).toBeTruthy();
      expect(t.description!.length, t.name).toBeGreaterThan(40);
      expect(t.outputSchema, t.name).toBeTruthy();
      expect(t.annotations?.destructiveHint, t.name).toBe(false);
      expect(typeof t.annotations?.readOnlyHint, t.name).toBe("boolean");
      expect(typeof t.annotations?.idempotentHint, t.name).toBe("boolean");
      expect(typeof t.annotations?.openWorldHint, t.name).toBe("boolean");
    }
    const dl = tools.find((t) => t.name === "download_subtitle")!;
    expect(dl.annotations).toMatchObject({ readOnlyHint: false, idempotentHint: false });
    expect(dl.description).toMatch(/daily .*quota/);
    expect(tools.find((t) => t.name === "list_languages")!.inputSchema).toMatchObject({ type: "object", additionalProperties: false });
  });
  it("omits calculate_file_hash over HTTP", async () => {
    conn = await connect({ mode: "http", fetch: mockFetch(standardRoutes()) });
    const { tools } = await conn.client.listTools();
    expect(tools.map((t) => t.name)).not.toContain("calculate_file_hash");
    expect(tools).toHaveLength(7);
    // Unknown tool = protocol error (spec), so it cannot read the server's disk.
    await expect(conn.client.callTool({ name: "calculate_file_hash", arguments: { file_path: "/etc/passwd" } })).rejects.toThrow(/not found/);
  });
});

describe("search_subtitles", () => {
  it("resolves a title to the exact feature (not 'The Matrix Revisited') and returns structured results", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("search_subtitles", { query: "The Matrix", year: 1999, languages: ["pt-BR", "en"] }, { fetch: f });
    expect(r.isError).toBeFalsy();
    const q = searchCall(f).url.searchParams;
    expect(q.get("id")).toBe("100");
    expect(q.get("query")).toBeNull();
    expect(q.get("languages")).toBe("en,pt-br");
    const sc = r.structuredContent!;
    expect(sc.resolved_feature).toMatchObject({ feature_id: 100, title: "The Matrix", year: 1999 });
    const first = sc.results![0]!;
    expect(first).toMatchObject({ file_id: expect.any(Number), language: "en", hearing_impaired: false, ai_translated: false, machine_translated: false });
    expect((first.feature as { title: string }).title).toBe("The Matrix");
    expect(sc).toMatchObject({ total_count: 3, page: 1, per_page: 20, total_pages: 1 });
    expect(text(r)).toMatch(/file_id \d+/);
  });
  it("parses a filename with guessit-js and ranks the matching release first", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("search_subtitles", { filename: "The.Matrix.1999.1080p.BluRay.x264-GROUP.mkv" }, { fetch: f });
    expect(r.structuredContent!.guessed).toMatchObject({ title: "The Matrix", year: 1999, type: "movie" });
    expect(r.structuredContent!.results![0]!.release).toBe("The.Matrix.1999.1080p.BluRay.x264-GROUP");
  });
  it("treats imdb_id with season/episode as the show's id", async () => {
    const f = mockFetch(standardRoutes());
    await call("search_subtitles", { imdb_id: "tt2261391", season_number: 14, episode_number: 1 }, { fetch: f });
    const q = searchCall(f).url.searchParams;
    expect(q.get("parent_imdb_id")).toBe("2261391");
    expect(q.get("season_number")).toBe("14");
    expect(q.get("imdb_id")).toBeNull();
  });
  it("resolves an episode filename to the show via parent_feature_id", async () => {
    const f = mockFetch([
      (c) => (path("/features")(c) ? { body: { data: [{ ...feature(12466, "Synthetic Show", 2012), type: "tvshow", attributes: { ...feature(12466, "Synthetic Show", 2012).attributes, feature_type: undefined } }] } } : undefined),
      ...standardRoutes(),
    ]);
    await call("search_subtitles", { filename: "Synthetic.Show.S14E01.1080p.WEB.h264-GRP.mkv", languages: ["en"] }, { fetch: f });
    expect(f.calls.find((c) => path("/features")(c))!.url.searchParams.get("type")).toBe("tvshow");
    const q = searchCall(f).url.searchParams;
    expect(q.get("parent_feature_id")).toBe("12466");
    expect(q.get("episode_number")).toBe("1");
  });
  it("maps boolean and enum filters to the API's values", async () => {
    const f = mockFetch(standardRoutes());
    await call(
      "search_subtitles",
      { imdb_id: 133093, include_ai_translated: false, include_machine_translated: true, trusted_only: true, hearing_impaired: "exclude", foreign_parts_only: "only", order_by: "upload_date" },
      { fetch: f },
    );
    const q = searchCall(f).url.searchParams;
    expect(Object.fromEntries(q)).toMatchObject({
      ai_translated: "exclude",
      machine_translated: "include",
      trusted_sources: "only",
      hearing_impaired: "exclude",
      foreign_parts_only: "only",
      order_by: "upload_date",
    });
  });
  it("pages across the API's fixed 50-per-page pages", async () => {
    const f = mockFetch([
      (c) => {
        if (!path("/subtitles")(c)) return undefined;
        const page = Number(c.url.searchParams.get("page") ?? "1");
        const data = Array.from({ length: 50 }, (_, i) => subtitle((page - 1) * 50 + i + 1));
        return { body: { total_count: 120, total_pages: 3, per_page: 50, page, data } };
      },
      ...standardRoutes(),
    ]);
    const r = await call("search_subtitles", { imdb_id: 133093, page: 2, per_page: 30, order_by: "download_count" }, { fetch: f });
    const pages = f.calls.filter((c) => path("/subtitles")(c)).map((c) => c.url.searchParams.get("page") ?? "1");
    expect(pages).toEqual(["1", "2"]);
    const ids = r.structuredContent!.results!.map((x) => Number(x.subtitle_id));
    expect(ids[0]).toBe(31);
    expect(ids).toHaveLength(30);
    expect(r.structuredContent).toMatchObject({ total_count: 120, total_pages: 4 });
  });
  it("keeps results when the API returns null years (issue #4)", async () => {
    const f = mockFetch([
      (c) =>
        path("/subtitles")(c)
          ? { body: { total_count: 2, total_pages: 1, per_page: 50, page: 1, data: [subtitle(1, {}, { year: null, title: null }), subtitle(2, {}, { year: null })] } }
          : undefined,
      ...standardRoutes(),
    ]);
    const r = await call("search_subtitles", { imdb_id: 2261391, season_number: 14, episode_number: 1 }, { fetch: f });
    expect(r.isError).toBeFalsy();
    expect(r.structuredContent!.results).toHaveLength(2);
  });
  it("gives actionable hints when nothing is found", async () => {
    const f = mockFetch([(c) => (path("/subtitles")(c) ? { body: { total_count: 0, total_pages: 0, per_page: 50, page: 1, data: [] } } : undefined), ...standardRoutes()]);
    const r = await call("search_subtitles", { imdb_id: 1, languages: ["de"], trusted_only: true }, { fetch: f });
    expect(text(r)).toMatch(/No subtitles found; try: drop or widen languages \(now de\), set trusted_only=false/);
  });
  it("falls back to a text search when no exact title exists, and can skip resolution", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("search_subtitles", { query: "Matrix Synthetic Nonexistent" }, { fetch: f });
    expect(searchCall(f).url.searchParams.get("query")).toBe("matrix synthetic nonexistent");
    expect(r.structuredContent!.hints).toEqual(expect.arrayContaining([expect.stringMatching(/search_features/)]));
    const f2 = mockFetch(standardRoutes());
    await conn!.close();
    await call("search_subtitles", { query: "The Matrix", exact_title: false }, { fetch: f2 });
    expect(f2.calls.some((c) => path("/features")(c))).toBe(false);
  });
  it("rejects empty and oversized input with isError (no API call)", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("search_subtitles", {}, { fetch: f });
    expect(r.isError).toBe(true);
    expect(text(r)).toMatch(/at least one of/);
    const r2 = await conn!.client.callTool({ name: "search_subtitles", arguments: { query: "x".repeat(201) } });
    expect(r2.isError).toBe(true);
    const r3 = await conn!.client.callTool({ name: "search_subtitles", arguments: { imdb_id: 1, per_page: 101 } });
    expect(r3.isError).toBe(true);
    const r4 = await conn!.client.callTool({ name: "search_subtitles", arguments: { imdb_id: 1, hearing_impaired: "maybe" } });
    expect(r4.isError).toBe(true);
    expect(f.calls).toHaveLength(0);
  });
  it("reports API errors as isError results", async () => {
    const f = mockFetch([() => ({ status: 403, body: { message: "You cannot consume this service" } })]);
    const r = await call("search_subtitles", { imdb_id: 1 }, { fetch: f });
    expect(r.isError).toBe(true);
    expect(text(r)).toMatch(/Access denied \(403\)/);
  });
});

describe("download_subtitle", () => {
  it("returns the text, the remaining quota and an embedded resource (stdio, app key)", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("download_subtitle", { file_id: 30, sub_format: "srt", timeshift: -1.5 }, { fetch: f });
    expect(r.isError).toBeFalsy();
    expect(f.calls.find((c) => path("/download")(c))!.body).toEqual({ file_id: 30, sub_format: "srt", timeshift: -1.5 });
    expect(r.structuredContent).toMatchObject({ file_id: 30, content: expect.stringContaining("Hello"), quota: { remaining: 97 }, truncated: false });
    expect(r.content.find((c) => c.type === "resource")).toBeTruthy();
    expect(text(r)).toMatch(/97 downloads left/);
    expect(text(r)).toMatch(/user-uploaded content/);
  });
  it("returns only a link with delivery=link", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("download_subtitle", { file_id: 30, delivery: "link" }, { fetch: f });
    expect(f.calls.some((c) => c.url.hostname === "dl.example.test")).toBe(false);
    expect(r.content.find((c) => c.type === "resource_link")).toMatchObject({ uri: "https://dl.example.test/file/abc.srt" });
  });
  it("over HTTP refuses downloads without the user's own credentials", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("download_subtitle", { file_id: 30 }, { mode: "http", fetch: f });
    expect(r.isError).toBe(true);
    expect(text(r)).toMatch(/Api-Key/);
    expect(f.calls).toHaveLength(0);
  });
  it("over HTTP downloads with the user's API key", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("download_subtitle", { file_id: 30 }, { mode: "http", credentials: { apiKey: "USERKEY" }, fetch: f });
    expect(r.isError).toBeFalsy();
    expect(f.calls.find((c) => path("/download")(c))!.headers["api-key"]).toBe("USERKEY");
  });
  it("requires in_fps and out_fps together", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("download_subtitle", { file_id: 30, in_fps: 25 }, { fetch: f });
    expect(r.isError).toBe(true);
    expect(f.calls).toHaveLength(0);
  });
  it("reports the quota reset time when the quota is used up, and audits the attempt", async () => {
    const lines: string[] = [];
    setLogSink((l) => lines.push(l));
    const f = mockFetch([
      (c) => (path("/download")(c) ? { status: 406, body: { message: "You have downloaded your allowed 20 subtitles for 24h.", reset_time_utc: "2026-11-23T06:00:00.000Z" } } : undefined),
      ...standardRoutes(),
    ]);
    const r = await call("download_subtitle", { file_id: 30 }, { fetch: f });
    setLogSink((l) => process.stderr.write(l + "\n"));
    expect(r.isError).toBe(true);
    expect(text(r)).toMatch(/allowed 20 subtitles.*resets at 2026-11-23T06:00:00.000Z/);
    expect(lines.some((l) => l.includes('"event":"audit.download"') && l.includes('"status":"error"'))).toBe(true);
  });
});

describe("other tools", () => {
  it("search_features: exact title first, type and seasons", async () => {
    const show = feature(12466, "Synthetic Show", 2012, "Tvshow", {
      seasons: [
        { season_number: 1, episodes: [{ episode_number: 1, title: "Pilot", feature_id: 1, feature_imdb_id: 2 }] },
        { season_number: 2, episodes: [] },
      ],
    });
    const f = mockFetch([(c) => (path("/features")(c) ? { body: { data: [feature(1, "Synthetic Show Revisited", 2020), show] } } : undefined)]);
    const r = await call("search_features", { query: "Synthetic Show", include_episodes: true }, { fetch: f });
    const fs = r.structuredContent!.features as Array<Record<string, unknown>>;
    expect(fs[0]).toMatchObject({ feature_id: 12466, type: "tvshow", year: 2012 });
    expect(fs[0]!.seasons).toEqual([
      { season_number: 1, episode_count: 1, episodes: [{ episode_number: 1, title: "Pilot", feature_id: 1, imdb_id: 2 }] },
      { season_number: 2, episode_count: 0, episodes: [] },
    ]);
  });
  it("get_subtitle_details: finds the subtitle and related releases; isError when absent", async () => {
    const f = mockFetch([
      (c) =>
        path("/subtitles")(c)
          ? { body: { total_count: 3, total_pages: 1, per_page: 50, page: 1, data: [subtitle(1, { release: "The.Matrix.1999.DVDRip" }), subtitle(2, { release: "The.Matrix.1999.BluRay", comments: "synced for BluRay" }), subtitle(3, { release: "Unrelated" })] } }
          : undefined,
    ]);
    const r = await call("get_subtitle_details", { subtitle_id: "2", feature_id: 100, language: "en" }, { fetch: f });
    expect(r.structuredContent!.subtitle).toMatchObject({ subtitle_id: "2", comments: "synced for BluRay" });
    expect((r.structuredContent!.related as Array<{ subtitle_id: string }>)[0]!.subtitle_id).toBe("1");
    expect(searchCall(f).url.searchParams.get("id")).toBe("100");
    const r2 = await conn!.client.callTool({ name: "get_subtitle_details", arguments: { subtitle_id: "999", feature_id: 100 } });
    expect(r2.isError).toBe(true);
  });
  it("list_languages: structured list, cached between calls", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("list_languages", {}, { fetch: f });
    expect(r.structuredContent!.languages).toEqual([
      { code: "en", name: "English" },
      { code: "pt-BR", name: "Portuguese (BR)" },
    ]);
    await conn!.client.callTool({ name: "list_languages", arguments: {} });
    expect(f.calls.filter((c) => path("/infos/languages")(c))).toHaveLength(1);
  });
  it("guess_filename: offline parse", async () => {
    const f = mockFetch([]);
    const r = await call("guess_filename", { filename: "Synthetic.Show.S02E05.720p.WEB-GRP.mkv" }, { fetch: f });
    expect(r.structuredContent).toMatchObject({ title: "Synthetic Show", season: 2, episode: 5, type: "episode", release_group: "GRP" });
    expect(f.calls).toHaveLength(0);
  });
  it("calculate_file_hash: hashes a local file in stdio mode; clear error for a missing file", async () => {
    const dir = mkdtempSync(join(tmpdir(), "mcp-hash-"));
    const file = join(dir, "synthetic.mkv");
    writeFileSync(file, Buffer.alloc(131072));
    const r = await call("calculate_file_hash", { file_path: file }, { fetch: mockFetch([]) });
    expect(r.structuredContent).toEqual({ moviehash: "0000000000020000", moviebytesize: 131072, file_name: "synthetic.mkv" });
    const r2 = await conn!.client.callTool({ name: "calculate_file_hash", arguments: { file_path: join(dir, "missing.mkv") } });
    expect(r2.isError).toBe(true);
    expect((r2.content as Array<{ text: string }>)[0]!.text).toMatch(/file not found/);
  });
  it("get_user_info: needs a login; reports quota with one", async () => {
    const f = mockFetch(standardRoutes());
    const r = await call("get_user_info", {}, { fetch: f });
    expect(r.isError).toBe(true);
    expect(text(r)).toMatch(/needs a logged-in user/);
    await conn!.close();
    const r2 = await call("get_user_info", {}, { fetch: f, credentials: { username: "synthetic", password: "pw-synthetic" } });
    expect(r2.structuredContent).toMatchObject({ user_id: 42, remaining_downloads: 18, allowed_downloads: 20, vip: false });
  });
});

describe("resources and prompts", () => {
  it("serves the guide, limits and languages resources", async () => {
    conn = await connect({ fetch: mockFetch(standardRoutes()) });
    const { resources } = await conn.client.listResources();
    expect(resources.map((r) => r.uri)).toEqual(["opensubtitles://guide/intelligent-search", "opensubtitles://guide/limits", "opensubtitles://languages"]);
    const guide = await conn.client.readResource({ uri: "opensubtitles://guide/intelligent-search" });
    expect((guide.contents[0] as { text: string }).text).toMatch(/search_subtitles/);
    const langs = await conn.client.readResource({ uri: "opensubtitles://languages" });
    expect(JSON.parse((langs.contents[0] as { text: string }).text).languages[0]).toEqual({ code: "en", name: "English" });
  });
  it("offers the three prompts", async () => {
    conn = await connect({ fetch: mockFetch(standardRoutes()) });
    const { prompts } = await conn.client.listPrompts();
    expect(prompts.map((p) => p.name)).toEqual(["find_subtitles_for_file", "find_subtitles_for_title", "sync_or_convert"]);
    const p = await conn.client.getPrompt({ name: "sync_or_convert", arguments: { file_id: "30", in_fps: "25", out_fps: "23.976" } });
    expect((p.messages[0]!.content as { text: string }).text).toContain('"in_fps":25');
    const p2 = await conn.client.getPrompt({ name: "find_subtitles_for_title", arguments: { title: "Synthetic Show", language: "en", season: "1", episode: "2" } });
    expect((p2.messages[0]!.content as { text: string }).text).toContain('"season_number":1');
  });
});

export type { Route };
