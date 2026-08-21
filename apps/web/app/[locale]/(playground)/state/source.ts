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
 * The two cards joined for the reference bar's single drawer, each under
 * its filename — the boundary demo's pattern.
 */
export const STATE_SOURCE = `// var-card.tsx
${VAR_CARD_SOURCE.trim()}

// state-card.tsx
${STATE_CARD_SOURCE.trim()}`;
