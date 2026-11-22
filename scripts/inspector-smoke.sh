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
echo "$out" | grep -q '"calculate_file_hash"' || fail "stdio tools/list lacks calculate_file_hash"
echo "$out" | grep -q '"outputSchema"' || fail "stdio tools/list lacks outputSchema"
out=$($INSPECTOR node dist/index.js --method tools/call --tool-name guess_filename --tool-arg 'filename=Synthetic.Show.S01E02.mkv' 2>/dev/null)
echo "$out" | grep -q '"structuredContent"' || fail "stdio guess_filename returned no structuredContent"
$INSPECTOR node dist/index.js --method resources/list 2>/dev/null | grep -q 'opensubtitles://languages' || fail "stdio resources/list"
$INSPECTOR node dist/index.js --method prompts/list 2>/dev/null | grep -q 'find_subtitles_for_file' || fail "stdio prompts/list"

echo "== http on 127.0.0.1:$PORT"
PORT=$PORT HOST=127.0.0.1 node dist/index.js --http 2>/dev/null &
pid=$!
trap 'kill $pid 2>/dev/null || true' EXIT
for _ in $(seq 1 50); do curl -fsS "http://127.0.0.1:$PORT/health" >/dev/null 2>&1 && break; sleep 0.1; done
out=$($INSPECTOR "http://127.0.0.1:$PORT/mcp" --transport http --method tools/list 2>/dev/null)
echo "$out" | grep -q '"search_subtitles"' || fail "http tools/list"
echo "$out" | grep -q '"calculate_file_hash"' && fail "http offers calculate_file_hash"
out=$($INSPECTOR "http://127.0.0.1:$PORT/mcp" --transport http --method tools/call --tool-name guess_filename --tool-arg 'filename=The.Matrix.1999.1080p.mkv' 2>/dev/null)
echo "$out" | grep -q '"The Matrix"' || fail "http guess_filename"

echo "Inspector smoke test passed (stdio + http)"
