import { guessit } from "guessit-js";
import * as z from "zod/v4";

/** guessit-js output reduced to what an agent needs, plus the raw result. */
export const GuessOut = z.object({
  title: z.string().nullable(),
  year: z.number().nullable(),
  season: z.number().nullable(),
  episode: z.number().nullable(),
  episode_title: z.string().nullable(),
  type: z.enum(["movie", "episode"]).nullable(),
  release_group: z.string().nullable(),
  screen_size: z.string().nullable(),
  source: z.string().nullable(),
  video_codec: z.string().nullable(),
  container: z.string().nullable(),
  release_name: z.string().describe("The filename without directory and extension, used to rank subtitle releases"),
  raw: z.record(z.string(), z.unknown()).describe("Full guessit-js result"),
});
export type GuessOut = z.infer<typeof GuessOut>;

function first(v: unknown): unknown {
  return Array.isArray(v) ? v[0] : v;
}
function s(v: unknown): string | null {
  const x = first(v);
  return typeof x === "string" && x.length > 0 ? x : null;
}
function n(v: unknown): number | null {
  const x = first(v);
  return typeof x === "number" && Number.isFinite(x) ? x : null;
}

export function releaseName(filename: string): string {
  const base = filename.split(/[\\/]/).pop() ?? filename;
  return base.replace(/\.(mkv|mp4|avi|m4v|mov|wmv|mpg|mpeg|ts|m2ts|webm|flv|srt|sub|ass|ssa|vtt|idx)$/i, "");
}

export async function guessFilename(filename: string): Promise<GuessOut> {
  const raw = (await Promise.resolve(guessit(filename))) as Record<string, unknown>;
  const type = raw.type === "episode" ? "episode" : raw.type === "movie" ? "movie" : null;
  return {
    title: s(raw.title),
    year: n(raw.year),
    season: n(raw.season),
    episode: n(raw.episode),
    episode_title: s(raw.episode_title),
    type,
    release_group: s(raw.release_group),
    screen_size: s(raw.screen_size),
    source: s(raw.source),
    video_codec: s(raw.video_codec),
    container: s(raw.container),
    release_name: releaseName(filename),
    raw: JSON.parse(JSON.stringify(raw)) as Record<string, unknown>,
  };
}
