import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ApiError, canonicalQuery, clearTokenCache, OpenSubtitlesClient } from "../src/api/client.js";
import { ApiFeature, ApiSubtitle } from "../src/api/schemas.js";
import { guessFilename, releaseName } from "../src/guess.js";
import { calculateOpenSubtitlesHash, hashFromChunks } from "../src/hash.js";
import { clientId, registerSecret, scrub } from "../src/log.js";
import { RateLimiter } from "../src/ratelimit.js";
import { normTitle, pickExactFeature, rank, releaseSimilarity, toFeatureResult, toSubtitleResult } from "../src/results.js";
import { traceId, withLegacyJson } from "../src/tools/common.js";
import { fake, fakeJwt, feature, mockFetch, path, standardRoutes, subtitle } from "./helpers.js";

const api = (fetch: ReturnType<typeof mockFetch>, creds = {}) =>
  new OpenSubtitlesClient({ apiBase: "https://api.test/api/v1", defaultApiKey: "APPKEY", timeoutMs: 2000, fetch }, creds);

describe("canonicalQuery", () => {
  it("sorts keys, lowercases values, strips tt and leading zeros, drops empties", () => {
    expect(canonicalQuery({ query: "The Matrix", imdb_id: "tt0133093", languages: "en,pt-br", year: undefined, page: "" })).toBe(
      "imdb_id=133093&languages=en,pt-br&query=the+matrix",
    );
  });
});

describe("API schemas (issue #4)", () => {
  it("accepts null year, title, imdb_id, file_name and missing blocks", () => {
    const raw = subtitle(5, { release: null, upload_date: null, files: [{ file_id: 9, cd_number: null, file_name: null }] }, { year: null, title: null, imdb_id: null, feature_id: null });
    const parsed = ApiSubtitle.parse(raw);
    const r = toSubtitleResult(parsed);
    expect(r.feature?.year).toBeNull();
    expect(r.feature?.title).toBeNull();
    expect(r.file_id).toBe(9);
    expect(r.release).toBeNull();
  });
  it("coerces numeric strings (features return year as a string)", () => {
    const f = toFeatureResult(ApiFeature.parse(feature(1, "X", 2001)), false);
    expect(f.year).toBe(2001);
  });
  it("skips a malformed record but keeps the others", async () => {
    const f = mockFetch([(c) => (path("/subtitles")(c) ? { body: { total_count: 2, total_pages: 1, page: 1, per_page: 50, data: [{ nonsense: true }, subtitle(1)] } } : undefined)]);
    const res = await api(f).searchSubtitles({ query: "x" });
    expect(res.data).toHaveLength(1);
  });
});

