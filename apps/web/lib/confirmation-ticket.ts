/**
 * The page after the confirmation link exists only as the redirect's
 * landing spot. /api/confirmed hands over this cookie on its 303, and the
 * proxy turns a visit without it into a 404 — a typed-in address gets no
 * thank-you for something that did not happen.
 */
export const CONFIRMED_COOKIE = "confirmed";
export const CONFIRMED_PATH = "/confirmed";
export const CONFIRMED_COOKIE_MAX_AGE_S = 300;
