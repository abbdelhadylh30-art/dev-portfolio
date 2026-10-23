/**
 * Central content source for the Abdelhady Gabriel portfolio.
 * Every visible string on the site is sourced from here.
 *
 * Repository data was synced from github.com/abbdelhadylh30-art
 * (17 public repositories, synced from the GitHub REST API).
 */

export type LanguageBreakdown = { name: string; percent: number; bytes: number };

export type Project = {
  name: string;
  slug: string;
  description: string;
  highlights: string[];
  repoUrl: string;
  homepage?: string;
  /** Live-build screenshot, served from /public/screenshots (1280px WebP). */
  image?: string;
  category: "SaaS" | "Web" | "Portfolio" | "Tools";
  featured: boolean;
  updatedAt: string; // ISO date
  createdAt: string; // ISO date
  languages: LanguageBreakdown[];
  primaryTech: string[];
};

export type Stat = {
  label: string;
  value: string;
  hint: string;
};

export type SkillGroup = {
  title: string;
  blurb: string;
  skills: { name: string; level: number; note: string }[];
};

export type NavLink = { label: string; href: string };

export const profile = {
  name: "Abdelhady Gabriel",
  firstName: "Abdelhady",
  lastName: "Gabriel",
  role: "Full-Stack Developer & Product Engineer",
  roleLong: "Full-Stack Developer & Product Engineer",
  tagline:
    "I build fast, bilingual websites and web apps for businesses in Egypt and the Gulf — clinics, restaurants, real estate, and developers. Sites that load in under 2 seconds, rank on Google, and turn visitors into customers.",
  /** Cycled through in the hero with a typing-style animation. */
  roleVariations: [
    "Full-Stack Developer",
    "Product Engineer",
    "Bilingual SaaS Builder",
    "Next.js 16 Specialist",
    "Sites that load <2s",
    "RTL & i18n Practitioner",
  ],
  location: "Cairo, Egypt",
  timezone: "Africa/Cairo",
  availability: "Open to freelance & full-time roles",
  languages: [
    { code: "en", label: "English" },
    { code: "ar", label: "Arabic" },
  ],
  githubUsername: "abbdelhadylh30-art",
  githubUrl: "https://github.com/abbdelhadylh30-art",
  avatarUrl: "/abdelhady-avatar.webp",
  /** Full studio portrait (About section card) — the face behind the business. */
  portraitUrl: "/abdelhady-portrait.webp",
  /** Real channels — synced from the production deployment. */
  email: "abbdelhadylh31@gmail.com",
  phoneDisplay: "0103 224 6016",
  phoneIntl: "+201032246016",
  whatsappUrl:
    "https://wa.me/201032246016?text=" +
    encodeURIComponent(
      "Hi Abdelhady — I found your portfolio and I'd like to talk about a website project."
    ),
  /** Free-audit offer — the primary business conversion path. */
  freeAudit: {
    title: "Free 15-minute audit",
    body: "I'll audit your current site, show you exactly what to fix, and give you a fixed-price quote — whether you hire me or not.",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/abbdelhadylh30-art", handle: "@abbdelhadylh30-art" },
  ],
};

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Skills", href: "#skills" },
  { label: "Journey", href: "#journey" },
  { label: "Shipped", href: "#shipped" },
  { label: "Now", href: "#now" },
  { label: "Contact", href: "#contact" },
];

export const stats: Stat[] = [
  { label: "Public Repositories", value: "9", hint: "shipped on GitHub" },
  { label: "Client Load Time", value: "<2s", hint: "every site I ship" },
  { label: "Google Rank Hit", value: "#1", hint: "client name search · 1 week" },
  { label: "Faster Rebuild", value: "45×", hint: "Wix → Next.js · Knead Bakery" },
];

export const aboutParagraphs: string[] = [
  "I'm a full-stack developer based in Egypt who turns rough product ideas into shipped, bilingual web apps. My day-to-day is Next.js 16, TypeScript and Prisma — with a soft spot for type-safe boundaries, drag-drop tooling, and Arabic-first UX (RTL included).",
  "On the business side I build websites for companies that need to be found online — clinics that want patients to book online, restaurants that want their own ordering system, real estate agencies that want leads 24/7. Every site loads in under 2 seconds, works perfectly on mobile, and shows up when customers search.",
  "Recent work spans multi-tenant salon SaaS for the Gulf region, a landing-page studio with a five-category auditor, and a Haskell hardening layer that backs a Next.js lead-generation pipeline. I like the awkward middle layer between product, design and infrastructure.",
];

export const philosophy: { title: string; body: string }[] = [
  {
    title: "Type-safe by default",
    body: "Schemas first. If the compiler can catch it, the user never sees it.",
  },
  {
    title: "Bilingual & accessible",
    body: "AR/EN with proper RTL, semantic HTML, and keyboard-first navigation.",
  },
  {
    title: "Ship, then sharpen",
    body: "Land the working version, then layer in polish, metrics and audits.",
  },
  {
    title: "Small, honest UIs",
    body: "Fewer components, more intent. Clear hierarchy over decoration.",
  },
];

