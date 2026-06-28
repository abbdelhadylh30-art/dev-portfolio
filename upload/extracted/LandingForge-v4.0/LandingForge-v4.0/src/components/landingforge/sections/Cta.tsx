"use client";

import type { ThemeTokens } from "@/lib/sections/types";

export interface CtaConfig {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  variant: "solid" | "muted" | "gradient";
}

export function CtaSection({ config, theme }: { config: CtaConfig; theme: ThemeTokens }) {
  const c = config;
  const bg =
    c.variant === "gradient"
      ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`
      : c.variant === "muted"
      ? theme.muted
      : theme.primary;
  const fg =
    c.variant === "muted" ? theme.foreground : theme.primaryFg;
  const mutedFg =
    c.variant === "muted" ? theme.mutedFg : "rgba(255,255,255,0.85)";
  const btnBorder =
    c.variant === "muted" ? theme.border : "rgba(255,255,255,0.3)";

  return (
    <section className="px-6 py-16 sm:py-24" style={{ background: theme.background }}>
      <div className="mx-auto max-w-5xl">
        <div
          className="rounded-2xl px-8 py-12 text-center sm:px-16 sm:py-16"
          style={{ background: bg, color: fg, borderRadius: theme.radius }}
        >
          {c.eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: mutedFg }}>
              {c.eyebrow}
            </p>
          )}
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: fg, fontFamily: theme.fontHeading }}
          >
            {c.title}
          </h2>
          {c.subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg" style={{ color: mutedFg }}>
              {c.subtitle}
            </p>
          )}
          {(c.primaryCtaLabel || c.secondaryCtaLabel) && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {c.primaryCtaLabel && (
                <a
                  href={c.primaryCtaHref}
                  className="inline-flex items-center gap-1 rounded-md px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-105"
                  style={{ background: theme.background, color: theme.foreground }}
                >
                  {c.primaryCtaLabel}
                </a>
              )}
              {c.secondaryCtaLabel && (
                <a
                  href={c.secondaryCtaHref}
                  className="inline-flex items-center gap-1 rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors"
                  style={{ borderColor: btnBorder, color: fg, background: "transparent" }}
                >
                  {c.secondaryCtaLabel}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
