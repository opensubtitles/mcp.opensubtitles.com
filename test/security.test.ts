import { describe, expect, it } from "vitest";
import { connect, mockFetch, standardRoutes } from "./helpers.js";

const CREDENTIAL = /pass(word)?|token|api[-_]?key|secret|auth|credential|user(name)?|login|jwt|bearer/i;

/** Every property name anywhere in a JSON Schema (properties, items, anyOf, …). */
function propertyNames(schema: unknown, out: string[] = []): string[] {
  if (Array.isArray(schema)) schema.forEach((s) => propertyNames(s, out));
  else if (schema && typeof schema === "object") {
    const o = schema as Record<string, unknown>;
    if (o.properties && typeof o.properties === "object") out.push(...Object.keys(o.properties as object));
    for (const v of Object.values(o)) propertyNames(v, out);
  }
  return out;
}

describe("no credentials in tool inputs", () => {
  for (const mode of ["stdio", "http"] as const) {
    it(`no ${mode} tool input schema has a password, token, API key or login field`, async () => {
      const c = await connect({ mode, fetch: mockFetch(standardRoutes()) });
      const { tools } = await c.client.listTools();
      const { prompts } = await c.client.listPrompts();
      await c.close();
      for (const t of tools) {
        const names = propertyNames(t.inputSchema);
        expect(names.filter((n) => CREDENTIAL.test(n)), t.name).toEqual([]);
      }
      for (const p of prompts) {
        expect((p.arguments ?? []).map((a) => a.name).filter((n) => CREDENTIAL.test(n)), p.name).toEqual([]);
      }
    });
  }
  it("rejects extra credential arguments (1.x style) instead of using them", async () => {
    const api = mockFetch(standardRoutes());
    const c = await connect({ fetch: api });
    const r = await c.client.callTool({ name: "download_subtitle", arguments: { file_id: 30, user_api_key: "X-synthetic", username: "u", password: "p" } });
    await c.close();
    // Unknown keys are ignored by the schema and never reach the API.
    for (const call of api.calls) {
      expect(JSON.stringify(call)).not.toContain("X-synthetic");
    }
    expect(r).toBeTruthy();
  });
});
