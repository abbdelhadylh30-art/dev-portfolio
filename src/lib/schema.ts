import { profile, projects, skillGroups, services, faqs } from "@/lib/portfolio-data";
import type { PortfolioMode } from "@/lib/mode";

/**
 * Structured data (JSON-LD) builder — a schema.org `@graph` that gives
 * search engines an explicit, machine-readable understanding of the
 * site: who Abdelhady is (Person/ProfilePage), what the site is
 * (WebSite), what the business offers (ProfessionalService) and the
 * client-facing FAQ (FAQPage).
 *
 * Mode-aware: crawlers arrive cookie-less, which renders the Business
 * view by default — so the client mode emits the full graph including
 * the business entities. The Developer view keeps Person + WebSite +
 * ProfilePage (the résumé face).
 */

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

const DEV_DESCRIPTION =
  "Abdelhady Gabriel is a full-stack developer & product engineer based in Egypt. Builder of Forge Studio, PixelForge, LandingForge, Lead Profiler, and client portfolios. Available for freelance and full-time roles.";

const CLIENT_DESCRIPTION =
  "Fixed-price websites and booking systems for businesses in Egypt and the Gulf. Fast, bilingual (Arabic + English), built to rank on Google — with support after launch.";

/** The countries the business actively serves (Egypt + the Gulf). */
const AREA_SERVED = ["Egypt", "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Bahrain", "Oman"];

export function buildJsonLdGraph(mode: PortfolioMode): Record<string, unknown> {
  const base = siteUrl();
  const personId = `${base}/#person`;
  const websiteId = `${base}/#website`;
  const isClient = mode === "client";

  const graph: Record<string, unknown>[] = [
    /* ── WebSite ─────────────────────────────────────────────────── */
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: base,
      name: "Abdelhady Gabriel",
      description: isClient ? CLIENT_DESCRIPTION : DEV_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": personId },
    },

    /* ── ProfilePage ─────────────────────────────────────────────── */
    {
      "@type": "ProfilePage",
      "@id": `${base}/#profile-page`,
      url: base,
      name: isClient
        ? "Abdelhady Gabriel — Web Developer for Businesses"
        : "Abdelhady Gabriel — Full-Stack Developer & Product Engineer",
      description: isClient ? CLIENT_DESCRIPTION : DEV_DESCRIPTION,
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": personId },
      about: { "@id": personId },
    },

    /* ── Person ──────────────────────────────────────────────────── */
    {
      "@type": "Person",
      "@id": personId,
      name: profile.name,
      givenName: profile.firstName,
      familyName: profile.lastName,
      jobTitle: isClient ? "Web Developer" : profile.role,
      description: isClient ? CLIENT_DESCRIPTION : DEV_DESCRIPTION,
      url: base,
      image: profile.avatarUrl,
      email: `mailto:${profile.email}`,
      telephone: profile.phoneIntl,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cairo",
        addressCountry: "EG",
      },
      nationality: { "@type": "Country", name: "Egypt" },
      knowsLanguage: ["en", "ar"],
      sameAs: [profile.githubUrl],
      hasOccupation: {
        "@type": "Occupation",
        name: isClient ? "Web Developer" : "Full-Stack Developer & Product Engineer",
        occupationLocation: { "@type": "City", name: "Cairo" },
      },
      knowsAbout: Array.from(
        new Set([
          ...skillGroups.flatMap((g) => g.skills.map((s) => s.name)),
          ...projects.flatMap((p) => p.primaryTech),
          "Next.js 16",
          "TypeScript",
          "Prisma",
          "Tailwind CSS 4",
          "shadcn/ui",
          "Framer Motion",
          "Bilingual AR/EN",
          "RTL",
          "Multi-tenant SaaS",
        ]),
      ).slice(0, 30),
      worksFor: { "@type": "Organization", name: "Independent" },
    },
  ];

  if (isClient) {
    graph.push(
      /* ── ProfessionalService (the business face) ─────────────── */
      {
        "@type": "ProfessionalService",
        "@id": `${base}/#professional-service`,
        name: "Abdelhady Gabriel — Web Development",
        description: CLIENT_DESCRIPTION,
        url: base,
        image: profile.avatarUrl,
        telephone: profile.phoneIntl,
        email: `mailto:${profile.email}`,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cairo",
          addressCountry: "EG",
        },
        areaServed: AREA_SERVED.map((name) => ({ "@type": "Country", name })),
        founder: { "@id": personId },
        employee: { "@id": personId },
        sameAs: [profile.githubUrl],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.body,
              areaServed: AREA_SERVED.map((name) => ({ "@type": "Country", name })),
            },
          })),
        },
      },

      /* ── FAQPage (mirrors the live FAQ accordion) ─────────────── */
      {
        "@type": "FAQPage",
        "@id": `${base}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    );
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
