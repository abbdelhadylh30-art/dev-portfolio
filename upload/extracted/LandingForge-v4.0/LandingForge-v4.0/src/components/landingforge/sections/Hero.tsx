"use client";

import type { ThemeTokens } from "@/lib/sections/types";

export interface HeroConfig {
  variant: "centered" | "split-left" | "split-right";
  eyebrow?: string;
  headline: string;
  subhead?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
  align?: "left" | "center";
}

export function HeroSection({ config, theme }: { config: HeroConfig; theme: ThemeTokens }) {
  const c = config;
  const isSplit = c.variant !== "centered";
  const isCentered = !isSplit;
  const align = c.align ?? (isCentered ? "center" : "left");
  const textAlign = align === "center" ? "text-center" : "text-left";
  const itemsAlign = align === "center" ? "items-center" : "items-start";

  const textBlock = (
    <div className={`flex flex-col gap-5 ${itemsAlign} ${textAlign}`}>
      {c.eyebrow && (
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
          style={{ background: theme.muted, color: theme.mutedFg }}
        >
          {c.eyebrow}
        </span>
      )}
      <h1
        className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
        style={{ color: theme.foreground, fontFamily: theme.fontHeading }}
      >
        {c.headline}
      </h1>
      {c.subhead && (
        <p
          className="max-w-2xl text-base sm:text-lg"
          style={{ color: theme.mutedFg }}
        >
          {c.subhead}
        </p>
      )}
      <div className={`mt-2 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
        {c.primaryCtaLabel && (
          <a
            href={c.primaryCtaHref}
            className="inline-flex items-center gap-1 rounded-md px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-105"
            style={{ background: theme.primary, color: theme.primaryFg }}
          >
            {c.primaryCtaLabel}
          </a>
        )}
        {c.secondaryCtaLabel && (
          <a
            href={c.secondaryCtaHref}
            className="inline-flex items-center gap-1 rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors"
            style={{ borderColor: theme.border, color: theme.foreground, background: "transparent" }}
          >
            {c.secondaryCtaLabel}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <section className="px-6 py-16 sm:py-24" style={{ background: theme.background }}>
      <div className="mx-auto max-w-6xl">
        {isCentered ? (
          <div className="flex flex-col items-center text-center">{textBlock}</div>
        ) : (
          <div
            className={`grid items-center gap-12 md:grid-cols-2 ${
              c.variant === "split-right" ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            {textBlock}
            {c.imageUrl ? (
              <img
                src={c.imageUrl}
                alt=""
                className="w-full rounded-xl shadow-xl"
                style={{ borderRadius: theme.radius }}
              />
            ) : (
              <div
                className="grid aspect-video w-full place-items-center rounded-xl"
                style={{ background: theme.muted, borderRadius: theme.radius }}
              >
                <span className="text-sm" style={{ color: theme.mutedFg }}>
                  Image placeholder
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
