import type { MetadataRoute } from "next";

/**
 * Generates /sitemap.xml.
 *
 * The portfolio is a single canonical URL — the paged experience
 * (`#/services`, `#/work`, …) is a client-side hash micro-router, and
 * search engines ignore hash fragments, so listing them as separate
 * entries is noise (the previous sitemap also listed legacy anchors
 * that no longer exist). One clean, honest entry: the root document.
 *
 * `?p=<slug>` deep links exist for social previews only (unique
 * title/OG image, same body content) — deliberately not listed, as
 * they are near-duplicates of the root.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];
}
