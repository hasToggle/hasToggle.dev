import { describe, expect, test } from "bun:test";
import {
  DEFAULT_STRATEGY,
  isSpent,
  nextStrategy,
  parseStrategy,
  STRATEGY_ORDER,
} from "./strategy";

describe("parseStrategy", () => {
  test("a missing param starts at the belief", () => {
    expect(parseStrategy(undefined)).toBe("blocking");
    expect(parseStrategy("")).toBe("blocking");
    expect(DEFAULT_STRATEGY).toBe("blocking");
  });

  test("the three arrangements pass through", () => {
    expect(parseStrategy("blocking")).toBe("blocking");
    expect(parseStrategy("loading")).toBe("loading");
    expect(parseStrategy("parts")).toBe("parts");
  });

  test("rejects everything a URL bar can invent", () => {
    expect(parseStrategy("Parts")).toBe("blocking");
    expect(parseStrategy("stream")).toBe("blocking");
    expect(parseStrategy("__proto__")).toBe("blocking");
    expect(parseStrategy("constructor")).toBe("blocking");
    expect(parseStrategy(" parts")).toBe("blocking");
  });
});

describe("the walk", () => {
  test("runs blocking → loading → parts", () => {
    expect(STRATEGY_ORDER).toEqual(["blocking", "loading", "parts"]);
    expect(nextStrategy("blocking")).toBe("loading");
    expect(nextStrategy("loading")).toBe("parts");
  });

  test("ends at the last arrangement", () => {
    expect(nextStrategy("parts")).toBeUndefined();
  });

  test("knows which steps the walk has already spent", () => {
    expect(isSpent("blocking", "parts")).toBe(true);
    expect(isSpent("loading", "parts")).toBe(true);
    expect(isSpent("parts", "parts")).toBe(false);
    expect(isSpent("loading", "blocking")).toBe(false);
  });
});
