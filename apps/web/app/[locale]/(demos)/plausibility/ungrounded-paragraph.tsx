import { UNGROUNDED_TOKENS, type UngroundedToken } from "./paragraph-data";

function isCodeToken(token: UngroundedToken) {
  return token.text.startsWith("`") && token.text.endsWith("`");
}

function renderTokenText(token: UngroundedToken) {
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
        <span className="whitespace-pre-wrap" key={token.id}>
          {renderTokenText(token)}
        </span>
      ))}
    </p>
  );
}
