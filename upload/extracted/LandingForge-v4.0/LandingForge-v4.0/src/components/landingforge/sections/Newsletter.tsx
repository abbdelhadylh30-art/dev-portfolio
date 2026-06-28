"use client";

import type { ThemeTokens } from "@/lib/sections/types";

export interface NewsletterConfig {
  title: string;
  subtitle?: string;
  placeholder?: string;
  buttonLabel?: string;
  footnote?: string;
}

export function NewsletterSection({ config, theme }: { config: NewsletterConfig; theme: ThemeTokens }) {
  const c = config;
  return (
    <section id="waitlist" className="px-6 py-16 sm:py-24" style={{ background: theme.muted }}>
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
        >
          {c.title}
        </h2>
        {c.subtitle && (
          <p className="mt-4 text-base sm:text-lg" style={{ color: theme.mutedFg }}>
            {c.subtitle}
          </p>
        )}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            placeholder={c.placeholder ?? "you@email.com"}
            className="flex-1 rounded-md border px-4 py-2.5 text-sm outline-none"
            style={{
              borderColor: theme.border,
              background: theme.background,
              color: theme.foreground,
            }}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-105"
            style={{ background: theme.primary, color: theme.primaryFg }}
          >
            {c.buttonLabel ?? "Subscribe"}
          </button>
        </form>
        {c.footnote && (
          <p className="mt-4 text-xs" style={{ color: theme.mutedFg }}>
            {c.footnote}
          </p>
        )}
      </div>
    </section>
  );
}
