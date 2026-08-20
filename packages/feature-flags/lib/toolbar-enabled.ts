import { keys } from "../keys";

/**
 * Whether the Vercel Toolbar should be wired up in this environment.
 *
 * The toolbar is a development instrument, but `FLAGS_SECRET` is set in every
 * environment, so gating on it alone shipped the toolbar to production
 * visitors: `feedback.js`, a `feedback.html` iframe, and a `fetch` of the
 * page's own OG image — roughly 120 KB and three extra origins, on a surface
 * only the team can log into. Preview is where flag overrides earn their keep,
 * so the toolbar runs there and locally, and stays out of production.
 *
 * `VERCEL_ENV` is unset outside Vercel, which is what keeps it available in
 * local development.
 *
 * This lives apart from `./toolbar` on purpose. That module reaches for
 * `@vercel/toolbar/plugins/next`, a build-time plugin that drags in chokidar
 * and the native fsevents binding; importing it from the proxy or a Server
 * Component fails the Turbopack build with "non-ecmascript placeable asset".
 * Runtime callers want this file, never that one.
 */
export const isToolbarEnabled = (): boolean =>
  Boolean(keys().FLAGS_SECRET) && process.env.VERCEL_ENV !== "production";
