"use server";

import { cookies, headers } from "next/headers";
import { COUNT_COOKIE, MAX_COUNT, parseCount } from "./count-parser";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * What the action saw and did, read from the real request — the request
 * view draws this and nothing else. Every field is something the function
 * can only know because the round trip happened: the action id arrives as
 * a header, the body's content type arrives as a header, and the cookie
 * line is the exact one the response carries back.
 */
export interface PressReceipt {
  /** The `Next-Action` header: the function's id, which is the whole route. */
  actionId: string;
  /** The `Content-Type` the browser chose for the form body. */
  contentType: string;
  /** The count after this press. */
  count: number;
  /** The path the POST went to — the page's own. */
  path: string;
  /** The `Set-Cookie` line the response carries, as set. */
  setCookie: string;
}

/**
 * The entire backend of the mutation demo. No API route, no fetch, no JSON —
 * the form invokes this function on the server, the server rewrites the
 * cookie, and Next.js re-renders the page so every Server Component reading
 * that cookie shows the new value. The signature matches what
 * `useActionState` passes: (previousState, formData). It returns its
 * receipt so the request view can show the round trip that actually ran.
 */
export async function pressTheButton(
  _previous: PressReceipt | null,
  _formData: FormData
): Promise<PressReceipt> {
  const [jar, incoming] = await Promise.all([cookies(), headers()]);
  const count = Math.min(
    parseCount(jar.get(COUNT_COOKIE)?.value) + 1,
    MAX_COUNT
  );

  const options = {
    httpOnly: true,
    maxAge: ONE_YEAR_SECONDS,
    path: "/",
    sameSite: "lax",
  } as const;
  jar.set(COUNT_COOKIE, String(count), options);

  return {
    actionId: incoming.get("next-action") ?? "",
    contentType: (incoming.get("content-type") ?? "").split(";")[0],
    count,
    path: pathnameOf(incoming.get("referer")),
    setCookie: `${COUNT_COOKIE}=${count}; Path=${options.path}; Max-Age=${options.maxAge}; HttpOnly; SameSite=Lax`,
  };
}

/** The page's own path, from the referer the browser sends with the POST. */
function pathnameOf(referer: string | null): string {
  if (!referer) {
    return "";
  }
  try {
    return new URL(referer).pathname;
  } catch {
    return "";
  }
}
