import { describe, expect, test } from "bun:test";
import {
  type CompletionToken,
  completionClass,
  kindFromScopes,
  visibleTokens,
} from "./index";

const toks = (...pairs: [string, string][]): CompletionToken[] =>
  pairs.map(([t, k]) => ({ k: k as CompletionToken["k"], t }));

describe("kindFromScopes", () => {
  test("a comment wins over the punctuation scope it also carries", () => {
    // Shiki hands back one token for `// a comment` whose LAST scope is
    // punctuation.definition.comment.js. Scanning only the last scope would
    // render every comment as punctuation.
    expect(
      kindFromScopes([
        "source.js",
        "comment.line.double-slash.js",
        "punctuation.definition.comment.js",
      ])
    ).toBe("comment");
  });

  test("strings, keywords and punctuation each find their kind", () => {
    expect(kindFromScopes(["string.quoted.single.js"])).toBe("string");
    expect(kindFromScopes(["meta.var.expr.js", "storage.type.js"])).toBe(
      "keyword"
    );
    expect(kindFromScopes(["keyword.operator.assignment.js"])).toBe("keyword");
    expect(kindFromScopes(["punctuation.terminator.statement.js"])).toBe(
      "punct"
    );
  });

  test("anything unrecognised is plain, never undefined", () => {
    expect(kindFromScopes(["source.js"])).toBe("plain");
    expect(kindFromScopes([])).toBe("plain");
  });
});

describe("completionClass", () => {
  test("every kind is cyan and only cyan", () => {
    for (const k of [
      "comment",
      "keyword",
      "plain",
      "punct",
      "string",
    ] as const) {
      expect(completionClass(k)).toContain("ht-cyan");
    }
  });

  test("comments are dimmed and italic, keywords carry weight", () => {
    expect(completionClass("comment")).toContain("italic");
    expect(completionClass("keyword")).toContain("font-medium");
    expect(completionClass("keyword")).not.toContain("italic");
  });
});

describe("visibleTokens", () => {
  const three = toks(["const", "keyword"], [" x", "plain"], [";", "punct"]);

  test("nothing revealed yet", () => {
    expect(visibleTokens(three, 0)).toEqual([]);
  });

  test("a budget inside the first token slices it", () => {
    expect(visibleTokens(three, 2)).toEqual(toks(["co", "keyword"]));
  });

  test("a budget on an exact boundary keeps whole tokens and adds nothing", () => {
    expect(visibleTokens(three, 5)).toEqual(toks(["const", "keyword"]));
  });

  test("a budget spanning tokens slices only the last", () => {
    expect(visibleTokens(three, 6)).toEqual(
      toks(["const", "keyword"], [" ", "plain"])
    );
  });

  test("the full budget returns every token intact", () => {
    expect(visibleTokens(three, 8)).toEqual(three);
  });

  test("an over-budget never invents characters", () => {
    expect(visibleTokens(three, 999)).toEqual(three);
    expect(
      visibleTokens(three, 999)
        .map((t) => t.t)
        .join("")
    ).toBe("const x;");
  });

  test("the revealed text always equals a prefix of the whole", () => {
    // The property that matters: the console must never show a character the
    // machine has not produced, and never drop its last one.
    const whole = three.map((t) => t.t).join("");
    for (let i = 0; i <= whole.length; i += 1) {
      expect(
        visibleTokens(three, i)
          .map((t) => t.t)
          .join("")
      ).toBe(whole.slice(0, i));
    }
  });
});
