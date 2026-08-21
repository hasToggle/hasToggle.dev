export const STATE_CARD_SOURCE = `
"use client";

import { useState } from "react";

export function StateCard() {
  const [count, setCount] = useState(0);
  // setCount does both jobs: it stores the value where React keeps it
  // between calls, and it schedules the render that repaints the screen.
  return (
    <Card pill="useState">
      <button onClick={() => setCount(count + 1)}>+1</button>
      <p>{count}</p>
    </Card>
  );
}
`;

/**
 * What the reference bar's drawer shows for the chapter.
 */
export const STATE_SOURCE = `// state-card.tsx
${STATE_CARD_SOURCE.trim()}`;

/**
 * The source the replay walks: compact enough that every line fits the
 * card's back face, and shaped so the four narrated moments — the press,
 * the fresh call, the kept value, the paint — each have a line to land on.
 * Line numbers are contract: replay-code.tsx renders this with Shiki (on
 * the server), state-card.tsx steps a highlight down its \`.line\` spans by
 * index. Change one, change both.
 */
export const REPLAY_SOURCE = `function StateCard() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
      <p>{count}</p>
    </>
  );
}`;

/** The replay's landing lines, by index into REPLAY_SOURCE. */
export const REPLAY_LINES = {
  fn: 0,
  paint: 8,
  press: 5,
  useState: 1,
} as const;

/**
 * Banked for the /learn state lesson (design.md §5): the local-variable
 * half of the story, staged beside this chapter's counter on the learning
 * path rather than in the lab.
 */
export const VAR_CARD_SOURCE = `
"use client";

// No state anywhere in this file — that is the experiment.
export function VarCard() {
  let count = 0; // born in this render, dies with it

  return (
    <Card pill="let count">
      <button onClick={() => { count += 1 }}>+1</button>
      {/* paints whatever count was when React last ran this function */}
      <p>{count}</p>
    </Card>
  );
}
`;
