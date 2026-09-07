/**
 * Process-wide runtime state: which transport we are serving and the credential
 * the user handed over during this session.
 *
 * The session credential lives in memory only. It is never written to disk, so a
 * restart asks for it again - the permanent place for a key is the
 * OPENSUBTITLES_API_KEY environment variable.
 */

export type TransportMode = "stdio" | "http";

let transportMode: TransportMode = "stdio";
let sessionApiKey: string | undefined;
let sessionToken: string | undefined;
let sessionLabel: string | undefined;

export function setTransportMode(mode: TransportMode): void {
  transportMode = mode;
}

export function getTransportMode(): TransportMode {
  return transportMode;
}

/** Credentials set at runtime are only meaningful for a single-user (stdio) server. */
export function supportsSessionCredentials(): boolean {
  return transportMode === "stdio";
}

export function setSessionApiKey(key: string, label?: string): void {
  sessionApiKey = key;
  sessionToken = undefined;
  sessionLabel = label;
}

export function setSessionToken(token: string, label?: string): void {
  sessionToken = token;
  sessionLabel = label;
}

export function clearSessionCredentials(): void {
  sessionApiKey = undefined;
  sessionToken = undefined;
  sessionLabel = undefined;
}

export function getSessionApiKey(): string | undefined {
  return sessionApiKey;
}

export function getSessionToken(): string | undefined {
  return sessionToken;
}

export function getSessionLabel(): string | undefined {
  return sessionLabel;
}

/** Show enough of a key to recognise it, never enough to use it. */
export function maskSecret(secret: string): string {
  if (secret.length <= 8) return "*".repeat(secret.length);
  return `${secret.slice(0, 4)}${"*".repeat(secret.length - 8)}${secret.slice(-4)}`;
}

/**
 * What to tell a client that ran into a key-related error. The useful answer
 * differs per transport: a stdio server can take the key in conversation, a
 * shared HTTP server must get it per request.
 */
export function apiKeyHint(): string {
  if (transportMode === "http") {
    return (
      "Send your own key with the request (header 'Api-Key: <key>', or 'Authorization: Bearer <token>'), " +
      "or set OPENSUBTITLES_API_KEY on the server. Free keys: https://www.opensubtitles.com/api"
    );
  }
  return (
    "Ask the user for their OpenSubtitles API key (free at https://www.opensubtitles.com/api) and pass it to " +
    "the set_api_key tool - it applies to this session, no config file needed. " +
    "For a permanent setup, set OPENSUBTITLES_API_KEY in the MCP server environment."
  );
}
