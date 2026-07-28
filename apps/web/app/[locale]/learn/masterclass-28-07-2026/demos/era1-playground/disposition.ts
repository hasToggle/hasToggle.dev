import { type PhaseId, reached } from "./phases";

export interface Disposition {
  showDial: boolean;
  showFooter: boolean;
  showPostTrainedCell: boolean;
  showSecondPrompt: boolean;
}

/**
 * The only place the two modes reconcile. Without presenter mode the console
 * is fully populated and there are no beats; with it, disclosure follows the
 * furthest phase visited — never the current one, so stepping back never takes
 * a control away mid-talk.
 */
export function dispositionFor({
  furthest,
  presenter,
}: {
  furthest: PhaseId;
  presenter: boolean;
}): Disposition {
  if (!presenter) {
    return {
      showDial: true,
      showFooter: false,
      showPostTrainedCell: true,
      showSecondPrompt: true,
    };
  }
  return {
    showDial: reached(furthest, "dial"),
    showFooter: true,
    showPostTrainedCell: reached(furthest, "taught"),
    showSecondPrompt: reached(furthest, "unanswered"),
  };
}
