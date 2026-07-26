import type { Band, Mode } from "./selector";

const BASE_CONTINUE =
  "It isn't looking anything up. It's continuing your pattern — that's all it ever does.";

const BASE_CONTINUE_HIGH =
  "Still continuing — just with worse judgment. The dial doesn't add knowledge, only nerve.";

const BASE_QUESTION =
  "You asked a question. It didn't answer — it continued your question with another question.";

const BASE_QUESTION_HIGH =
  "Nothing broke. You widened the odds, and it kept continuing the only pattern it could see — someone typing questions.";

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
    return band === "high" ? BASE_QUESTION_HIGH : BASE_QUESTION;
  }
  return band === "high" ? BASE_CONTINUE_HIGH : BASE_CONTINUE;
}
