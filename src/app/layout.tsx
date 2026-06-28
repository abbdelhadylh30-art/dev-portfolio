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
  title: "Mohamed Medhat Ahmed — Full-Stack Developer & Product Engineer",
  description:
    "Portfolio of Mohamed Medhat Ahmed — a full-stack developer building developer tools, landing page studios, and AI-powered web apps with Next.js, React, and TypeScript.",
  keywords: [
    "Mohamed Medhat Ahmed",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Product Engineer",
    "Developer Tools",
    "Portfolio",
  ],
  authors: [{ name: "Mohamed Medhat Ahmed" }],
  openGraph: {
    title: "Mohamed Medhat Ahmed — Full-Stack Developer & Product Engineer",
    description:
      "Builder of Forge Studio, PixelForge, LandingForge, and Lead Profiler. Next.js 16, React 19, TypeScript.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Medhat Ahmed — Full-Stack Developer",
    description: "Builder of Forge Studio, PixelForge, LandingForge, and Lead Profiler.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
