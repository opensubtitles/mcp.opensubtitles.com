# CLAUDE.md

OpenSubtitles MCP server v2 (TypeScript, `@modelcontextprotocol/server` SDK v2, MCP 2026-07-28 + 2025-era stateless).

- `src/index.ts` entry (stdio default, `--http`); `src/http.ts` node:http server (modern → SDK `createMcpHandler`, legacy → per-request JSON transport); `src/server.ts` builds one `McpServer` per request/connection.
- `src/api/` REST client (fetch, timeouts, error mapping, login cache) and lenient zod schemas (API fields are often null).
- `src/tools/*` one file per tool; wrap handlers with `instrument()` (logs, isError mapping, cancellation).
- Rules: no credential fields in tool schemas; never log args/headers/tokens; `calculate_file_hash` stdio only; synthetic data only in tests.
- `npm test` (build + vitest, tool suite runs in both protocol eras), `npm run smoke:inspector`.
- Version lives in package.json, `src/config.ts` VERSION and server.json; keep them equal.
