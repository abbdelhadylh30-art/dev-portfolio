import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Legacy-domain redirect: abdelhady-gabriel.vercel.app → www.abdelhadygabriel.me
 *
 * The custom domain is live, but the project's old *.vercel.app URL still
 * serves 200s. Google has the old URL indexed, so every legacy URL must
 * permanently redirect (308) to the same path + query on the canonical
 * host. This is the server-side half of the site-move story, alongside
 * the canonical/OG/sitemap flip to SITE_URL (src/lib/site-url.ts).
 *
 * Why a middleware instead of next.config redirects: Next.js redirect
 * rules cannot match on the request host; middleware can.
 *
 * Safety:
 *  - Runs only when the exact legacy host is requested. Preview
 *    deployments (abdelhady-gabriel-<hash>.vercel.app), localhost and
 *    the custom domains themselves are untouched.
 *  - 308 = Permanent Redirect, method- and body-preserving; Googlebot
 *    treats it exactly like a 301 and transfers ranking signals.
 */

const LEGACY_HOST = "abdelhady-gabriel.vercel.app";
const CANONICAL_HOST = "www.abdelhadygabriel.me";

export function middleware(request: NextRequest) {
  // Vercel fronts the app with a proxy: the real requested host lives in
  // x-forwarded-host (host is the internal edge address).
  const forwarded = request.headers.get("x-forwarded-host");
  const host = (forwarded ?? request.headers.get("host") ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();

  if (host !== LEGACY_HOST) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.host = CANONICAL_HOST;
  url.port = "";

  return NextResponse.redirect(url, 308);
}

export const config = {
  /** Match every path — documents, /api routes, feeds, images. */
  matcher: ["/((?!_next/static|_next/image).*)"],
};
