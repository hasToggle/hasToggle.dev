/**
 * The drawer shows the story's file at each stop the deck makes —
 * start, crossed, split — a refusal after each of the first two. The
 * same four beats, in source form. Condensed the way every drawer here
 * condenses: real API, real shapes, the layout noise left out.
 */
export const BOUNDARY_SOURCE = `// card.tsx — as it started. No directive: a Server Component,
// like every file that doesn't say otherwise.
import { cacheLife } from "next/cache";

async function getLatestCommit() {
  "use cache";
  cacheLife("hours");
  const response = await fetch(
    "https://api.github.com/repos/hasToggle/hasToggle.dev/commits/main"
  );
  const { sha, commit } = await response.json();
  return { sha: sha.slice(0, 7), subject: commit.message.split("\\n")[0] };
}

export async function Card() {
  const { sha, subject } = await getLatestCommit();
  return <p>latest commit {sha} — {subject}</p>;
}

// step 1 — add a copy button. useState in this file stops the build:
// "This React Hook only works in a Client Component."

// card.tsx — after step 2. The directive went on top of everything
// the file already was, and the build stops again:
// "It is not allowed to define inline "use cache" annotated
//  functions in Client Components."
"use client";
import { cacheLife } from "next/cache";
import { useState } from "react";

async function getLatestCommit() {
  "use cache"; // ⨯ no client form — this line is the second refusal
  cacheLife("hours");
  /* … */
}

// card.tsx — after step 3. No directive again: the fetch never left
// Node, and the one file that needs the browser carries its own line.
import { CopyButton } from "./copy-button";

export async function Card() {
  const { sha, subject } = await getLatestCommit();
  return <p>latest commit {sha} <CopyButton value={sha} /></p>;
}

// copy-button.tsx — the entire client bundle of this card.
"use client";
import { useState } from "react";

export function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => {
      navigator.clipboard.writeText(value);
      setCopied(true);
    }}>
      {copied ? "copied" : "copy"}
    </button>
  );
}`;
