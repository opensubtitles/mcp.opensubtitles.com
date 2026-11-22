import type { McpServer } from "@modelcontextprotocol/server";
import type { ToolDeps } from "./tools/common.js";
import { getLanguages } from "./tools/misc.js";

export const SEARCH_GUIDE = `# OpenSubtitles search guide (for AI agents)

## Pick the most specific input you have
| You have | Call |
|---|---|
| A video filename | \`search_subtitles {"filename": "Show.S02E05.1080p.WEB-GRP.mkv", "languages": ["en"]}\` — parsed with guessit-js; the release name ranks matching subtitles first |
| A local file (stdio mode) | \`calculate_file_hash\`, then \`search_subtitles {"moviehash": …, "filename": …}\` — hash matches are flagged \`moviehash_match\` |
| An IMDb/TMDB id | \`search_subtitles {"imdb_id": "tt0133093"}\`; for an episode give the **show's** id plus \`season_number\`/\`episode_number\` |
| Only a title | \`search_subtitles {"query": "The Matrix", "year": 1999}\` — resolved to the exact title first (\`exact_title\`, default true) |
| An ambiguous title, or a show's episode list | \`search_features\` first, then \`search_subtitles {"feature_id": …}\` |

## Languages
Pass \`languages\` as an array in order of preference: \`["pt-BR", "pt-PT", "en"]\`. Codes come from \`list_languages\` / \`opensubtitles://languages\`. Note \`pt-BR\`, \`pt-PT\`, \`zh-CN\`, \`zh-TW\`.

## Filters
- \`hearing_impaired\`: include (default) | exclude | only — SDH subtitles.
- \`foreign_parts_only\`: include | exclude | only — only the foreign-language lines.
- \`include_ai_translated\` (default true), \`include_machine_translated\` (default false), \`trusted_only\`.
- \`order_by\`: relevance (default), download_count, upload_date, rating, votes. \`page\`/\`per_page\` (≤ 100).

## Choosing a result
Prefer, in order: \`moviehash_match\`; a release name close to the user's file (same group, source, resolution); the right FPS; human (not AI/machine) translations; high \`download_count\`. Multi-CD releases list every part in \`files\`.

## Downloading
\`download_subtitle {"file_id": …}\` returns the text and the remaining daily quota. **Each call costs one download**; don't download to "preview". Use \`get_subtitle_details\` (free) to inspect a result. To fix sync: \`in_fps\`+\`out_fps\` (e.g. 25 → 23.976) or \`timeshift\` in seconds; \`sub_format\` converts (srt, webvtt, …).

## When nothing is found
Drop \`year\`, widen \`languages\`, set \`exact_title\` false, check the title with \`search_features\`, or try the original-language title. Recent episodes may have no year.
`;

export const LIMITS_GUIDE = `# OpenSubtitles API limits and quotas

- **Search** (search_subtitles, search_features, get_subtitle_details, list_languages) does not use download quota. The REST API allows about 5 requests per second per API key; this server also rate-limits each client.
- **Downloads** (download_subtitle) count against a daily quota that belongs to the user:
  - anonymous / API key only: a small daily allowance;
  - logged-in free account: the account's allowance (see get_user_info);
  - VIP: a much higher allowance.
  The quota resets 24 h after the first download of the period; every download result reports \`remaining\` and \`reset_time\`.
- **Errors**: 401 = login needed or wrong; 403 = invalid API key; 406 = quota used up or invalid file_id (message says which, with the reset time); 429 = too many requests, retry after the given seconds.
- **Credentials are configuration, never tool arguments.** stdio: \`OPENSUBTITLES_API_KEY\`, \`OPENSUBTITLES_USERNAME\`, \`OPENSUBTITLES_PASSWORD\` in the server's environment. Remote (https://mcp.opensubtitles.com/mcp): headers \`Api-Key\`, and \`X-OpenSubtitles-Token\` or \`X-OpenSubtitles-Username\`/\`X-OpenSubtitles-Password\`, set in the MCP client. Get a free API key at https://www.opensubtitles.com/consumers. Never ask the user to paste a password into the chat.
`;

export function registerResources(server: McpServer, deps: ToolDeps): void {
  server.registerResource(
    "search-guide",
    "opensubtitles://guide/intelligent-search",
    { title: "Subtitle search guide", description: "How to find the right subtitle quickly with these tools", mimeType: "text/markdown", cacheHint: { ttlMs: 3_600_000, cacheScope: "public" } },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: SEARCH_GUIDE }] }),
  );
  server.registerResource(
    "limits",
    "opensubtitles://guide/limits",
    { title: "Rate limits and download quota", description: "API rate limits, download quotas, error codes, and how credentials are configured", mimeType: "text/markdown", cacheHint: { ttlMs: 3_600_000, cacheScope: "public" } },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: LIMITS_GUIDE }] }),
  );
  server.registerResource(
    "languages",
    "opensubtitles://languages",
    { title: "Subtitle languages", description: "Supported subtitle language codes and names (JSON)", mimeType: "application/json", cacheHint: { ttlMs: 86_400_000, cacheScope: "public" } },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify({ languages: await getLanguages(deps.api) }) }],
    }),
  );
}
