"use server";

import { cookies } from "next/headers";
import { COUNT_COOKIE, MAX_COUNT, parseCount } from "./count-parser";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * The entire backend of the mutation demo. No API route, no fetch, no JSON —
 * the form invokes this function on the server, the server rewrites the
 * cookie, and Next.js re-renders the page so every Server Component reading
 * that cookie shows the new value. The signature matches what
 * `useActionState` passes: (previousState, formData).
 */
export async function pressTheButton(
  _previous: unknown,
  _formData: FormData
): Promise<void> {
  const jar = await cookies();
  const count = parseCount(jar.get(COUNT_COOKIE)?.value);

  jar.set(COUNT_COOKIE, String(Math.min(count + 1, MAX_COUNT)), {
    httpOnly: true,
    maxAge: ONE_YEAR_SECONDS,
    path: "/",
    sameSite: "lax",
  });
}
