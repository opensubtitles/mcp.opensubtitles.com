import * as z from "zod/v4";
import type { ApiFeature, ApiSubtitle } from "./api/schemas.js";

/** Structured shapes returned to agents (also used as tool output schemas). */

export const FeatureRef = z.object({
  feature_id: z.number().nullable(),
  type: z.string().nullable().describe("movie, episode or tvshow"),
  title: z.string().nullable(),
  year: z.number().nullable(),
  imdb_id: z.number().nullable(),
  tmdb_id: z.number().nullable(),
  season_number: z.number().nullable(),
  episode_number: z.number().nullable(),
  parent_title: z.string().nullable(),
  parent_imdb_id: z.number().nullable(),
  parent_feature_id: z.number().nullable(),
});
export type FeatureRef = z.infer<typeof FeatureRef>;

export const SubtitleFileOut = z.object({
  file_id: z.number(),
  file_name: z.string().nullable(),
  cd_number: z.number().nullable(),
});

export const SubtitleResult = z.object({
  subtitle_id: z.string(),
  file_id: z.number().nullable().describe("Pass this to download_subtitle. For multi-CD releases see files."),
  files: z.array(SubtitleFileOut),
  language: z.string().nullable(),
  release: z.string().nullable(),
  fps: z.number().nullable(),
  download_count: z.number(),
  rating: z.number().nullable(),
  votes: z.number().nullable(),
  hearing_impaired: z.boolean(),
  hd: z.boolean(),
  ai_translated: z.boolean(),
  machine_translated: z.boolean(),
  foreign_parts_only: z.boolean(),
  from_trusted: z.boolean(),
  moviehash_match: z.boolean(),
  uploader: z.object({ id: z.number().nullable(), name: z.string().nullable(), rank: z.string().nullable() }),
  upload_date: z.string().nullable(),
  feature: FeatureRef.nullable(),
  url: z.string().nullable(),
});
export type SubtitleResult = z.infer<typeof SubtitleResult>;

export function normType(t: string | null | undefined): string | null {
  if (!t) return null;
  const v = t.toLowerCase();
  if (v === "tvshow" || v === "tv show" || v === "tv") return "tvshow";
  return v;
}

export function toSubtitleResult(s: ApiSubtitle): SubtitleResult {
  const a = s.attributes;
  const f = a.feature_details;
  return {
    subtitle_id: a.subtitle_id,
    file_id: a.files[0]?.file_id ?? null,
    files: a.files.map((x) => ({ file_id: x.file_id, file_name: x.file_name, cd_number: x.cd_number })),
    language: a.language,
    release: a.release,
    fps: a.fps || null,
    download_count: a.download_count ?? 0,
    rating: a.ratings || null,
    votes: a.votes,
    hearing_impaired: a.hearing_impaired,
    hd: a.hd,
    ai_translated: a.ai_translated,
    machine_translated: a.machine_translated,
    foreign_parts_only: a.foreign_parts_only,
    from_trusted: a.from_trusted,
    moviehash_match: a.moviehash_match,
    uploader: { id: a.uploader.uploader_id, name: a.uploader.name, rank: a.uploader.rank },
    upload_date: a.upload_date,
    feature: f
      ? {
          feature_id: f.feature_id,
          type: normType(f.feature_type),
          title: f.title,
          year: f.year,
          imdb_id: f.imdb_id,
          tmdb_id: f.tmdb_id,
          season_number: f.season_number,
          episode_number: f.episode_number,
          parent_title: f.parent_title,
          parent_imdb_id: f.parent_imdb_id,
          parent_feature_id: f.parent_feature_id,
        }
      : null,
    url: a.url,
  };
}

export const FeatureResult = z.object({
  feature_id: z.number(),
  type: z.string().nullable().describe("movie, tvshow or episode"),
  title: z.string().nullable(),
  original_title: z.string().nullable(),
  year: z.number().nullable(),
  imdb_id: z.number().nullable(),
  tmdb_id: z.number().nullable(),
  parent_title: z.string().nullable(),
  parent_imdb_id: z.number().nullable(),
  parent_feature_id: z.number().nullable(),
  season_number: z.number().nullable(),
  episode_number: z.number().nullable(),
  subtitles_count: z.number().nullable(),
  subtitles_by_language: z.record(z.string(), z.number()),
  seasons: z
    .array(
      z.object({
        season_number: z.number().nullable(),
        episode_count: z.number(),
        episodes: z
          .array(z.object({ episode_number: z.number().nullable(), title: z.string().nullable(), feature_id: z.number().nullable(), imdb_id: z.number().nullable() }))
          .optional(),
      }),
    )
    .describe("TV shows only"),
  url: z.string().nullable(),
});
export type FeatureResult = z.infer<typeof FeatureResult>;

