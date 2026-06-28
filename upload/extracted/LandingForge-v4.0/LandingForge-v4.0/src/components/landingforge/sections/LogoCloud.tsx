"use client";

import type { ThemeTokens } from "@/lib/sections/types";

export interface LogoCloudConfig {
  title?: string;
  logos: { name: string; url?: string }[];
}

export function LogoCloudSection({ config, theme }: { config: LogoCloudConfig; theme: ThemeTokens }) {
  const c = config;
  return (
    <section className="px-6 py-12" style={{ background: theme.background }}>
      <div className="mx-auto max-w-6xl">
        {c.title && (
          <p
            className="mb-8 text-center text-sm font-medium uppercase tracking-wider"
            style={{ color: theme.mutedFg }}
          >
            {c.title}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
          {c.logos?.map((logo, i) => (
            <div key={i} className="flex items-center gap-2">
              {logo.url ? (
                <img src={logo.url} alt={logo.name} className="h-7 w-auto" />
              ) : (
                <span
                  className="text-xl font-bold tracking-tight"
                  style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
                >
                  {logo.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
