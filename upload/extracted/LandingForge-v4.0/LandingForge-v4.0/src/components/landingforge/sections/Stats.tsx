"use client";

import type { ThemeTokens } from "@/lib/sections/types";

export interface StatsConfig {
  title?: string;
  stats: { value: string; label: string }[];
}

export function StatsSection({ config, theme }: { config: StatsConfig; theme: ThemeTokens }) {
  const c = config;
  return (
    <section className="px-6 py-12" style={{ background: theme.muted }}>
      <div className="mx-auto max-w-6xl">
        {c.title && (
          <h2
            className="mb-10 text-center text-2xl font-bold tracking-tight"
            style={{ color: theme.foreground }}
          >
            {c.title}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {c.stats?.map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
              >
                {s.value}
              </div>
              <div className="mt-2 text-sm font-medium" style={{ color: theme.mutedFg }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
