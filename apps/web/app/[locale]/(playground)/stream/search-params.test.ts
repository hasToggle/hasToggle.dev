import { describe, expect, test } from "bun:test";
import { DEFAULT_STRATEGY, parseStrategy, STRATEGY_ORDER } from "./strategy";

describe("parseStrategy", () => {
  test("a missing param opens on the arrangement the title describes", () => {
    expect(parseStrategy(undefined)).toBe("parts");
    expect(parseStrategy("")).toBe("parts");
    expect(DEFAULT_STRATEGY).toBe("parts");
  });

  test("the three arrangements pass through", () => {
    expect(parseStrategy("blocking")).toBe("blocking");
    expect(parseStrategy("loading")).toBe("loading");
    expect(parseStrategy("parts")).toBe("parts");
  });

  test("rejects everything a URL bar can invent", () => {
    expect(parseStrategy("Parts")).toBe("parts");
    expect(parseStrategy("stream")).toBe("parts");
    expect(parseStrategy("__proto__")).toBe("parts");
    expect(parseStrategy("constructor")).toBe("parts");
    expect(parseStrategy(" parts")).toBe("parts");
  });
});

describe("the arrangements", () => {
  test("are shown least to most streaming", () => {
    expect(STRATEGY_ORDER).toEqual(["blocking", "loading", "parts"]);
  });
});
