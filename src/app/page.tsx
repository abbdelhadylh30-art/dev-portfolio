/* Page content elements (keyed by the page ids in src/lib/site-pages.ts) */
import { Hero } from "@/components/portfolio/hero";
import { HighlightsStrip } from "@/components/portfolio/highlights-strip";
import { ProcessStrip } from "@/components/portfolio/process-strip";
import { TestimonialsStrip } from "@/components/portfolio/testimonials-strip";
import { About } from "@/components/portfolio/about";
import { Projects } from "@/components/portfolio/projects";
import { ClientWork } from "@/components/portfolio/client-work";
import { Skills } from "@/components/portfolio/skills";
import { JourneyTimeline } from "@/components/portfolio/journey-timeline";
import { ShippedStrip } from "@/components/portfolio/shipped-strip";
import { NowSection } from "@/components/portfolio/now-section";
import { Contact } from "@/components/portfolio/contact";
import { projects } from "@/lib/portfolio-data";
import { getMode } from "@/lib/mode-server";

// Client ("Business") view
import { ClientHero } from "@/components/portfolio/client-mode/client-hero";
import { Services } from "@/components/portfolio/client-mode/services";
import { Results } from "@/components/portfolio/client-mode/results";
import { ClientProcess } from "@/components/portfolio/client-mode/client-process";
import { AboutLite } from "@/components/portfolio/client-mode/about-lite";
import { TrustFaq } from "@/components/portfolio/client-mode/trust-faq";
import { ClientContact } from "@/components/portfolio/client-mode/client-contact";
import { ModeTransformOverlay } from "@/components/portfolio/mode-transform-overlay";
import { PortfolioShell } from "@/components/portfolio/portfolio-shell";

/**
 * Per-project social previews: a shared `?p=<slug>` deep link (copied from
 * the project modal) gets its own title, description and OG image —
 * `/api/og?p=<slug>` renders a branded project-brief card on the fly.
 * Anything else keeps the default profile metadata from layout.tsx.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<import("next").Metadata> {
  const params = await searchParams;
  const raw = params.p;
  const slug = (Array.isArray(raw) ? raw[0] : raw)?.toLowerCase();
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;

  // Mode-aware fallback: the Business view is the default face of the site,
  // so links shared in WhatsApp/Instagram bios should preview a client-
  // facing card ("websites for businesses") instead of the developer résumé.
  // Dev-mode visitors keep the engineer-flavoured metadata from layout.tsx.
  if (!project) {
    const mode = await getMode();
    if (mode === "client") {
      const title = "Websites that work as hard as you do — Abdelhady Gabriel";
      const description =
        "Fixed-price websites and booking systems for businesses in Egypt and the Gulf. Fast, bilingual (Arabic + English), built to rank on Google — with support after launch. Starts with a free 15-minute chat.";
      const image = "/api/og?mode=client";
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: "website",
          siteName: "Abdelhady Gabriel",
          images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [image],
        },
      };
    }
    return {};
  }

  const title = `${project.name} — Abdelhady Gabriel`;
  const description = project.description;
  const image = `/api/og?p=${project.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: project.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Home() {
  const mode = await getMode();

  /* One page per section — the paged portfolio. Both element sets are
     shipped to the client; PortfolioShell decides which tree is live
     (first paint follows this server mode so SSR + hydration match,
     then the client store owns the Business ⇄ Developer flip). */
  const clientElements: Record<string, React.ReactNode> = {
    home: <ClientHero />,
    services: <Services />,
    results: <Results />,
    process: <ClientProcess />,
    about: <AboutLite />,
    faq: <TrustFaq />,
    contact: <ClientContact />,
  };

  const devElements: Record<string, React.ReactNode> = {
    home: (
      <>
        <Hero />
        <HighlightsStrip />
      </>
    ),
    about: (
      <>
        <About />
        <ProcessStrip />
      </>
    ),
    work: <Projects />,
    clients: (
      <>
        <ClientWork />
        <TestimonialsStrip />
      </>
    ),
    skills: (
      <>
        <Skills />
        <ShippedStrip />
      </>
    ),
    journey: <JourneyTimeline />,
    now: <NowSection />,
    contact: <Contact />,
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Subtle grain overlay — fixed, pointer-events-none */}
      <div
        aria-hidden
        className="bg-grain pointer-events-none fixed inset-0 -z-50 opacity-30 dark:opacity-40"
      />

      {/* Client cockpit: owns the live mode, the skin (body[data-view] +
          theme class), the paged router and all shared chrome. */}
      <PortfolioShell
        serverMode={mode}
        clientElements={clientElements}
        devElements={devElements}
      />

      {/* Transformers-style Business ⇄ Developer mode-shift overlay.
          Rendered OUTSIDE the shell so it stays mounted — and its phase
          machine keeps running — no matter which tree is live. It swaps
          the live mode itself the instant the plates seal the screen. */}
      <ModeTransformOverlay />
    </div>
  );
}
