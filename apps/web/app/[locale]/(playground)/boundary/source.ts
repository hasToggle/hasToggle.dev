export const SERVER_CARD_SOURCE = `
import { cacheLife } from "next/cache";

// No "use client" at the top: this is a Server Component.
// It runs in Node.js, its output is cached, zero JS ships.
async function getServerFacts() {
  "use cache";
  cacheLife("hours");
  return {
    nodeVersion: process.version, // browsers don't have one
    renderedAt: new Date().toISOString(),
  };
}

export async function ServerCard() {
  const facts = await getServerFacts();
  return <Card side="server">Rendered in Node.js {facts.nodeVersion}</Card>;
}
`;

export const CLIENT_CARD_SOURCE = `
"use client"; // this one directive is the entire boundary

import { useState } from "react";

export function ClientCard() {
  const [count, setCount] = useState(0);

  return (
    <Card side="client">
      <button onClick={() => setCount(count + 1)}>Click me</button>
      {count}
    </Card>
  );
}
`;

/**
 * The two cards joined for the reference bar's single drawer, each under its
 * filename the way the shell demo joins bake.ts and actions.ts.
 */
export const BOUNDARY_SOURCE = `// server-card.tsx
${SERVER_CARD_SOURCE.trim()}

// client-card.tsx
${CLIENT_CARD_SOURCE.trim()}`;