describe("OpenSubtitlesClient", () => {
  it("sends Api-Key and the v2 User-Agent; never a token without login", async () => {
    const f = mockFetch(standardRoutes());
    await api(f).searchSubtitles({ query: "x" });
    expect(f.calls[0]!.headers["api-key"]).toBe("APPKEY");
    expect(f.calls[0]!.headers["user-agent"]).toBe("OpenSubtitles MCP Server v2.0.2");
    expect(f.calls[0]!.headers.authorization).toBeUndefined();
  });
  it("uses the caller's own key when given", async () => {
    const f = mockFetch(standardRoutes());
    await api(f, { apiKey: "USERKEY" }).searchSubtitles({ query: "x" });
    expect(f.calls[0]!.headers["api-key"]).toBe("USERKEY");
  });
  it("logs in once, caches the token, and sends it as Bearer", async () => {
    clearTokenCache();
    const f = mockFetch(standardRoutes());
    const c = api(f, { username: fake("user"), password: fake("pw") });
    await c.userInfo();
    await c.userInfo();
    expect(f.calls.filter((x) => path("/login")(x))).toHaveLength(1);
    expect(f.calls.find((x) => path("/infos/user")(x))!.headers.authorization).toMatch(/^Bearer /);
  });
  it("logs in again when the cached token is rejected", async () => {
    clearTokenCache();
    let first = true;
    const f = mockFetch([
      (c) => {
        if (!path("/infos/user")(c)) return undefined;
        if (first) {
          first = false;
          return { status: 401, body: { message: "token expired" } };
        }
        return undefined;
      },
      ...standardRoutes(),
    ]);
    const u = await api(f, { username: fake("user"), password: fake("pw") }).userInfo();
    expect(u.remaining_downloads).toBe(18);
    expect(f.calls.filter((x) => path("/login")(x))).toHaveLength(2);
  });
  it("refreshes a token that is about to expire", async () => {
    clearTokenCache();
    let n = 0;
    const f = mockFetch([
      (c) => (path("/login")(c) ? { body: { token: fakeJwt(Math.floor(Date.now() / 1000) + (n++ === 0 ? 60 : 86400)) } } : undefined),
      ...standardRoutes(),
    ]);
    const c = api(f, { username: fake("user"), password: fake("pw") });
    await c.userInfo();
    await c.userInfo();
    expect(f.calls.filter((x) => path("/login")(x))).toHaveLength(2);
  });
  it.each([
    [401, { errors: ["No token in request"] }, {}, /Not authorised \(401\)/],
    [403, { message: "You cannot consume this service" }, {}, /Access denied \(403\).*consumers/],
    [406, { message: "You have downloaded your allowed 5 subtitles for 24h.", reset_time_utc: "2026-11-23T00:00:00Z" }, {}, /allowed 5 subtitles.*resets at 2026-11-23T00:00:00Z/],
    [429, { message: "Throttle limit reached" }, { "retry-after": "2" }, /retry after 2 s/],
    [503, {}, {}, /temporarily unavailable/],
  ])("maps HTTP %s to an actionable message", async (status, body, headers, re) => {
    const f = mockFetch([() => ({ status, body, headers })]);
    const err = await api(f).searchSubtitles({ query: "x" }).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toMatch(re);
  });
  it("sends credentials only to opensubtitles.com hosts assigned at login", async () => {
    const mk = (base_url: string) =>
      mockFetch([(c) => (path("/login")(c) ? { body: { token: fakeJwt(), base_url } } : undefined), ...standardRoutes()]);
    for (const [assigned, expected] of [
      ["vip-api.opensubtitles.com", "vip-api.opensubtitles.com"],
      ["evil.example", "api.opensubtitles.com"],
      ["opensubtitles.com.evil.example", "api.opensubtitles.com"],
    ] as const) {
      clearTokenCache();
      const f = mk(assigned);
      const c = new OpenSubtitlesClient({ apiBase: "https://api.opensubtitles.com/api/v1", defaultApiKey: "K", timeoutMs: 2000, fetch: f }, { username: fake("user"), password: fake("pw") });
      await c.userInfo();
      expect(f.calls.find((x) => path("/infos/user")(x))!.url.hostname, assigned).toBe(expected);
    }
  });
  it("turns a timeout into a clear error", async () => {
    const slow = (async (_u: string | URL, init?: RequestInit) =>
      new Promise<Response>((_, reject) => init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("t"), { name: "TimeoutError" }))))) as never;
    const c = new OpenSubtitlesClient({ apiBase: "https://api.test/api/v1", defaultApiKey: "K", timeoutMs: 50, fetch: slow });
    await expect(c.searchSubtitles({ query: "x" })).rejects.toThrow(/did not answer within/);
  });
  it("aborts the API call when the MCP request is cancelled", async () => {
    const ac = new AbortController();
    const hang = (async (_u: string | URL, init?: RequestInit) =>
      new Promise<Response>((_, reject) => init?.signal?.addEventListener("abort", () => reject(new Error("aborted"))))) as never;
    const c = new OpenSubtitlesClient({ apiBase: "https://api.test/api/v1", defaultApiKey: "K", timeoutMs: 10_000, fetch: hang }).withSignal(ac.signal);
    const p = c.searchSubtitles({ query: "x" });
    ac.abort();
    await expect(p).rejects.toThrow(/cancelled/);
  });
});

