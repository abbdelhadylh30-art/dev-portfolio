import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { industries, industrySlugs } from "@/lib/industries-data";
import { IndustryPage } from "@/components/industry/industry-page";

export function generateStaticParams() {
  return industrySlugs.map((slug) => ({ industry: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry: slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) return { title: "Not found" };

  return {
    title: ind.metaTitle,
    description: ind.metaDescription,
    keywords: ind.keywords,
    alternates: { canonical: `https://abdelhady-gabriel.vercel.app/${ind.slug}` },
    openGraph: {
      title: ind.metaTitle,
      description: ind.metaDescription,
      url: `https://abdelhady-gabriel.vercel.app/${ind.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ind.metaTitle,
      description: ind.metaDescription,
    },
  };
}

export default async function IndustryRoute({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry: slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();

  return <IndustryPage industry={industry} />;
}
