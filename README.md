# Abdelhady Gabriel — Portfolio

> Full-Stack Developer & Product Engineer · Egypt 🇪🇬 · EN / AR

Live site: **[abdelhady-gabriel.vercel.app](https://abdelhady-gabriel.vercel.app/)**

A dark, Vercel-style single-page portfolio that syncs live data from my 9 public
repositories on GitHub and turns them into a business-ready conversion site —
client case studies, a free-audit funnel via WhatsApp, and an admin back-office.

## Highlights

- **11 sections** — hero with animated stats, process strip, receipts, about,
  projects (filterable, with per-project briefs + prev/next browsing), client
  work with measured outcomes, skills, journey, a live "shipped" feed of real
  commits, a [/now page](https://nownownow.com/), and contact.
- **Live GitHub sync** — stars/forks/issues per repo + latest commit per repo,
  fetched server-side with ETag conditional requests, disk-persisted caches and
  graceful stale-serve fallbacks (never breaks the page).
- **Business layer** — real client case studies with metrics, WhatsApp-first
  contact (floating FAB, pre-composed messages), free-audit CTA.
- **Admin back-office** (`?admin=1`) — inbox of contact messages, privacy-first
  analytics (17 event types), a markdown editor for the /now page with
  snapshot history.
- **Craft details** — ⌘K command palette, keyboard shortcuts overlay, section
  rail scroll-spy, per-project deep links (`?p=slug`), Atom feed (`/api/feed`),
  dynamic OG images (`/api/og`), reduced-motion support, sticky footer,
  light/dark themes.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 + shadcn/ui (New York) + Framer Motion
- Prisma ORM (SQLite locally, gracefully degrades serverless without a DB)
- Edge-native API routes: `/api/github`, `/api/github/commits`, `/api/feed`,
  `/api/og`, `/api/contact`, `/api/now`, `/api/events`

## Develop

```bash
bun install        # or npm install
bun run dev        # http://localhost:3000
```

Optional env vars (`.env`):

```bash
DATABASE_URL="file:./db/custom.db"   # contact inbox + analytics + /now editor
GITHUB_TOKEN="ghp_..."               # 60 → 5000 req/hr for live repo data
PORTFOLIO_ADMIN_TOKEN="..."          # unlocks ?admin=1 (defaults to a dev token)
```

## Deploy

Pushes to `main` auto-deploy via Vercel. Set `DATABASE_URL` to any
serverless-friendly database (or leave unset — every DB-backed route
degrades gracefully and the contact form falls back to WhatsApp delivery).

## License

MIT — the code is yours to learn from. The content (case studies, copy) is mine.
