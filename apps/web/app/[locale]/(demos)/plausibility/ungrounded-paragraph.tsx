import { cn } from "@repo/design-system/lib/utils";
import { type Token, UNGROUNDED_TOKENS } from "./paragraph-data";

function isCodeToken(token: Token) {
  return token.text.startsWith("`") && token.text.endsWith("`");
}

function renderTokenText(token: Token) {
  if (!isCodeToken(token)) {
    return token.text;
  }
  return (
    <code className="rounded bg-foreground/[0.06] px-1 py-0.5 font-mono text-[0.95em] text-foreground/90">
      {token.text.slice(1, -1)}
    </code>
  );
}

export function UngroundedParagraph() {
  return (
    <p className="font-display text-foreground/85 text-lg leading-8">
      {UNGROUNDED_TOKENS.map((token) => (
        <span
          className={cn(
            "whitespace-pre-wrap",
            token.wrong && "border-red-500/70 border-b-2"
          )}
          key={token.id}
        >
          {renderTokenText(token)}
        </span>
      ))}
    </p>
  );
}
