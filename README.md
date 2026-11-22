# OpenSubtitles MCP Server

The official [Model Context Protocol](https://modelcontextprotocol.io) server for [OpenSubtitles.com](https://www.opensubtitles.com). It lets AI agents find, inspect and download subtitles for movies and TV episodes in 100+ languages, and returns structured results an agent can reason over.

- **Remote:** `https://mcp.opensubtitles.com/mcp` (Streamable HTTP)
- **Local:** `npx -y @opensubtitles/mcp-server` (stdio)
- **Protocol:** MCP **2026-07-28**, plus 2025-era clients (2025-11-25, 2025-06-18, 2025-03-26) served statelessly
- **Registry:** `com.opensubtitles/mcp-server`

## Quick start

### Claude Code

```bash
# Remote, search only (no account needed)
claude mcp add --transport http opensubtitles https://mcp.opensubtitles.com/mcp

# Remote, with downloads on your account's quota (free account at opensubtitles.com)
claude mcp add --transport http opensubtitles https://mcp.opensubtitles.com/mcp \
  --header "X-OpenSubtitles-Username: YOUR_USERNAME" \
  --header "X-OpenSubtitles-Password: YOUR_PASSWORD"

# Local (stdio): can also hash files on your disk
claude mcp add opensubtitles \
  -e OPENSUBTITLES_USERNAME=YOUR_USERNAME -e OPENSUBTITLES_PASSWORD=YOUR_PASSWORD \
  -- npx -y @opensubtitles/mcp-server
```

Add `-s user` to make it available in every project. An own API key is optional (`--header "Api-Key: …"` / `-e OPENSUBTITLES_API_KEY=…`, free at <https://www.opensubtitles.com/consumers>).

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "npx",
      "args": ["-y", "@opensubtitles/mcp-server"],
      "env": {
        "OPENSUBTITLES_USERNAME": "YOUR_USERNAME",
        "OPENSUBTITLES_PASSWORD": "YOUR_PASSWORD"
      }
    }
  }
}
```

### Cursor (`~/.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "opensubtitles": {
      "url": "https://mcp.opensubtitles.com/mcp",
      "headers": {
        "X-OpenSubtitles-Username": "YOUR_USERNAME",
        "X-OpenSubtitles-Password": "YOUR_PASSWORD"
      }
    }
  }
}
```

### VS Code (`.vscode/mcp.json`)

```json
{
  "servers": {
    "opensubtitles": {
      "type": "http",
      "url": "https://mcp.opensubtitles.com/mcp",
      "headers": {
        "X-OpenSubtitles-Username": "${input:os-user}",
        "X-OpenSubtitles-Password": "${input:os-pass}"
      }
    }
  },
  "inputs": [
    { "id": "os-user", "type": "promptString", "description": "OpenSubtitles username" },
    { "id": "os-pass", "type": "promptString", "description": "OpenSubtitles password", "password": true }
  ]
}
```

### n8n

In the **MCP Client Tool** node, set *Endpoint* to `https://mcp.opensubtitles.com/mcp` and *Server Transport* to **HTTP Streamable**. For downloads, set *Authentication* to **Custom Auth** with the headers `X-OpenSubtitles-Username` and `X-OpenSubtitles-Password` (or **Header Auth** with `X-OpenSubtitles-Token`). `/message` still works but is deprecated (see [Migration](#migrating-from-1x)).

## Credentials

Credentials are **configuration, never tool arguments**: they never pass through the model or the chat transcript, and the server never logs them.

| | stdio (environment) | Remote (headers set in the client) |
|---|---|---|
| Login (recommended) | `OPENSUBTITLES_USERNAME` + `OPENSUBTITLES_PASSWORD` (logs in once, caches and refreshes the token) | `X-OpenSubtitles-Username` + `X-OpenSubtitles-Password`, or `X-OpenSubtitles-Token: <token from /login>` |
| API key (optional) | `OPENSUBTITLES_API_KEY` | `Api-Key: <key>` |

