import { cacheLife } from "next/cache";
import { codeToHtml } from "shiki";
import { REPLAY_SOURCE } from "./source";

async function highlightReplay(): Promise<string> {
  "use cache";
  cacheLife("max");
  return await codeToHtml(REPLAY_SOURCE, {
    defaultColor: false,
    lang: "tsx",
    themes: { dark: "github-dark", light: "github-light" },
  });
}

/**
 * The card's back face: the source the replay walks, highlighted once on
 * the server with the same cached Shiki pipeline the reference drawers
 * use — no highlighter ships to the browser. The client's whole job is
 * moving one CSS class down the pre-rendered `.line` spans and writing
 * the annotation text; see `.ht-replay` in app/styles.css.
 */
export async function ReplayCode() {
  const html = await highlightReplay();

  return (
    <div
      className="ht-replay overflow-x-auto text-[0.8rem]/6 sm:text-sm/6 [&_pre]:m-0 [&_pre]:bg-transparent"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output from our own source string, not user input
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
