import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Forge Studio — Build. Audit. Ship.",
  description:
    "The all-in-one landing page studio. Drag-drop builder + 5-category auditor with one-click fixes. Build, audit, and ship landing pages in one place.",
  keywords: ["landing page", "page builder", "audit", "SEO", "accessibility", "no-code", "Forge Studio"],
  authors: [{ name: "Forge Studio" }],
  openGraph: {
    title: "Forge Studio",
    description: "Build. Audit. Ship. The all-in-one landing page studio.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
