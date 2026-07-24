import { describe, expect, test } from "bun:test";
import {
  advance,
  reached,
  type Stage,
  showsDial,
  showsDialWhisper,
  showsModeSwitch,
  showsOffer,
  showsPromptSelector,
  showsReset,
} from "./stage";

const continuationVerdict = {
  band: "mid",
  isQuestion: false,
  mode: "base",
  type: "verdict",
} as const;

const questionVerdict = {
  band: "mid",
  isQuestion: true,
  mode: "base",
  type: "verdict",
} as const;

describe("era1 stage machine", () => {
  test("the first verdict opens the second prompt", () => {
    expect(advance("continuation", continuationVerdict)).toBe("question");
  });

  test("only the question's verdict opens the dial", () => {
    expect(advance("question", continuationVerdict)).toBe("question");
    expect(advance("question", questionVerdict)).toBe("dial");
  });

  test("the offer waits until the dial has actually been moved", () => {
    // The dial opens at INITIAL_TEMP, which lands in the mid band.
    expect(advance("dial", { ...questionVerdict, band: "mid" })).toBe("dial");
    expect(advance("dial", { ...questionVerdict, band: "high" })).toBe("offer");
    expect(advance("dial", { ...questionVerdict, band: "low" })).toBe("offer");
  });

  test("only accepting the offer flips the machine", () => {
    expect(advance("offer", questionVerdict)).toBe("offer");
    expect(advance("offer", { type: "accept-offer" })).toBe("flip");
  });

  test("accepting the offer early is a no-op", () => {
    expect(advance("continuation", { type: "accept-offer" })).toBe(
      "continuation"
    );
    expect(advance("dial", { type: "accept-offer" })).toBe("dial");
  });

  test("the flip is terminal", () => {
    expect(advance("flip", questionVerdict)).toBe("flip");
    expect(advance("flip", { type: "accept-offer" })).toBe("flip");
  });

  test("gates never close", () => {
    const stages: Stage[] = [
      "continuation",
      "question",
      "dial",
      "offer",
      "flip",
    ];
    for (const stage of stages) {
      for (const band of ["low", "mid", "high"] as const) {
        for (const isQuestion of [true, false]) {
          for (const mode of ["base", "instruct"] as const) {
            const next = advance(stage, {
              band,
              isQuestion,
              mode,
              type: "verdict",
            });
            expect(reached(next, stage)).toBe(true);
          }
        }
      }
      expect(reached(advance(stage, { type: "accept-offer" }), stage)).toBe(
        true
      );
    }
  });

  test("reset re-arms the demo from anywhere", () => {
    expect(advance("flip", { type: "reset" })).toBe("continuation");
    expect(advance("dial", { type: "reset" })).toBe("continuation");
  });

  test("nothing is on screen before its beat", () => {
    expect(showsPromptSelector("continuation")).toBe(false);
    expect(showsPromptSelector("question")).toBe(true);
    expect(showsDial("question", "base")).toBe(false);
    expect(showsDial("dial", "base")).toBe(true);
    expect(showsModeSwitch("offer")).toBe(false);
    expect(showsModeSwitch("flip")).toBe(true);
    expect(showsReset("continuation")).toBe(false);
    expect(showsReset("question")).toBe(true);
  });

  test("the dial belongs to the base machine only", () => {
    expect(showsDial("flip", "base")).toBe(true);
    expect(showsDial("flip", "instruct")).toBe(false);
  });

  test("the offer is a moment, not a fixture", () => {
    expect(showsOffer("dial")).toBe(false);
    expect(showsOffer("offer")).toBe(true);
    expect(showsOffer("flip")).toBe(false);
  });

  test("the dial whisper is said once, during its own stage", () => {
    expect(showsDialWhisper("question")).toBe(false);
    expect(showsDialWhisper("dial")).toBe(true);
    expect(showsDialWhisper("offer")).toBe(false);
  });
});
