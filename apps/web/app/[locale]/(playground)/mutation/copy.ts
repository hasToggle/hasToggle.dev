/**
 * Every string the mutation instrument shows, in the instrument register:
 * lowercase, middot-separated, mechanism facts only. Anything quoting a
 * real header or a real cookie keeps straight quotes and real casing.
 */

/** Chrome, top-right: the cause view — the one round trip, as it went. */
export const VIEW_LABEL = "request";

/** The form's one action, and its pending label. */
export const SUBMIT_LABEL = "Add one";
export const SUBMIT_PENDING_LABEL = "Adding one…";

/** Under the count: where the number was read, and who cannot read it. */
export const COUNT_NOTE =
  "read on the server from an httpOnly cookie · your JavaScript cannot see it";

/** The count's fallback while the cookie is read. */
export const COUNT_PENDING = "reading your cookie on the server…";

/** The request view before any press: nothing has gone out yet. */
export const REQUEST_EMPTY =
  "no request yet · add one and the round trip appears here";

/** The seam under the request view: the three facts the card proves. */
export const REQUEST_SEAM =
  "one POST to the page’s own URL · the function is named in a header · the re-render rides back in the same response";

/** The seam under the page view: the trip, and that it needs no JavaScript to make it. */
export const PAGE_SEAM =
  "the form posts to the function · the function writes the cookie · the page re-renders around it, with or without JavaScript";

/** Labels for the two halves of the card. */
export const REQUEST_HEADING = "request";
export const RESPONSE_HEADING = "response";

/** The response line no client can verify — and the reason it cannot. */
export const RSC_LINE = "the re-rendered page, as an RSC payload";
export const COOKIE_HIDDEN_NOTE =
  "visible in the network tab · absent from document.cookie";
