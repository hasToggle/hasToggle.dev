import { cacheLife } from "next/cache";
import { codeToHtml } from "shiki";

async function highlight(
  code: string,
  lang: string,
  title: string
): Promise<string> {
  "use cache";
  cacheLife("max");
  return await codeToHtml(code.trim(), {
    defaultColor: false,
    lang,
    themes: { dark: "github-dark", light: "github-light" },
    transformers: [
      {
        pre(node) {
          // An empty title means the chrome already names the file (the bar
          // variant's summary) — skip the in-block heading entirely, since
          // `.shiki[title]:before` would render it a second time.
          if (title) {
            node.properties.title = title;
          }
        },
      },
    ],
  });
}

interface CodeBlockProps {
  code: string;
  /** Displayed filename, e.g. "server-card.tsx". */
  file: string;
  lang?: string;
  /**
   * `standalone` draws its own frame below a panel (the legacy shape, still
   * used by unmigrated demos). `bar` is the chassis form: frameless, its
   * summary is the left side of the instrument's reference bar.
   */
  variant?: "bar" | "standalone";
}

/**
 * The code behind a demo, highlighted on the server (cached forever — same
 * string, same HTML) and collapsed behind a native `<details>`. Zero
 * JavaScript ships to the browser for this: disclosure is HTML's job.
 */
export async function CodeBlock({
  code,
  file,
  lang = "tsx",
  variant = "standalone",
}: CodeBlockProps) {
  const html = await highlight(code, lang, variant === "bar" ? "" : file);

  const summary = (
    <summary className="flex h-11 cursor-pointer select-none items-center gap-2.5 px-4 font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em] transition-colors hover:text-foreground sm:px-5 [&::-webkit-details-marker]:hidden">
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
      >
        &#9656;
      </span>
      {file}
    </summary>
  );

  const source = (
    <div
      className="overflow-x-auto border-foreground/10 border-t p-4 text-sm [&_pre]:m-0 [&_pre]:bg-transparent"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output from our own source strings, not user input
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  if (variant === "bar") {
    return (
      <details className="group">
        {summary}
        {source}
      </details>
    );
  }

  return (
    <details className="group mt-4 overflow-hidden rounded-xl border border-foreground/10 bg-background">
      {summary}
      {source}
    </details>
  );
}
