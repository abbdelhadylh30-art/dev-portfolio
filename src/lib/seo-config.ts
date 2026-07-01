import { profile } from "@/lib/portfolio-data";

export const SITE_URL = "https://abdelhady-gabriel.vercel.app";

export const primaryKeywords = [
  "Abdelhady Gabriel",
  "Abdelhady Gabriel developer",
  "full-stack developer Egypt",
  "Next.js developer portfolio",
  "React developer Egypt",
  "TypeScript developer Cairo",
  "product engineer portfolio",
  "developer tools builder",
  "landing page builder",
  "AI web apps developer",
  "freelance web developer Egypt",
  "Next.js 16 expert",
];

export const siteConfig = {
  name: profile.name,
  title: `${profile.name} — ${profile.role}`,
  shortTitle: `${profile.name} · Full-Stack Dev`,
  description: `${profile.name} is a ${profile.role.toLowerCase()} based in ${profile.location}. Builder of Forge Studio, PixelForge, LandingForge, Lead Profiler, and client portfolios. Available for freelance and full-time roles.`,
  shortDescription: `${profile.name} — ${profile.role}. Builder of developer tools and AI-powered web apps with Next.js, React, and TypeScript.`,
  url: SITE_URL,
  locale: "en_US",
  siteName: `${profile.name} — Portfolio`,
  twitterHandle: "",
  keywords: primaryKeywords,
  email: profile.email,
  phone: profile.phone,
  location: profile.location,
  role: profile.role,
} as const;
