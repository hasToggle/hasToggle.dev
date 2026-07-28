import { describe, expect, test } from "bun:test";
import { fingerprintText, kindFromScopes } from "./index";

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

describe("fingerprintText", () => {
  test("the same strings always hash the same", () => {
    expect(fingerprintText(["a", "b"])).toBe(fingerprintText(["a", "b"]));
  });

  test("one changed character changes the hash", () => {
    expect(fingerprintText(["hello"])).not.toBe(fingerprintText(["hellp"]));
  });

  test("the length suffix makes same-length collisions harder to hit", () => {
    expect(fingerprintText(["abc"]).endsWith("-3")).toBe(true);
  });
});
