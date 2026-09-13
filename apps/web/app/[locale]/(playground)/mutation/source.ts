export const MUTATION_SOURCE = `
// actions.ts — the entire backend of this demo
"use server";

export async function pressTheButton() {
  const jar = await cookies();
  const count = parseCount(jar.get("playground-presses")?.value) + 1;
  jar.set("playground-presses", String(count), { httpOnly: true });
  // Cookie changed, so Next.js re-renders this page's server tree —
  // the count you see is read back on the server, not tracked in JS.

  // The request view is drawn from what this function saw:
  const incoming = await headers();
  return {
    actionId: incoming.get("next-action"), // the function's id — the route
    contentType: incoming.get("content-type"), // multipart/form-data
    count,
  };
}

// mutation-panel.tsx — the entire frontend
const [receipt, formAction, pending] = useActionState(pressTheButton, null);

return <form action={formAction}>{/* a button */}</form>;
`;
