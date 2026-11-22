import { createHash } from "node:crypto";

/**
 * Structured JSON-lines logger (OpenObserve-friendly), always on stderr so that
 * stdout stays clean for the stdio transport.
 *
 * Rules: never log tool arguments, request headers, tokens or passwords. Callers
 * pass only the fields below. As a second line of defence every secret the
 * process learns (API keys, tokens, passwords) is registered here and scrubbed
 * from any string before it is written.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogFields {
  event: string;
  tool?: string;
  client?: string;
  status?: "ok" | "error" | "rejected";
  duration_ms?: number;
  http_status?: number;
  method?: string;
  path?: string;
  era?: string;
  count?: number;
  reason?: string;
  [key: string]: string | number | boolean | undefined;
}

const LEVELS: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const secrets = new Set<string>();
let sink: (line: string) => void = (line) => process.stderr.write(line + "\n");
let minLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) in LEVELS ? (process.env.LOG_LEVEL as LogLevel) : "info";

/** Register a value that must never appear in a log line. */
export function registerSecret(value: string | undefined): void {
  if (value && value.length >= 4) secrets.add(value);
}

export function scrub(text: string): string {
  let out = text;
  for (const s of secrets) {
    if (out.includes(s)) out = out.split(s).join("[redacted]");
  }
  return out;
}

export function setLogSink(fn: (line: string) => void): void {
  sink = fn;
}

export function setLogLevel(level: LogLevel): void {
  minLevel = level;
}

export function log(level: LogLevel, msg: string, fields: LogFields): void {
  if (LEVELS[level] < LEVELS[minLevel]) return;
  const record = { ts: new Date().toISOString(), level, service: "opensubtitles-mcp", msg, ...fields };
  sink(scrub(JSON.stringify(record)));
}

/**
 * Anonymised, stable client id: a salted hash of whatever identifies the caller
 * (their API key, login, or IP address). Never reversible to the input.
 */
export function clientId(salt: string, identity: string): string {
  return createHash("sha256").update(salt).update("\0").update(identity).digest("hex").slice(0, 12);
}

/** Running count of downloads per anonymised client, logged as an audit event. */
const downloadCounts = new Map<string, number>();
export function auditDownload(client: string, fileId: number, ok: boolean): void {
  const count = (downloadCounts.get(client) ?? 0) + (ok ? 1 : 0);
  downloadCounts.set(client, count);
  log("info", "download", { event: "audit.download", client, status: ok ? "ok" : "error", count, file_id: fileId });
}
