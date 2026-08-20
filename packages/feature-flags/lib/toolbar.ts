import { isToolbarEnabled } from "./toolbar-enabled";

/**
 * Build-time only. This pulls in `@vercel/toolbar/plugins/next`, which depends
 * on chokidar and the native fsevents binding — import it from anywhere that
 * gets bundled for the browser, the proxy or a Server Component and the
 * Turbopack build fails. Runtime callers want `./toolbar-enabled`.
 */
export const withToolbar = async (config: object) => {
  if (isToolbarEnabled()) {
    const { withVercelToolbar } = await import("@vercel/toolbar/plugins/next");
    return withVercelToolbar()(config);
  }
  return config;
};
