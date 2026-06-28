"use client";

import type { ThemeTokens } from "@/lib/sections/types";

export interface TestimonialsConfig {
  title?: string;
  items: { quote: string; name: string; role?: string; avatar?: string }[];
}

export function TestimonialsSection({ config, theme }: { config: TestimonialsConfig; theme: ThemeTokens }) {
  const c = config;
  return (
    <section id="testimonials" className="px-6 py-16 sm:py-24" style={{ background: theme.muted }}>
      <div className="mx-auto max-w-6xl">
        {c.title && (
          <h2
            className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
          >
            {c.title}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-3">
          {c.items?.map((t, i) => (
            <figure
              key={i}
              className="flex flex-col gap-4 rounded-xl border p-6"
              style={{ borderColor: theme.border, background: theme.background, borderRadius: theme.radius }}
            >
              <blockquote
                className="text-base leading-relaxed"
                style={{ color: theme.foreground }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold"
                    style={{ background: theme.primary, color: theme.primaryFg }}
                  >
                    {t.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold" style={{ color: theme.foreground }}>
                    {t.name}
                  </div>
                  {t.role && (
                    <div className="text-xs" style={{ color: theme.mutedFg }}>
                      {t.role}
                    </div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
