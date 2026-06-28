# LandingForge v4.0

> The no-code landing page builder, reimagined as a modern Next.js 16 app.

Built on top of [LandingForge v3.5](./upload/) (a vanilla-JS page builder), v4.0 is a
complete rewrite that migrates the project to **Next.js 16 + React 19 + TypeScript +
Tailwind 4 + shadcn/ui + Prisma + Zustand + dnd-kit**.

---

## What's new in v4.0

### Architecture
- **Full Next.js 16 migration** — App Router, TypeScript strict, React Server Components
  where it matters, client components for the editor.
- **Modular by default** — every section is a self-contained React component with a
  JSON schema that auto-generates its inspector form. Adding a new section type is
  ~30 lines of code.
- **Prisma schema** for sites, pages, sections, themes, templates, and analytics events.
- **Zustand store** with **50-step undo/redo history**, multi-page state, device preview,
  and theme tokens.

### Editor
- **Drag-and-drop section reordering** (dnd-kit) with visible drag handles.
- **Auto-generated inspector** — every section's schema becomes a form with text inputs,
  textareas, color pickers, switches, selects, image URL fields, and **repeatable list
  editors** (with add/remove/reorder per item).
- **Inline section selection** — click any section in the canvas to edit it.
- **Device preview** — desktop / tablet / mobile widths.
- **Theme picker** — 7 built-in presets (Slate, Midnight, Sunset, Forest, Rose, Ocean, Mono)
  with live CSS variable theming.
- **Keyboard shortcuts** — Cmd/Ctrl+Z (undo), Cmd/Ctrl+Shift+Z or Cmd/Ctrl+Y (redo),
  Esc (deselect).

### Sections (12 types)
| Category      | Sections                                         |
| ------------- | ------------------------------------------------ |
| Structure     | Navbar, Footer                                   |
| Conversion    | Hero, Features, Pricing, FAQ, CTA, Newsletter    |
| Social proof  | Logo cloud, Stats, Testimonials                  |
| Media         | Gallery                                          |

### Templates (5 pre-built sites)
- **Northwind — SaaS** (multi-page: Home + Pricing)
- **Atelier — Portfolio**
- **Globex — Agency**
- **Hooli — E-commerce**
- **Tidewave — Startup launch**

### Export
- **Standalone HTML** — one self-contained file with inline CSS. Host anywhere.
- **ZIP bundle** — `index.html` + `styles.css` + `README.txt`. Drag-and-drop to Netlify,
  Vercel, Cloudflare Pages, GitHub Pages.
- **JSON blueprint** — full site state, re-importable into LandingForge.

The export pipeline is **pure server-side string templating** (no React on the rendered
page), so exported pages have zero runtime dependencies.

### Analytics dashboard
- 4 KPI cards with period-over-period change indicators.
- 30-day traffic area chart (views, visitors, conversions).
- Section performance bar chart.
- Traffic sources donut chart.
- Conversion funnel with drop-off percentages.
- AI-generated optimization insight.

### AI copy suggestions
- Every text/textarea field with `aiSuggest: true` shows a "✨ Suggest" button.
- Calls `/api/ai-copy` which uses `z-ai-web-dev-sdk` to generate field-specific copy
  (headline, subhead, eyebrow, testimonial quote, FAQ answer, etc.).
- Falls back to curated templates if the AI service is unavailable.

### Live preview
- Full-page render of the current page at desktop/tablet/mobile widths.
- "Publish" button simulates a deployment (records an analytics event).

### Multi-page support
- Each site can have multiple pages (Home, Pricing, About, etc.).
- Page switcher in the top bar.
- Each page has its own sections and SEO metadata.

---

## Tech stack

