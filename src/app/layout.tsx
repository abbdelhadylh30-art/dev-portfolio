import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/seo-config";
import { StructuredData } from "@/components/seo/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─────────────────────────────────────────────────────────────────────────────
// Comprehensive SEO metadata
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },

  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,

  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: siteConfig.url,
  },

  openGraph: {
    type: "profile",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    title: siteConfig.title,
    description: siteConfig.shortDescription,
    firstName: siteConfig.name.split(" ")[0],
    lastName: siteConfig.name.split(" ").slice(1).join(" "),
    username: siteConfig.name,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.role}`,
        type: "image/png",
      },
      {
        url: "/og-square.png",
        width: 1200,
        height: 1200,
        alt: `${siteConfig.name} — ${siteConfig.role}`,
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle || undefined,
    creator: siteConfig.twitterHandle || undefined,
    title: siteConfig.title,
    description: siteConfig.shortDescription,
    images: ["/og.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64", type: "image/x-icon" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },

  applicationName: siteConfig.siteName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteConfig.name,
  },

  manifest: "/manifest.webmanifest",
  category: "technology",

  other: {
    "profile:first_name": siteConfig.name.split(" ")[0],
    "profile:last_name": siteConfig.name.split(" ").slice(1).join(" "),
    "profile:username": siteConfig.name,
    "contact:email": siteConfig.email,
    "contact:phone_number": siteConfig.phone,
    "contact:country_name": siteConfig.location,
    "geo.region": "EG",
    "geo.placename": siteConfig.location,
    "theme-color": "#08080c",
    "color-scheme": "dark",
    "author": siteConfig.name,
    "publisher": siteConfig.name,
    "keywords": siteConfig.keywords.join(", "),
    "page-topic": "Portfolio",
    "page-type": "Portfolio",
    "audience": "all",
    "revisit-after": "7 days",
    "language": "English",
    "distribution": "global",
    "rating": "general",
    "copyright": siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#08080c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <StructuredData />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="canonical" href={siteConfig.url} />
        {/* Explicit favicon declarations for Google's favicon crawler */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" type="image/x-icon" />
        <link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/favicon-96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        <link rel="mask-icon" href="/icon.svg" color="#08080c" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
