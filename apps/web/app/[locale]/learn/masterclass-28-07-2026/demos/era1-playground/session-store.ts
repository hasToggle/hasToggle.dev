import type { Stage } from "./stage";

/**
 * The revealed stage survives step navigation (the demo unmounts when the
 * presenter steps to Era II) but not a page reload, which is how the demo
 * re-arms for a fresh run. Written only from client event handlers, so the
 * server copy never leaves its default.
 */
let revealed: Stage = "continuation";

export function getRevealedStage(): Stage {
  return revealed;
}

export function setRevealedStage(stage: Stage): void {
  revealed = stage;
}
