import { siteConfig } from "@/lib/seo-config";
import { projects } from "@/lib/portfolio-data";

export function StructuredData() {
  const personSchema = {
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.name,
    givenName: siteConfig.name.split(" ")[0],
    familyName: siteConfig.name.split(" ").slice(1).join(" "),
    url: siteConfig.url,
    image: `${siteConfig.url}/og-square.png`,
    email: `mailto:${siteConfig.email}`,
    telephone: `+20${siteConfig.phone.replace(/^0/, "")}`,
    jobTitle: siteConfig.role,
    description: siteConfig.description,
    address: { "@type": "PostalAddress", addressCountry: "EG", addressRegion: siteConfig.location },
    nationality: { "@type": "Country", name: "Egypt" },
    knowsAbout: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "Node.js", "Full-Stack Development", "Web Performance", "SEO", "Accessibility", "Zustand", "Framer Motion", "shadcn/ui"],
    knowsLanguage: ["en", "ar"],
    sameAs: [siteConfig.url].filter(Boolean) as string[],
  };

  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.siteName,
    description: siteConfig.shortDescription,
    publisher: { "@id": `${siteConfig.url}/#person` },
    inLanguage: "en",
  };

  const profilePageSchema = {
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/#profilepage`,
    url: siteConfig.url,
    name: `${siteConfig.name} — Portfolio`,
    description: siteConfig.description,
    inLanguage: "en",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#person` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${siteConfig.url}/og.png`, width: 1200, height: 630 },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().slice(0, 10),
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${siteConfig.url}/#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: `${siteConfig.url}/#work` },
      { "@type": "ListItem", position: 3, name: "Capabilities", item: `${siteConfig.url}/#capabilities` },
      { "@type": "ListItem", position: 4, name: "Contact", item: `${siteConfig.url}/#contact` },
    ],
  };

  const projectSchemas = projects.map((project, i) => ({
    "@type": "CreativeWork",
    "@id": `${siteConfig.url}/#project-${project.index}`,
    name: project.name,
    description: project.summary,
    url: project.links?.[0]?.href || siteConfig.url,
    image: project.screenshots[0] ? { "@type": "ImageObject", url: `${siteConfig.url}${project.screenshots[0].src}`, caption: project.screenshots[0].caption } : undefined,
    creator: { "@id": `${siteConfig.url}/#person` },
    author: { "@id": `${siteConfig.url}/#person` },
    datePublished: `${project.year}-01-01`,
    keywords: project.stack.join(", "),
    genre: project.category,
    inLanguage: "en",
    position: i + 1,
    thumbnailUrl: project.screenshots[0] ? `${siteConfig.url}${project.screenshots[0].src}` : undefined,
  }));

  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${siteConfig.url}/#projects`,
    name: "Selected Work",
    description: "Portfolio of shipped Next.js projects by Abdelhady Gabriel.",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: project.name,
      url: `${siteConfig.url}/#work`,
      item: { "@id": `${siteConfig.url}/#project-${project.index}` },
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [personSchema, websiteSchema, profilePageSchema, breadcrumbSchema, itemListSchema, ...projectSchemas],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
