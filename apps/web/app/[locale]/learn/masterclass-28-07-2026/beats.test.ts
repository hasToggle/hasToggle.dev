import { describe, expect, test } from "bun:test";
import {
  adjacentBeat,
  BEATS,
  beatIndex,
  firstBeat,
  furthestBeatOf,
  reached,
} from "./beats";

describe("BEATS", () => {
  test("the reading ladder comes before the reach demo", () => {
    const ids = BEATS["agentic-engineering"].map((b) => b.id);
    expect(ids.indexOf("reading")).toBeLessThan(ids.indexOf("run"));
  });

  test("the four failures sit between the run and the fence", () => {
    const ids = BEATS["agentic-engineering"].map((b) => b.id);
    expect(ids.slice(ids.indexOf("run") + 1, ids.indexOf("fenced"))).toEqual([
      "skipped",
      "bent",
      "left",
      "reached",
    ]);
  });

  test("era II splits into the tab and the editor", () => {
    expect(BEATS.integration.map((b) => b.id)).toEqual(["tab", "editor"]);
  });

  test("era IV holds the ambient demo back until the second beat", () => {
    // `masterclass.tsx` gates on these exact ids. A rename here without one
    // there hides a demo for the whole talk and nothing else would catch it.
    expect(BEATS.outlook.map((b) => b.id)).toEqual(["compiled", "ambient"]);
    expect(reached("outlook", "ambient", "compiled", true)).toBe(false);
    expect(reached("outlook", "ambient", "ambient", true)).toBe(true);
  });

  test("steps without beats are ungated", () => {
    expect(BEATS.completion).toEqual([]);
    expect(reached("completion", "anything", "anything", true)).toBe(true);
  });
});

describe("reached", () => {
  test("shows everything when presenter is off", () => {
    expect(reached("agentic-engineering", "meter", "loop", false)).toBe(true);
  });

  test("gates on furthest, not current", () => {
    expect(reached("agentic-engineering", "run", "reading", true)).toBe(false);
    expect(reached("agentic-engineering", "reading", "run", true)).toBe(true);
  });
});

describe("adjacentBeat", () => {
  test("returns null at the ends", () => {
    expect(adjacentBeat("integration", "tab", "prev")).toBeNull();
    expect(adjacentBeat("integration", "editor", "next")).toBeNull();
  });

  test("walks forward", () => {
    expect(adjacentBeat("integration", "tab", "next")).toBe("editor");
  });
});

describe("furthestBeatOf", () => {
  test("keeps the later of the two", () => {
    expect(furthestBeatOf("integration", "editor", "tab")).toBe("editor");
    expect(furthestBeatOf("integration", "tab", "editor")).toBe("editor");
  });
});

describe("firstBeat", () => {
  test("is null where there are no beats", () => {
    expect(firstBeat("completion")).toBeNull();
    expect(firstBeat("agentic-engineering")).toBe("loop");
  });

  test("beatIndex reports -1 for an unknown id", () => {
    expect(beatIndex("integration", "nope")).toBe(-1);
  });
});
