import type { NextRequest } from "next/server";

/**
 * Pages that exist only as the landing spot after a redirect: the button
 * behind the confirmation link, the thank-you after it, the one after
 * leaving the list. The route that redirects hands over a short-lived
 * cookie scoped to the page, and the proxy turns a visit without it into a
 * 404 — a typed-in address gets no thank-you for something that did not
 * happen.
 */
export interface Ticket {
  readonly cookie: string;
  readonly path: string;
}

/** Carries the confirmation token to the page with the button. */
export const CONFIRMING_TICKET: Ticket = {
  cookie: "confirming",
  path: "/confirm",
};

export const CONFIRMED_TICKET: Ticket = {
  cookie: "confirmed",
  path: "/confirmed",
};

/**
 * Carries `id.sig` to the page with the button. The signature is base64url
 * and has no dot of its own, so the last dot is the seam.
 */
export const LEAVING_TICKET: Ticket = {
  cookie: "leaving",
  path: "/unsubscribe",
};

export const UNSUBSCRIBED_TICKET: Ticket = {
  cookie: "unsubscribed",
  path: "/unsubscribe/done",
};

export const TICKETS: readonly Ticket[] = [
  CONFIRMING_TICKET,
  CONFIRMED_TICKET,
  LEAVING_TICKET,
  UNSUBSCRIBED_TICKET,
];

const TICKET_MAX_AGE_S = 300;

/**
 * The 303 to the ticketed page, cookie attached. Most tickets only need to
 * exist; one that hands something over carries it as the value.
 */
export function ticketRedirect(
  ticket: Ticket,
  request: NextRequest,
  value = "1"
): Response {
  const secure = request.nextUrl.protocol === "https:";
  const response = new Response(null, {
    headers: { Location: ticket.path },
    status: 303,
  });
  response.headers.append(
    "Set-Cookie",
    [
      `${ticket.cookie}=${value}`,
      `Path=${ticket.path}`,
      `Max-Age=${TICKET_MAX_AGE_S}`,
      "HttpOnly",
      "SameSite=Lax",
      ...(secure ? ["Secure"] : []),
    ].join("; ")
  );
  return response;
}
