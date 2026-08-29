/**
 * "Now" section content — a snapshot of what Abdelhady is currently up to.
 * Inspired by nownownow.com. Update this when your focus changes; the whole
 * section re-renders from this file.
 */

export type NowEntry = { label: string; detail: string };

export type NowSection = {
  title: string;
  blurb: string;
  updatedAt: string; // ISO
  groups: { heading: string; icon: string; entries: NowEntry[] }[];
};

export const nowSection: NowSection = {
  title: "Now",
  blurb:
    "A living snapshot of what I'm building, learning and reading. Updated whenever the focus shifts.",
  updatedAt: "2026-08-24T00:00:00.000Z",
  groups: [
    {
      heading: "Building",
      icon: "hammer",
      entries: [
        {
          label: "Build Ledger",
          detail:
            "Exploring strict typing across mixed-language boundaries — TS core, Python scripts, a small Rust hot-path.",
        },
        {
          label: "Forge Studio",
          detail:
            "Iterating on the 5-category auditor's deterministic checks so suggestions always match the canvas.",
        },
        {
          label: "This portfolio",
          detail:
            "Adding live GitHub stats, a working contact form, and a ⌘K command palette.",
        },
      ],
    },
    {
      heading: "Learning",
      icon: "book",
      entries: [
        {
          label: "Haskell ADTs",
          detail:
            "Using strict algebraic data types as a hardening layer over lenient JSON — see lead-profiler-haskell.",
        },
        {
          label: "Multi-tenant patterns",
          detail:
            "Tenant-scoped Prisma middleware and per-tenant sessions in GlamChain.",
        },
        {
          label: "RTL & i18n",
          detail:
            "Layout-level (not just string) flipping for Arabic-first Gulf-region SaaS.",
        },
      ],
    },
    {
      heading: "Reading",
      icon: "glasses",
      entries: [
        {
          label: "Designing Data-Intensive Applications",
          detail: "Re-reading the chapters on replication and partitioning.",
        },
        {
          label: "Learn You a Haskell",
          detail:
            "Going deeper on typeclasses and monads for the hardening layer.",
        },
      ],
    },
  ],
};

export const nowNavLinks: { label: string; href: string }[] = [
  { label: "Now", href: "#now" },
];
