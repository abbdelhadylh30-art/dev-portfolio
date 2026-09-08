/**
 * The single source of truth for the site's canonical public URL.
 *
 * The production domain is www.abdelhadygabriel.me (the apex
 * abdelhadygabriel.me 308-redirects to www at the Vercel edge, so www
 * is the canonical host). Every absolute URL the site emits —
 * canonical tags, og:url, sitemap.xml, robots.txt, JSON-LD @ids and
 * the Atom feed — must resolve to this host, because that is the URL
 * we want Google to index and consolidate ranking signals on.
 *
 * Precedence:
 *  1. NEXT_PUBLIC_SITE_URL env var (override for local dev / previews)
 *  2. https://www.abdelhadygabriel.me (production default)
 *
 * Note: the legacy fallback chain used process.env.VERCEL_URL, which
 * resolves to the project's *.vercel.app alias on Vercel — that kept
 * canonicals pointed at abdelhady-gabriel.vercel.app after the custom
 * domain was connected, telling Google the old URL was the real one.
 * VERCEL_URL is deliberately no longer part of the chain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.abdelhadygabriel.me")
  .replace(/\/+$/, "");
