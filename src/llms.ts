import { VERSION } from "./config.js";

export function llmsTxt(publicUrl: string): string {
  return `# OpenSubtitles MCP Server

> Official Model Context Protocol server for OpenSubtitles.com (v${VERSION}). Lets AI agents search, inspect and download subtitles for movies and TV episodes in 100+ languages, with structured results.

- Remote endpoint (Streamable HTTP, MCP 2026-07-28 and 2025-era clients): ${publicUrl}/mcp
- Local (stdio): \`npx -y @opensubtitles/mcp-server\`
- Registry name: com.opensubtitles/mcp-server
- Source and docs: https://github.com/opensubtitles/mcp.opensubtitles.com
- REST API it wraps: https://opensubtitles.stoplight.io/docs/opensubtitles-api

## Connect
- Claude Code (remote): \`claude mcp add --transport http opensubtitles ${publicUrl}/mcp --header "X-OpenSubtitles-Username: YOUR_USER" --header "X-OpenSubtitles-Password: YOUR_PASS"\`
- Claude Code (local): \`claude mcp add opensubtitles -e OPENSUBTITLES_USERNAME=YOUR_USER -e OPENSUBTITLES_PASSWORD=YOUR_PASS -- npx -y @opensubtitles/mcp-server\`
- Search works without credentials. Downloads need the user's OpenSubtitles login (free account; headers \`X-OpenSubtitles-Username\`/\`X-OpenSubtitles-Password\` or \`X-OpenSubtitles-Token\`; env \`OPENSUBTITLES_USERNAME\`/\`OPENSUBTITLES_PASSWORD\` locally). An own API key (\`Api-Key\` header / \`OPENSUBTITLES_API_KEY\`) is optional. Credentials are never tool arguments.

## Tools
- search_subtitles: find subtitles by filename, title, IMDb/TMDB/feature id + season/episode, or moviehash; filters for language, hearing impaired, AI/machine translation, trusted uploaders; paging. Returns file_ids.
- get_subtitle_details: full metadata, files and related subtitles for one result (no quota).
- download_subtitle: subtitle text or link by file_id, optional format/FPS/time-shift conversion. Uses one download from the user's daily quota.
- search_features: movies, shows and episodes with ids, seasons and subtitle counts.
- list_languages: supported language codes.
- guess_filename: parse a video filename with guessit-js (https://www.npmjs.com/package/guessit-js).
- calculate_file_hash: OpenSubtitles hash of a local file (local/stdio mode only).
- get_user_info: account level, VIP status and remaining downloads.

## Resources and prompts
- opensubtitles://guide/intelligent-search, opensubtitles://guide/limits, opensubtitles://languages
- Prompts: find_subtitles_for_file, find_subtitles_for_title, sync_or_convert

## Related
- guessit-js filename parser, also an MCP server: \`npx -y guessit-js --mcp\` or https://guessit.opensubtitles.com/mcp
`;
}
