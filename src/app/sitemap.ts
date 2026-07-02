import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo-config";
import { projects } from "@/lib/portfolio-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const sections: { path: string; priority: number; changeFreq: "monthly" | "weekly" }[] = [
    { path: "/", priority: 1.0, changeFreq: "monthly" },
    { path: "/#about", priority: 0.9, changeFreq: "monthly" },
    { path: "/#work", priority: 0.9, changeFreq: "weekly" },
    { path: "/#capabilities", priority: 0.8, changeFreq: "monthly" },
    { path: "/#contact", priority: 0.8, changeFreq: "monthly" },
  ];
  const projectEntries: { path: string; priority: number; changeFreq: "monthly" }[] = projects.map(() => ({
    path: "/#work",
    priority: 0.7,
    changeFreq: "monthly",
  }));
  return [...sections, ...projectEntries].map((s) => ({
    url: `${siteConfig.url}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFreq,
    priority: s.priority,
  }));
}
