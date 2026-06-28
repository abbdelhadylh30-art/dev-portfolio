# Forge Studio — Build. Audit. Ship.

> The all-in-one landing page studio. A drag-drop **page builder** + a 5-category **page auditor** with one-click fixes — in one unified app.

Forge Studio combines two complete tools under one roof:
1. **Builder** (ported from LandingForge v4.0) — no-code drag-drop landing page editor with 12 section types, 5 templates, 7 themes, multi-page support, and HTML/ZIP export.
2. **Auditor** (ported from PixelForge v19) — import any HTML or URL, get an instant 0-100 quality score across SEO, Accessibility, Content, Structure, and Performance, then apply 38 one-click fixes.

The two tools are connected by a **bidirectional transfer bridge**: click "Audit this page" in the builder to send your HTML to the auditor for scoring, or click "Edit in builder" in the auditor to send imported HTML to the builder for editing.

---

## What's inside

### Dashboard (landing view)
- Two large tool cards: **Page Builder** (start blank / browse templates) and **Page Auditor** (open auditor / audit current builder page)
- Quick stats: 12 section types, 30+ audit checks, 38 quick-fixes, 5 templates
- Template quick-start grid (blank page + 5 pre-built templates)
- 3-step workflow explainer: Build → Audit → Fix & ship

### Builder (light theme)
- **12 section types**: Navbar, Hero, Logo cloud, Features, Stats, Gallery, Testimonials, Pricing, FAQ, CTA, Newsletter, Footer
- **5 pre-built templates**: Northwind (SaaS), Atelier (Portfolio), Globex (Agency), Hooli (E-commerce), Tidewave (Startup)
- **7 theme presets**: Slate, Midnight, Sunset, Forest, Rose, Ocean, Mono
- **Drag-and-drop** section reordering (dnd-kit) with visible drag handles
- **Auto-generated inspector** — every section's JSON schema becomes a form with text inputs, textareas, color pickers, selects, switches, image URLs, and repeatable list editors
- **AI copy suggestions** — every text/textarea field with `aiSuggest: true` has a "✨ Suggest" button (powered by z-ai-web-dev-sdk)
- **Multi-page sites** with page switcher
- **Undo/redo** (50-deep history) with keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- **Device preview**: desktop / tablet / mobile widths
- **HTML export** — standalone HTML file or JSON blueprint
- **"Audit this page" button** — sends the current HTML to the Auditor for scoring

### Auditor (dark dev-tool theme)
- **5 scoring categories** (120 pts scaled to 100):
  - SEO & Meta (20 pts): H1, meta description, title, lang, OG tags, favicon
  - Content & Conversion (25 pts): CTA above fold, CTA copy strength, value proposition, trust signals
  - Accessibility (25 pts): image alt, form labels, link text, color contrast (WCAG 4.5:1), focus indicators
  - Structure & Mobile (20 pts): heading hierarchy, viewport, touch targets, hero section
  - Performance (30 pts): DOM size, image sizes, font-display, lazy-load, hero preload, srcset, script defer, responsive CSS, theme-color, font size, autocomplete, DNS prefetch, icon-font warning
- **Mobile/desktop split scoring** with mobile penalty formula
- **38 quick-fixes** operating on the iframe DOM + "Fix All Safe" button
- **4-tab right panel**: Score (gauge + categories + top 3 + issues), Edit (element inspector with 8 collapsible groups), OG (social preview + favicon editor), Share (before/after share card canvas)
- **5 modals**: Import, Competitor comparison, A/B variant scoring, Tools (10-tool grid), Export
- **10 tools**: PDF Report, White Label, Platform Export (Shopify/WordPress/Webflow/ClickFunnels), Client Mode, Auto Monitor, Heatmap Simulation, Conversion Probability Score, Team Comments, Page Speed Simulation, Above-Fold Score
- **8-step guided walkthrough** with spotlight on issue elements
- **80-deep undo/redo** + changelog FAB with per-change revert
- **URL bar**: Live mode (iframe direct) + Fetch mode (server-side CORS proxy)
- **"Edit in builder" button** — sends the current HTML to the Builder for editing