- **Search** works anonymously (remote: the server's key, rate-limited per client).
- **Downloads** use *your* account's quota: set your login (a free account is enough; VIP gets more). Your own API key is optional; without one the server's app key is used. Remote downloads with only an `Api-Key` and no login also work, but then count as anonymous.
- `Authorization: Bearer …` from 1.x configs is still accepted as a fallback. `Authorization` is reserved for MCP OAuth, so use the `X-OpenSubtitles-*` headers.

## Tools

| Tool | What it does | Quota |
|---|---|---|
| `search_subtitles` | Find subtitles by `filename` (parsed with [guessit-js](https://www.npmjs.com/package/guessit-js)), `query`, `imdb_id`/`tmdb_id`/`feature_id` (+ `season_number`/`episode_number`) or `moviehash`. Filters: `languages[]`, `hearing_impaired`, `foreign_parts_only`, `include_ai_translated`, `include_machine_translated`, `trusted_only`; `order_by`, `page`, `per_page` ≤ 100. Exact title/episode and release-name matches rank first. | free |
| `get_subtitle_details` | One subtitle's full metadata, files, uploader comments and related subtitles. | free |
| `download_subtitle` | Subtitle text (or a temporary link) by `file_id`; optional `sub_format`, `in_fps`/`out_fps`, `timeshift`. Reports the remaining quota. | **1 download** |
| `search_features` | Movies, shows and episodes: ids, year, seasons/episodes, subtitle counts per language. | free |
| `list_languages` | Supported language codes and names. | free |
| `guess_filename` | Parse a video filename (title, year, season, episode, release group…). Offline. | free |
| `calculate_file_hash` | OpenSubtitles `moviehash` + size of a local file. **stdio only.** | free |
| `get_user_info` | Your level, VIP status and remaining downloads (needs a login). | free |

Every tool has a `title`, an `inputSchema` with real types and limits, an `outputSchema` with `structuredContent` plus a short text summary, and `annotations`. Errors the agent can fix come back as `isError` results with a suggestion (for example "No subtitles found; try: drop or widen languages (now de), drop year").

**Resources:** `opensubtitles://guide/intelligent-search`, `opensubtitles://guide/limits`, `opensubtitles://languages`.
**Prompts:** `find_subtitles_for_file`, `find_subtitles_for_title`, `sync_or_convert`.

## Migrating from 1.x

2.0.0 is a breaking release. The changes for existing users:

1. **Credentials moved out of tool arguments.** `username`, `password` and `user_api_key` arguments are gone. Configure them once in the client (see [Credentials](#credentials)).
2. **Endpoint:** use `https://mcp.opensubtitles.com/mcp`. `/message` and `/json` still work and answer with `Deprecation` and `Sunset` headers; they will be **removed on 2027-03-01**.
3. **Tool inputs:** `languages` is an array (`["en","pt-BR"]`); `hearing_impaired`/`foreign_parts_only` are `include|exclude|only`; `machine_translated`/`ai_translated`/`trusted_sources` became booleans `include_machine_translated`, `include_ai_translated`, `trusted_only`; `parent_imdb_id` is now `imdb_id` with `season_number`/`episode_number`.
4. **Results** are structured (`structuredContent`) with `file_id`s, paging (`page`, `per_page`, `total_count`, `total_pages`) and flags, not a Markdown top-5 list.
5. **`calculate_file_hash`** exists only in local (stdio) mode. On the remote server, hash locally and pass `moviehash`.
6. **Removed:** `/debug`, `/proxy`, the `mcp-opensubtitles-remote`/`-http` binaries.

## Run your own

```bash
npx -y @opensubtitles/mcp-server --http          # 127.0.0.1:1620, endpoint /mcp
docker build -t opensubtitles-mcp . && docker run -p 1620:1620 -e OPENSUBTITLES_API_KEY=… opensubtitles-mcp
```

| Variable | Default | Meaning |
|---|---|---|
| `PORT` / `HOST` | `1620` / `127.0.0.1` (Docker image: `0.0.0.0`) | Listen address |
| `OPENSUBTITLES_API_KEY` | built-in app key | stdio: your key. http: server key for anonymous search |
| `OPENSUBTITLES_API_BASE` | `https://api.opensubtitles.com/api/v1` | REST API base |
| `ALLOWED_ORIGINS` | claude.ai, claude.com, mcp.opensubtitles.com | Browser `Origin`s allowed (others get 403). `*` allows all |
| `ALLOWED_HOSTS` | (any) | Restrict the `Host` header |
| `TRUST_PROXY` | off | Read the client IP from `CF-Connecting-IP` / `X-Forwarded-For` |
| `RATE_LIMIT_PER_MINUTE` | `120` | Per client (API key, login or IP), per replica |
| `MAX_BODY_BYTES` | `1048576` | Request body limit |
| `LOG_LEVEL`, `LOG_SALT` | `info`, … | JSON logs on stderr; client ids are salted hashes |

Endpoints: `POST /mcp`, `GET /health` → `{"status":"ok","version":"2.0.0"}`, `GET /llms.txt`, `GET /`.

Logs are JSON lines (OpenObserve-ready): tool name, duration, status, HTTP status, anonymised client id and W3C trace id. Never arguments, headers, tokens or passwords. Each download also writes an `audit.download` event with a per-client counter.

## Development

```bash
npm ci
npm test                 # build + 120+ tests (unit, both protocol eras, raw HTTP, stdio e2e, log/secret checks)
npm run smoke:inspector  # MCP Inspector CLI over stdio and HTTP
npx @modelcontextprotocol/inspector node dist/index.js
```

## Related

- [guessit-js](https://github.com/opensubtitles/guessit-js): the filename parser behind `filename` and `guess_filename`, also an MCP server (`npx -y guessit-js --mcp`, `https://guessit.opensubtitles.com/mcp`).
- [OpenSubtitles REST API](https://opensubtitles.stoplight.io/docs/opensubtitles-api)

## License

MIT
