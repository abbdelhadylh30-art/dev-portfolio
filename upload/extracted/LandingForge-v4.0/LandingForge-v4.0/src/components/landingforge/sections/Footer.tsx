"use client";

import type { ThemeTokens } from "@/lib/sections/types";

export interface FooterConfig {
  brand: string;
  tagline?: string;
  columns: { title: string; links: { label: string; href: string }[] }[];
  copyright?: string;
}

export function FooterSection({ config, theme }: { config: FooterConfig; theme: ThemeTokens }) {
  const c = config;
  return (
    <footer
      className="border-t px-6 py-12"
      style={{ background: theme.background, borderColor: theme.border }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[2fr_repeat(var(--cols),1fr)]" style={{ ["--cols" as any]: c.columns?.length ?? 3 }}>
          <div>
            <div className="flex items-center gap-2">
              <div
                className="grid h-7 w-7 place-items-center rounded-md font-bold"
                style={{ background: theme.primary, color: theme.primaryFg }}
              >
                {c.brand?.[0]?.toUpperCase() ?? "A"}
              </div>
              <span
                className="font-semibold"
                style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
              >
                {c.brand}
              </span>
            </div>
            {c.tagline && (
              <p className="mt-3 max-w-xs text-sm" style={{ color: theme.mutedFg }}>
                {c.tagline}
              </p>
            )}
          </div>
          {c.columns?.map((col, i) => (
            <div key={i}>
              <h4
                className="mb-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: theme.foreground }}
              >
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links?.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="text-sm transition-opacity hover:opacity-70"
                      style={{ color: theme.mutedFg }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {c.copyright && (
          <div
            className="mt-10 border-t pt-6 text-center text-xs"
            style={{ borderColor: theme.border, color: theme.mutedFg }}
          >
            {c.copyright}
          </div>
        )}
      </div>
    </footer>
  );
}
