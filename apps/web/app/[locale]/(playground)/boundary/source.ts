/**
 * The drawer shows the story's file at both ends of the sequence, with the
 * refusal between them — the same three beats the deck walks, in source
 * form. Condensed the way every drawer here condenses: real API, real
 * shapes, the layout noise left out.
 */
export const BOUNDARY_SOURCE = `// card.tsx — as it started. No directive: a Server Component,
// like every file that doesn't say otherwise.
import { cacheLife } from "next/cache";

async function getServerFacts() {
  "use cache";
  cacheLife("hours");
  const response = await fetch(
    "https://api.github.com/repos/hasToggle/hasToggle.dev/commits/main"
  );
  const { sha, commit } = await response.json();
  return {
    sha: sha.slice(0, 7),
    subject: commit.message.split("\\n")[0],
    nodeVersion: process.version, // browsers don't have one
  };
}

export async function Card() {
  const facts = await getServerFacts();
  return <p>latest commit {facts.sha} — {facts.subject}</p>;
}

// step 1 — add a counter. useState in this file stops the build:
// "This React Hook only works in a Client Component."

// card.tsx — after step 2. One directive, and the file changes sides.
"use client";

import { useState } from "react";

export function Card() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Click me {count}</button>;
}`;
