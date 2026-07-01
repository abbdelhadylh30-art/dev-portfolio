import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Googlebot", allow: "/", crawlDelay: 0 },
      { userAgent: "Bingbot", allow: "/", crawlDelay: 1 },
      { userAgent: ["Twitterbot", "facebookexternalhit", "LinkedInBot", "Slackbot", "Discordbot", "TelegramBot", "WhatsApp"], allow: "/" },
      { userAgent: ["GPTBot", "ClaudeBot", "Claude-Web", "CCBot", "Google-Extended", "PerplexityBot", "Amazonbot"], allow: "/", crawlDelay: 2 },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "*", allow: "/", crawlDelay: 1 },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
