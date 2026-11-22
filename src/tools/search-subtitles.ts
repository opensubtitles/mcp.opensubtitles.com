import * as z from "zod/v4";
import { guessFilename, GuessOut } from "../guess.js";
import {
  FeatureRef,
  pickExactFeature,
  rank,
  SubtitleResult,
  toFeatureResult,
  toSubtitleResult,
  type RankContext,
} from "../results.js";
import { instrument, languagesParam, plural, ToolError, type Register } from "./common.js";

export const LANGUAGE_CODE = z
  .string()
  .regex(/^[A-Za-z]{2,3}(-[A-Za-z]{2,4})?$/, "language code such as en, pt-BR, zh-CN")
  .describe("Language code as listed by list_languages, e.g. en, de, pt-BR, zh-CN");

const ImdbId = z
  .union([z.number().int().positive(), z.string().regex(/^(tt)?\d{1,10}$/i, "IMDb id such as tt0133093 or 133093")])
  .transform((v) => Number(String(v).replace(/^tt/i, "")));

const API_PAGE = 50;

export const SearchInput = z.object({
  query: z.string().trim().min(1).max(200).optional().describe("Title to search for, e.g. \"The Matrix\". Not needed when an id, moviehash or filename is given."),
  filename: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .optional()
    .describe("Video filename, e.g. \"Chicago.Fire.S14E01.1080p.WEB.h264-ETHEL.mkv\". Parsed with guessit-js into title/year/season/episode; its release name ranks matching subtitles first."),
  imdb_id: ImdbId.optional().describe("IMDb id (tt0133093 or 133093). With season_number/episode_number it is the show's id."),
  tmdb_id: z.number().int().positive().optional().describe("TMDB id. With season_number/episode_number it is the show's id."),
  feature_id: z.number().int().positive().optional().describe("OpenSubtitles feature id from search_features. With season_number/episode_number it is the show's id."),
  season_number: z.number().int().min(0).max(999).optional(),
  episode_number: z.number().int().min(0).max(9999).optional(),
  year: z.number().int().min(1870).max(2100).optional(),
  type: z.enum(["movie", "episode", "all"]).optional().describe("Restrict to movies or TV episodes"),
  languages: z.array(LANGUAGE_CODE).min(1).max(20).optional().describe("Subtitle languages in order of preference, e.g. [\"en\", \"pt-BR\"]. Omit for all languages."),
  moviehash: z
    .string()
    .regex(/^[0-9a-fA-F]{16}$/, "16 hex digits")
    .optional()
    .describe("OpenSubtitles hash of the video file (calculate_file_hash in local mode). Exact file matches are flagged moviehash_match and ranked first."),
  hearing_impaired: z.enum(["include", "exclude", "only"]).default("include").describe("Subtitles for the deaf and hard of hearing (SDH)"),
  foreign_parts_only: z.enum(["include", "exclude", "only"]).default("include").describe("Subtitles that only cover foreign-language dialogue"),
  include_ai_translated: z.boolean().default(true).describe("Include AI-translated subtitles"),
  include_machine_translated: z.boolean().default(false).describe("Include machine-translated subtitles (usually low quality)"),
  trusted_only: z.boolean().default(false).describe("Only subtitles from trusted uploaders"),
  order_by: z
    .enum(["relevance", "download_count", "upload_date", "rating", "votes"])
    .default("relevance")
    .describe("relevance = exact title/episode and release-name matches first, then popularity"),
  exact_title: z
    .boolean()
    .default(true)
    .describe("When searching by title, first resolve it to the exact movie/show (so \"The Matrix\" does not return \"The Matrix Revisited\"). Set false for a fuzzy text search."),
  page: z.number().int().min(1).max(1000).default(1),
  per_page: z.number().int().min(1).max(100).default(20),
});
export type SearchInput = z.infer<typeof SearchInput>;

export const SearchOutput = z.object({
  total_count: z.number().describe("Matches at the API for the effective filters"),
  total_pages: z.number(),
  page: z.number(),
  per_page: z.number(),
  results: z.array(SubtitleResult),
  resolved_feature: FeatureRef.nullable().describe("The movie/show the title was resolved to, when exact_title applied"),
  guessed: GuessOut.omit({ raw: true }).nullable().describe("What guessit-js read from filename"),
  filters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).describe("Effective query sent to the OpenSubtitles API"),
  hints: z.array(z.string()),
});
export type SearchOutput = z.infer<typeof SearchOutput>;

