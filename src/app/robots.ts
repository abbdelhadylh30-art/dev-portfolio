import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * Generates /robots.txt. Allows the public portfolio root, but keeps the
 * admin API endpoints (messages inbox + analytics) out of search engines.
 */
export default function robots(): MetadataRoute.Robots {
  // Canonical production URL — see src/lib/site-url.ts.
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/contact/messages", "/api/events", "/api/now"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
