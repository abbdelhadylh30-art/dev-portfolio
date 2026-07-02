/**
 * Portfolio content — single source of truth.
 * Edit identity, contact, projects, skills here.
 */

export const profile = {
  name: "Abdelhady Gabriel",
  initials: "AG",
  role: "Full-Stack Developer & Product Engineer",
  tagline: "I build developer tools, landing page studios, and AI-powered web apps end-to-end — from Prisma schema to the last pixel.",
  location: "Egypt",
  availability: "Open to freelance & full-time roles",
  email: "abbelhadylh31@gmail.com",
  phone: "01032246016",
  whatsapp: "https://wa.me/201032246016",
  linkedin: "" as string,
  github: "" as string,
};

export const philosophy = [
  {
    title: "Ship daily, perfect later",
    body: "Every project I ship started as a rough cut. PixelForge v19 began as an 8,934-line vanilla-JS file. I migrated it to Next.js 16 with full feature parity in a single focused sprint — and then iterated. Velocity beats theory.",
  },
  {
    title: "Tools should compound",
    body: "Forge Studio didn't replace LandingForge and PixelForge — it merged them. When two tools share a transfer bridge, one plus one equals three. I build with re-use in mind: components, stores, and patterns that survive the next idea.",
  },
  {
    title: "Performance is a feature",
    body: "Custom ZIP writer with CRC32 instead of a 50KB dependency. Pure string-templated HTML export instead of SSR. Lighthouse isn't an afterthought — it's measured at every commit and protected by the auditor's own scoring engine.",
  },
  {
    title: "DX is UX",
    body: "Drag handles you can actually grab. 50-step undo for mistakes you'll definitely make. Keyboard shortcuts that match your editor. The same care I put into end-user interfaces goes into the panels, inspectors, and toolbars other developers will live in.",
  },
] as const;

export type SubProject = {
  name: string;
  role: string;
  year: string;
  summary: string;
  features: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  screenshots: { src: string; caption: string }[];
};

export type Project = {
  index: string;
  name: string;
  category: string;
  year: string;
  status: "shipped" | "live" | "flagship";
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  features: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  screenshots: { src: string; caption: string }[];
  links?: { label: string; href: string }[];
  subProjects?: SubProject[];
};

