import * as z from "zod/v4";

/**
 * Lenient schemas for OpenSubtitles REST API responses.
 *
 * The API leaves many fields null or absent (recent episodes have no year, #4),
 * and mixes number and string types (feature year is "1999" in /features,
 * 1999 in /subtitles). Every optional field accepts null; records are validated
 * one at a time so a single odd record never hides the others.
 */

const num = z
  .union([z.number(), z.string().regex(/^-?\d+(\.\d+)?$/).transform(Number)])
  .nullish()
  .transform((v) => (v === undefined || v === null || Number.isNaN(v) ? null : v));
const str = z
  .string()
  .nullish()
  .transform((v) => v ?? null);
const bool = z
  .boolean()
  .nullish()
  .transform((v) => v ?? false);

export const ApiFile = z.object({
  file_id: z.number(),
  cd_number: num,
  file_name: str,
});

export const ApiFeatureDetails = z.object({
  feature_id: num,
  feature_type: str,
  year: num,
  title: str,
  movie_name: str,
  imdb_id: num,
  tmdb_id: num,
  season_number: num,
  episode_number: num,
  parent_imdb_id: num,
  parent_title: str,
  parent_tmdb_id: num,
  parent_feature_id: num,
});

export const ApiSubtitle = z.object({
  id: z.string(),
  type: z.string().optional(),
  attributes: z.object({
    subtitle_id: z.union([z.string(), z.number()]).transform(String),
    language: str,
    download_count: num,
    new_download_count: num,
    hearing_impaired: bool,
    hd: bool,
    fps: num,
    votes: num,
    ratings: num,
    points: num,
    from_trusted: bool,
    foreign_parts_only: bool,
    ai_translated: bool,
    machine_translated: bool,
    moviehash_match: bool,
    upload_date: str,
    release: str,
    comments: str,
    nb_cd: num,
    slug: str,
    url: str,
    uploader: z
      .object({ uploader_id: num, name: str, rank: str })
      .nullish()
      .transform((v) => v ?? { uploader_id: null, name: null, rank: null }),
    feature_details: ApiFeatureDetails.nullish().transform((v) => v ?? null),
    related_links: z
      .array(z.object({ label: str, url: str }).loose())
      .nullish()
      .transform((v) => v ?? []),
    files: z
      .array(ApiFile)
      .nullish()
      .transform((v) => v ?? []),
  }),
});
export type ApiSubtitle = z.infer<typeof ApiSubtitle>;

export const ApiSearchEnvelope = z.object({
  total_pages: num,
  total_count: num,
  per_page: num,
  page: num,
  data: z
    .array(z.unknown())
    .nullish()
    .transform((v) => v ?? []),
});

export const ApiEpisode = z.object({
  episode_number: num,
  title: str,
  feature_id: num,
  feature_imdb_id: num,
});

export const ApiFeature = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  type: z.string().optional(),
  attributes: z.object({
    feature_id: z.union([z.string(), z.number()]).transform(String).nullish(),
    feature_type: str,
    title: str,
    original_title: str,
    year: num,
    imdb_id: num,
    tmdb_id: num,
    parent_title: str,
    parent_imdb_id: num,
    parent_tmdb_id: num,
    parent_feature_id: num,
    season_number: num,
    episode_number: num,
    subtitles_count: num,
    seasons_count: num,
    subtitles_counts: z
      .record(z.string(), z.number())
      .nullish()
      .transform((v) => v ?? {}),
    title_aka: z
      .array(z.string())
      .nullish()
      .transform((v) => v ?? []),
    url: str,
    img_url: str,
    seasons: z
      .array(
        z.object({
          season_number: num,
          episodes: z
            .array(ApiEpisode)
            .nullish()
            .transform((v) => v ?? []),
        }),
      )
      .nullish()
      .transform((v) => v ?? []),
  }),
});
export type ApiFeature = z.infer<typeof ApiFeature>;

export const ApiDownload = z.object({
  link: z.string(),
  file_name: str,
  requests: num,
  remaining: num,
  message: str,
  reset_time: str,
  reset_time_utc: str,
});
export type ApiDownload = z.infer<typeof ApiDownload>;

export const ApiLogin = z.object({
  token: z.string(),
  base_url: str,
  user: z
    .object({
      allowed_downloads: num,
      level: str,
      user_id: num,
      vip: bool,
    })
    .loose()
    .nullish(),
});
export type ApiLogin = z.infer<typeof ApiLogin>;

export const ApiUserInfo = z.object({
  data: z
    .object({
      allowed_downloads: num,
      allowed_translations: num,
      level: str,
      user_id: num,
      ext_installed: bool,
      vip: bool,
      downloads_count: num,
      remaining_downloads: num,
    })
    .loose(),
});

export const ApiLanguages = z.object({
  data: z.array(z.object({ language_code: z.string(), language_name: z.string() })),
});

export const ApiFormats = z.object({
  data: z.object({ output_formats: z.array(z.string()) }),
});

/** Parse each element, keeping the ones that fit and counting the rest. */
export function parseEach<T>(schema: z.ZodType<T>, items: unknown[]): { items: T[]; skipped: number } {
  const out: T[] = [];
  let skipped = 0;
  for (const item of items) {
    const r = schema.safeParse(item);
    if (r.success) out.push(r.data);
    else skipped++;
  }
  return { items: out, skipped };
}
