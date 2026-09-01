import type { PortfolioMode } from "@/lib/mode";

/**
 * Site "pages" — the portfolio used to be one long scroll; it is now a
 * paged experience where every section gets its own page, navigated via
 * a hash micro-router (`#/services`, `#/work`, …) inside the single `/`
 * route. Each mode (Business ⇄ Developer) ships its own page set.
 *
 * The page ids double as DOM-free route slugs; the old in-page anchor
 * ids (`#services`, `#work`…) map 1:1 onto them so legacy links keep
 * working (see the redirect table in page-router.tsx).
 */

export type SitePage = {
  /** Route slug — also the hash target: `#/<id>` (home is `#/`). */
  id: string;
  /** Short label for the navbar / rails / footer nav. */
  label: string;
  /** Tiny ALL-CAPS kicker shown in the page footer nav. */
  kicker: string;
  /** One-line teaser (used on the home index cards + footer nav). */
  blurb: string;
  /** lucide icon name is resolved by the caller — keep this data-only. */
  icon: "home" | "globe" | "trophy" | "route" | "user" | "help" | "mail" | "code" | "briefcase" | "folder" | "layers" | "map" | "zap";
};

export const CLIENT_PAGES: SitePage[] = [
  {
    id: "home",
    label: "Home",
    kicker: "Start here",
    blurb: "Websites that work as hard as you do.",
    icon: "home",
  },
  {
    id: "services",
    label: "What I do",
    kicker: "Services",
    blurb: "Fixed-price websites, booking systems and Google visibility.",
    icon: "globe",
  },
  {
    id: "results",
    label: "Results",
    kicker: "Proof",
    blurb: "Real businesses, real numbers — loads, ranks, bookings.",
    icon: "trophy",
  },
  {
    id: "process",
    label: "How it works",
    kicker: "Process",
    blurb: "From free 15-minute chat to launch in 2–4 weeks.",
    icon: "route",
  },
  {
    id: "about",
    label: "About",
    kicker: "Your developer",
    blurb: "Who you're actually working with — no agency middlemen.",
    icon: "user",
  },
  {
    id: "faq",
    label: "FAQ",
    kicker: "Questions",
    blurb: "Prices, ownership, timelines — answered plainly.",
    icon: "help",
  },
  {
    id: "contact",
    label: "Contact",
    kicker: "Say hello",
    blurb: "WhatsApp, email or the form — replies within a day.",
    icon: "mail",
  },
];

export const DEV_PAGES: SitePage[] = [
  {
    id: "home",
    label: "Home",
    kicker: "Deploy",
    blurb: "Full-stack engineer shipping bilingual products.",
    icon: "home",
  },
  {
    id: "about",
    label: "About",
    kicker: "Profile",
    blurb: "How I work, and the philosophy behind it.",
    icon: "code",
  },
  {
    id: "work",
    label: "Work",
    kicker: "Repositories",
    blurb: "9 public repos — SaaS, chat, tooling, automation.",
    icon: "folder",
  },
  {
    id: "clients",
    label: "Clients",
    kicker: "Shipped for others",
    blurb: "Production sites + what clients said about them.",
    icon: "briefcase",
  },
  {
    id: "skills",
    label: "Skills",
    kicker: "Stack",
    blurb: "TypeScript to Terraform, with receipts.",
    icon: "layers",
  },
  {
    id: "journey",
    label: "Journey",
    kicker: "Timeline",
    blurb: "From first <marquee> to multi-tenant SaaS.",
    icon: "map",
  },
  {
    id: "now",
    label: "Now",
    kicker: "Currently",
    blurb: "What I'm building, learning and listening to.",
    icon: "zap",
  },
  {
    id: "contact",
    label: "Contact",
    kicker: "Reach out",
    blurb: "Open to work, contracts and interesting problems.",
    icon: "mail",
  },
];

export function pagesForMode(mode: PortfolioMode): SitePage[] {
  return mode === "client" ? CLIENT_PAGES : DEV_PAGES;
}

/** Navbar order excludes "Home" (the logo covers it) on desktop. */
export function navPagesForMode(mode: PortfolioMode): SitePage[] {
  return pagesForMode(mode).filter((p) => p.id !== "home");
}