export const projects: Project[] = [
  {
    index: "01",
    name: "Forge Studio",
    category: "FLAGSHIP · ALL-IN-ONE STUDIO",
    year: "2025",
    status: "flagship",
    summary:
      "A unified studio that fuses a no-code landing page builder with a 5-category page auditor — connected by a bidirectional transfer bridge. Forge Studio didn't replace its two component tools; it merged them. Build a page, audit it, apply 38 one-click fixes, ship — without ever leaving the tab.",
    problem:
      "Page builders and page auditors are usually two separate products. You build in one, copy-paste HTML into the other, lose your place, fix issues manually, and never close the loop. I'd already shipped both halves independently — LandingForge (the builder) and PixelForge (the auditor) — but the round-trip between them was the actual problem. Forge Studio kills that round-trip.",
    approach:
      "I took the two tools I'd already shipped and fused them under a single Dashboard. A shared Zustand store holds the in-flight HTML. Click \"Audit this page\" in the builder and the auditor opens pre-loaded with your rendered HTML, already scored. Click \"Edit in builder\" in the auditor and the builder opens with the imported HTML rendered as an editable section. Two tools, one workflow. The compounding concept: each sub-project took the previous one as raw material, and the flagship took both as raw material.",
    outcome:
      "One app where you can draft a SaaS landing page from a template, score it 63/100, click \"Fix All Safe\" to jump to 91/100, then export a self-contained HTML file — without ever leaving the tab. The transfer bridge made both tools feel like features of a single product instead of two products stapled together. This is what I mean by \"tools should compound\": one plus one equals three.",
    features: [
      "Bidirectional Builder ↔ Auditor transfer bridge",
      "12 section types with JSON-schema-driven auto-inspector forms",
      "5 pre-built templates (SaaS, Portfolio, Agency, E-commerce, Startup)",
      "7 theme presets with live CSS variable theming",
      "Drag-and-drop section reordering (dnd-kit) with visible handles",
      "5-category scoring: SEO, Content, A11y, Structure, Performance",
      "38 one-click quick-fixes + \"Fix All Safe\" in optimal order",
      "Multi-page sites with page switcher",
      "50-step undo/redo history with keyboard shortcuts",
      "Device preview: desktop / tablet / mobile widths",
      "AI copy suggestions on every text/textarea field",
      "HTML / ZIP / JSON export pipeline",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind 4", "shadcn/ui", "Prisma", "Zustand", "dnd-kit", "z-ai-web-dev-sdk", "recharts"],
    metrics: [
      { label: "Component tools", value: "2" },
      { label: "Quick-fixes", value: "38" },
      { label: "Audit checks", value: "30+" },
      { label: "Section types", value: "12" },
    ],
    screenshots: [
      { src: "/projects/forge-studio/01-dashboard.png", caption: "Dashboard — Builder + Auditor tool cards, quick stats, template grid" },
      { src: "/projects/forge-studio/02-builder.png", caption: "Builder — section library, canvas, auto-generated inspector" },
      { src: "/projects/forge-studio/03-auditor.png", caption: "Auditor — 5-category score gauge, issues list, quick-fixes" },
      { src: "/projects/forge-studio/04-templates.png", caption: "Templates gallery — 5 pre-built multi-page sites" },
    ],
    subProjects: [
      {
        name: "LandingForge v4.0",
        role: "THE BUILDER · BUILT FIRST",
        year: "2025",
        summary:
          "A no-code landing page builder. Drag-drop section reordering, 12 section types, 5 templates, 7 theme presets, multi-page sites, and a pure string-templated HTML export pipeline with zero runtime dependencies. Started as an 18,000-line vanilla-JS monolith (v3.5), reimagined as a modular Next.js 16 app where adding a section type is ~30 lines of code.",
        features: [
          "12 section types: Navbar, Hero, LogoCloud, Features, Stats, Gallery, Testimonials, Pricing, FAQ, CTA, Newsletter, Footer",
          "5 pre-built templates as JSON blueprints (SaaS, Portfolio, Agency, E-commerce, Startup)",
          "7 theme presets with live CSS variable theming",
          "Auto-generated inspector forms from FieldSchema",
          "50-step undo/redo history + keyboard shortcuts",
          "Standalone HTML export (zero runtime deps) + ZIP bundle (custom CRC32 STORE-method writer)",
          "Analytics dashboard: KPI cards, area/bar/donut/funnel charts",
        ],
        stack: ["Next.js 16", "React 19", "TypeScript", "Zustand", "dnd-kit", "recharts"],
        metrics: [
          { label: "Section types", value: "12" },
          { label: "Templates", value: "5" },
          { label: "Themes", value: "7" },
          { label: "Undo depth", value: "50" },
        ],
        screenshots: [
          { src: "/projects/landingforge/01-editor.png", caption: "Editor — section library, canvas, inspector panel" },
          { src: "/projects/landingforge/02-templates.png", caption: "Templates gallery — 5 pre-built sites" },
          { src: "/projects/landingforge/03-analytics.png", caption: "Analytics dashboard — KPIs, area, bar, donut, funnel" },
          { src: "/projects/landingforge/04-preview.png", caption: "Live preview — iframe-rendered page" },
          { src: "/projects/landingforge/05-dark-theme.png", caption: "Midnight theme — live CSS variable theming" },
          { src: "/projects/landingforge/06-mobile-preview.png", caption: "Mobile preview width — responsive at every breakpoint" },
        ],
      },
      {
        name: "PixelForge v19",
        role: "THE AUDITOR · BUILT SECOND",
        year: "2025",
        summary:
          "A 1:1 Next.js 16 reimplementation of an 8,934-line single-file vanilla-JS audit tool. Five scoring categories, 30+ checks, 38 quick-fixes, 10 tools, an 8-step guided walkthrough, and a dark dev-tool aesthetic. Started as a single HTML file with 217 functions, no types, no tests — ported with full feature parity on a modern stack.",
        features: [
          "5 scoring categories with exact v19 point weights (SEO 20 + Content 25 + A11y 25 + Structure 20 + Perf 30)",
          "30+ audit checks (SEO meta, content, A11y WCAG 4.5:1, structure, perf)",
          "38 quick-fixes operating on iframe DOM + \"Fix All Safe\" in optimal order",
          "Mobile/desktop split scoring with penalty formula",
          "4 right-panel tabs: Score / Edit / OG / Share",
          "8-step guided walkthrough with spotlight + arrows",
          "10-tool grid: PDF report, white-label, platform exports, heatmap sim",
          "A/B variant scoring + competitor comparison",
          "80-deep undo/redo with per-change revert changelog",
          "Server-side URL fetch proxy with HTML sanitizer",
        ],
        stack: ["Next.js 16", "React 19", "TypeScript", "Zustand", "z-ai-web-dev-sdk", "canvas API"],
        metrics: [
          { label: "Functions ported", value: "217" },
          { label: "Quick-fixes", value: "38" },
          { label: "Audit checks", value: "30+" },
          { label: "Tools", value: "10" },
        ],
        screenshots: [
          { src: "/projects/pixelforge/01-initial-audit.png", caption: "Initial audit — 5-category score gauge + issues list" },
          { src: "/projects/pixelforge/02-after-fix-all.png", caption: "After \"Fix All Safe\" — 63 → 91, 26 fixes applied" },
          { src: "/projects/pixelforge/03-tools-modal.png", caption: "Tools modal — 10-tool grid (PDF, white-label, platforms...)" },
          { src: "/projects/pixelforge/04-guide-walkthrough.png", caption: "Guided walkthrough — 8-step spotlight on issue elements" },
          { src: "/projects/pixelforge/05-mobile-preview.png", caption: "Mobile preview — CSS phone shell with notch" },
        ],
      },
    ],
  },
  {
    index: "02",
    name: "Lead Profiler",
    category: "LEAD RESEARCH TOOL",
    year: "2025",
    status: "shipped",
    summary:
      "A research-compression tool for cold WhatsApp openers. Drop in a portfolio URL and a few images, run a multi-step pipeline, and walk away with a tight lead profile you can paste into your first message.",
    problem:
      "Cold outreach at scale means reading dozens of portfolios, LinkedIn pages, and case studies — then synthesizing a 30-second hook. Manual research doesn't scale, and generic LLM prompts produce generic openers that get ignored.",
    approach:
      "I built a step-ordered pipeline (STEP_ORDER) that runs each research stage server-side and streams results back to the UI as they complete. The state machine tracks pending/running/done/error per step. A portfolio URL auto-fills the first observations; uploaded images are passed alongside the URL so the model can read visual context the URL alone misses.",
    outcome:
      "A single-screen workflow: paste URL, drop images, click Run. Each step's output renders in its own card with duration. The compressed observation can be copied straight into a WhatsApp opener — no editing required for the average lead.",
    features: [
      "Step-ordered pipeline with STEP_ORDER state machine",
      "Per-step status: pending / running / done / error",
      "Auto-fill observations from a portfolio URL",
      "Multi-image upload with previews",
      "Streaming step results as they complete",
      "Per-step duration tracking (ms)",
      "Toast notifications for stage transitions",
      "Audit tab alongside profiler tab",
      "Validation: lead name + profession required before run",
      "Compressed output ready to paste into a cold opener",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind 4", "shadcn/ui", "z-ai-web-dev-sdk", "sonner"],
    metrics: [
      { label: "Pipeline steps", value: "6" },
      { label: "Image inputs", value: "Multi" },
      { label: "Output", value: "Paste-ready" },
      { label: "Latency", value: "Streamed" },
    ],
    screenshots: [],
  },
  {
    index: "03",
    name: "Mohamed Medhat — Portfolio",
    category: "CLIENT PROJECT · MARKETING PORTFOLIO",
    year: "2025",
    status: "live",
    summary:
      "A dark, editorial portfolio for a marketing & business development specialist. Six sections — About, Experience, Work, Skills, Academic, Contact — built around the client's existing case studies and a strict Vercel-style aesthetic.",
    problem:
      "Mohamed is a marketer, not a developer. He had the case studies, the experience history, and the skills — but no place to point recruiters or potential clients that felt as premium as the brands he'd audited. He needed a portfolio that matched the editorial quality of his brand audits (Pablo & Abdo, Maine, Pizza Station).",
    approach:
      "I treated the portfolio itself as a brand exercise: near-black background, warm cream text, tight type hierarchy, and a sticky section nav that lets the visitor jump anywhere in one click. Every section follows the same rhythm — index number, eyebrow, headline — so the page reads like a magazine spread. The Work section uses hover-reveal cards with the case-study tags the client already used in his decks (Brand Audit, Competitive Analysis, Campaign Design).",
    outcome:
      "A single-page Next.js app deployed to Vercel. The client's case studies (Pablo & Abdo, The Origin Story, Maine, Pizza Station, AI Research) render as full-bleed cards with category labels. The Skills section is split into 5 categories — Marketing & Campaigns, Digital & Paid Media, Business Development, Analytics & Tools, Languages — matching the client's mental model. Lighthouse clean, mobile-perfect, deployable to any static host.",
    features: [
      "Single-page scroll with sticky section nav (About / Experience / Work / Skills / Contact)",
      "Dark editorial aesthetic — #08080C bg, #FAF8F4 text, Geist font",
      "Hero with large name + dual CTAs (View my work / Get in touch)",
      "About section with contact card + 4 philosophy statements",
      "Experience timeline with 5 roles (CRM, Sales & Marketing, 3 internships)",
      "Selected Work — 5 case studies with hover-reveal detail cards",
      "Skills dashboard — 5 categorized columns",
      "Academic background — Dual Degree (Marketing & International Business)",
      "Contact section with email / LinkedIn / phone channels",
      "Back-to-top button in footer",
      "Responsive — mobile menu, single-column layouts at <768px",
      "Deployed to Vercel with custom domain",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Geist Font", "Vercel"],
    metrics: [
      { label: "Sections", value: "6" },
      { label: "Case studies", value: "5" },
      { label: "Skill categories", value: "5" },
      { label: "Roles", value: "5" },
    ],
    screenshots: [
      { src: "/projects/mohamed-medhat-portfolio/hero.png", caption: "Hero — large name, dual CTAs, sticky nav" },
      { src: "/projects/mohamed-medhat-portfolio/about.png", caption: "About — contact card + 4 philosophy statements" },
      { src: "/projects/mohamed-medhat-portfolio/experience.png", caption: "Experience — 5-role professional history" },
      { src: "/projects/mohamed-medhat-portfolio/work.png", caption: "Selected Work — 5 case studies with hover-reveal" },
      { src: "/projects/mohamed-medhat-portfolio/skills.png", caption: "Skills dashboard — 5 categorized columns" },
      { src: "/projects/mohamed-medhat-portfolio/contact.png", caption: "Contact — email, LinkedIn, phone channels" },
    ],
    links: [
      { label: "Live site", href: "https://portfolio-z258.vercel.app/" },
    ],
  },
];

export type SkillCategory = {
  title: string;
  description: string;
  skills: { name: string; level: number; note?: string }[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    description: "Production interfaces from low-fidelity wireframe to last-pixel polish.",
    skills: [
      { name: "Next.js 16 (App Router)", level: 95, note: "RSC, route handlers, middleware" },
      { name: "React 19", level: 95, note: "use() hook, actions, suspense" },
      { name: "TypeScript", level: 92, note: "strict mode, generics, inference" },
      { name: "Tailwind CSS 4", level: 95, note: "@theme, custom variants, design tokens" },
      { name: "shadcn/ui", level: 92, note: "New York style, custom variants" },
      { name: "Framer Motion", level: 85, note: "scroll-reveal, layout transitions" },
    ],
  },
  {
    title: "State & Data",
    description: "From a Prisma schema to a Zustand selector — the parts users never see but always feel.",
    skills: [
      { name: "Zustand", level: 92, note: "selectors, middleware, undo/redo 80-deep" },
      { name: "Prisma ORM", level: 88, note: "SQLite, relations, migrations" },
      { name: "TanStack Query", level: 80, note: "server state, optimistic updates" },
      { name: "dnd-kit", level: 88, note: "sortable, drag handles, multi-container" },
      { name: "React Hook Form + Zod", level: 85, note: "schema-first validation" },
    ],
  },
  {
    title: "AI & SDK",
    description: "Wiring LLMs, vision models, and web search into real product features — not demos.",
    skills: [
      { name: "z-ai-web-dev-sdk", level: 90, note: "LLM, VLM, image gen, web search, TTS" },
      { name: "Prompt engineering", level: 88, note: "curated fallbacks, structured output" },
      { name: "Streaming responses", level: 82, note: "step-by-step UI feedback" },
      { name: "Image understanding", level: 80, note: "base64 + URL inputs, multi-image" },
    ],
  },
  {
    title: "Engineering",
    description: "The unglamorous parts that decide whether a project ships: exports, persistence, build pipeline.",
    skills: [
      { name: "HTML / ZIP export", level: 90, note: "custom CRC32 STORE-method writer, zero deps" },
      { name: "iframe DOM manipulation", level: 88, note: "click-to-select, layer tree, quick-fixes" },
      { name: "WCAG 4.5:1 contrast engine", level: 85, note: "hex/rgb/hsl/named color parsing" },
      { name: "JSON-schema-driven UIs", level: 90, note: "auto-generated inspector forms" },
      { name: "Server-side URL fetch proxy", level: 82, note: "CORS-safe + HTML sanitizer" },
    ],
  },
  {
    title: "Tooling & Deploy",
    description: "What I reach for to ship — not because it's trendy, because it works.",
    skills: [
      { name: "Bun", level: 85, note: "scripts, dev server, lockfile" },
      { name: "Vercel", level: 88, note: "deploy, preview branches, edge" },
      { name: "ESLint + Prettier", level: 88, note: "strict configs, 0-error standard" },
      { name: "Caddy", level: 75, note: "gateway, reverse proxy, TLS" },
      { name: "Prisma Studio / SQLite", level: 85, note: "local dev, schema push" },
    ],
  },
];

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Industries", href: "#industries" },
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Contact", href: "#contact" },
] as const;
