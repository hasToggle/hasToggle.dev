/**
 * The drawer shows the file at both of the instrument's states — the
 * Server Component as it started, then the same file importing the one
 * small client file the button needed. Condensed the way every drawer
 * here condenses: real API, real shapes, the layout noise left out.
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

// card.tsx — with the copy button. Still no directive: the fetch never
// left Node, and the one file that needs the browser carries its own line.
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