describe("ranking", () => {
  const rs = [
    subtitle(1, { download_count: 9000 }, { title: "The Matrix Revisited", year: 2001 }),
    subtitle(2, { download_count: 10 }),
    subtitle(3, { download_count: 5, release: "The.Matrix.1999.1080p.BluRay.x264-GROUP" }),
  ].map((s) => toSubtitleResult(ApiSubtitle.parse(s)));
  it("puts an exact title match above a more popular near match", () => {
    expect(rank(rs, { title: "The Matrix", year: 1999 })[0]!.feature!.title).toBe("The Matrix");
  });
  it("puts the release matching the filename first", () => {
    expect(rank(rs, { title: "The Matrix", release: "The.Matrix.1999.1080p.BluRay.x264-GROUP", releaseGroup: "GROUP" })[0]!.subtitle_id).toBe("3");
  });
  it("ranks a moviehash match above everything", () => {
    const m = toSubtitleResult(ApiSubtitle.parse(subtitle(4, { moviehash_match: true, download_count: 0 }, { title: "Other" })));
    expect(rank([...rs, m], { title: "The Matrix" })[0]!.subtitle_id).toBe("4");
  });
  it("normalises titles and compares releases", () => {
    expect(normTitle("The Matrix")).toBe(normTitle("matrix"));
    expect(releaseSimilarity("A.B.C-GRP", "a b c grp")).toBe(1);
    expect(releaseSimilarity("", "x")).toBe(0);
  });
  it("picks the exact feature, preferring the year", () => {
    const fs = [feature(200, "The Matrix Revisited", 2001), feature(100, "The Matrix", 1999), feature(101, "The Matrix", 2030)].map((f) => toFeatureResult(ApiFeature.parse(f), false));
    expect(pickExactFeature(fs, "the matrix", 1999)!.feature_id).toBe(100);
    expect(pickExactFeature(fs, "the matrix", 1990)).toBeNull();
    expect(pickExactFeature(fs, "Matrix Revisited")!.feature_id).toBe(200);
  });
});

describe("OpenSubtitles hash", () => {
  it("matches an independent implementation on a synthetic file", async () => {
    const dir = mkdtempSync(join(tmpdir(), "oshash-"));
    const file = join(dir, "synthetic.bin");
    const size = 300_001;
    const buf = Buffer.alloc(size);
    for (let i = 0; i < size; i++) buf[i] = (i * 7919 + 13) & 0xff;
    writeFileSync(file, buf);
    // Independent reference: Number-based 32-bit halves with carry.
    let lo = size >>> 0;
    let hi = Math.floor(size / 2 ** 32);
    const add = (b: Buffer, off: number) => {
      for (let i = 0; i < 65536; i += 8) {
        const l = b.readUInt32LE(off + i);
        const h = b.readUInt32LE(off + i + 4);
        const s = lo + l;
        lo = s >>> 0;
        hi = (hi + h + (s > 0xffffffff ? 1 : 0)) >>> 0;
      }
    };
    add(buf, 0);
    add(buf, size - 65536);
    const expected = hi.toString(16).padStart(8, "0") + lo.toString(16).padStart(8, "0");
    const r = await calculateOpenSubtitlesHash(file);
    expect(r).toEqual({ moviehash: expected, moviebytesize: size });
  });
  it("is the size alone for an all-zero file", () => {
    expect(hashFromChunks(131072, Buffer.alloc(65536), Buffer.alloc(65536))).toBe("0000000000020000");
  });
  it("rejects files under 128 KiB", async () => {
    const dir = mkdtempSync(join(tmpdir(), "oshash-"));
    const file = join(dir, "small.bin");
    writeFileSync(file, Buffer.alloc(1000));
    await expect(calculateOpenSubtitlesHash(file)).rejects.toThrow(/too small/);
  });
});

