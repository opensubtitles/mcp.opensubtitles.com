import * as z from "zod/v4";
import { FeatureResult, normTitle, toFeatureResult } from "../results.js";
import { instrument, plural, ToolError, type Register } from "./common.js";

const ImdbId = z
  .union([z.number().int().positive(), z.string().regex(/^(tt)?\d{1,10}$/i, "IMDb id such as tt0133093 or 133093")])
  .transform((v) => Number(String(v).replace(/^tt/i, "")));

export const FeaturesInput = z.object({
  query: z.string().trim().min(1).max(200).optional().describe("Title, e.g. \"Chicago Fire\""),
  imdb_id: ImdbId.optional(),
  tmdb_id: z.number().int().positive().optional(),
  feature_id: z.number().int().positive().optional(),
  type: z.enum(["movie", "tvshow", "episode", "all"]).default("all"),
  year: z.number().int().min(1870).max(2100).optional(),
  include_episodes: z.boolean().default(false).describe("List every episode (title, feature_id, IMDb id) per season for TV shows"),
  limit: z.number().int().min(1).max(50).default(10),
});

export const FeaturesOutput = z.object({
  total: z.number(),
  features: z.array(FeatureResult),
});

export const registerSearchFeatures: Register = (server, deps) => {
  server.registerTool(
    "search_features",
    {
      title: "Find movies and TV shows",
      description:
        "Look up movies, TV shows and episodes on OpenSubtitles (title, year, IMDb/TMDB/feature ids, seasons and episode counts, subtitle counts per language). Use it to disambiguate a title before search_subtitles, or to find a show's seasons and episodes.",
      inputSchema: FeaturesInput,
      outputSchema: FeaturesOutput,
      annotations: { title: "Find movies and TV shows", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    instrument("search_features", deps, async (input, deps) => {
      if (!input.query && !input.imdb_id && !input.tmdb_id && !input.feature_id) {
        throw new ToolError("Give query, imdb_id, tmdb_id or feature_id. Example: {\"query\": \"Chicago Fire\", \"type\": \"tvshow\"}.");
      }
      const raw = await deps.api.searchFeatures({
        query: input.query,
        imdb_id: input.imdb_id,
        tmdb_id: input.tmdb_id,
        feature_id: input.feature_id,
        type: input.type === "all" ? undefined : input.type,
        year: input.year,
      });
      let features = raw.map((f) => toFeatureResult(f, input.include_episodes));
      if (input.year) features = features.filter((f) => f.year === null || f.year === input.year);
      if (input.query) {
        const want = normTitle(input.query);
        const exact = (f: FeatureResult) => [f.title, f.original_title].some((t) => normTitle(t) === want);
        features = features
          .map((f, i) => ({ f, i }))
          .sort((a, b) => Number(exact(b.f)) - Number(exact(a.f)) || (b.f.subtitles_count ?? 0) - (a.f.subtitles_count ?? 0) || a.i - b.i)
          .map((x) => x.f);
      }
      const total = features.length;
      features = features.slice(0, input.limit);
      const lines = [`${plural(total, "match")}${total > features.length ? `, showing ${features.length}` : ""}.`];
      for (const f of features) {
        const seasons = f.type === "tvshow" ? `, ${plural(f.seasons.length, "season")}` : "";
        lines.push(
          `- ${f.title ?? "?"}${f.year ? ` (${f.year})` : ""} [${f.type ?? "?"}] feature_id ${f.feature_id}${f.imdb_id ? `, imdb tt${String(f.imdb_id).padStart(7, "0")}` : ""}${seasons}, ${f.subtitles_count ?? 0} subtitles`,
        );
      }
      if (total === 0) lines.push("Nothing found. Check the spelling, drop year, or try the original title.");
      return { content: [{ type: "text", text: lines.join("\n") }], structuredContent: { total, features } };
    }),
  );
};
