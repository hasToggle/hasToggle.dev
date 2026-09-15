/**
 * Where the confirmation link points. The request's own origin is what a
 * preview deployment or a local run needs — the token is in that database
 * — but it comes from the Host header, which anything can send. So the
 * request origin is honoured only when it is the configured site, a Vercel
 * preview host, or localhost; anything else gets the configured origin.
 */
export function confirmationOrigin(
  requestUrl: string,
  configuredUrl: string
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
    host.endsWith(".vercel.app");

  return trusted ? request.origin : configured;
}
