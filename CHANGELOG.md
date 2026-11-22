# Changelog

All notable changes to the OpenSubtitles MCP Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.3] - 2026-11-22

### Changed
- Every tool argument has a description (12 were missing), and a test keeps it that way.
- Icon: a 512x512 PNG (`icon.png` in the repo) in `server.json` (`icons`) and in the server's
  `serverInfo`, replacing the favicon.

## [2.0.2] - 2026-11-22

### Changed
- `/message` and `/json` (deprecated 1.x endpoints) now announce their removal date, 2027-03-01,
  with a `Sunset` header (RFC 8594) next to `Deprecation` and `Link: rel="successor-version"`.

## [2.0.1] - 2026-11-22

### Changed
- A login is now the recommended way to enable downloads, and an own API key is optional: the
  download hint, README, `llms.txt`, the limits guide, `--help` and `server.json` (which now lists
  the `X-OpenSubtitles-Username`/`-Password` headers) say so. Behaviour is unchanged: login headers
  alone already worked, logging in with the server's app key and downloading on the user's account.

## [2.0.0] - 2026-11-22

A rewrite on the MCP TypeScript SDK v2. **Breaking**: see the migration notes below.

### Protocol
- Implements MCP **2026-07-28** (stateless: no sessions, `server/discover`, per-request `_meta`,
  `Mcp-Method`/`Mcp-Name` header validation, `resultType`, cache hints) and serves 2025-era clients
  (`initialize` handshake, 2025-11-25 back to 2024-11-05) statelessly with plain JSON responses.
  Any replica can serve any request.
- SDK transports only: no hand-written HTTP framing, no User-Agent switches.
- stdio and Streamable HTTP from one binary (`npx -y @opensubtitles/mcp-server [--http]`).

### Tools
- `search_subtitles` rebuilt: structured results with `file_id`s, paging (`page`, `per_page` ≤ 100,
  `total_count`, `total_pages`), real booleans and enums, `languages` as an array, `filename`
  parsing with guessit-js, exact-title resolution ("The Matrix" no longer returns *The Matrix
  Revisited* first) and release-name ranking.
- New: `get_subtitle_details`, `search_features`, `list_languages`, `guess_filename`, `get_user_info`.
- `download_subtitle`: format/FPS/time-shift conversion, text or link delivery, remaining quota.
- `calculate_file_hash`: stdio only.
- Every tool has `title`, `outputSchema` + `structuredContent`, and `annotations` (including
  `annotations.title`). Errors the
  agent can act on are `isError` results with a concrete suggestion; REST 401/403/406/429 map to
  clear messages with reset times.
- Resources: search guide, limits and quota rules, languages. Prompts: `find_subtitles_for_file`,
  `find_subtitles_for_title`, `sync_or_convert`.

### Distribution
- `plugin.json` and `mcp.json` at the repo root (Agent Plugins 1.0.0), so plugin directories
  such as cursor.directory detect the server from the GitHub repo: local stdio
  `npx -y @opensubtitles/mcp-server` and the hosted `https://mcp.opensubtitles.com/mcp`.
  Not shipped in the npm package.

### Security
- Credentials are configuration only: env in stdio; `Api-Key`, `X-OpenSubtitles-Token`,
  `X-OpenSubtitles-Username`/`-Password` headers over HTTP. No tool takes a credential.
- Logs never contain arguments, headers, tokens or passwords (enforced by tests); client ids are
  salted hashes.
- Origin validation (403), strict CORS, request body limit, per-client rate limit, REST timeouts,
  credentials sent only to opensubtitles.com hosts.

### Removed
- `/debug`, `/proxy`, the header echo on `GET /mcp`, `mcp-opensubtitles-remote`/`-http` binaries,
  committed `node_modules/` and `dist/`, the n8n/postgres/qdrant compose file, `deploy.sh`.

### Migration from 1.x
1. Remove `username`, `password`, `user_api_key` from tool calls; configure credentials in the
   client instead (README, "Credentials").
2. Point clients at `https://mcp.opensubtitles.com/mcp`. `/message` and `/json` keep working and
   answer with a `Deprecation` header; they will be removed on 2027-03-01.
3. `languages: "en,de"` becomes `["en","de"]`; `machine_translated`/`ai_translated`/
   `trusted_sources` become `include_machine_translated`/`include_ai_translated`/`trusted_only`
   booleans; `parent_imdb_id` becomes `imdb_id` with `season_number`/`episode_number`.
4. Read results from `structuredContent` (the text block is a short summary).
5. `Authorization: Bearer` from 1.x configs still works; prefer `X-OpenSubtitles-Token`.

## [1.5.1] - 2026-11-22

Hotfix for the hosted server while 2.0.0 is prepared.

