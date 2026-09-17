import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * The unsubscribe link in a transactional mail. Resend mints per-contact
 * links for broadcasts only, so the reminder and the confirmation mail
 * carry one of ours: the subscriber's id, signed with a server secret. The
 * signature is what makes the link a capability — without it, anyone could
 * remove anyone by trying ids. Nothing is stored for it; the secret is the
 * whole state.
 */
export function unsubscribeSignature(subscriberId: string, secret: string) {
  return createHmac("sha256", secret).update(subscriberId).digest("base64url");
}

export function verifyUnsubscribe(
  subscriberId: string,
  signature: string,
  secret: string
): boolean {
  const expected = Buffer.from(unsubscribeSignature(subscriberId, secret));
  const presented = Buffer.from(signature);
  return (
    presented.length === expected.length && timingSafeEqual(presented, expected)
  );
}

/**
 * Where the link points: the route, which redirects a browser to the page
 * with its button and answers a mail client's one-click POST (RFC 8058)
 * directly. One URL serves as both the visible link and the
 * List-Unsubscribe header.
 */
export function unsubscribeUrl(
  origin: string,
  subscriberId: string,
  secret: string
): string {
  const url = new URL("/api/unsubscribe", origin);
  url.searchParams.set("id", subscriberId);
  url.searchParams.set("sig", unsubscribeSignature(subscriberId, secret));
  return url.toString();
}

/** The mail headers that let a client offer its own unsubscribe control. */
export function unsubscribeHeaders(url: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${url}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
