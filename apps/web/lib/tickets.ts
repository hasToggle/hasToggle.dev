import type { NextRequest } from "next/server";

/**
 * Pages that exist only as the landing spot after a redirect: the one
 * after the confirmation link, the one after leaving the list. The route
 * that redirects hands over a short-lived cookie scoped to the page, and
 * the proxy turns a visit without it into a 404 — a typed-in address gets
 * no thank-you for something that did not happen.
 */
export interface Ticket {
  readonly cookie: string;
  readonly path: string;
}

export const CONFIRMED_TICKET: Ticket = {
  cookie: "confirmed",
  path: "/confirmed",
};

export const UNSUBSCRIBED_TICKET: Ticket = {
  cookie: "unsubscribed",
  path: "/unsubscribe/done",
};

export const TICKETS: readonly Ticket[] = [
  CONFIRMED_TICKET,
  UNSUBSCRIBED_TICKET,
];

const TICKET_MAX_AGE_S = 300;

/** The 303 to the ticketed page, cookie attached. */
export function ticketRedirect(ticket: Ticket, request: NextRequest): Response {
  const secure = request.nextUrl.protocol === "https:";
  const response = new Response(null, {
    headers: { Location: ticket.path },
    status: 303,
  });
  response.headers.append(
    "Set-Cookie",
    [
      `${ticket.cookie}=1`,
      `Path=${ticket.path}`,
      `Max-Age=${TICKET_MAX_AGE_S}`,
      "HttpOnly",
      "SameSite=Lax",
      ...(secure ? ["Secure"] : []),
    ].join("; ")
  );
  return response;
}
