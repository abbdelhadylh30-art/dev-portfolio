/**
 * LandingForge v4.0 — Theme utilities
 * ------------------------------------
 * Convert ThemeTokens → CSS custom properties that section components consume.
 */

import type { ThemeTokens } from "@/lib/sections/types";

export function themeToCssVars(t: ThemeTokens): Record<string, string> {
  return {
    "--lf-primary": t.primary,
    "--lf-primary-fg": t.primaryFg,
    "--lf-accent": t.accent,
    "--lf-accent-fg": t.accentFg,
    "--lf-bg": t.background,
    "--lf-fg": t.foreground,
    "--lf-muted": t.muted,
    "--lf-muted-fg": t.mutedFg,
    "--lf-border": t.border,
    "--lf-font": t.font,
    "--lf-font-heading": t.fontHeading,
    "--lf-radius": t.radius,
  };
}

export function themeToInlineStyle(t: ThemeTokens): React.CSSProperties {
  return themeToCssVars(t) as React.CSSProperties;
}