export function toFeatureResult(f: ApiFeature, includeEpisodes: boolean): FeatureResult {
  const a = f.attributes;
  // With a type filter the API puts the type in the top-level "type" and omits feature_type.
  const type = normType(a.feature_type) ?? (f.type && f.type !== "feature" ? normType(f.type) : null);
  return {
    feature_id: Number(a.feature_id ?? f.id),
    type,
    title: a.original_title || a.title,
    original_title: a.original_title,
    year: a.year || null,
    imdb_id: a.imdb_id,
    tmdb_id: a.tmdb_id,
    parent_title: a.parent_title || null,
    parent_imdb_id: a.parent_imdb_id,
    parent_feature_id: a.parent_feature_id,
    season_number: type === "episode" ? a.season_number : null,
    episode_number: type === "episode" ? a.episode_number : null,
    subtitles_count: a.subtitles_count,
    subtitles_by_language: a.subtitles_counts,
    seasons: a.seasons
      .filter((s) => s.season_number !== 0 || s.episodes.length > 0)
      .map((s) => ({
        season_number: s.season_number,
        episode_count: s.episodes.length,
        ...(includeEpisodes
          ? { episodes: s.episodes.map((e) => ({ episode_number: e.episode_number, title: e.title, feature_id: e.feature_id, imdb_id: e.feature_imdb_id })) }
          : {}),
      })),
    url: a.url,
  };
}

/* ------------------------------------------------------------------ ranking */

export function normTitle(t: string | null | undefined): string {
  return (t ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/^(the|a|an) /, "")
    .trim();
}

function tokens(s: string | null | undefined): Set<string> {
  return new Set(
    (s ?? "")
      .toLowerCase()
      .replace(/\.[a-z0-9]{2,4}$/, "")
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 0),
  );
}

/** Jaccard similarity of release-name tokens (0..1). */
export function releaseSimilarity(a: string | null | undefined, b: string | null | undefined): number {
  const A = tokens(a);
  const B = tokens(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

export interface RankContext {
  title?: string;
  year?: number;
  season?: number;
  episode?: number;
  release?: string;
  releaseGroup?: string;
  languages?: string[];
}

export function score(r: SubtitleResult, ctx: RankContext): number {
  let s = 0;
  if (r.moviehash_match) s += 1000;
  const f = r.feature;
  if (ctx.title && f) {
    const want = normTitle(ctx.title);
    const have = [f.title, f.parent_title].map(normTitle);
    if (have.includes(want)) s += 100;
    else if (have.some((h) => h.startsWith(want) || want.startsWith(h))) s += 20;
  }
  if (ctx.year && f?.year === ctx.year) s += 30;
  if (ctx.season !== undefined && f?.season_number === ctx.season) s += 40;
  if (ctx.episode !== undefined && f?.episode_number === ctx.episode) s += 40;
  if (ctx.release) {
    const bestFile = Math.max(0, ...r.files.map((file) => releaseSimilarity(ctx.release, file.file_name)));
    s += 200 * Math.max(releaseSimilarity(ctx.release, r.release), bestFile);
  }
  if (ctx.releaseGroup && r.release && r.release.toLowerCase().includes(ctx.releaseGroup.toLowerCase())) s += 40;
  if (ctx.languages?.length && r.language) {
    const idx = ctx.languages.findIndex((l) => l.toLowerCase() === r.language!.toLowerCase());
    if (idx >= 0) s += Math.max(0, 10 - idx * 2);
  }
  if (r.from_trusted) s += 5;
  if (r.ai_translated) s -= 5;
  if (r.machine_translated) s -= 15;
  s += 3 * Math.log10(1 + r.download_count);
  return s;
}

/** Stable sort by relevance, highest first. */
export function rank(results: SubtitleResult[], ctx: RankContext): SubtitleResult[] {
  return results
    .map((r, i) => ({ r, i, s: score(r, ctx) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.r);
}

/** Best feature whose title matches exactly; prefers the year, then the most subtitles. */
export function pickExactFeature(features: FeatureResult[], title: string, year?: number, type?: string): FeatureResult | null {
  const want = normTitle(title);
  if (!want) return null;
  const exact = features.filter(
    (f) => (!type || f.type === type) && [f.title, f.original_title].some((t) => normTitle(t) === want),
  );
  if (exact.length === 0) return null;
  const byYear = year ? exact.filter((f) => f.year === year) : [];
  const pool = byYear.length ? byYear : year ? [] : exact;
  if (pool.length === 0) return null;
  return [...pool].sort((a, b) => (b.subtitles_count ?? 0) - (a.subtitles_count ?? 0))[0] ?? null;
}
