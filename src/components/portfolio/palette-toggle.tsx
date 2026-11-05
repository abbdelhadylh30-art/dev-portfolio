"use client";

import * as React from "react";
import { usePrefs, PALETTES, type PaletteId } from "@/lib/i18n/language";

/**
 * Colour-variant picker for the Business view — three hand-tuned
 * palettes as swatch dots (sunset / royal / midnight). Pure CSS-variable
 * swaps, so switching is instant and every gradient, glow and card
 * re-skins itself. Business view only.
 */
const SWATCHES: Record<PaletteId, string> = {
  /* Mini tri-hue preview of each palette's brand sweep. */
  sunset:
    "linear-gradient(120deg, oklch(0.62 0.16 35), oklch(0.72 0.14 65), oklch(0.58 0.13 25))",
  royal:
    "linear-gradient(120deg, oklch(0.45 0.08 210), oklch(0.75 0.12 75), oklch(0.6 0.12 30))",
  midnight:
    "linear-gradient(120deg, oklch(0.14 0.012 250), oklch(0.75 0.14 180), oklch(0.78 0.13 70))",
};

export function PaletteToggle() {
  const { palette, setPalette, t } = usePrefs();

  return (
    <div
      role="group"
      aria-label={t.nav.paletteGroup}
      title={t.nav.paletteTitle}
      className="relative flex items-center gap-1 rounded-full border border-border/70 bg-background/60 px-2 py-1 backdrop-blur"
    >
      {PALETTES.map((p) => {
        const active = palette === p;
        return (
          <button
            key={p}
            type="button"
            aria-pressed={active}
            aria-label={t.nav.paletteNames[p] ?? p}
            title={t.nav.paletteNames[p] ?? p}
            onClick={() => setPalette(p)}
            className={`grid h-5 w-5 place-items-center rounded-full transition-transform duration-200 hover:scale-110 ${
              active ? "scale-110" : ""
            }`}
          >
            <span
              aria-hidden
              className={`block h-3.5 w-3.5 rounded-full transition-shadow ${
                active ? "ring-2 ring-brand/70 ring-offset-1 ring-offset-background" : "ring-1 ring-foreground/15"
              }`}
              style={{ background: SWATCHES[p] }}
            />
          </button>
        );
      })}
    </div>
  );
}
