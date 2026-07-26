import type { Band, Mode } from "./selector";

const BASE_CONTINUE =
  "It isn't looking anything up. It's continuing your pattern — that's all it ever does.";

const BASE_CONTINUE_HIGH =
  "Still continuing — just with worse judgment. The dial doesn't add knowledge, only nerve.";

const BASE_QUESTION =
  "You asked a question. It didn't answer — it continued your question with another question.";

/**
 * The dial beat. One reading for both directions the presenter can turn it, so
 * the beat says the same thing whichever way it went — the point is what the
 * dial *is*, not which end of it you happened to reach.
 */
const BASE_QUESTION_MOVED =
  "That's temperature — how willing it is to pick a less likely next word. Cold, it repeats; hot, it wanders. Neither setting puts anyone in there to answer you.";

const INSTRUCT_QUESTION =
  "Now it answers. Not because it became something else — because humans taught it the format. That flip is the ChatGPT moment.";

const INSTRUCT_CONTINUE =
  "One clean completion, every time. Same machine — new manners.";

const INSTRUCT_QUESTION_HIGH =
  "The dial is still up, and it still answers — in the shape you asked for. Post-training didn't take the dice away. It made the format survive them.";

const INSTRUCT_CONTINUE_HIGH =
  "It wanders a little, and still lands the completion. The format holds at any temperature.";

export function verdictFor({
  band,
  isQuestion,
  mode,
}: {
  band: Band;
  isQuestion: boolean;
  mode: Mode;
}): string {
  if (mode === "instruct") {
    if (isQuestion) {
      return band === "high" ? INSTRUCT_QUESTION_HIGH : INSTRUCT_QUESTION;
    }
    return band === "high" ? INSTRUCT_CONTINUE_HIGH : INSTRUCT_CONTINUE;
  }
  if (isQuestion) {
    // `mid` is where the dial is parked, so any other band means it was turned.
    return band === "mid" ? BASE_QUESTION : BASE_QUESTION_MOVED;
  }
  return band === "high" ? BASE_CONTINUE_HIGH : BASE_CONTINUE;
}
