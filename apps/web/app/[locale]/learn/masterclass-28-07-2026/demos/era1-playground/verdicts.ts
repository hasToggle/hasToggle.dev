import type { Band, Mode } from "./selector";

/**
 * One reading per beat, at every temperature — except the base question, where
 * moving the dial *is* the beat and so earns a second.
 *
 * The dial used to fork every reading. That meant the line the room heard
 * depended on where the slider happened to be sitting, and at the flip it meant
 * the era's payoff could be replaced by a footnote about dice.
 */

const BASE_CONTINUE =
  "It isn't looking anything up. It's continuing your pattern — that's all it ever does.";

/** The dial parked where it started: still the "nobody answers" beat. */
const BASE_QUESTION =
  "You asked a question. It didn't answer — it continued your question with another question.";

/** The dial turned, either way. The beat is what the dial is, not where it went. */
const BASE_QUESTION_MOVED =
  "That's temperature — how willing it is to pick a less likely next word. Cold, it repeats; hot, it wanders.";

const INSTRUCT_QUESTION =
  "Same machine, same continuation. Humans taught it what an answer looks like, so that's the pattern it continues now. That flip is what the world met as ChatGPT.";

const INSTRUCT_CONTINUE =
  "One clean completion instead of a pile of them. Same machine — new manners.";

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
    return isQuestion ? INSTRUCT_QUESTION : INSTRUCT_CONTINUE;
  }
  if (isQuestion) {
    // `mid` is where the dial is parked, so any other band means it was turned.
    return band === "mid" ? BASE_QUESTION : BASE_QUESTION_MOVED;
  }
  return BASE_CONTINUE;
}
