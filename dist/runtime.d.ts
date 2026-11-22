/**
 * Process-wide runtime state: which transport we are serving and the credential
 * the user handed over during this session.
 *
 * The session credential lives in memory only. It is never written to disk, so a
 * restart asks for it again - the permanent place for a key is the
 * OPENSUBTITLES_API_KEY environment variable.
 */
export type TransportMode = "stdio" | "http";
export declare function setTransportMode(mode: TransportMode): void;
export declare function getTransportMode(): TransportMode;
/** Credentials set at runtime are only meaningful for a single-user (stdio) server. */
export declare function supportsSessionCredentials(): boolean;
export declare function setSessionApiKey(key: string, label?: string): void;
export declare function setSessionToken(token: string, label?: string): void;
export declare function clearSessionCredentials(): void;
export declare function getSessionApiKey(): string | undefined;
export declare function getSessionToken(): string | undefined;
export declare function getSessionLabel(): string | undefined;
/** Show enough of a key to recognise it, never enough to use it. */
export declare function maskSecret(secret: string): string;
/**
 * What to tell a client that ran into a key-related error. The useful answer
 * differs per transport: a stdio server can take the key in conversation, a
 * shared HTTP server must get it per request.
 */
export declare function apiKeyHint(): string;
//# sourceMappingURL=runtime.d.ts.map