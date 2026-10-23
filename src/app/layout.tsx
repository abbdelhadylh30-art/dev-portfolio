import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { profile } from "@/lib/portfolio-data";
import { getMode } from "@/lib/mode-server";
import { buildJsonLdGraph } from "@/lib/schema";
import { SITE_URL } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Arabic family for the Business view's AR mode — geometric, highly
 * legible at UI sizes, and pairs cleanly with Geist. next/font
 * downloads + self-hosts the woff2 (arabic + latin subsets with
 * unicode-range) at build time, so nothing is fetched from Google
 * at runtime. */
const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/**
 * Early-apply language/direction/palette preferences before hydration.
 * The Business view defaults to EN/LTR on the server; a visitor who
 * chose Arabic (or a palette) last time shouldn't watch an LTR flash
 * first. Runs inline before paint; React state syncs post-hydration.
 * Values are validated — unknown values fall back to defaults.
 */
const PREF_EARLY_SCRIPT = `(function(){try{var d=document.documentElement,l=localStorage.getItem("pref-lang"),p=localStorage.getItem("pref-palette");if(l==="ar"){d.lang="ar";d.dir="rtl"}if(p==="royal"||p==="midnight"){d.dataset.palette=p}}catch(e){}})();`;

/** Google Tag Manager container for www.abdelhadygabriel.me. Public by
 *  design — the ID ships in every page's source anyway. Override with
 *  NEXT_PUBLIC_GTM_ID to point at a different container (e.g. a scratch
 *  one for experiments) without a code change. */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-M5TFLR86";

export const metadata: Metadata = {
  title: "Abdelhady Gabriel — Full-Stack Developer & Product Engineer",
  description:
    "Abdelhady Gabriel is a full-stack developer & product engineer based in Egypt. Builder of Forge Studio, ProfileForge, GlamChain, Lead Profiler, and client portfolios. Available for freelance and full-time roles.",
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
  /** Search-engine verification codes. Google's code is set as a Vercel
   *  env var (production + preview); the hardcoded fallback keeps the
   *  meta tag present even if the env var is ever lost — the value is
   *  public-by-design (it renders in the HTML head). Bing stays env-only
   *  (simply omitted when unset). */
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
      "stB6Mz35LFd0Bc0XR16zSz57eJG2JrBtd1DU5aSztz4",
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
  /** Canonical host: www.abdelhadygabriel.me — see src/lib/site-url.ts.
   *  metadataBase resolves every relative URL in metadata (canonical,
   *  og:url, og:image, feed link) against the indexed domain. */
  metadataBase: new URL(SITE_URL),
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
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased bg-background text-foreground`}
      >
        {/* Language/palette early-apply (see PREF_EARLY_SCRIPT above). */}
        <script dangerouslySetInnerHTML={{ __html: PREF_EARLY_SCRIPT }} />
        {/* Google Tag Manager — loads on production and local dev, but is
            skipped on Vercel PREVIEW deployments so test/QA traffic never
            reaches GA4. VERCEL_ENV is set automatically by Vercel. Events
            reach GTM via the dataLayer mirror in src/lib/analytics.ts. */}
        {process.env.VERCEL_ENV !== "preview" && (
          <>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
            <Script id="gtm-loader" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
          </>
        )}
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
