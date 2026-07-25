import { describe, expect, test } from "bun:test";
import {
  adjacentPhase,
  FIRST_PHASE,
  furthestOf,
  PHASES,
  phaseFor,
  reached,
} from "./phases";
import { PROMPTS } from "./selector";

describe("era1 phases", () => {
  test("four beats, in the order the presenter walks them", () => {
    expect(PHASES.map((p) => p.id)).toEqual([
      "autocomplete",
      "unanswered",
      "dial",
      "taught",
    ]);
    expect(FIRST_PHASE).toBe("autocomplete");
  });

  test("every arrival loads a prompt that actually exists", () => {
    for (const phase of PHASES) {
      expect(PROMPTS.some((p) => p.id === phase.arrival.promptId)).toBe(true);
    }
  });

  test("only the last beat loads the post-trained model", () => {
    const instruct = PHASES.filter((p) => p.arrival.mode === "instruct");
    expect(instruct.map((p) => p.id)).toEqual(["taught"]);
  });

  test("only the last beat inherits the dial — the rest park it", () => {
    const inherits = PHASES.filter((p) => !p.arrival.resetTemp);
    expect(inherits.map((p) => p.id)).toEqual(["taught"]);
  });

  test("only the beat that is a date carries a year", () => {
    const dated = PHASES.filter((p) => p.year !== undefined);
    expect(dated.map((p) => p.id)).toEqual(["taught"]);
    expect(phaseFor("taught").year).toBe("2022");
  });

  test("reached includes the phase itself and everything behind it", () => {
    expect(reached("dial", "autocomplete")).toBe(true);
    expect(reached("dial", "dial")).toBe(true);
    expect(reached("dial", "taught")).toBe(false);
  });

  test("furthestOf never goes backwards", () => {
    expect(furthestOf("dial", "autocomplete")).toBe("dial");
    expect(furthestOf("autocomplete", "dial")).toBe("dial");
    expect(furthestOf("taught", "taught")).toBe("taught");
  });

  test("the arrows stop at the ends", () => {
    expect(adjacentPhase("autocomplete", "prev")).toBeNull();
    expect(adjacentPhase("autocomplete", "next")).toBe("unanswered");
    expect(adjacentPhase("taught", "next")).toBeNull();
    expect(adjacentPhase("taught", "prev")).toBe("dial");
  });

  test("labels stay out of the engineers' register", () => {
    for (const phase of PHASES) {
      expect(phase.label).not.toContain("//");
      expect(phase.label).not.toContain("▸");
    }
  });
});
