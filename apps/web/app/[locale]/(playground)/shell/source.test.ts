import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { SHELL_SOURCE } from "./source";

const DIRECTIVE = /"use cache[^"]*"/;

const bakeSource = await readFile(
  new URL("./bake.ts", import.meta.url),
  "utf8"
);

/**
 * The reference drawer quotes bake.ts by hand, so the two can drift. The
 * directive is the line that matters most — `use cache` and
 * `use cache: remote` look alike and behave differently on Vercel — so the
 * drawer must show exactly the one the running entry uses.
 */
describe("the reference drawer", () => {
  test("shows the same cache directive bake.ts runs", () => {
    const directive = bakeSource.match(DIRECTIVE)?.[0];
    expect(directive).toBe('"use cache: remote"');
    expect(SHELL_SOURCE).toContain(directive as string);
  });
});
