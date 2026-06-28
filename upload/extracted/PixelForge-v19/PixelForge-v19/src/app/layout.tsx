import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PixelForge v19 — Landing Page Audit & Optimization",
  description:
    "PixelForge is a smart landing page audit and optimization tool. Import any page, get instant quality scores across SEO, accessibility, content, structure, and performance, then fix issues with one click.",
  keywords: ["landing page", "audit", "SEO", "accessibility", "page speed", "optimization"],
  authors: [{ name: "PixelForge" }],
  openGraph: {
    title: "PixelForge v19",
    description: "Import any landing page, get an instant quality score, find the top fixes, and download the improved version.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
