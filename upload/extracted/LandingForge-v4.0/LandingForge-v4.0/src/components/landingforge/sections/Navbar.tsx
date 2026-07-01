"use client";

import type { ThemeTokens } from "@/lib/sections/types";

export interface NavbarConfig {
  brand: string;
  logoUrl?: string;
  links: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
  sticky?: boolean;
  transparent?: boolean;
}

export function NavbarSection({ config, theme }: { config: NavbarConfig; theme: ThemeTokens }) {
  const c = config;
  return (
    <header
      className="w-full border-b backdrop-blur-sm"
      style={{
        background: c.transparent ? "transparent" : theme.background,
        borderColor: theme.border,
        position: c.sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 30,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          {c.logoUrl ? (
            <img src={c.logoUrl} alt={c.brand} className="h-7 w-auto" />
          ) : (
            <div
              className="grid h-7 w-7 place-items-center rounded-md font-bold"
              style={{ background: theme.primary, color: theme.primaryFg }}
            >
              {c.brand?.[0]?.toUpperCase() ?? "A"}
            </div>
          )}
          <span
            className="font-semibold"
            style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
          >
            {c.brand}
          </span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {c.links?.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: theme.foreground }}
            >
              {l.label}
            </a>
          ))}
        </nav>
        {c.ctaLabel && (
          <a
            href={c.ctaHref}
            className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-semibold transition-transform hover:scale-105"
            style={{ background: theme.primary, color: theme.primaryFg }}
          >
            {c.ctaLabel}
          </a>
        )}
      </div>
    </header>
  );
}