const ORDER_API: Record<string, string> = {
  relevance: "download_count",
  download_count: "download_count",
  upload_date: "upload_date",
  rating: "ratings",
  votes: "votes",
};

export const registerSearchSubtitles: Register = (server, deps) => {
  server.registerTool(
    "search_subtitles",
    {
      title: "Search subtitles",
      description:
        "Find subtitles for a movie or TV episode and get file_ids to download. Search by title (query), video filename, IMDb/TMDB/feature id with optional season/episode, or moviehash; filter by language and flags. Results are ranked with exact title, episode and release-name matches first.",
      inputSchema: SearchInput,
      outputSchema: SearchOutput,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    instrument("search_subtitles", deps, async (input, deps) => {
      const out = await searchSubtitles(deps, input);
      return { content: [{ type: "text", text: summarise(out) }], structuredContent: out };
    }),
  );
};

export async function searchSubtitles(deps: Parameters<Register>[1], input: SearchInput): Promise<SearchOutput> {
  const hints: string[] = [];
  const guessed = input.filename ? await guessFilename(input.filename) : null;

  const title = input.query ?? guessed?.title ?? undefined;
  const year = input.year ?? guessed?.year ?? undefined;
  const season = input.season_number ?? guessed?.season ?? undefined;
  const episode = input.episode_number ?? guessed?.episode ?? undefined;
  const episodic = season !== undefined || episode !== undefined;
  const type = input.type ?? (guessed?.type ?? undefined);

  if (!title && !input.imdb_id && !input.tmdb_id && !input.feature_id && !input.moviehash) {
    throw new ToolError(
      "Give at least one of: query, filename, imdb_id, tmdb_id, feature_id or moviehash. Example: {\"query\": \"The Matrix\", \"year\": 1999, \"languages\": [\"en\"]}.",
    );
  }

  const filters: Record<string, string | number | boolean> = {};
  let resolved: SearchOutput["resolved_feature"] = null;

  // Ids: with a season/episode they name the show (parent_*).
  if (input.imdb_id) filters[episodic ? "parent_imdb_id" : "imdb_id"] = input.imdb_id;
  if (input.tmdb_id) filters[episodic ? "parent_tmdb_id" : "tmdb_id"] = input.tmdb_id;
  if (input.feature_id) filters[episodic ? "parent_feature_id" : "id"] = input.feature_id;

  const hasId = Boolean(input.imdb_id || input.tmdb_id || input.feature_id);
  if (!hasId && title) {
    if (input.exact_title) {
      const featureType = episodic || type === "episode" ? "tvshow" : type === "movie" ? "movie" : undefined;
      const features = (await deps.api.searchFeatures({ query: title, ...(featureType ? { type: featureType } : {}) })).map((f) =>
        toFeatureResult(f, false),
      );
      const pick =
        pickExactFeature(features, title, episodic ? undefined : year, featureType) ??
        (episodic ? null : pickExactFeature(features, title, undefined, featureType));
      if (pick) {
        resolved = {
          feature_id: pick.feature_id,
          type: pick.type,
          title: pick.title,
          year: pick.year,
          imdb_id: pick.imdb_id,
          tmdb_id: pick.tmdb_id,
          season_number: null,
          episode_number: null,
          parent_title: null,
          parent_imdb_id: null,
          parent_feature_id: null,
        };
        if (pick.type === "tvshow") filters.parent_feature_id = pick.feature_id;
        else filters.id = pick.feature_id;
        if (year && pick.year && pick.year !== year && !episodic) hints.push(`No exact match for "${title}" in ${year}; using ${pick.title} (${pick.year}).`);
      } else {
        filters.query = title;
        hints.push(`No movie or show is titled exactly "${title}"; ran a text search instead. Use search_features to pick the right one.`);
      }
    } else {
      filters.query = title;
    }
  }
  if (season !== undefined) filters.season_number = season;
  if (episode !== undefined) filters.episode_number = episode;
  if (year && !filters.id && !filters.imdb_id && !filters.tmdb_id && !episodic) filters.year = year;
  if (type && type !== "all" && !filters.id) filters.type = type;
  if (input.moviehash) filters.moviehash = input.moviehash.toLowerCase();
  const langs = languagesParam(input.languages);
  if (langs) filters.languages = langs;
  if (input.hearing_impaired !== "include") filters.hearing_impaired = input.hearing_impaired;
  if (input.foreign_parts_only !== "include") filters.foreign_parts_only = input.foreign_parts_only;
  if (!input.include_ai_translated) filters.ai_translated = "exclude";
  if (input.include_machine_translated) filters.machine_translated = "include";
  if (input.trusted_only) filters.trusted_sources = "only";
  filters.order_by = ORDER_API[input.order_by] ?? "download_count";
  filters.order_direction = "desc";

  // Map page/per_page onto the API's fixed 50-per-page pages.
  const offset = (input.page - 1) * input.per_page;
  const firstApiPage = Math.floor(offset / API_PAGE) + 1;
  const lastApiPage = Math.floor((offset + input.per_page - 1) / API_PAGE) + 1;
  let total = 0;
  let collected: SubtitleResult[] = [];
  for (let p = firstApiPage; p <= lastApiPage; p++) {
    const res = await deps.api.searchSubtitles({ ...filters, ...(p > 1 ? { page: p } : {}) });
    total = res.total_count;
    collected = collected.concat(res.data.map(toSubtitleResult));
    if (p >= res.total_pages) break;
  }

  const ctx: RankContext = {
    title: resolved?.title ?? title,
    year,
    season,
    episode,
    release: guessed?.release_name,
    releaseGroup: guessed?.release_group ?? undefined,
    languages: input.languages,
  };
  if (input.order_by === "relevance") collected = rank(collected, ctx);
  const start = offset - (firstApiPage - 1) * API_PAGE;
  const results = collected.slice(start, start + input.per_page);

  if (total === 0) {
    const tips: string[] = [];
    if (langs) tips.push(`drop or widen languages (now ${langs})`);
    if (filters.year) tips.push("drop year");
    if (input.trusted_only) tips.push("set trusted_only=false");
    if (input.hearing_impaired === "only") tips.push("set hearing_impaired=include");
    if (filters.query) tips.push("check the spelling or find the title with search_features");
    if (input.moviehash) tips.push("search by title as well: moviehash matches only files someone has already linked");
    hints.push(`No subtitles found${tips.length ? `; try: ${tips.join(", ")}` : ""}.`);
  } else if (results.length === 0) {
    hints.push(`Page ${input.page} is past the last page (${Math.ceil(total / input.per_page)}).`);
  }
  if (total > 0 && langs === undefined) hints.push("Tip: pass languages (e.g. [\"en\"]) to get only the languages you need.");

  const { raw: _raw, ...guessedOut } = guessed ?? { raw: null };
  return {
    total_count: total,
    total_pages: Math.max(1, Math.ceil(total / input.per_page)),
    page: input.page,
    per_page: input.per_page,
    results,
    resolved_feature: resolved,
    guessed: guessed ? (guessedOut as SearchOutput["guessed"]) : null,
    filters,
    hints,
  };
}

function label(r: SubtitleResult): string {
  const f = r.feature;
  if (!f) return "";
  const ep =
    f.season_number != null && f.episode_number != null
      ? ` S${String(f.season_number).padStart(2, "0")}E${String(f.episode_number).padStart(2, "0")}`
      : "";
  return `${f.parent_title || f.title || ""}${ep}${f.year ? ` (${f.year})` : ""}`;
}

export function summarise(out: SearchOutput): string {
  const lines: string[] = [];
  const what = out.resolved_feature ? ` for ${out.resolved_feature.title}${out.resolved_feature.year ? ` (${out.resolved_feature.year})` : ""}` : "";
  lines.push(
    `${plural(out.total_count, "subtitle")} found${what}; page ${out.page}/${out.total_pages}, showing ${out.results.length}.`,
  );
  out.results.slice(0, 10).forEach((r, i) => {
    const flags = [r.hearing_impaired && "HI", r.ai_translated && "AI", r.machine_translated && "MT", r.moviehash_match && "hash match", r.from_trusted && "trusted"]
      .filter(Boolean)
      .join(", ");
    lines.push(
      `${i + 1}. file_id ${r.file_id ?? "-"} [${r.language ?? "?"}] ${label(r)} — ${r.release ?? "(no release name)"} — ${r.download_count} downloads${flags ? ` (${flags})` : ""}`,
    );
  });
  if (out.results.length > 10) lines.push(`… ${out.results.length - 10} more in structuredContent.`);
  for (const h of out.hints) lines.push(h);
  if (out.results.length) lines.push("Download with download_subtitle {\"file_id\": <file_id>}.");
  return lines.join("\n");
}
