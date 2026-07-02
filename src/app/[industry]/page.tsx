import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { industries, industrySlugs } from "@/lib/industries-data";
import { IndustryPage } from "@/components/industry/industry-page";
import { profile } from "@/lib/portfolio-data";

export function generateStaticParams() {
  return industrySlugs.map((slug) => ({ industry: slug }));
}

export function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> | Metadata {
  // params is a Promise in Next.js 16 — but generateMetadata can be sync
  // We'll handle it as a regular object since generateStaticParams pre-renders all pages
  return generateMetadataSync(params as unknown as { industry: string });
}

function generateMetadataSync({ industry }: { industry: string }): Metadata {
  const ind = industries.find((i) => i.slug === industry);
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