export const projects: Project[] = [
  {
    name: "Forge Studio",
    slug: "forge-studio",
    description:
      "Build. Audit. Ship. — The all-in-one landing-page studio. Drag-drop builder paired with a 5-category auditor and one-click fixes.",
    highlights: [
      "Drag-and-drop landing page builder",
      "5-category auditor with one-click fixes",
      "TypeScript-first, ~865k LOC shipped",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/forge-studio",
    homepage: "https://forge-studio-green.vercel.app",
    image: "/screenshots/forge-studio.webp",
    category: "SaaS",
    featured: true,
    updatedAt: "2026-08-23T22:00:22Z",
    createdAt: "2026-07-19T22:49:48Z",
    primaryTech: ["Next.js", "TypeScript", "Drag-Drop", "Auditor"],
    languages: [
      { name: "TypeScript", percent: 97.9, bytes: 865038 },
      { name: "CSS", percent: 1.7, bytes: 14608 },
      { name: "JavaScript", percent: 0.5, bytes: 4144 },
    ],
  },
  {
    name: "CoolFix — Concept Demo",
    slug: "coolfix",
    description:
      "Concept build: 24/7 home-services dispatch (AC, plumbing, electrical) for Cairo & Riyadh — 5-step booking with 2-hour arrival windows, an emergency fast-path and a live jobs board. Fully bilingual AR/EN.",
    highlights: [
      "5-step dispatch booking, 2-hour arrival windows",
      "Emergency fast-path + live jobs board",
      "Bilingual AR/EN, WhatsApp confirmation flow",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/portfolio-demos",
    homepage: "https://demos.abdelhadygabriel.me/coolfix",
    image: "/screenshots/coolfix.webp",
    category: "Web",
    featured: true,
    updatedAt: "2026-10-16T15:47:33Z",
    createdAt: "2026-10-16T00:00:00Z",
    primaryTech: ["Next.js 16", "Tailwind 4", "zustand", "RTL"],
    languages: [
      { name: "TypeScript", percent: 97.4, bytes: 386032 },
      { name: "CSS", percent: 2.2, bytes: 8733 },
      { name: "JavaScript", percent: 0.4, bytes: 1713 },
    ],
  },
  {
    name: "Layan Interiors — Concept Demo",
    slug: "layan",
    description:
      "Concept build: interior-architecture studio site with crawlable case-study URLs (/work/[slug]) and consultation booking that pre-qualifies budget. Bilingual AR/EN with native RTL.",
    highlights: [
      "Multi-page case-study portfolio (/work/[slug])",
      "Consultation booking with budget pre-qualification",
      "Bilingual AR/EN, Arabic-first typography",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/portfolio-demos",
    homepage: "https://demos.abdelhadygabriel.me/layan",
    image: "/screenshots/layan.webp",
    category: "Web",
    featured: true,
    updatedAt: "2026-10-16T15:47:33Z",
    createdAt: "2026-10-16T00:00:00Z",
    primaryTech: ["Next.js 16", "Framer Motion", "i18n", "SEO"],
    languages: [
      { name: "TypeScript", percent: 97.4, bytes: 386032 },
      { name: "CSS", percent: 2.2, bytes: 8733 },
      { name: "JavaScript", percent: 0.4, bytes: 1713 },
    ],
  },
  {
    name: "Lumière Clinic — Concept Demo",
    slug: "lumiere",
    description:
      "Concept build: one-page scrollytelling site for an aesthetic clinic — 4-step treatment-booking wizard with live time slots and a shared owner dashboard. Bilingual AR/EN.",
    highlights: [
      "One-page scrollytelling experience",
      "4-step treatment booking wizard with slots",
      "Shared bookings dashboard across all demos",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/portfolio-demos",
    homepage: "https://demos.abdelhadygabriel.me/lumiere",
    image: "/screenshots/lumiere.webp",
    category: "Web",
    featured: true,
    updatedAt: "2026-10-16T15:47:33Z",
    createdAt: "2026-10-16T00:00:00Z",
    primaryTech: ["Next.js 16", "shadcn/ui", "zustand", "JSON-LD"],
    languages: [
      { name: "TypeScript", percent: 97.4, bytes: 386032 },
      { name: "CSS", percent: 2.2, bytes: 8733 },
      { name: "JavaScript", percent: 0.4, bytes: 1713 },
    ],
  },
  {
    name: "GlamChain",
    slug: "glamchain",
    description:
      "GlamChain v1.0 — Multi-tenant salon management SaaS for the Gulf region. Next.js 16 + TypeScript + Prisma + NextAuth. Bilingual AR/EN with full RTL support.",
    highlights: [
      "Multi-tenant salon management platform",
      "Bilingual AR/EN with RTL layouts",
      "NextAuth + Prisma data layer",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/glamchain",
    homepage: "https://glamchain.vercel.app",
    image: "/screenshots/glamchain.webp",
    category: "SaaS",
    featured: true,
    updatedAt: "2026-08-23T06:21:06Z",
    createdAt: "2026-07-25T02:49:17Z",
    primaryTech: ["Next.js 16", "Prisma", "NextAuth", "RTL", "i18n"],
    languages: [
      { name: "TypeScript", percent: 86.5, bytes: 693762 },
      { name: "HTML", percent: 10.8, bytes: 86933 },
      { name: "CSS", percent: 1.8, bytes: 14066 },
      { name: "Shell", percent: 0.7, bytes: 5733 },
      { name: "JavaScript", percent: 0.2, bytes: 1875 },
    ],
  },
  {
    name: "Dev Portfolio",
    slug: "dev-portfolio",
    description:
      "Dark Vercel-style developer portfolio template — Next.js 16, React 19, TypeScript, Tailwind 4 and Framer Motion. Hero, selected work, capabilities and contact.",
    highlights: [
      "Vercel-style dark portfolio template",
      "~1.97M LOC across TS + Haskell + CSS",
      "Framer Motion throughout",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/dev-portfolio",
    image: "/screenshots/dev-portfolio.webp",
    category: "Portfolio",
    featured: true,
    updatedAt: "2026-07-03T00:04:12Z",
    createdAt: "2026-06-28T03:55:56Z",
    primaryTech: ["Next.js 16", "React 19", "Tailwind 4", "Framer Motion"],
    languages: [
      { name: "TypeScript", percent: 90.7, bytes: 1792516 },
      { name: "Haskell", percent: 7.0, bytes: 139222 },
      { name: "CSS", percent: 1.7, bytes: 33009 },
      { name: "JavaScript", percent: 0.4, bytes: 7215 },
      { name: "Python", percent: 0.3, bytes: 5066 },
    ],
  },
  {
    name: "Lead Profiler",
    slug: "lead-profiler",
    description:
      "A 5-step pipeline that turns 5 minutes of social-media observation into a pitch-ready Arabic WhatsApp opener.",
    highlights: [
      "5-step lead-generation pipeline",
      "Generates Arabic WhatsApp openers",
      "Social-media observation → pitch",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/lead-profiler",
    homepage: "https://lead-profiler-deploy.vercel.app",
    image: "/screenshots/lead-profiler.webp",
    category: "SaaS",
    featured: true,
    updatedAt: "2026-07-27T01:57:25Z",
    createdAt: "2026-06-29T00:11:03Z",
    primaryTech: ["Next.js", "Pipeline", "Arabic NLP", "WhatsApp"],
    languages: [
      { name: "TypeScript", percent: 97.9, bytes: 278483 },
      { name: "CSS", percent: 1.5, bytes: 4168 },
      { name: "JavaScript", percent: 0.6, bytes: 1713 },
    ],
  },
  {
    name: "Fitness House",
    slug: "fitness-house",
    description:
      "Boutique fitness studio website — Next.js 16 + Tailwind 4 + shadcn/ui. Re-life Your Body.",
    highlights: [
      "Boutique fitness studio site",
      "Next.js 16 + Tailwind 4 + shadcn/ui",
      "Tagline: Re-life Your Body",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/fitness-house",
    homepage: "https://fitness-house-phi.vercel.app",
    image: "/screenshots/fitness-house.webp",
    category: "Web",
    featured: false,
    updatedAt: "2026-08-08T22:42:18Z",
    createdAt: "2026-08-08T22:36:13Z",
    primaryTech: ["Next.js 16", "Tailwind 4", "shadcn/ui"],
    languages: [
      { name: "TypeScript", percent: 96.8, bytes: 234543 },
      { name: "CSS", percent: 2.5, bytes: 5956 },
      { name: "JavaScript", percent: 0.7, bytes: 1713 },
    ],
  },
  {
    name: "Portfolio + Admin",
    slug: "portfolio",
    description:
      "Professional portfolio paired with an admin dashboard — TypeScript throughout, with shell tooling and HTML templates.",
    highlights: [
      "Portfolio + admin dashboard combo",
      "Shell + HTML tooling included",
      "TypeScript-first codebase",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/portfolio",
    category: "Portfolio",
    featured: false,
    updatedAt: "2026-07-28T02:48:31Z",
    createdAt: "2026-06-13T16:26:03Z",
    primaryTech: ["Next.js", "Admin Dashboard", "Shell"],
    languages: [
      { name: "TypeScript", percent: 84.9, bytes: 460876 },
      { name: "Shell", percent: 5.4, bytes: 29150 },
      { name: "JavaScript", percent: 4.5, bytes: 24302 },
      { name: "HTML", percent: 4.4, bytes: 23749 },
      { name: "CSS", percent: 0.9, bytes: 4645 },
    ],
  },
  {
    name: "Build Ledger",
    slug: "build-ledger",
    description:
      "A build & ledger tracking tool — polyglot codebase spanning TypeScript, Shell, Python and Rust. Most recently updated repository.",
    highlights: [
      "Polyglot: TS · Shell · Python · Rust",
      "Most recently updated repo",
      "Build & ledger tracking",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/build-ledger",
    category: "Tools",
    featured: false,
    updatedAt: "2026-08-24T18:35:14Z",
    createdAt: "2026-08-22T17:47:43Z",
    primaryTech: ["TypeScript", "Python", "Rust", "Shell"],
    languages: [
      { name: "TypeScript", percent: 92.2, bytes: 297832 },
      { name: "Shell", percent: 2.5, bytes: 8046 },
      { name: "JavaScript", percent: 1.3, bytes: 4240 },
      { name: "CSS", percent: 1.3, bytes: 4168 },
      { name: "Python", percent: 1.0, bytes: 3368 },
      { name: "Rust", percent: 0.1, bytes: 339 },
    ],
  },
  {
    name: "Lead Profiler · Haskell",
    slug: "lead-profiler-haskell",
    description:
      "Haskell hardening layer for the lead-profiler Next.js app — lenient JSON pre-processor, strict ADT schemas, defaults layer, and a code generator.",
    highlights: [
      "Haskell hardening layer",
      "Lenient JSON → strict ADT schemas",
      "Defaults layer + code generator",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/lead-profiler-haskell",
    homepage: "https://lead-profiler-haskell.vercel.app",
    category: "Tools",
    featured: false,
    updatedAt: "2026-06-28T23:57:45Z",
    createdAt: "2026-06-28T23:57:31Z",
    primaryTech: ["Haskell", "ADT Schemas", "Codegen"],
    languages: [
      { name: "Haskell", percent: 93.2, bytes: 139222 },
      { name: "HTML", percent: 4.4, bytes: 6576 },
      { name: "TypeScript", percent: 2.4, bytes: 3551 },
    ],
  },
  {
    name: "Qaimati",
    slug: "qaimati",
    description:
      "Qaimati — QR digital-menu platform: guests scan and browse a live menu, merchants manage it from a dashboard, analytics close the loop. Bilingual AR/EN end to end.",
    highlights: [
      "QR menus — customer → merchant → analytics",
      "Merchant dashboard with live menu management",
      "Bilingual AR/EN platform",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/qaimati",
    homepage: "https://qaimati-eight.vercel.app",
    image: "/screenshots/qaimati.webp",
    category: "SaaS",
    featured: false,
    updatedAt: "2026-09-19T22:57:00Z",
    createdAt: "2026-09-17T00:00:00Z",
    primaryTech: ["Next.js", "TypeScript", "QR", "Dashboard"],
    languages: [
      { name: "TypeScript", percent: 87.9, bytes: 587928 },
      { name: "CSS", percent: 6.9, bytes: 45913 },
      { name: "Shell", percent: 5.0, bytes: 33449 },
      { name: "JavaScript", percent: 0.3, bytes: 1713 },
    ],
  },
  {
    name: "Deutsch A1",
    slug: "deutsch-a1-app",
    description:
      "CEFR A1 German learning app for Arabic speakers — 12-chapter curriculum, spaced-repetition review and exam practice, with an Arabic-first UI.",
    highlights: [
      "12-chapter CEFR A1 curriculum",
      "Spaced-repetition (SRS) review engine",
      "Arabic-first UI, RTL layouts",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/deutsch-a1-app",
    homepage: "https://deutsch-a1-app.vercel.app",
    image: "/screenshots/deutsch-a1-app.webp",
    category: "Web",
    featured: false,
    updatedAt: "2026-10-06T04:10:38Z",
    createdAt: "2026-09-30T00:00:00Z",
    primaryTech: ["Next.js", "TypeScript", "SRS", "i18n"],
    languages: [
      { name: "TypeScript", percent: 96.0, bytes: 1306816 },
      { name: "Shell", percent: 2.5, bytes: 33449 },
      { name: "CSS", percent: 0.9, bytes: 11614 },
      { name: "JavaScript", percent: 0.6, bytes: 8178 },
    ],
  },
  {
    name: "Athar",
    slug: "athar",
    description:
      "Athar — a journaling app that remembers who you're becoming: three sentences a day, kept private, reflected back over time.",
    highlights: [
      "Three-sentences-a-day journaling",
      "Long-term self-reflection view",
      "Live on Vercel",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/Athar",
    homepage: "https://athar-navy.vercel.app",
    image: "/screenshots/athar.webp",
    category: "Web",
    featured: false,
    updatedAt: "2026-09-19T22:57:39Z",
    createdAt: "2026-06-07T00:00:00Z",
    primaryTech: ["Next.js", "TypeScript", "Tailwind 4"],
    languages: [
      { name: "TypeScript", percent: 76.2, bytes: 83006 },
      { name: "Shell", percent: 17.7, bytes: 19291 },
      { name: "CSS", percent: 4.5, bytes: 4914 },
      { name: "JavaScript", percent: 1.6, bytes: 1713 },
    ],
  },
  {
    name: "PixelForge",
    slug: "pixelforge",
    description:
      "PixelForge — landing-page audit & optimization tool: scores a page across performance, SEO and content, then walks you to the fixes.",
    highlights: [
      "Landing-page audit scoring engine",
      "Actionable per-finding fixes",
      "Fully client-side, no backend",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/Pixelforge",
    homepage: "https://pixelforge-sigma.vercel.app",
    image: "/screenshots/pixelforge.webp",
    category: "Tools",
    featured: false,
    updatedAt: "2026-09-19T22:57:43Z",
    createdAt: "2026-05-04T00:00:00Z",
    primaryTech: ["HTML", "CSS", "JavaScript", "Audit"],
    languages: [
      { name: "HTML", percent: 99.0, bytes: 490497 },
      { name: "TypeScript", percent: 1.0, bytes: 5148 },
    ],
  },
  {
    name: "Landing Forge",
    slug: "landing-forge",
    description:
      "landing-forge studio — the open-source visual builder Forge Studio grew from: drag & drop sections, AI prompts and section-level control.",
    highlights: [
      "Drag-&-drop landing page builder",
      "AI-assisted section prompts",
      "Serialisable section tree — pages are data",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/landing-forge",
    category: "Tools",
    featured: false,
    updatedAt: "2026-09-19T23:09:41Z",
    createdAt: "2026-09-03T00:00:00Z",
    primaryTech: ["TypeScript", "Drag-Drop", "AI"],
    languages: [
      { name: "TypeScript", percent: 94.9, bytes: 841551 },
      { name: "Shell", percent: 4.1, bytes: 36354 },
      { name: "CSS", percent: 0.8, bytes: 7318 },
      { name: "JavaScript", percent: 0.2, bytes: 1713 },
    ],
  },
  {
    name: "Mobile Accessories Store",
    slug: "mobile-accessories-store",
    description:
      "Full accessories e-commerce storefront — product catalog, cart and checkout flow on Next.js with a clean TypeScript data layer.",
    highlights: [
      "E-commerce catalog, cart & checkout",
      "API-route backed order flow",
      "Production-shaped TypeScript models",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/mobile-accessories-store",
    category: "Web",
    featured: false,
    updatedAt: "2026-10-07T13:56:41Z",
    createdAt: "2026-10-07T00:00:00Z",
    primaryTech: ["Next.js", "TypeScript", "E-commerce"],
    languages: [
      { name: "TypeScript", percent: 94.0, bytes: 731879 },
      { name: "Shell", percent: 4.3, bytes: 33449 },
      { name: "CSS", percent: 1.4, bytes: 11169 },
      { name: "JavaScript", percent: 0.2, bytes: 1713 },
    ],
  },
  {
    name: "Fleet Control",
    slug: "fleet-control",
    description:
      "Fleet Control — the ops control plane for abdelhadygabriel.me: live status, SEO readiness checks, an IndexNow pipeline and agent access.",
    highlights: [
      "Live status + SEO readiness checks",
      "IndexNow pipeline for instant indexing",
      "Agent-accessible ops endpoints",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/fleet-control",
    category: "Tools",
    featured: false,
    updatedAt: "2026-09-24T03:35:47Z",
    createdAt: "2026-09-20T00:00:00Z",
    primaryTech: ["TypeScript", "SEO", "IndexNow", "Ops"],
    languages: [
      { name: "TypeScript", percent: 97.9, bytes: 779301 },
      { name: "Python", percent: 1.2, bytes: 9415 },
      { name: "CSS", percent: 0.7, bytes: 5920 },
      { name: "JavaScript", percent: 0.2, bytes: 1713 },
    ],
  },
  {
    name: "ProfileForge",
    slug: "profileforge",
    description:
      "Forge a stunning GitHub profile README in minutes — live preview, 50+ tech badges, stats embeds, an AI bio writer and ready-made templates.",
    highlights: [
      "Live-preview README builder",
      "50+ tech badges + stats embeds",
      "AI bio writer + ready-made templates",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/profileforge",
    category: "Tools",
    featured: true,
    updatedAt: "2026-08-29T20:55:08Z",
    createdAt: "2026-08-29T20:54:37Z",
    primaryTech: ["Next.js", "TypeScript", "Live Preview", "AI"],
    languages: [
      { name: "TypeScript", percent: 96.9, bytes: 258009 },
      { name: "CSS", percent: 2.5, bytes: 6680 },
      { name: "JavaScript", percent: 0.6, bytes: 1713 },
    ],
  },
];

export const projectFilters = ["All", "SaaS", "Web", "Portfolio", "Tools"] as const;
export type ProjectFilter = (typeof projectFilters)[number];

/**
 * Longer narrative bullets shown inside each project's detail modal.
 * Keyed by project slug. Keeps the card surface lean while giving the
 * modal real depth.
 */
export const projectDetails: Record<string, string[]> = {
  "forge-studio": [
    "A single workspace that combines a visual landing-page builder with an automated 5-category auditor (performance, accessibility, SEO, content, conversion) and one-click fixes.",
    "Built end-to-end in TypeScript with a drag-drop canvas backed by a serialisable component tree. The auditor runs deterministic checks against the same tree, so suggestions always match what you see.",
    "Roughly 865k LOC of TypeScript — the largest single-app codebase in the portfolio.",
  ],
  "glamchain": [
    "Multi-tenant salon management SaaS engineered for the Gulf market. Each tenant gets isolated data via Prisma's tenant-scoped middleware, with NextAuth handling per-tenant sessions.",
    "First-class bilingual support: Arabic and English with proper RTL flipping at the layout level, not just string translation.",
    "Stack: Next.js 16 App Router, TypeScript, Prisma, NextAuth, Tailwind 4, shadcn/ui.",
  ],
  "dev-portfolio": [
    "The dark, Vercel-style portfolio template this very site is patterned after — Hero, About, Selected Work, Capabilities and Contact sections.",
    "Heavy use of Framer Motion for purposeful motion: scroll-reveals, layout transitions on the project grid, and animated proficiency bars.",
    "Notably polyglot under the hood: ~1.97M LOC, with a Haskell hardening layer sitting alongside the TypeScript.",
  ],
  "lead-profiler": [
    "A 5-step pipeline that compresses ~5 minutes of social-media observation into a pitch-ready Arabic WhatsApp opener.",
    "Steps: ingest → extract signals → score relevance → draft opener → review. Each step is independently testable.",
    "Optimised for the Arabic-speaking outreach workflow — tone, dialect cues and opener structure are locale-aware.",
  ],
  "fitness-house": [
    "A boutique fitness studio marketing site built for speed: Next.js 16 + Tailwind 4 + shadcn/ui, deployed to Vercel.",
    "Tagline-driven narrative — 'Re-life Your Body' — carried through hero, classes, trainers and contact.",
    "Lean codebase (~235k LOC TS) focused on fast first paint and clean content hierarchy.",
  ],
  "portfolio": [
    "A professional portfolio paired with an admin dashboard for managing its own content.",
    "TypeScript throughout, with shell tooling for deploys and HTML email templates wired into the admin.",
    "Predates the current dev-portfolio refresh — kept public for reference and for the admin patterns it introduced.",
  ],
  "build-ledger": [
    "A build & ledger tracking tool. The most recently updated repository in the profile.",
    "Genuinely polyglot: TypeScript core, Shell glue, Python scripts, a small Rust hot-path, plus CSS and JavaScript.",
    "Explores using strict typing across mixed-language boundaries — a testbed for cross-language schema work.",
  ],
  "lead-profiler-haskell": [
    "A hardening layer for the lead-profiler Next.js app, written in Haskell.",
    "Three-stage design: a lenient JSON pre-processor that tolerates messy input, strict ADT schemas that fail loudly, and a defaults layer that fills gaps safely.",
    "Includes a code generator that emits TypeScript types from the Haskell ADTs so the two stacks can't drift.",
  ],
  "profileforge": [
    "A GitHub profile README studio: compose your profile from 50+ tech badges, stats embeds and ready-made templates while a live preview shows the exact README you'll get.",
    "An AI bio writer drafts the about section from a few prompts, and everything compiles to clean Markdown you can paste straight into your GitHub profile.",
    "The newest build in the portfolio — TypeScript end-to-end (~258k LOC), shipped the same day the idea landed.",
  ],
  "coolfix": [
    "Spec build for the niche most agencies skip: 24/7 AC, plumbing and electrical dispatch across Cairo & Riyadh.",
    "5-step booking flow with 2-hour arrival windows, an emergency fast-path and a live jobs board fed by a shared API.",
    "Bilingual AR/EN with native RTL, WhatsApp deep-link confirmation and HomeAndConstructionBusiness JSON-LD.",
  ],
  "layan": [
    "Interior-architecture concept where the portfolio is crawlable — every case study owns a real URL (/work/[slug]).",
    "Consultation booking pre-qualifies budget before the call, so studio time goes to serious enquiries.",
    "Per-brand i18n with zero route duplication: instant AR/EN flip, proper RTL, Arabic-first fonts.",
  ],
  "lumiere": [
    "Aesthetic-clinic concept: one-page scrollytelling that sells trust before treatments.",
    "4-step booking wizard with live time slots; every request lands in a shared dashboard with a readable reference code.",
    "MedicalClinic + FAQPage JSON-LD and a strict performance budget — self-hosted fonts, static-first pages.",
  ],
  "qaimati": [
    "QR digital-menu platform: guests scan, browse and order from a live menu; merchants manage it all from a dashboard.",
    "Analytics close the loop — views and orders per item, per day.",
    "Bilingual AR/EN end to end; the Arabic UI is designed first-class, not translated afterwards.",
  ],
  "deutsch-a1-app": [
    "A full CEFR A1 German curriculum for Arabic speakers — 12 chapters from zero to exam-ready.",
    "A spaced-repetition engine schedules vocabulary so it sticks.",
    "Arabic-first interface with RTL layouts and phonetic aids for German sounds.",
  ],
  "athar": [
    "A minimal journaling practice: three sentences a day, timestamped and private.",
    "Athar surfaces past entries back to you — a long-memory view of who you're becoming.",
    "Deployed on Vercel with a lean TypeScript core.",
  ],
  "pixelforge": [
    "Landing-page audit tool: scores performance, SEO and content, then converts each finding into a concrete fix.",
    "Its audit heuristics later became the 5-category auditor inside Forge Studio.",
    "Single-page tool — no backend required, fully client-side scoring.",
  ],
  "landing-forge": [
    "The original visual builder: drag & drop sections onto a canvas, tune each one, let AI prompts draft the copy.",
    "Serialisable section tree — pages are data, so they save, reload and export cleanly.",
    "The codebase that grew into Forge Studio's builder.",
  ],
  "mobile-accessories-store": [
    "Full accessories storefront: product catalog, cart and checkout flow backed by Next.js API routes.",
    "TypeScript data layer with clean product and order models.",
    "Built as a production-shaped e-commerce reference.",
  ],
  "fleet-control": [
    "The ops control plane for abdelhadygabriel.me: live status, SEO readiness and uptime checks from one place.",
    "IndexNow pipeline pings search engines the moment content changes.",
    "Agent-accessible endpoints let automation inspect and operate the site safely.",
  ],
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    blurb: "The layer users see and touch.",
    skills: [
      { name: "Next.js 16 (App Router)", level: 95, note: "primary framework" },
      { name: "React 19", level: 92, note: "Server & Client components" },
      { name: "TypeScript", level: 94, note: "strict mode by default" },
      { name: "Tailwind CSS 4", level: 90, note: "design tokens + shadcn/ui" },
      { name: "Framer Motion", level: 80, note: "subtle, purposeful motion" },
    ],
  },
  {
    title: "Backend & Data",
    blurb: "Where state actually lives.",
    skills: [
      { name: "Prisma ORM", level: 88, note: "SQLite / Postgres" },
      { name: "Next.js API Routes", level: 90, note: "REST + server actions" },
      { name: "NextAuth.js", level: 82, note: "auth & sessions" },
      { name: "Bun runtime", level: 78, note: "scripts & services" },
    ],
  },
  {
    title: "Languages",
    blurb: "Beyond TypeScript, when the job needs it.",
    skills: [
      { name: "TypeScript", level: 94, note: "daily driver" },
      { name: "Haskell", level: 65, note: "schema hardening" },
      { name: "Python", level: 70, note: "scripts & tooling" },
      { name: "Rust", level: 55, note: "experimental" },
      { name: "Shell", level: 75, note: "CI & build glue" },
    ],
  },
  {
    title: "Specialties",
    blurb: "The niches I keep getting hired for.",
    skills: [
      { name: "Bilingual AR/EN + RTL", level: 88, note: "Gulf-region SaaS" },
      { name: "Multi-tenant SaaS", level: 85, note: "tenant isolation" },
      { name: "Drag-drop builders", level: 82, note: "dnd-kit" },
      { name: "Landing-page audits", level: 80, note: "5-category auditor" },
    ],
  },
];

export const techMarquee: string[] = [
  "Next.js 16",
  "React 19",
  "TypeScript 5",
  "Tailwind CSS 4",
  "shadcn/ui",
  "Prisma",
  "NextAuth",
  "Framer Motion",
  "Bun",
  "Vercel",
  "Haskell",
  "Python",
  "Rust",
  "dnd-kit",
  "Turbopack",
  "Zustand",
  "TanStack Query",
];

/**
 * Proof-points / "highlights" surfaced in the auto-scrolling strip between
 * the Hero and About sections. Each card is a one-line, fact-styled brag.
 */
export type Highlight = {
  /** Short verb-first copy. */
  text: string;
  /** Context / source — usually a repo or product. */
  context: string;
  /** lucide icon name handled in the component (kept here as a tag). */
  icon: "git" | "globe" | "code" | "globe2" | "star" | "calendar" | "rtl";
};

export const highlights: Highlight[] = [
  {
    text: "17 repos shipped",
    context: "github.com/abbdelhadylh30-art",
    icon: "git",
  },
  {
    text: "865k LOC TypeScript",
    context: "Forge Studio — landing-page builder",
    icon: "code",
  },
  {
    text: "Bilingual AR/EN + RTL built-in",
    context: "GlamChain — multi-tenant salon SaaS",
    icon: "rtl",
  },
  {
    text: "5-category auditor",
    context: "one-click fixes — Forge Studio",
    icon: "star",
  },
  {
    text: "Next.js 16 · App Router · React 19",
    context: "primary stack — Turbopack-powered",
    icon: "globe",
  },
  {
    text: "Africa/Cairo · GMT+2",
    context: "open to freelance & full-time",
    icon: "calendar",
  },
  {
    text: "8 languages tracked",
    context: "TS · Haskell · Python · Rust · more",
    icon: "globe2",
  },
  {
    text: "6 live Vercel deploys",
    context: "production-tested · cached at edge",
    icon: "globe",
  },
];

/**
 * The three-step build methodology surfaced in the "Process" strip
 * (between Highlights and About). Grounded in the dev philosophy on the
 * page — Spec → Ship → Sharpen.
 */
export type ProcessStep = {
  num: string;
  title: string;
  body: string;
  /** A concrete, project-grounded outcome that proves the step. */
  outcome: string;
  icon: "spec" | "ship" | "sharpen";
};

export const processSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Spec",
    body: "Schemas first. We turn rough product ideas into typed boundaries — Prisma models, zod schemas, and the awkward middle layer between product and infra gets named before any UI is built.",
    outcome: "Lead Profiler → 5-step pipeline spec'd before any UI",
    icon: "spec",
  },
  {
    num: "02",
    title: "Ship",
    body: "Land the working version fast. Next.js 16 App Router, React 19, Tailwind 4 — bilingual AR/EN with proper RTL from day one, deployed to Vercel before the week is out.",
    outcome: "GlamChain v1.0 multi-tenant SaaS deployed in a week",
    icon: "ship",
  },
  {
    num: "03",
    title: "Sharpen",
    body: "Then layer in the polish, metrics and audits. The 5-category auditor runs against the same tree it built, so suggestions always match what the user sees. A Haskell hardening layer catches drift before production.",
    outcome: "Forge Studio auditor: performance · a11y · SEO · content · conversion",
    icon: "sharpen",
  },
];

/**
 * The "Journey" — a chronological timeline of the public GitHub
 * projects, surfaced as a vertical timeline between Skills and Now.
 * Derived from each project's `createdAt` field; sorted oldest-first
 * so the timeline reads naturally (top = where it started, bottom =
 * most recent).
 */
export type JourneyEntry = {
  /** ISO date — the project's createdAt. */
  date: string;
  /** Human-readable month/year label, e.g. "May 2026". */
  label: string;
  /** Project name. */
  project: string;
  /** One-line takeaway — what shipped or what was learned. */
  takeaway: string;
  /** Slug for deep-linking via ?p=slug. */
  slug: string;
  /** Category tag for color/visual treatment. */
  category: Project["category"];
};

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export const journey: JourneyEntry[] = [...projects]
  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  .map((p) => ({
    date: p.createdAt,
    label: monthYear(p.createdAt),
    project: p.name,
    takeaway:
      p.category === "SaaS"
        ? `Multi-tenant SaaS — ${p.primaryTech.slice(0, 3).join(" · ")}`
        : p.category === "Tools"
          ? `Tooling — ${p.primaryTech.slice(0, 3).join(" · ")}`
          : p.category === "Web"
            ? `Web build — ${p.primaryTech.slice(0, 3).join(" · ")}`
            : `Portfolio — ${p.primaryTech.slice(0, 3).join(" · ")}`,
    slug: p.slug,
    category: p.category,
  }));

/**
 * Real client case studies — synced from the production deployment
 * (www.abdelhadygabriel.me). These are delivered client projects
 * with measured business outcomes, distinct from the open-source repos
 * in `projects`. Rendered by the ClientWork section (#clients).
 */
export type CaseStudy = {
  client: string;
  title: string;
  /** Industry + engagement tag, e.g. "Abu Dhabi bakery · Wix → Next.js". */
  context: string;
  story: string;
  /** 2–3 measured outcomes. */
  metrics: { value: string; label: string }[];
  tech: string[];
  icon: "store" | "search" | "gauge" | "message";
};

export const caseStudies: CaseStudy[] = [
  {
    client: "Knead Bakery",
    title: "Site Redesign — Wix to Next.js",
    context: "Abu Dhabi bakery · Wix → Next.js",
    story:
      "Took a slow Wix site with 15 confusing menu categories and rebuilt it as a fast, focused ordering experience. Grouped the menu by when you eat — morning, afternoon, evening — instead of by food type, and surfaced the 4-hour pickup time up front so customers stop abandoning at checkout.",
    metrics: [
      { value: "45×", label: "faster page load" },
      { value: "15→4", label: "menu categories" },
      { value: "<1.5s", label: "load on mobile" },
    ],
    tech: ["Next.js", "Tailwind CSS", "Vercel"],
    icon: "store",
  },
  {
    client: "Mohamed Medhat",
    title: "Marketing Portfolio",
    context: "Client project · Marketing professional",
    story:
      "Built a marketing specialist a portfolio that matches the quality of his brand audits. Dark editorial design, six sections, mobile-perfect. He went from “no web presence” to ranking #1 for his own name on Google within a week of launch.",
    metrics: [
      { value: "6", label: "sections" },
      { value: "#1", label: "Google rank for name" },
      { value: "1 wk", label: "to index" },
    ],
    tech: ["Next.js", "SEO", "Dark editorial"],
    icon: "search",
  },
];

/**
 * "What the codebase says about me" — testimonial-style cards grounded
 * in real repo metrics (no fake quotes). Each card surfaces a real
 * data point from the GitHub sync (language percentages, LOC, tech
 * composition) and frames it as a credible endorsement.
 *
 * Surfaced as a "Testimonials"-style strip between Process and About
 * on the public page.
 */
export type Testimonial = {
  /** Headline quote — framed as a testimonial. */
  quote: string;
  /** Source attribution — usually a repo name + metric. */
  source: string;
  /** A secondary metric chip (e.g. "97.9% TypeScript"). */
  metric: string;
  /** Slug for deep-link. */
  slug: string;
  /** lucide icon tag. */
  icon: "code" | "stack" | "globe" | "shield";
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "97.9% TypeScript across 865k LOC — strict typing is non-negotiable, even at scale.",
    source: "Forge Studio — landing-page builder",
    metric: "865k LOC TS",
    slug: "forge-studio",
    icon: "code",
  },
  {
    quote:
      "Bilingual AR/EN with RTL flipping at the layout level, not just string translation.",
    source: "GlamChain — multi-tenant salon SaaS",
    metric: "AR/EN + RTL",
    slug: "glamchain",
    icon: "globe",
  },
  {
    quote:
      "Haskell hardening layer: lenient JSON in, strict ADT schemas out, codegen prevents drift.",
    source: "Lead Profiler · Haskell",
    metric: "93.2% Haskell",
    slug: "lead-profiler-haskell",
    icon: "shield",
  },
  {
    quote:
      "Polyglot by necessity — TS core, Shell glue, Python scripts, a small Rust hot-path.",
    source: "Build Ledger — most recently updated",
    metric: "4 languages",
    slug: "build-ledger",
    icon: "stack",
  },
];


/* ───────────────────────────────────────────────────────────────────────────
 * CLIENT MODE ("Business view")
 *
 * A cleaner, non-technical presentation for business owners and clients.
 * The default experience — the full technical portfolio is one toggle away
 * ("Developer view"). Every string here is written for someone who cares
 * about outcomes (more customers, less admin work), not implementation.
 * ─────────────────────────────────────────────────────────────────────────── */

/* NOTE — single source of truth: the client-mode COPY (hero stats,
   services, results, process, pricing flow, guarantees, FAQ, about)
   lives in src/lib/i18n/en.ts + ar.ts — that is what the UI renders.
   This file keeps only the English data that feeds the JSON-LD graph
   (services, faqs, pricingTiers via schema.ts) plus the dev-view
   content, so the two layers can never silently drift apart again. */

export type Service = {
  title: string;
  body: string;
  bullets: string[];
  outcome: string;
  icon: "globe" | "calendar" | "search" | "shield";
};

export const services: Service[] = [
  {
    title: "Business websites",
    body: "The online front door of your business — beautiful, fast, and mobile-perfect. Not a template everyone else has.",
    bullets: [
      "Menus, services, and prices that are easy to update",
      "WhatsApp ordering & click-to-call built in",
      "Works perfectly on every phone",
    ],
    outcome: "Visitors become customers.",
    icon: "globe",
  },
  {
    title: "Booking & management systems",
    body: "Stop running your business from a notebook and a pile of WhatsApp chats. Appointments, reminders, and customer records in one place.",
    bullets: [
      "Online booking — even at 2am",
      "Automatic WhatsApp reminders",
      "Customer history at a glance",
    ],
    outcome: "Hours of admin back, every week.",
    icon: "calendar",
  },
  {
    title: "Getting found on Google",
    body: "When someone searches for your business — or what you sell — you show up. Every site I build includes the fundamentals Google actually rewards.",
    bullets: [
      "Google Business & search setup",
      "Fast pages (speed is ranking)",
      "Arabic & English search terms",
    ],
    outcome: "More calls, more visits, more orders.",
    icon: "search",
  },
  {
    title: "Care after launch",
    body: "I don't disappear once the site is live. Need to change a price, add a service, or fix something? One WhatsApp message.",
    bullets: [
      "Free tweaks in the first month",
      "Same-day replies on WhatsApp",
      "Monthly care plans if you want them",
    ],
    outcome: "A website that stays healthy.",
    icon: "shield",
  },
];

export type ClientResult = {
  client: string;
  headline: string;
  story: string;
  metrics: { value: string; label: string }[];
  icon: "store" | "search" | "scissors" | "cta";
};

export type ClientProcessStep = {
  num: string;
  title: string;
  body: string;
  icon: "chat" | "quote" | "build" | "launch";
};

/* ───────────────────────────────────────────────────────────────────────────
   Pricing — the fixed-price package data. Rendered into the JSON-LD
   OfferCatalog by schema.ts; the rendered pricing UI copy lives in the
   i18n files and must be kept in sync with the numbers here.
   ─────────────────────────────────────────────────────────────────────────── */

export type PricingTask = {
  /** Task name, e.g. "Design". */
  task: string;
  /** What the client actually gets for it. */
  detail: string;
  /** When it happens, e.g. "Days 1–2" or "+2–3 days". */
  when: string;
};

/** The one-pager comes in two flavours that share one card (UI toggle). */
export type PricingVariant = {
  name: string;
  blurb: string;
  price: number;
  deposit: number;
  duration: string;
  tasks: PricingTask[];
};

export type PricingTier = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  deposit: number;
  duration: string;
  /** Highlighted "most chosen" card. */
  popular?: boolean;
  /** Set when the tier builds on the previous one. */
  buildsOn?: string;
  tasks: PricingTask[];
  /** Two flavours on one card — only the one-pager uses this. */
  variants?: PricingVariant[];
};

export const pricingTiers: PricingTier[] = [
  {
    id: "onepager",
    name: "One-Pager",
    tagline: "One page, one goal, live this week.",
    price: 149,
    deposit: 75,
    duration: "2–4 days",
    tasks: [],
    variants: [
      {
        name: "Portfolio",
        blurb: "Who I am, what I do, contact me — for personal brands.",
        price: 149,
        deposit: 75,
        duration: "2–3 days",
        tasks: [
          { task: "Kickoff", detail: "15-minute call or voice note — we scope the page.", when: "Day 1" },
          { task: "Design", detail: "Hero → proof → offer → contact flow, 1 revision round.", when: "Day 1" },
          { task: "Build", detail: "Single page, mobile-first, AR + EN, WhatsApp & call buttons.", when: "Days 1–2" },
          { task: "Launch", detail: "Google indexing, loads under 1.5s, domain connected.", when: "Days 2–3" },
        ],
      },
      {
        name: "Landing page",
        blurb: "Runs under a boosted post or ad — built to convert.",
        price: 199,
        deposit: 100,
        duration: "3–4 days",
        tasks: [
          { task: "Kickoff", detail: "We define the ONE action: book, call, or order.", when: "Day 1" },
          { task: "Conversion copy", detail: "Headline + offer written to sell, Arabic or English.", when: "Days 1–2" },
          { task: "Build", detail: "Page + WhatsApp flow + thank-you state, 1 revision round.", when: "Days 2–3" },
          { task: "Tracking", detail: "Facebook Pixel / GA event — so you know the ad worked.", when: "Day 3" },
          { task: "Launch", detail: "Domain or subdomain, live and measured.", when: "Days 3–4" },
        ],
      },
    ],
  },
  {
    id: "launch",
    name: "Launch",
    tagline: "The full business website — your online front door.",
    price: 349,
    deposit: 175,
    duration: "5–7 days",
    tasks: [
      { task: "Discovery & structure", detail: "15-minute call, sitemap of up to 5 pages.", when: "Day 1" },
      { task: "Design", detail: "Homepage concept in your brand, 2 revision rounds.", when: "Days 1–2" },
      { task: "Build", detail: "3–5 pages, mobile-first, Arabic + English.", when: "Days 2–4" },
      { task: "SEO & speed", detail: "Google indexing, meta tags, loads under 2 seconds.", when: "Days 4–5" },
      { task: "Launch & handover", detail: "Domain connected, live, training video, all passwords.", when: "Days 5–7" },
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "The website plus the system that books and sells for you.",
    price: 649,
    deposit: 325,
    duration: "10–14 days",
    popular: true,
    buildsOn: "Everything in Launch, plus:",
    tasks: [
      { task: "Booking / menu / WhatsApp", detail: "Appointment form, menu, or WhatsApp ordering — wired to your phone.", when: "+2–3 days" },
      { task: "Analytics & tracking", detail: "Google Analytics + Search Console + conversion events.", when: "+1 day" },
      { task: "Copy polish (AR + EN)", detail: "Headlines rewritten to sell, not just describe.", when: "+1 day" },
      { task: "Google Business Profile", detail: "Maps listing set up and optimized.", when: "+1 day" },
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    tagline: "E-commerce and custom builds with real payments.",
    price: 1199,
    deposit: 600,
    duration: "3–4 weeks",
    buildsOn: "Everything in Business, plus:",
    tasks: [
      { task: "E-commerce or custom", detail: "Online store with payments (Paymob / Stripe / cash on delivery) or a custom feature.", when: "+1–2 weeks" },
      { task: "Security & performance", detail: "SSL, backups, hardening, 90+ Lighthouse score.", when: "+2–3 days" },
      { task: "Live training", detail: "1-on-1 call + recorded video for your team.", when: "+1 day" },
    ],
  },
];

export type Guarantee = { title: string; body: string; icon: "price" | "own" | "time" | "support" };

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "How much does a website cost?",
    a: "One-page sites start at $149, full business websites at $349, and booking or e-commerce builds at $649 — every package with its task list, timeline and deposit is laid out on the Pricing page. Whatever you pick, you get one fixed number before any work begins, and that number won't change.",
  },
  {
    q: "How do payments work?",
    a: "Split in two, matched to the timeline: a 50% deposit books your slot and unlocks the first design within 72 hours. The second half is due at launch — after you've seen the full site working on your own phone. Nothing goes live until you say so, and every launch carries a 14-day fix warranty.",
  },
  {
    q: "I already have a website — do I need a rebuild?",
    a: "Not necessarily. Half the time the right move is a few targeted fixes — speed, mobile layout, a clearer call-to-action — not a full rebuild. That's exactly what the free 15-minute audit is for: I'll look at what you have and tell you honestly which one you need, even if the answer means you don't hire me.",
  },
  {
    q: "How long until my site is live?",
    a: "Most business websites launch in 2–4 weeks. Larger systems (booking, ordering, customer accounts) take 4–8 weeks. The timeline is written into the quote — and you can watch progress on a live preview link from day one.",
  },
  {
    q: "Can my site be in Arabic?",
    a: "Yes, absolutely. Your site can be Arabic, English, or both — with proper right-to-left layout designed in from the start, not a machine-flipped afterthought. It changes how professional your business reads to Arabic-first customers.",
  },
  {
    q: "What if I need changes later?",
    a: "Small tweaks in the first month are free. After that, I'm one WhatsApp message away — either a quick one-off fix or a monthly care plan if you expect regular updates. You'll never be left with a website nobody can change.",
  },
  {
    q: "Will customers find me on Google?",
    a: "Every site I ship includes what Google actually rewards: fast pages, mobile-first design, proper structure, and clean Arabic/English content. One client reached #1 for his own name within a week of launch. No honest developer promises rankings — but the fundamentals will be right.",
  },
];
