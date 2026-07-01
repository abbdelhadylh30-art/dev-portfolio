# Portfolio

A dark, Vercel-style developer portfolio built with Next.js 16, React 19, and Tailwind CSS 4.

## What's inside

- **Hero** — Big name, role, tagline, dual CTAs, credibility stats
- **About** — Bio, contact grid, 4 dev philosophy statements
- **Selected Work** — 5 project case studies with screenshots, metrics, narrative accordions, and a lightbox gallery
- **Capabilities** — 5 categorized skill cards with animated proficiency bars + tech marquee
- **Contact** — Channel grid with email/LinkedIn/GitHub/phone + back-to-top

## Tech stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animations**: Framer Motion
- **Font**: Geist Sans + Geist Mono

## Getting started

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Build for production
bun run build
```

## Customization

All content lives in [`src/lib/portfolio-data.ts`](src/lib/portfolio-data.ts) — edit identity, projects, skills, and philosophy there. The entire site updates automatically.

## Deploy

This portfolio is a static Next.js app — deploy to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

No environment variables required.
