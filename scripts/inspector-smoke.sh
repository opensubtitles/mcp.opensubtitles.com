#!/usr/bin/env bash
# Smoke test with the official MCP Inspector CLI, over stdio and Streamable HTTP.
# Offline: uses tools/list, resources/list, prompts/list and guess_filename only.
set -euo pipefail
cd "$(dirname "$0")/.."
INSPECTOR="npx -y @modelcontextprotocol/inspector@2.16.0 --cli"
PORT="${SMOKE_PORT:-38620}"
fail() { echo "FAIL: $*" >&2; exit 1; }

[ -f dist/index.js ] || npm run build

echo "== stdio"
out=$($INSPECTOR node dist/index.js --method tools/list 2>/dev/null)
grep -q '"calculate_file_hash"' <<<"$out" || fail "stdio tools/list lacks calculate_file_hash"
grep -q '"outputSchema"' <<<"$out" || fail "stdio tools/list lacks outputSchema"
out=$($INSPECTOR node dist/index.js --method tools/call --tool-name guess_filename --tool-arg 'filename=Synthetic.Show.S01E02.mkv' 2>/dev/null)
grep -q '"structuredContent"' <<<"$out" || fail "stdio guess_filename returned no structuredContent"
out=$($INSPECTOR node dist/index.js --method resources/list 2>/dev/null); grep -q 'opensubtitles://languages' <<<"$out" || fail "stdio resources/list"
out=$($INSPECTOR node dist/index.js --method prompts/list 2>/dev/null); grep -q 'find_subtitles_for_file' <<<"$out" || fail "stdio prompts/list"

echo "== http on 127.0.0.1:$PORT"
PORT=$PORT HOST=127.0.0.1 node dist/index.js --http 2>/dev/null &
pid=$!
trap 'kill $pid 2>/dev/null || true' EXIT
for _ in $(seq 1 50); do curl -fsS "http://127.0.0.1:$PORT/health" >/dev/null 2>&1 && break; sleep 0.1; done
out=$($INSPECTOR "http://127.0.0.1:$PORT/mcp" --transport http --method tools/list 2>/dev/null)
grep -q '"search_subtitles"' <<<"$out" || fail "http tools/list"
grep -q '"calculate_file_hash"' <<<"$out" && fail "http offers calculate_file_hash"
out=$($INSPECTOR "http://127.0.0.1:$PORT/mcp" --transport http --method tools/call --tool-name guess_filename --tool-arg 'filename=The.Matrix.1999.1080p.mkv' 2>/dev/null)
grep -q '"The Matrix"' <<<"$out" || fail "http guess_filename"

echo "Inspector smoke test passed (stdio + http)"
