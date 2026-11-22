import type { McpServer } from "@modelcontextprotocol/server";
import type { CallToolResult, ServerContext } from "@modelcontextprotocol/server";
import { ApiError, type OpenSubtitlesClient } from "../api/client.js";
import type { Config, Mode } from "../config.js";
import { log } from "../log.js";

export interface ToolDeps {
  mode: Mode;
  config: Config;
  api: OpenSubtitlesClient;
  /** Anonymised id of the caller, for logs and the download audit. */
  client: string;
  /** Protocol version negotiated with the client, when known. */
  protocolVersion?: () => string | undefined;
}

/** structuredContent arrived in protocol 2025-06-18; older clients only read content. */
export function withLegacyJson(result: CallToolResult, version: string | undefined): CallToolResult {
  if (result.isError || result.structuredContent === undefined || !version || version >= "2025-06-18") return result;
  return { ...result, content: [...(result.content ?? []), { type: "text", text: JSON.stringify(result.structuredContent) }] };
}

/** A tool failure the agent can act on: becomes an `isError` result, not a protocol error. */
export class ToolError extends Error {}

export function errorResult(message: string): CallToolResult {
  return { isError: true, content: [{ type: "text", text: message }] };
}

/**
 * Wrap a tool handler: time it, log name/duration/status/client (never the
 * arguments), and turn API and tool errors into `isError` results.
 */
export function instrument<A>(
  name: string,
  outer: ToolDeps,
  fn: (args: A, deps: ToolDeps) => Promise<CallToolResult>,
): (args: A, ctx: ServerContext) => Promise<CallToolResult> {
  return async (args: A, ctx: ServerContext) => {
    const started = Date.now();
    const deps: ToolDeps = { ...outer, api: outer.api.withSignal(ctx?.mcpReq?.signal) };
    const trace = traceId(ctx);
    try {
      const result = withLegacyJson(await fn(args, deps), deps.protocolVersion?.());
      log("info", "tool call", {
        event: "tool.call",
        tool: name,
        trace_id: trace,
        client: deps.client,
        status: result.isError ? "error" : "ok",
        duration_ms: Date.now() - started,
      });
      return result;
    } catch (err) {
      const known = err instanceof ApiError || err instanceof ToolError;
      log(known ? "info" : "error", "tool call", {
        event: "tool.call",
        tool: name,
        trace_id: trace,
        client: deps.client,
        status: "error",
        duration_ms: Date.now() - started,
        http_status: err instanceof ApiError ? err.status : undefined,
        reason: known ? undefined : err instanceof Error ? err.name : "unknown",
      });
      if (known) return errorResult((err as Error).message);
      return errorResult(`Unexpected error in ${name}. Try again; if it keeps failing, report it at https://github.com/opensubtitles/mcp.opensubtitles.com/issues.`);
    }
  };
}

/** W3C trace id from the request's `_meta.traceparent` (SEP-414), for log correlation. */
export function traceId(ctx: ServerContext | undefined): string | undefined {
  const tp = (ctx?.mcpReq?._meta as Record<string, unknown> | undefined)?.traceparent;
  const m = typeof tp === "string" ? tp.match(/^[0-9a-f]{2}-([0-9a-f]{32})-[0-9a-f]{16}-[0-9a-f]{2}$/) : null;
  return m?.[1];
}

export type Register = (server: McpServer, deps: ToolDeps) => void;

/** Languages arg: accepts ["en","pt-BR"] (preferred) or "en,pt-br". Returns API form. */
export function languagesParam(langs: string[] | undefined): string | undefined {
  if (!langs || langs.length === 0) return undefined;
  return [...new Set(langs.map((l) => l.trim().toLowerCase()).filter(Boolean))].sort().join(",");
}

export function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
