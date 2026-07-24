import { type Band, bandFor, INITIAL_TEMP, type Mode } from "./selector";

export type Stage = "continuation" | "question" | "dial" | "offer" | "flip";

export type StageEvent =
  | { band: Band; isQuestion: boolean; mode: Mode; type: "verdict" }
  | { type: "accept-offer" }
  | { type: "reset" };

const ORDER: Record<Stage, number> = {
  continuation: 0,
  dial: 2,
  flip: 4,
  offer: 3,
  question: 1,
};

/** The band the dial is standing in when it first appears. */
const OPENING_BAND = bandFor(INITIAL_TEMP);

export function reached(stage: Stage, target: Stage): boolean {
  return ORDER[stage] >= ORDER[target];
}

export function advance(stage: Stage, event: StageEvent): Stage {
  if (event.type === "reset") {
    return "continuation";
  }
  if (event.type === "accept-offer") {
    return stage === "offer" ? "flip" : stage;
  }
  if (stage === "continuation") {
    // Only one prompt exists here, so any verdict is the continuation's.
    return "question";
  }
  if (stage === "question") {
    return event.isQuestion && event.mode === "base" ? "dial" : stage;
  }
  if (stage === "dial") {
    return event.band === OPENING_BAND ? stage : "offer";
  }
  return stage;
}

export function showsPromptSelector(stage: Stage): boolean {
  return reached(stage, "question");
}

export function showsDial(stage: Stage, mode: Mode): boolean {
  return reached(stage, "dial") && mode === "base";
}

export function showsDialWhisper(stage: Stage): boolean {
  return stage === "dial";
}

export function showsOffer(stage: Stage): boolean {
  return stage === "offer";
}

export function showsModeSwitch(stage: Stage): boolean {
  return reached(stage, "flip");
}

export function showsReset(stage: Stage): boolean {
  return stage !== "continuation";
}
