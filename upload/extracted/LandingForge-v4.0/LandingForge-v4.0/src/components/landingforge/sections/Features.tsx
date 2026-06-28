"use client";

import type { ThemeTokens } from "@/lib/sections/types";
import { resolveIcon } from "@/lib/sections/icons";

export interface FeaturesConfig {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  columns: "2" | "3" | "4";
  items: { icon?: string; title: string; description?: string }[];
}

export function FeaturesSection({ config, theme }: { config: FeaturesConfig; theme: ThemeTokens }) {
  const c = config;
  const cols = Number(c.columns ?? 3);
  const gridCols = `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols}`;
  return (
    <section id="features" className="px-6 py-16 sm:py-24" style={{ background: theme.background }}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          {c.eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: theme.accent }}>
              {c.eyebrow}
            </p>
          )}
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
          >
            {c.title}
          </h2>
          {c.subtitle && (
            <p className="mt-4 text-lg" style={{ color: theme.mutedFg }}>
              {c.subtitle}
            </p>
          )}
        </div>
        <div className={`grid gap-6 ${gridCols}`}>
          {c.items?.map((item, i) => {
            const Icon = resolveIcon(item.icon);
            return (
              <div
                key={i}
                className="group rounded-xl border p-6 transition-all hover:shadow-lg"
                style={{ borderColor: theme.border, background: theme.background, borderRadius: theme.radius }}
              >
                <div
                  className="mb-4 grid h-10 w-10 place-items-center rounded-lg"
                  style={{ background: theme.muted, color: theme.accent }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
                >
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm" style={{ color: theme.mutedFg }}>
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
