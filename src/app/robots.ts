import type { MetadataRoute } from "next";

/**
 * Generates /robots.txt. Allows the public portfolio root, but keeps the
 * admin API endpoints (messages inbox + analytics) out of search engines.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

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
