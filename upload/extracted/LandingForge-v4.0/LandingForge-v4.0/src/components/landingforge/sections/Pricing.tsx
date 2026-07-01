"use client";

import type { ThemeTokens } from "@/lib/sections/types";
import { Check } from "lucide-react";

export interface PricingConfig {
  title?: string;
  subtitle?: string;
  currency: string;
  period: string;
  tiers: {
    name: string;
    price: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
    highlighted?: boolean;
    features: string; // newline-separated
  }[];
}

export function PricingSection({ config, theme }: { config: PricingConfig; theme: ThemeTokens }) {
  const c = config;
  return (
    <section id="pricing" className="px-6 py-16 sm:py-24" style={{ background: theme.background }}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          {c.title && (
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
            >
              {c.title}
            </h2>
          )}
          {c.subtitle && (
            <p className="mt-4 text-lg" style={{ color: theme.mutedFg }}>
              {c.subtitle}
            </p>
          )}
        </div>
        <div className={`grid gap-6 ${c.tiers?.length === 1 ? "mx-auto max-w-md" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {c.tiers?.map((tier, i) => {
            const features = (tier.features ?? "").split("\n").filter(Boolean);
            const highlight = tier.highlighted;
            return (
              <div
                key={i}
                className="relative flex flex-col rounded-xl border p-6 shadow-sm"
                style={{
                  borderColor: highlight ? theme.accent : theme.border,
                  background: theme.background,
                  borderRadius: theme.radius,
                  boxShadow: highlight ? `0 10px 30px -10px ${theme.accent}40` : undefined,
                  transform: highlight ? "scale(1.02)" : undefined,
                }}
              >
                {highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                    style={{ background: theme.accent, color: theme.accentFg }}
                  >
                    Most popular
                  </div>
                )}
                <h3 className="text-lg font-semibold" style={{ color: theme.foreground }}>
                  {tier.name}
                </h3>
                {tier.description && (
                  <p className="mt-1 text-sm" style={{ color: theme.mutedFg }}>
                    {tier.description}
                  </p>
                )}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight" style={{ color: theme.foreground }}>
                    {c.currency}{tier.price}
                  </span>
                  <span className="text-sm" style={{ color: theme.mutedFg }}>
                    {c.period}
                  </span>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-2">
                  {features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm" style={{ color: theme.foreground }}>
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: theme.accent }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {tier.ctaLabel && (
                  <a
                    href={tier.ctaHref}
                    className="mt-6 inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-105"
                    style={{
                      background: highlight ? theme.accent : theme.primary,
                      color: highlight ? theme.accentFg : theme.primaryFg,
                    }}
                  >
                    {tier.ctaLabel}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
