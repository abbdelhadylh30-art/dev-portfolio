import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.name,
    description: siteConfig.shortDescription,
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#08080c",
    theme_color: "#08080c",
    categories: ["portfolio", "developer", "technology", "productivity"],
    lang: "en",
    dir: "ltr",
    scope: "/",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "View Work", short_name: "Work", description: "See selected projects", url: "/#work", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Contact", short_name: "Contact", description: "Get in touch", url: "/#contact", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
