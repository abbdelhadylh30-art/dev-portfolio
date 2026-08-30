import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { profile } from "@/lib/portfolio-data";
import { getMode } from "@/lib/mode-server";
import { buildJsonLdGraph } from "@/lib/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdelhady Gabriel — Full-Stack Developer & Product Engineer",
  description:
    "Abdelhady Gabriel is a full-stack developer & product engineer based in Egypt. Builder of Forge Studio, PixelForge, LandingForge, Lead Profiler, and client portfolios. Available for freelance and full-time roles.",
  keywords: [
    "Abdelhady Gabriel",
    "Full-Stack Developer",
    "Product Engineer",
    "Next.js 16",
    "TypeScript",
    "Prisma",
    "Portfolio",
    "Bilingual SaaS",
    "RTL",
    "Web developer Egypt",
    "Web developer Cairo",
    "Clinic websites Egypt",
    "Restaurant websites Egypt",
    "Real estate websites Egypt",
    "Booking system Egypt",
    "Arabic English website",
    "SEO fast websites",
  ],
  authors: [{ name: "Abdelhady Gabriel", url: profile.githubUrl }],
  creator: "Abdelhady Gabriel",
  publisher: "Abdelhady Gabriel",
  applicationName: "Abdelhady Gabriel",
  category: "technology",
  /** Index everything; let Google use large image previews (Discover,
   *  rich results) and full snippet lengths. */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  /** Search-engine verification codes — set via env vars when the
   *  owner registers the site with Google Search Console / Bing
   *  Webmaster Tools. Absent env → tags are simply omitted. */
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
  openGraph: {
    title: "Abdelhady Gabriel — Full-Stack Developer & Product Engineer",
    description:
      "Fast, bilingual websites and web apps for businesses in Egypt and the Gulf — built with Next.js 16, TypeScript and Prisma.",
    type: "website",
    siteName: "Abdelhady Gabriel",
    locale: "en_US",
    url: "/",
    /** Generated on the fly by /api/og — branded card with avatar, name,
     *  role, tagline + repo stats. Rendered with next/og (Satori). */
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Abdelhady Gabriel — Full-Stack Developer & Product Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdelhady Gabriel — Full-Stack Developer & Product Engineer",
    description:
      "Fast, bilingual websites and web apps for businesses in Egypt and the Gulf — built with Next.js 16, TypeScript and Prisma.",
    images: ["/api/og"],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  alternates: {
    canonical: "/",
    /** Atom feed of the live "Recently shipped" commits — served by
     *  /api/feed and advertised so readers/news aggregators can discover
     *  it automatically from the homepage <head>. */
    types: {
      "application/atom+xml": "/api/feed",
    },
  },
};

/**
 * JSON-LD structured data — a schema.org @graph (WebSite + ProfilePage
 * + Person, plus ProfessionalService & FAQPage for the Business view)
 * built in src/lib/schema.ts. Renders as a server-side
 * `<script type="application/ld+json">` so it is available immediately
 * to crawlers. Mode-aware: the default (cookie-less) Business view
 * ships the full business graph.
 */
async function jsonLdFor(mode: Awaited<ReturnType<typeof getMode>>) {
  return buildJsonLdGraph(mode);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fixed skins: the Business view is ALWAYS the friendly warm-light
  // skin (coral → amber → rose on cream), and the Developer view is
  // ALWAYS the original dark. No visitor-selectable theme — the mode
  // owns it. `data-view` on <body> scopes the warm palette from
  // globals.css and also flows into portal content (toasts, dialogs).
  const mode = await getMode();
  const jsonLd = await jsonLdFor(mode);

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        data-view={mode}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme={mode === "client" ? "light" : "dark"}
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
