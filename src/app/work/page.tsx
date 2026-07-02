import type { Metadata } from "next";
import { WorkPage } from "@/components/portfolio/work-page";

export const metadata: Metadata = {
  title: "Selected Work — Full-Stack Projects",
  description:
    "Full-stack projects by Abdelhady Gabriel — Forge Studio, Lead Profiler (Haskell hardening layer), and client portfolios. Built end-to-end with Next.js 16, React 19, TypeScript.",
  alternates: { canonical: "https://abdelhady-gabriel.vercel.app/work" },
  openGraph: {
    title: "Selected Work — Abdelhady Gabriel",
    description:
      "Full-stack projects built end-to-end. Forge Studio, Lead Profiler, and client portfolios.",
    url: "https://abdelhady-gabriel.vercel.app/work",
    type: "website",
  },
};

export default function WorkRoute() {
  return <WorkPage />;
}
