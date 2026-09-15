/**
 * Where the confirmation link points. The request's own origin is what a
 * preview deployment or a local run needs — the token is in that database
 * — but it comes from the Host header, which anything can send. So the
 * request origin is honoured only when its host is the configured site,
 * one of this deployment's own hostnames (VERCEL_URL and VERCEL_BRANCH_URL,
 * set by the platform), or localhost. Any other host, including someone
 * else's *.vercel.app, gets the configured origin.
 */
export function confirmationOrigin(
  requestUrl: string,
  configuredUrl: string,
  deploymentHosts: readonly (string | undefined)[] = [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
  ]
): string {
  const configured = new URL(configuredUrl).origin;
  let request: URL;
  try {
    request = new URL(requestUrl);
  } catch {
    return configured;
  }

  const host = request.hostname;
  const trusted =
    request.origin === configured ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    deploymentHosts.some((own) => own && own.toLowerCase() === host);

  return trusted ? request.origin : configured;
}
