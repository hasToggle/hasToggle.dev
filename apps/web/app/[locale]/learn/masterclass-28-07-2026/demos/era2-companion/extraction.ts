export type ClipPhase = "idle" | "copied" | "pasted";
export type ClipAction = "copy" | "paste" | "reset";

export function clipTransition(
  phase: ClipPhase,
  action: ClipAction
): ClipPhase {
  if (action === "reset") {
    return "idle";
  }
  if (action === "copy" && phase === "idle") {
    return "copied";
  }
  if (action === "paste" && phase === "copied") {
    return "pasted";
  }
  return phase;
}

export const THREAD_QUESTION =
  "how do I stop an unknown discount code from crashing checkout?";

export const THREAD_ANSWER: readonly string[] = [
  "function validateCode(code) {",
  "  if (!(code in DISCOUNTS)) {",
  "    return { ok: false };",
  "  }",
  "  return { ok: true, rate: DISCOUNTS[code] };",
  "}",
];
