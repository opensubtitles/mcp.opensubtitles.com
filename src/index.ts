#!/usr/bin/env node
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { loadConfig, VERSION } from "./config.js";
import { createHttpServer } from "./http.js";
import { clientId, log, registerSecret } from "./log.js";
import { buildServer } from "./server.js";

const HELP = `OpenSubtitles MCP server ${VERSION}

Usage:
  npx -y @opensubtitles/mcp-server            stdio (local; for Claude Code/Desktop, Cursor, VS Code)
  npx -y @opensubtitles/mcp-server --http     Streamable HTTP on $PORT (default 1620), endpoint /mcp

Environment (stdio):
  OPENSUBTITLES_USERNAME    your OpenSubtitles login, for your account's download quota / VIP
  OPENSUBTITLES_PASSWORD
  OPENSUBTITLES_API_KEY     optional own API key (https://www.opensubtitles.com/consumers)
Environment (http): PORT, HOST, OPENSUBTITLES_API_KEY (server key for anonymous search),
  ALLOWED_ORIGINS, ALLOWED_HOSTS, TRUST_PROXY, RATE_LIMIT_PER_MINUTE, PUBLIC_URL, LOG_SALT, LOG_LEVEL
`;

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    process.stdout.write(HELP);
    return;
  }
  if (argv.includes("--version") || argv.includes("-v")) {
    process.stdout.write(`${VERSION}\n`);
    return;
  }
  const config = loadConfig();
  registerSecret(config.apiKey);
  registerSecret(config.password);
  const http = argv.includes("--http") || process.env.MCP_MODE === "http";

  if (http) {
    const { server, close } = createHttpServer({ config });
    server.listen(config.port, config.host, () => {
      log("info", "listening", { event: "startup", mode: "http", port: config.port, version: VERSION, default_key: config.apiKeyIsDefault });
    });
    const stop = async (signal: string) => {
      log("info", "shutting down", { event: "shutdown", reason: signal });
      const timer = setTimeout(() => process.exit(0), 10_000);
      timer.unref();
      await close();
      process.exit(0);
    };
    process.on("SIGTERM", () => void stop("SIGTERM"));
    process.on("SIGINT", () => void stop("SIGINT"));
    return;
  }

  const credentials = {
    apiKey: config.apiKeyIsDefault ? undefined : config.apiKey,
    username: config.username,
    password: config.password,
  };
  const client = clientId(config.logSalt, config.username ?? (config.apiKeyIsDefault ? "stdio" : config.apiKey));
  serveStdio(() => buildServer({ mode: "stdio", config, credentials, client }));
  log("info", "listening", { event: "startup", mode: "stdio", version: VERSION, default_key: config.apiKeyIsDefault });
}

main().catch((err) => {
  log("error", "fatal", { event: "fatal", reason: err instanceof Error ? err.message : "unknown" });
  process.exit(1);
});
