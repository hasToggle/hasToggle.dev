import { highlight } from "../code-block";
import { REPLAY_SOURCE } from "./source";

/**
 * The card's back face: the source the replay walks, highlighted once on
 * the server with the same cached Shiki pipeline the reference drawers
 * use — no highlighter ships to the browser. The client's whole job is
 * moving one CSS class down the pre-rendered `.line` spans and writing
 * the annotation text; see `.ht-replay` in app/styles.css.
 */
export async function ReplayCode() {
  const html = await highlight(REPLAY_SOURCE, "tsx");

  return (
    <div
      className="ht-replay overflow-x-auto text-[0.8rem]/6 sm:text-sm/6 [&_pre]:m-0 [&_pre]:bg-transparent"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output from our own source string, not user input
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