describe("guessit-js integration", () => {
  it("parses movies and episodes", async () => {
    const m = await guessFilename("The.Matrix.1999.1080p.BluRay.x264-GROUP.mkv");
    expect(m).toMatchObject({ title: "The Matrix", year: 1999, type: "movie", release_group: "GROUP", release_name: "The.Matrix.1999.1080p.BluRay.x264-GROUP" });
    const e = await guessFilename("/videos/Synthetic.Show.S02E05.720p.WEB-GRP.mkv");
    expect(e).toMatchObject({ title: "Synthetic Show", season: 2, episode: 5, type: "episode" });
    expect(releaseName("C:\\x\\Show.S01E01.mp4")).toBe("Show.S01E01");
  });
});

describe("log helpers", () => {
  it("scrubs registered secrets and anonymises client ids", () => {
    const v = fake("value");
    registerSecret(v);
    expect(scrub(`{"x":"${v}"}`)).toBe('{"x":"[redacted]"}');
    const id = clientId("salt", "ip:203.0.113.9");
    expect(id).toMatch(/^[0-9a-f]{12}$/);
    expect(id).not.toContain("203");
  });
  it("extracts the W3C trace id from _meta.traceparent", () => {
    const ctx = { mcpReq: { _meta: { traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01" } } } as never;
    expect(traceId(ctx)).toBe("4bf92f3577b34da6a3ce929d0e0e4736");
    expect(traceId({ mcpReq: { _meta: { traceparent: "junk" } } } as never)).toBeUndefined();
  });
});

describe("rate limiter", () => {
  it("allows a burst, then refuses with a retry time, then refills", () => {
    const rl = new RateLimiter(60, 3);
    const t = 1_000_000;
    expect([rl.take("a", t), rl.take("a", t), rl.take("a", t)].every((r) => r.ok)).toBe(true);
    const no = rl.take("a", t);
    expect(no.ok).toBe(false);
    if (!no.ok) expect(no.retryAfter).toBeGreaterThanOrEqual(1);
    expect(rl.take("b", t).ok).toBe(true);
    expect(rl.take("a", t + 1500).ok).toBe(true);
  });
});

describe("legacy JSON text block", () => {
  const res = { content: [{ type: "text" as const, text: "summary" }], structuredContent: { a: 1 } };
  it("adds serialized JSON only for clients older than 2025-06-18", () => {
    expect(withLegacyJson(res, "2025-03-26").content).toHaveLength(2);
    expect(withLegacyJson(res, "2025-06-18").content).toHaveLength(1);
    expect(withLegacyJson(res, "2026-07-28").content).toHaveLength(1);
    expect(withLegacyJson({ ...res, isError: true }, "2024-11-05").content).toHaveLength(1);
  });
});

describe("version", () => {
  it("is the same in package.json, src/config.ts, server.json and plugin.json", async () => {
    const { readFileSync } = await import("node:fs");
    const { VERSION } = await import("../src/config.js");
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    const srv = JSON.parse(readFileSync(new URL("../server.json", import.meta.url), "utf8"));
    expect(pkg.version).toBe(VERSION);
    expect(srv.version).toBe(VERSION);
    expect(srv.packages[0].version).toBe(VERSION);
    expect(pkg.mcpName).toBe(srv.name);
    const plugin = JSON.parse(readFileSync(new URL("../plugin.json", import.meta.url), "utf8"));
    expect(plugin.version).toBe(VERSION);
    const mcp = JSON.parse(readFileSync(new URL("../mcp.json", import.meta.url), "utf8"));
    expect(mcp.mcpServers.opensubtitles.args).toContain(pkg.name);
    expect(mcp.mcpServers["opensubtitles-remote"].url).toBe(srv.remotes[0].url);
  });
});
