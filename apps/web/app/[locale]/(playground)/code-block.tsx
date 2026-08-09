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
          node.properties.title = title;
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
}

/**
 * The code behind a demo, highlighted on the server (cached forever — same
 * string, same HTML) and collapsed behind a native `<details>`. Zero
 * JavaScript ships to the browser for this: disclosure is HTML's job.
 */
export async function CodeBlock({ code, file, lang = "tsx" }: CodeBlockProps) {
  const html = await highlight(code, lang, file);

  return (
    <details className="group mt-4 overflow-hidden rounded-xl border border-foreground/10 bg-background">
      <summary className="flex cursor-pointer select-none items-center gap-2.5 px-4 py-3 font-mono font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em] transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
        >
          &#9656;
        </span>
        the code — {file}
      </summary>
      <div
        className="overflow-x-auto border-foreground/10 border-t p-4 text-sm [&_pre]:m-0 [&_pre]:bg-transparent"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output from our own source strings, not user input
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </details>
  );
}
