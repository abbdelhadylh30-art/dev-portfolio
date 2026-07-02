import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const sections: { path: string; priority: number; changeFreq: "monthly" | "weekly" }[] = [
    { path: "/", priority: 1.0, changeFreq: "monthly" },
    { path: "/#about", priority: 0.9, changeFreq: "monthly" },
    { path: "/#industries", priority: 0.9, changeFreq: "monthly" },
    { path: "/work", priority: 0.9, changeFreq: "weekly" },
    { path: "/dental", priority: 0.8, changeFreq: "monthly" },
    { path: "/medical", priority: 0.8, changeFreq: "monthly" },
    { path: "/restaurants", priority: 0.8, changeFreq: "monthly" },
    { path: "/real-estate", priority: 0.8, changeFreq: "monthly" },
    { path: "/#contact", priority: 0.8, changeFreq: "monthly" },
  ];
  return sections.map((s) => ({
    url: `${siteConfig.url}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFreq,
    priority: s.priority,
  }));
}
