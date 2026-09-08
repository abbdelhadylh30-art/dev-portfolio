import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

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
  // Canonical production URL — see src/lib/site-url.ts.
  const baseUrl = SITE_URL;

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];
}
