/**
 * Tiny bearer-token auth for the portfolio admin inbox.
 *
 * The token is read from `PORTFOLIO_ADMIN_TOKEN` (provisioned per-
 * environment in production). There is deliberately NO hardcoded
 * fallback: this repo is public, so a built-in default token would be
 * a publicly known key to the whole admin surface. Fail-closed — if
 * the env var is missing, admin access is disabled everywhere.
 *
 * The dashboard client stores the token in localStorage after the user types
 * it once; the token is sent as `Authorization: Bearer <token>`.
 */

export function getAdminToken(): string | undefined {
  return process.env.PORTFOLIO_ADMIN_TOKEN;
}

/**
 * Returns true if the request carries a valid admin bearer token.
 * Reads `Authorization: Bearer <token>` from any request-like object.
 */
export function isAdminAuthorized(request: Request): boolean {
  const expected = getAdminToken();
  if (!expected) return false; // no token provisioned → locked
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  // Constant-time-ish compare — not strictly required for a personal site,
  // but a free correctness hedge.
  const got = match[1].trim();
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Client-side helper that builds the Authorization header for fetch calls
 * against the admin endpoints, reading the token from localStorage (which
 * is populated by the AdminDashboard's token input).
 */
export function adminAuthHeader(token: string): Record<string, string> {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

/**
 * HTTP headers that mark a response as non-indexable by search engines.
 * Belt-and-suspenders on top of `robots.txt` — the robots.txt file is a
 * "polite request" that crawlers can ignore, while the `X-Robots-Tag`
 * header is a real HTTP header that well-behaved crawlers respect even
 * when they reach the URL via a direct link.
 *
 * Use this on every admin-only API response so the admin endpoints stay
 * out of search engines regardless of how they're reached.
 */
export const NOINDEX_HEADERS: HeadersInit = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};
