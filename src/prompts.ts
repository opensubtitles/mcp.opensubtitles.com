import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

function user(text: string) {
  return { messages: [{ role: "user" as const, content: { type: "text" as const, text } }] };
}

export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "find_subtitles_for_file",
    {
      title: "Find subtitles for a video file",
      description: "Find the best-matching subtitle for a video filename in a language",
      argsSchema: z.object({
        filename: z.string().describe("Video filename, e.g. Show.S01E02.1080p.WEB-GRP.mkv"),
        language: z.string().describe("Language code, e.g. en or pt-BR"),
      }),
    },
    ({ filename, language }) =>
      user(
        `Find ${language} subtitles for the video file "${filename}".\n` +
          `1. Call search_subtitles with {"filename": "${filename}", "languages": ["${language}"]}.\n` +
          `2. Pick the result whose release name best matches the file (same group/source/resolution); prefer moviehash_match, human translations and high download counts.\n` +
          `3. Show me the top 3 with file_id, release and downloads, and ask before downloading (each download uses quota).`,
      ),
  );

  server.registerPrompt(
    "find_subtitles_for_title",
    {
      title: "Find subtitles for a movie or episode",
      description: "Find subtitles by title, optionally year and season/episode, in a language",
      argsSchema: z.object({
        title: z.string(),
        language: z.string().describe("Language code, e.g. en"),
        year: z.string().optional(),
        season: z.string().optional(),
        episode: z.string().optional(),
      }),
    },
    ({ title, language, year, season, episode }) => {
      const args: Record<string, unknown> = { query: title, languages: [language] };
      if (year) args.year = Number(year);
      if (season) args.season_number = Number(season);
      if (episode) args.episode_number = Number(episode);
      return user(
        `Find ${language} subtitles for ${title}${year ? ` (${year})` : ""}${season ? ` season ${season}` : ""}${episode ? ` episode ${episode}` : ""}.\n` +
          `Call search_subtitles with ${JSON.stringify(args)}. If the title is ambiguous or nothing is found, use search_features to find the right feature_id and search again with it. ` +
          `List the best 5 results (file_id, release, downloads, flags) and ask which one to download.`,
      );
    },
  );

  server.registerPrompt(
    "sync_or_convert",
    {
      title: "Re-time or convert a subtitle",
      description: "Download a subtitle with an FPS conversion, a time shift, or a format conversion",
      argsSchema: z.object({
        file_id: z.string(),
        in_fps: z.string().optional().describe("FPS the subtitle was made for, e.g. 25"),
        out_fps: z.string().optional().describe("FPS of the video, e.g. 23.976"),
        timeshift: z.string().optional().describe("Seconds to shift, e.g. -1.5"),
        sub_format: z.string().optional().describe("srt, webvtt, sub, mpl, dfxp or txt"),
      }),
    },
    ({ file_id, in_fps, out_fps, timeshift, sub_format }) => {
      const args: Record<string, unknown> = { file_id: Number(file_id) };
      if (in_fps && out_fps) {
        args.in_fps = Number(in_fps);
        args.out_fps = Number(out_fps);
      }
      if (timeshift) args.timeshift = Number(timeshift);
      if (sub_format) args.sub_format = sub_format;
      return user(
        `Call download_subtitle with ${JSON.stringify(args)} (this uses one download from my quota). ` +
          `If the subtitle drifts progressively it's an FPS mismatch (in_fps/out_fps); if it's off by a constant amount use timeshift. Report the remaining quota.`,
      );
    },
  );
}