### Bidirectional transfer
The two tools share a transfer bridge via the unified `useForge` store:
- **Builder → Auditor**: Click "Audit this page" in the builder top bar. The auditor opens with the builder's rendered HTML pre-loaded and scored.
- **Auditor → Builder**: Click "Edit in builder" in the auditor top bar. The builder opens with the auditor's HTML rendered in an iframe section for further editing.

### Per-tool themes
- **Dashboard**: Light, modern, gradient-accented (violet → fuchsia)
- **Builder**: Light theme with white panels, slate text, violet accents
- **Auditor**: Dark dev-tool aesthetic (#0a0c10 bg, #5c8def accent, Inter font, tabular-nums)

---

## Tech stack
| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19 + shadcn/ui + Lucide icons |
| Styling | Tailwind CSS 4 + custom CSS variables |
| State | Zustand (unified `useForge` + `useBuilder` + `usePFStore`) |
| Drag-and-drop | @dnd-kit/core + @dnd-kit/sortable |
| AI | z-ai-web-dev-sdk (server-side only) |
| Database | Prisma ORM + SQLite (schema defined) |
| Fonts | Inter (next/font) |

---

## File structure
```
src/
├── app/
│   ├── layout.tsx                    # Inter font + metadata
│   ├── page.tsx                      # View switcher (dashboard/builder/templates/auditor)
│   ├── globals.css                   # Dark auditor theme + light builder utilities
│   └── api/
│       ├── fetch-url/route.ts        # Server-side URL fetch + sanitize (auditor)
│       ├── ai-copy/route.ts          # z-ai-web-dev-sdk copy generator (both tools)
│       └── export-html/route.ts      # HTML download endpoint (auditor)
├── lib/
│   ├── forge/store.ts                # Unified app store (view + transfer bridge)
│   ├── builder/
│   │   ├── sections/{types,registry,theme-utils,renderer}.ts
│   │   ├── store/builder-store.ts    # Zustand (50-deep history, multi-page, export)
│   │   └── templates/templates.ts    # 5 pre-built site blueprints
│   └── pixelforge/
│       ├── types.ts
│       ├── store/pf-store.ts         # Zustand (80-deep history)
│       ├── scoring/{engine,guide-steps,sample-page}.ts
│       └── fixes/quick-fixes.ts      # 38 quick-fixes + Fix All Safe
├── components/
│   ├── forge/
│   │   ├── Dashboard.tsx             # Landing view with tool cards + templates
│   │   └── AuditorShell.tsx          # Wraps PF AppShell + transfer logic
│   ├── builder/
│   │   ├── editor/{BuilderShell,TopBar,Canvas,Inspector,ExportDialog}.tsx
│   │   ├── sections/{AllSections,SectionRenderer}.tsx
│   │   └── templates/TemplatesGallery.tsx
│   └── pixelforge/                   # Full auditor (unchanged from v19)
│       ├── editor/{AppShell,TopBar,DeviceBar,LayerPanel,Preview,RightPanel,GuideOverlay,ChangelogFab}.tsx
│       ├── panels/{ScorePanel,EditPanel,OGPanel,SharePanel}.tsx
│       ├── modals/{ImportModal,CompetitorModal,ABModal,ToolsModal,ExportModal}.tsx
│       └── shared/utils.ts
prisma/
└── schema.prisma                     # Project/Audit/QuickFix/etc.
```

---

## Verified working (agent-browser + VLM)
- Dashboard renders with both tool cards, stats, templates, workflow steps
- Templates gallery shows all 5 templates with "Use template" buttons
- Clicking a template loads it into the builder (Northwind SaaS rendered with all sections)
- Builder top bar shows device toggle, page switcher, theme picker, "Audit this page" button, Export
- Section library on left, canvas in center, inspector on right
- **Builder → Auditor transfer**: Click "Audit this page" → auditor opens with builder HTML → score 46 (SaaS template)
- **Auditor → Builder transfer**: Click "Edit in builder" → builder opens with auditor HTML rendered in iframe (AI Writer Pro demo page visible)
- Auditor score gauge, category breakdown, top 3 fixes, issues list all render
- "Back to Dashboard" buttons work in both tools
- Lint: 0 errors

---

## Development
```bash
bun install
bun run dev              # http://localhost:3000
bun run lint             # ESLint
bun run db:push          # Apply Prisma schema to SQLite
```

## License
MIT
