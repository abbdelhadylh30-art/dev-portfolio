import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { profile, projects, skillGroups } from "@/lib/portfolio-data";
import { getMode } from "@/lib/mode-server";

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
    "Clinic websites Egypt",
    "Restaurant websites Egypt",
    "Real estate websites Egypt",
    "SEO fast websites",
  ],
  authors: [{ name: "Abdelhady Gabriel" }],
  openGraph: {
    title: "Abdelhady Gabriel — Full-Stack Developer & Product Engineer",
    description:
      "Fast, bilingual websites and web apps for businesses in Egypt and the Gulf — built with Next.js 16, TypeScript and Prisma.",
    type: "website",
    siteName: "Abdelhady Gabriel",
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
 * JSON-LD Person structured data — gives search engines an explicit,
 * schema.org-typed understanding of who this page is about. Renders
 * as a server-side `<script type="application/ld+json">` so it's
 * available immediately to crawlers.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  givenName: profile.firstName,
  familyName: profile.lastName,
  jobTitle: profile.role,
  description:
    "Abdelhady Gabriel is a full-stack developer & product engineer based in Egypt. Builder of Forge Studio, PixelForge, LandingForge, Lead Profiler, and client portfolios. Available for freelance and full-time roles.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  image: profile.avatarUrl,
  email: `mailto:${profile.email}`,
  telephone: profile.phoneIntl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
  nationality: {
    "@type": "Country",
    name: "Egypt",
  },
  knowsLanguage: ["en", "ar"],
  sameAs: [profile.githubUrl],
  knowsAbout: Array.from(
    new Set(
      [
        ...skillGroups.flatMap((g) => g.skills.map((s) => s.name)),
        ...projects.flatMap((p) => p.primaryTech),
        "Next.js 16",
        "TypeScript",
        "Prisma",
        "Tailwind CSS 4",
        "shadcn/ui",
        "Framer Motion",
        "Bilingual AR/EN",
        "RTL",
        "Multi-tenant SaaS",
      ]
    )
  ).slice(0, 30),
  worksFor: {
    "@type": "Organization",
    name: "Independent",
  },
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
