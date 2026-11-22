import { defineConfig } from "vitest/config";

const common = { testTimeout: 20_000, hookTimeout: 30_000, pool: "forks" as const };

export default defineConfig({
  test: {
    projects: [
      { test: { ...common, name: "main", include: ["test/**/*.test.ts"] } },
      // The tool suite again on protocol revision 2026-07-28 (default runs use the 2025 handshake).
      { test: { ...common, name: "tools-2026-07-28", include: ["test/tools.test.ts"], env: { MCP_TEST_ERA: "modern" } } },
    ],
  },
});
