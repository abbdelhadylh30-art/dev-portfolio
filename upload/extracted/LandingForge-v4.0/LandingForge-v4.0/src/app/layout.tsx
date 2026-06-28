import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LandingForge v4.0 — No-code landing page builder",
  description:
    "Build, ship, and iterate on landing pages without code. Drag-drop sections, theme presets, templates, HTML/ZIP export, AI copy suggestions, analytics — all in one place.",
  keywords: ["landing page", "page builder", "no-code", "Next.js", "drag and drop", "AI copy"],
  authors: [{ name: "LandingForge" }],
  openGraph: {
    title: "LandingForge v4.0",
    description: "The no-code landing page builder. Drag, drop, ship.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
