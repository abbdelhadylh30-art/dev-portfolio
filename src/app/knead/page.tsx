import type { Metadata } from "next";
import { KneadPage } from "@/components/knead/knead-page";

export const metadata: Metadata = {
  title: "Knead Bakery — Site Reimagining | Abdelhady Gabriel",
  description:
    "A reimagined Knead Bakery website with documented design analysis. Custom Fraunces serif, warm cream palette, menu grouped by moments of the day, and full case study explaining every decision.",
  alternates: { canonical: "https://abdelhady-gabriel.vercel.app/knead" },
  openGraph: {
    title: "Knead Bakery — Site Reimagining",
    description: "A bakery website reimagined with documented design decisions. By Abdelhady Gabriel.",
    url: "https://abdelhady-gabriel.vercel.app/knead",
    type: "website",
  },
};

export default function KneadRoute() {
  return <KneadPage />;
}
