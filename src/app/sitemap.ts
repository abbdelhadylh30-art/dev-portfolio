import type { MetadataRoute } from "next";
import { profile } from "@/lib/portfolio-data";

/**
 * Generates /sitemap.xml. The portfolio is a single-page site, so we list
 * the canonical root URL plus the in-page anchor sections as separate
 * entries — search engines can index each section by its hash fragment
 * and Google's "jump to" links will surface them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const lastModified = new Date();
  const sections = ["", "#about", "#work", "#skills", "#now", "#contact"];

  return sections.map((hash) => ({
    url: `${baseUrl}/${hash}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: hash === "" ? 1 : 0.7,
  }));
}