### Fixed
- **Streamable HTTP framing** (from PR #3 by @iOSDevSK): responses are one plain JSON
  document for every client. The hand-written chunk markers (`dc6\r\n{...`) and the
  User-Agent switch are gone; `/mcp` is served next to `/message`.
- `search_subtitles` no longer fails with "Expected number, received null" when the API
  returns `null` for `feature_details.year` and similar fields (#4). Records are
  validated one by one, so one malformed record no longer hides the others.
- `initialize` answers with a protocol version the server supports instead of echoing
  any requested value.
- Tool errors carry `isError: true`.
- `OPENSUBTITLES_API_KEY` (or `OPENSUBTITLES_USER_KEY`) and `OPENSUBTITLES_API_BASE`
  are read from the environment; they were documented but ignored (also reported in PR #3).

### Security
- Tool arguments, request parameters, API request headers (`Api-Key`, Bearer token),
  usernames and raw login errors are no longer written to the log.
- `calculate_file_hash` is not offered over HTTP: there it read files on the server's
  own disk. It remains available in stdio mode.
- `GET /debug` is removed, and `GET /mcp` no longer echoes the caller's request headers.

### Kept
- `/json` stays as an alias of `/mcp` for clients (e.g. claude.ai custom connectors)
  that adopted it as the 1.5.0 workaround. It will be removed in 2.x with notice.

## [1.5.0] - 2025-09-28

### Fixed
- **CRITICAL**: Fixed double HTTP response sending causing JSON parsing errors in n8n
- Added `res.headersSent` guard to prevent duplicate response transmission
- Fixed "Unexpected non-whitespace character after JSON" error in n8n MCP client
- Enhanced User-Agent detection for n8n clients (node, n8n, langchain, mcpClientTool)

### Added
- Debug endpoint `/debug` for testing JSON response format
- Force JSON endpoint `/json` for guaranteed plain JSON responses
- Enhanced logging for response format debugging
- Comprehensive n8n client compatibility detection

### Technical Details
- Double response issue: Server was sending plain JSON response + chunked response
- Solution: Added headersSent check to prevent second response
- All n8n clients now receive proper plain JSON without parsing errors

## [1.4.8_n8n_json_fix] - 2025-09-28

### Added
- Enhanced n8n client detection patterns
- Force JSON endpoint for debugging
- Improved User-Agent pattern matching

## [1.4.7] - 2025-09-28

### Added
- Documentation updates for n8n integration
- Comprehensive CHANGELOG documentation

## [1.4.6_n8n_plain_json] - 2025-09-28

### Added
- Native n8n MCP client compatibility with adaptive response format
- Plain JSON responses for n8n clients to fix chunked encoding parsing issues
- Tools included directly in initialize response for n8n compatibility
- Enhanced debug logging for MCP client detection and response formatting
- User-Agent based client detection (n8n uses "node" User-Agent)

### Fixed
- **CRITICAL**: Fixed empty tools list in n8n MCP client integration
- n8n now receives all 3 tools (search_subtitles, download_subtitle, calculate_file_hash) properly
- Chunked HTTP response encoding issues with n8n client parsing
- Tools now available in both `capabilities.tools.available` and `result.tools` arrays

### Changed
- Adaptive HTTP response format: plain JSON for n8n, chunked for other clients
- Enhanced initialize response with tools for immediate availability
- Updated capabilities structure to include tool names in `available` array
- Improved error handling and client compatibility detection

### Technical Details
- Added `streamResponse()` function with client detection
- n8n clients (User-Agent: "node") receive `res.json()` response
- Other clients continue to receive chunked transfer encoding
- Tools are included in initialize response to avoid separate tools/list calls

## [1.4.5_n8n_debug] - 2025-09-28

### Added
- Enhanced debugging for n8n MCP client issues
- Comprehensive request/response logging
- Tools included in initialize response for compatibility testing

### Fixed
- Debugging empty tools response to n8n clients
- Enhanced logging to track tool discovery process

## [1.4.4] - 2025-09-27

### Added
- Docker development environment with docker-compose.yml
- Full n8n integration support with Qdrant and PostgreSQL
- Docker network connectivity for container communication
- Volume mapping for live development workflow
- Enhanced HTTP endpoints for debugging and testing

### Fixed
- ES module entry point reliability issues
- Keep-alive mechanisms for stable MCP connections
- Process exit prevention in stdio mode

### Changed
- Improved TypeScript build process
- Updated to latest MCP SDK patterns
- Enhanced server stability and reliability

## [1.4.3] - 2025-09-26

### Added
- Comprehensive error handling and user-friendly messages
- Enhanced file hash calculation with proper error reporting
- Improved API client with better Kong gateway integration

### Fixed
- Rate limiting error messages now suggest getting API key
- File path validation and error reporting
- Network connectivity error handling

## [1.4.2] - 2025-09-25

### Added
- HTTP server mode for web access and n8n integration
- Express.js and CORS support for browser compatibility
- Health check endpoint at /health
- Web interface endpoint at /web

### Changed
- Dual mode operation: stdio for Claude Desktop, HTTP for web access
- Enhanced build process with post-processing

## [1.4.1] - 2025-09-24

### Fixed
- Search parameters validation and type safety
- Download tool parameter handling
- File hash calculation edge cases

### Added
- Comprehensive input validation
- Better error messages for common user mistakes

## [1.4.0] - 2025-09-23

### Added
- Complete TypeScript implementation
- All three core tools (search, download, hash)
- Full MCP protocol compliance
- Kong gateway integration for API management

### Changed
- Migrated from JavaScript to TypeScript
- Updated to latest MCP SDK
- Improved code organization and maintainability

## [1.3.0] - 2025-09-20

### Added
- Claude Desktop integration support
- Stdio transport for MCP communication
- Keep-alive mechanisms for stable connections

### Fixed
- Process lifecycle management
- Signal handling for graceful shutdown

## [1.2.0] - 2025-09-18

### Added
- OpenSubtitles file hash calculation
- Support for exact movie file matching
- Enhanced search capabilities with all API parameters

### Changed
- Improved search algorithm accuracy
- Better parameter validation

## [1.1.0] - 2025-09-15

### Added
- Subtitle download functionality
- Multiple format support (SRT, ASS, VTT)
- API key authentication for downloads

### Fixed
- Rate limiting respect
- Error handling improvements

## [1.0.0] - 2025-09-10

### Added
- Initial release
- Basic subtitle search functionality
- MCP protocol implementation
- Kong gateway integration
- Freemium model support

### Features
- Search subtitles by title, IMDB ID, TMDB ID
- Language filtering
- Year and episode/season filtering
- Rate limiting via Kong gateway