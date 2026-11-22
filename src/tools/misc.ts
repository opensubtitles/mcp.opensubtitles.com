import { homedir } from "node:os";
import { basename, isAbsolute, resolve } from "node:path";
import * as z from "zod/v4";
import type { OpenSubtitlesClient } from "../api/client.js";
import { guessFilename, GuessOut } from "../guess.js";
import { calculateOpenSubtitlesHash } from "../hash.js";
import { instrument, ToolError, type Register } from "./common.js";

/* ------------------------------------------------------------ languages */

export const Language = z.object({ code: z.string(), name: z.string() });
const LANG_TTL = 24 * 3600 * 1000;
let langCache: { at: number; data: z.infer<typeof Language>[] } | null = null;

export async function getLanguages(api: OpenSubtitlesClient): Promise<z.infer<typeof Language>[]> {
  if (langCache && Date.now() - langCache.at < LANG_TTL) return langCache.data;
  const data = (await api.languages()).map((l) => ({ code: l.language_code, name: l.language_name }));
  langCache = { at: Date.now(), data };
  return data;
}
export function clearLanguageCache(): void {
  langCache = null;
}

export const registerListLanguages: Register = (server, deps) => {
  server.registerTool(
    "list_languages",
    {
      title: "List subtitle languages",
      description:
        "The subtitle language codes OpenSubtitles supports (e.g. en, pt-BR, zh-CN) with their names. Use the codes in search_subtitles.languages. Also available as the opensubtitles://languages resource.",
      inputSchema: z.object({}).strict(),
      outputSchema: z.object({ languages: z.array(Language) }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    instrument("list_languages", deps, async (_args, deps) => {
      const languages = await getLanguages(deps.api);
      return {
        content: [{ type: "text", text: `${languages.length} languages: ${languages.map((l) => `${l.code} ${l.name}`).join(", ")}` }],
        structuredContent: { languages },
      };
    }),
  );
};

/* ------------------------------------------------------------ guess_filename */

export const registerGuessFilename: Register = (server, deps) => {
  server.registerTool(
    "guess_filename",
    {
      title: "Parse a video filename",
      description:
        "Parse a movie or episode filename with guessit-js (title, year, season, episode, release group, resolution, source, codec). Offline and free; use it to build a precise search_subtitles call, or pass the filename to search_subtitles directly.",
      inputSchema: z.object({
        filename: z.string().trim().min(1).max(500).describe("e.g. \"The.Matrix.1999.1080p.BluRay.x264-GROUP.mkv\""),
      }),
      outputSchema: GuessOut,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    instrument("guess_filename", deps, async ({ filename }, deps) => {
      const g = await guessFilename(filename);
      const ep = g.season != null || g.episode != null ? ` S${g.season ?? "?"}E${g.episode ?? "?"}` : "";
      return {
        content: [
          {
            type: "text",
            text: `${g.type ?? "unknown type"}: ${g.title ?? "?"}${g.year ? ` (${g.year})` : ""}${ep}${g.release_group ? `, group ${g.release_group}` : ""}${g.screen_size ? `, ${g.screen_size}` : ""}${g.source ? `, ${g.source}` : ""}`,
          },
        ],
        structuredContent: g,
      };
    }),
  );
};

/* ------------------------------------------------------------ calculate_file_hash (stdio only) */

export const registerCalculateFileHash: Register = (server, deps) => {
  if (deps.mode !== "stdio") return; // Over HTTP a path would point at the server's own disk.
  server.registerTool(
    "calculate_file_hash",
    {
      title: "Hash a local video file",
      description:
        "Compute the OpenSubtitles hash (moviehash) and byte size of a video file on this computer, for exact-file matching in search_subtitles. Reads only the first and last 64 KiB. Local (stdio) mode only.",
      inputSchema: z.object({
        file_path: z.string().trim().min(1).max(4096).describe("Absolute path, or relative to the server's working directory; ~ is expanded"),
      }),
      outputSchema: z.object({ moviehash: z.string(), moviebytesize: z.number(), file_name: z.string() }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    instrument("calculate_file_hash", deps, async ({ file_path }, deps) => {
      const p = file_path.startsWith("~/") ? resolve(homedir(), file_path.slice(2)) : isAbsolute(file_path) ? file_path : resolve(file_path);
      let h;
      try {
        h = await calculateOpenSubtitlesHash(p);
      } catch (err) {
        const code = (err as NodeJS.ErrnoException).code;
        const why = code === "ENOENT" ? "file not found" : code === "EACCES" ? "permission denied" : code === "EISDIR" ? "it is a directory" : (err as Error).message;
        throw new ToolError(`Cannot hash ${p}: ${why}.`);
      }
      const out = { ...h, file_name: basename(p) };
      return {
        content: [{ type: "text", text: `moviehash ${h.moviehash}, ${h.moviebytesize} bytes. Next: search_subtitles {"moviehash": "${h.moviehash}", "filename": "${out.file_name}"}.` }],
        structuredContent: out,
      };
    }),
  );
};

/* ------------------------------------------------------------ get_user_info */

export const UserInfoOut = z.object({
  user_id: z.number().nullable(),
  level: z.string().nullable(),
  vip: z.boolean(),
  allowed_downloads: z.number().nullable(),
  downloads_count: z.number().nullable(),
  remaining_downloads: z.number().nullable(),
  allowed_translations: z.number().nullable(),
});

export const registerGetUserInfo: Register = (server, deps) => {
  server.registerTool(
    "get_user_info",
    {
      title: "Account and quota",
      description:
        "The logged-in OpenSubtitles user's level, VIP status, daily download allowance and downloads remaining, so you can plan downloads. Needs a configured login; does not use quota.",
      inputSchema: z.object({}).strict(),
      outputSchema: UserInfoOut,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    instrument("get_user_info", deps, async (_args, deps) => {
      const u = await deps.api.userInfo();
      if (!u) throw new ToolError("No user information returned.");
      const out = {
        user_id: u.user_id,
        level: u.level,
        vip: u.vip,
        allowed_downloads: u.allowed_downloads,
        downloads_count: u.downloads_count,
        remaining_downloads: u.remaining_downloads,
        allowed_translations: u.allowed_translations,
      };
      return {
        content: [
          {
            type: "text",
            text: `${u.level ?? "User"}${u.vip ? " (VIP)" : ""}: ${u.remaining_downloads ?? "?"} of ${u.allowed_downloads ?? "?"} downloads left today.`,
          },
        ],
        structuredContent: out,
      };
    }),
  );
};