| Layer            | Technology                                             |
| ---------------- | ------------------------------------------------------ |
| Framework        | Next.js 16 (App Router, Turbopack)                     |
| Language         | TypeScript 5                                           |
| UI               | React 19 + shadcn/ui (New York) + Lucide icons         |
| Styling          | Tailwind CSS 4                                         |
| State            | Zustand (client) + TanStack Query (server)             |
| Drag-and-drop    | @dnd-kit/core + @dnd-kit/sortable                      |
| Charts           | Recharts                                               |
| Animations       | Framer Motion                                          |
| Database         | Prisma ORM (SQLite client)                            |
| AI               | z-ai-web-dev-sdk (server-side only)                    |
| Toasts           | Sonner                                                 |
| Themes           | next-themes (ready for dark mode)                      |

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout + metadata
│   ├── page.tsx                      # View switcher (dashboard/editor/preview/...)
│   ├── globals.css                   # Tailwind + theme tokens
│   └── api/
│       ├── export/route.ts           # HTML/ZIP export (pure string templating)
│       └── ai-copy/route.ts          # AI copy generation via z-ai-web-dev-sdk
├── components/
│   ├── ui/                           # shadcn/ui components (preinstalled)
│   └── landingforge/
│       ├── editor/
│       │   ├── EditorShell.tsx       # Top bar + library + canvas + inspector
│       │   ├── TopBar.tsx            # View tabs, device toggle, theme, undo/redo, export
│       │   ├── SectionLibrary.tsx    # Left sidebar — click to add sections
│       │   ├── Canvas.tsx            # Center — dnd-kit sortable sections
│       │   ├── Inspector.tsx         # Right sidebar — auto-generated form
│       │   └── ExportDialog.tsx      # HTML/ZIP/JSON export UI
│       ├── sections/                 # 12 React section components
│       │   ├── SectionRenderer.tsx   # Resolves section.kind → component
│       │   ├── Navbar.tsx  Hero.tsx  Features.tsx  Pricing.tsx
│       │   ├── Faq.tsx     Cta.tsx   Newsletter.tsx  Footer.tsx
│       │   ├── LogoCloud.tsx  Stats.tsx  Gallery.tsx  Testimonials.tsx
│       ├── templates/TemplatesGallery.tsx
│       ├── analytics/AnalyticsDashboard.tsx
│       ├── dashboard/Dashboard.tsx
│       └── preview/Preview.tsx
└── lib/
    ├── sections/
    │   ├── types.ts                  # SectionKind, FieldSchema, ThemeTokens, presets
    │   ├── registry.ts               # SECTION_TYPES catalog (12 types with schemas)
    │   ├── icons.ts                  # Lucide icon name → component resolver
    │   └── theme-utils.ts            # ThemeTokens → CSS custom properties
    ├── store/editor-store.ts         # Zustand store (undo/redo, multi-page, device)
    ├── templates/templates.ts        # 5 pre-built site blueprints
    ├── db.ts                         # Prisma client
    └── utils.ts                      # cn() helper
prisma/
└── schema.prisma                     # Site, Page, Theme, Template, AnalyticsEvent
```

---

## Development

```bash
bun install              # install deps (already done)
bun run dev              # start dev server on :3000 (auto-restarts on save)
bun run lint             # ESLint
bun run db:push          # apply Prisma schema to SQLite
bun run build            # production build (don't run in sandbox)
```

---

## What was upgraded from v3.5

| Area                | v3.5 (vanilla JS)                         | v4.0 (Next.js)                                       |
| ------------------- | ----------------------------------------- | ---------------------------------------------------- |
| Framework           | Vanilla ES modules + 18K-line app.js       | Next.js 16 + React 19 + TypeScript                   |
| State               | Custom EventBus + StorageManager (IDB)     | Zustand with 50-step undo/redo                       |
| Section system      | 4 section types (pricing, faq, reviews)    | 12 section types with auto-generated inspector forms |
| Drag-and-drop       | None (manual move up/down buttons)         | dnd-kit with visible drag handles                    |
| Theming             | 5 CSS variable presets                     | 7 theme presets + live preview + CSS custom props    |
| Templates           | None                                       | 5 pre-built site blueprints                          |
| Export              | None                                       | HTML + ZIP + JSON blueprint                          |
| Analytics           | None                                       | Recharts dashboard with KPIs, funnel, sources        |
| AI copy             | None                                       | z-ai-web-dev-sdk inline suggestions per field        |
| Multi-page          | Single page only                           | Multi-page sites with page switcher                  |
| Preview             | Same tab                                   | Dedicated preview mode at 3 device widths            |
| Testing             | Vitest + Playwright                        | (Tests not migrated in v4.0 — see Notes)             |
| Security            | Custom sanitizer + auth modules            | CSP-friendly server-rendered export, no eval         |

---

## Notes

- The original v3.5 project is preserved under `upload/landingforge_extracted/` for reference.
- The v3.5 test suite (Vitest + Playwright) was not migrated to v4.0 in this release.
  The new architecture makes sections trivially unit-testable; adding tests is a
  follow-up task.
- The Prisma schema is defined and `db:push` is wired up, but the editor currently
  runs entirely client-side (Zustand store). Wiring the store to persist sites to
  SQLite via Prisma is the natural next step for multi-user support.
- Export is **pure string templating on the server** — no React in the exported HTML.
  This keeps exports dependency-free and hostable on any static host.

---

## License

MIT
