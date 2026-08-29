/**
 * Central content source for the Abdelhady Gabriel portfolio.
 * Every visible string on the site is sourced from here.
 *
 * Repository data was synced from github.com/abbdelhadylh30-art
 * (9 public repositories, fetched via the GitHub REST API).
 */

export type LanguageBreakdown = { name: string; percent: number; bytes: number };

export type Project = {
  name: string;
  slug: string;
  description: string;
  highlights: string[];
  repoUrl: string;
  homepage?: string;
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
  avatarUrl: "https://avatars.githubusercontent.com/u/275516572?v=4",
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
    name: "Pixelforge",
    slug: "pixelforge",
    description:
      "A creative HTML-first build deployed on Vercel. Lean markup with a TypeScript tooling layer.",
    highlights: [
      "HTML-first creative build",
      "Lean markup (~490k LOC)",
      "Live on Vercel",
    ],
    repoUrl: "https://github.com/abbdelhadylh30-art/Pixelforge",
    homepage: "https://pixelforge-sigma.vercel.app",
    category: "Web",
    featured: false,
    updatedAt: "2026-05-04T10:24:08Z",
    createdAt: "2026-05-04T09:07:14Z",
    primaryTech: ["HTML", "TypeScript", "Vercel"],
    languages: [
      { name: "HTML", percent: 99.0, bytes: 489753 },
      { name: "TypeScript", percent: 1.0, bytes: 4731 },
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
  "pixelforge": [
    "A creative, HTML-first build deployed on Vercel.",
    "~490k LOC of lean markup with a thin TypeScript tooling layer on top.",
    "An earlier experiment in hand-rolled, framework-light web craft.",
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
    text: "9 public repos shipped",
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
 * (abdelhady-gabriel.vercel.app). These are delivered client projects
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
      { value: "1wk", label: "to index" },
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

export const clientNavLinks: NavLink[] = [
  { label: "What I do", href: "#services" },
  { label: "Results", href: "#results" },
  { label: "How it works", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/** Client-facing hero stats — outcomes, not repo metrics. */
export const clientStats: Stat[] = [
  { label: "Every site loads in", value: "<2s", hint: "on a phone, on 3G" },
  { label: "Google rank for a client", value: "#1", hint: "one week after launch" },
  { label: "Faster than their old site", value: "45×", hint: "Knead Bakery · Wix rebuild" },
  { label: "Languages, done properly", value: "AR+EN", hint: "Arabic & English, built right" },
];

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

export const clientResults: ClientResult[] = [
  {
    client: "Knead Bakery",
    headline: "A slow website was losing them orders",
    story:
      "A bakery in Abu Dhabi was running on a Wix site so slow that customers gave up before the menu loaded. We rebuilt it around how customers actually order — food grouped by time of day, pickup times shown up front.",
    metrics: [
      { value: "45×", label: "faster than the old site" },
      { value: "15→4", label: "clearer menu categories" },
      { value: "<1.5s", label: "loads on a phone" },
    ],
    icon: "store",
  },
  {
    client: "Mohamed Medhat",
    headline: "From invisible to #1 on Google",
    story:
      "A marketing professional in Cairo had no web presence at all. We built him a portfolio that matches the quality of his own brand audits — dark, editorial, mobile-perfect.",
    metrics: [
      { value: "#1", label: "on Google for his name" },
      { value: "1 wk", label: "from launch to ranking" },
      { value: "6", label: "polished sections" },
    ],
    icon: "search",
  },
  {
    client: "A salon chain, Qatar",
    headline: "Bookings that run themselves",
    story:
      "A luxury salon was managing appointments by phone and losing customers to missed calls. We built them online booking with automatic WhatsApp reminders — in Arabic and English.",
    metrics: [
      { value: "24/7", label: "online booking" },
      { value: "Auto", label: "WhatsApp reminders" },
      { value: "AR+EN", label: "both languages, properly" },
    ],
    icon: "scissors",
  },
  {
    client: "Your business",
    headline: "The next story could be yours",
    story:
      "Every project above started the same way: a free 15-minute chat. No pressure, no jargon — I'll look at what you have now and tell you honestly what's worth fixing.",
    metrics: [
      { value: "Free", label: "15-minute chat" },
      { value: "Fixed", label: "price before we start" },
      { value: "2–4 wks", label: "typical launch time" },
    ],
    icon: "cta",
  },
];

export type ClientProcessStep = {
  num: string;
  title: string;
  body: string;
  icon: "chat" | "quote" | "build" | "launch";
};

export const clientProcess: ClientProcessStep[] = [
  {
    num: "01",
    title: "A free 15-minute chat",
    body: "WhatsApp or a call — you tell me about your business, I look at what you have now. I'll tell you honestly if you need a full rebuild or just a few fixes.",
    icon: "chat",
  },
  {
    num: "02",
    title: "One fixed price, in writing",
    body: "You know exactly what you'll pay before any work begins. No hourly meters, no surprise invoices, no 'it grew in scope'.",
    icon: "quote",
  },
  {
    num: "03",
    title: "Progress you can watch",
    body: "You get a private preview link from day one. Watch your site grow, tell me what to adjust — while it's cheap to adjust.",
    icon: "build",
  },
  {
    num: "04",
    title: "Launch — and I stay",
    body: "Your site goes live with your domain and hosting sorted. Then I stay on WhatsApp: free tweaks in the first month, fast replies always.",
    icon: "launch",
  },
];

export type Guarantee = { title: string; body: string; icon: "price" | "own" | "time" | "support" };

export const guarantees: Guarantee[] = [
  {
    title: "Fixed price, agreed up front",
    body: "The number in the quote is the number you pay. If I misjudge the work, that's my cost — not yours.",
    icon: "price",
  },
  {
    title: "You own everything",
    body: "Your domain, your hosting, your content, your code. If we ever part ways, it's all yours — no hostage-taking.",
    icon: "own",
  },
  {
    title: "On-time, in writing",
    body: "The launch date is part of the quote. You'll know what 'done' means before we start.",
    icon: "time",
  },
  {
    title: "Support after launch",
    body: "Free tweaks in the first month, same-day WhatsApp replies after that. A website is a living thing — it needs a caretaker.",
    icon: "support",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "How much does a website cost?",
    a: "It depends on what you need — but you'll get one fixed number before any work begins, and that number won't change. A simple business website costs far less than most owners expect; booking systems and larger tools cost more. The free chat exists precisely so we can pin this down in 15 minutes.",
  },
  {
    q: "How long until my site is live?",
    a: "Most business websites launch in 2–4 weeks. Larger systems (booking, ordering, customer accounts) take 4–8 weeks. The timeline is written into the quote — and you can watch progress on a live preview link from day one.",
  },
  {
    q: "Can my site be in Arabic?",
    a: "نعم بالتأكيد. Your site can be Arabic, English, or both — with proper right-to-left layout designed in from the start, not a machine-flipped afterthought. This matters for how professional your business looks to Arabic-first customers.",
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

export const aboutLite = {
  paragraphs: [
    "I'm Abdelhady Gabriel, a web developer based in Cairo. For the last three years I've built websites and web tools for businesses across Egypt and the Gulf — a bakery in Abu Dhabi, a salon chain in Qatar, a marketing consultant in Cairo. What they all had in common: they needed to look credible online and get more customers. That's the job.",
    "I work in Arabic and English, I answer my own WhatsApp, and I treat your budget like it's my own. No jargon in our conversations, no endless meetings — just a clear plan, one fixed price, and a website that does its job.",
  ],
  quickFacts: [
    { label: "Based in", value: "Cairo, Egypt" },
    { label: "Working with", value: "Egypt & the Gulf" },
    { label: "Languages", value: "Arabic & English" },
    { label: "Replies", value: "Same day, on WhatsApp" },
  ],
};
