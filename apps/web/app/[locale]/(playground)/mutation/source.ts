export const MUTATION_SOURCE = `
// actions.ts — the entire backend of this demo
"use server";

export async function pressTheButton() {
  const jar = await cookies();
  const count = parseCount(jar.get("playground-presses")?.value);
  jar.set("playground-presses", String(count + 1), { httpOnly: true });
  // Cookie changed, so Next.js re-renders this page's server tree —
  // the count you see is read back on the server, not tracked in JS.
}

// press-form.tsx — the entire frontend
const [, formAction, pending] = useActionState(pressTheButton, null);

return <form action={formAction}>{/* a button */}</form>;
`;
