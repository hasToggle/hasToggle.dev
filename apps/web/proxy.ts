import { isToolbarEnabled } from "@repo/feature-flags/lib/toolbar-enabled";
import { internationalizationMiddleware } from "@repo/internationalization/middleware";
import { type NextProxy, type NextRequest, NextResponse } from "next/server";
import {
  securityHeaders,
  securityOptions,
  securityOptionsWithToolbar,
  withSecurityHeaders,
} from "@/lib/security-headers";
import { TICKETS } from "@/lib/tickets";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search
    // params. The UUID is BotID's prefix: next.config rewrites it to Vercel,
    // which sets its own headers, and a locale redirect there would break
    // the challenge.
    "/((?!_next|monitoring|149e9513-01fa-4fb0-aad4-566afd725d1b|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/api/:path*",
  ],
};

// Only widen the CSP where the toolbar actually renders. Keying this on
// FLAGS_SECRET alone meant production carried vercel.live allowances for a
// toolbar it no longer loads.
const headerOptions = isToolbarEnabled()
  ? securityOptionsWithToolbar
  : securityOptions;

// Skip i18n rewriting for routes outside [locale] (i18n middleware's own
// matcher excludes these, but proxy.ts runs it for all matched routes,
// causing rewrites to /en/... paths that don't exist). The two metadata
// files live at the app root, where Next serves them from.
const UNLOCALIZED = new Set(["/robots.txt", "/sitemap.xml"]);

// The pages after the confirmation link, its button and the unsubscribe
// button are only for the visitor who just came from them: without the ticket their
// redirect set, the address is a 404.
const ticketed = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const ticket = TICKETS.find((t) => t.path === pathname);
  if (ticket && !request.cookies.has(ticket.cookie)) {
    return NextResponse.rewrite(
      new URL(`${ticket.path}/not-found`, request.url),
      { status: 404 }
    );
  }
};

const i18nWithExclusions = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  if (
    UNLOCALIZED.has(pathname) ||
    pathname.startsWith("/api") ||
    // /confirm (the button) and /confirmed (the thank-you).
    pathname.startsWith("/confirm") ||
    pathname.startsWith("/unsubscribe") ||
    pathname.startsWith("/.well-known")
  ) {
    return;
  }
  return internationalizationMiddleware(request);
};

// The chain: the ticket check, then the locale rewrite, then a plain
// `next()`. Whichever response comes back, the security headers are merged
// onto it rather than offered as a fallback that never gets used. Bots are
// not this file's business: BotID checks the two forms that send mail, in
// their own handlers (lib/bot-check.ts).
export const proxy: NextProxy = async (request: NextRequest) => {
  const response =
    ticketed(request) ??
    (await i18nWithExclusions(request)) ??
    NextResponse.next();
  return withSecurityHeaders(response, securityHeaders(headerOptions));
};
