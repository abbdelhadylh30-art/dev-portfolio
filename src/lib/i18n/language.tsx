"use client";

import * as React from "react";
import { enContent, type ClientContent } from "./en";
import arContent from "./ar";
import { useModeTransform } from "@/lib/mode-transform";
import { CLIENT_PAGES, DEV_PAGES, type SitePage } from "@/lib/site-pages";
import { trackEvent } from "@/lib/analytics";

/**
 * Language + palette preferences for the Business (client) view.
 *
 * Language: full AR/EN with proper RTL. The provider owns
 *   • <html lang> + <html dir> (RTL mirroring is document-level),
 *   • the active content object consumed by every client-mode section,
 *   • persistence (localStorage "pref-lang") and an early inline script
 *     in layout.tsx that pre-applies dir/lang before hydration so RTL
 *     users don't see an LTR flash.
 *
 * Palette: three hand-tuned colour variants ("sunset" | "royal" |
 * "midnight") scoped to the Business skin via <html data-palette> —
 * see the [data-palette=…] blocks in globals.css. The Developer view
 * keeps its fixed identity: dark + emerald, English, LTR — flipping
 * to dev mode temporarily pins EN/LTR without clearing the stored
 * preference, so returning to Business restores it.
 */

export type Lang = "en" | "ar";
export type PaletteId = "sunset" | "royal" | "midnight";

const LANG_KEY = "pref-lang";
const PALETTE_KEY = "pref-palette";
export const PALETTES: PaletteId[] = ["sunset", "royal", "midnight"];

type PrefsValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Active translated content — consume this in every client-mode section. */
  t: ClientContent;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  palette: PaletteId;
  setPalette: (p: PaletteId) => void;
  /** Pages of the current mode with localised labels (client mode only). */
  localizedPages: SitePage[];
};

const PrefsContext = React.createContext<PrefsValue | null>(null);

export function usePrefs(): PrefsValue {
  const ctx = React.useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return ctx;
}

function readStoredLang(): Lang {
  try {
    return localStorage.getItem(LANG_KEY) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

function readStoredPalette(): PaletteId {
  try {
    const v = localStorage.getItem(PALETTE_KEY);
    return v === "royal" || v === "midnight" ? v : "sunset";
  } catch {
    return "sunset";
  }
}

function applyDocumentAttrs(lang: Lang, palette: PaletteId) {
  if (typeof document === "undefined") return;
  const content = lang === "ar" ? arContent : enContent;
  document.documentElement.lang = content.lang;
  document.documentElement.dir = content.dir;
  document.documentElement.dataset.palette = palette;
}

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  /* First paint = English/LTR so SSR + hydration match; stored
     preferences apply right after mount (direction is pre-applied by
     the inline early script in layout.tsx, so there is no RTL flash). */
  const [lang, setLangState] = React.useState<Lang>("en");
  const [palette, setPaletteState] = React.useState<PaletteId>("sunset");
  const [hydrated, setHydrated] = React.useState(false);

  const liveMode = useModeTransform((s) => s.liveMode);

  React.useEffect(() => {
    setLangState(readStoredLang());
    setPaletteState(readStoredPalette());
    setHydrated(true);
  }, []);

  /* Apply document attributes whenever (lang, palette, mode) settle. */
  React.useEffect(() => {
    if (!hydrated) return;
    /* Developer view keeps its fixed identity: dark + emerald, EN, LTR. */
    applyDocumentAttrs(liveMode === "dev" ? "en" : lang, palette);
  }, [lang, palette, liveMode, hydrated]);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* storage blocked — preference lives for this session only */
    }
    trackEvent("language_switch", { label: l });
  }, []);

  const setPalette = React.useCallback((p: PaletteId) => {
    setPaletteState(p);
    try {
      localStorage.setItem(PALETTE_KEY, p);
    } catch {
      /* storage blocked — preference lives for this session only */
    }
    trackEvent("palette_switch", { label: p });
  }, []);

  /* Localised page labels: client mode translates, dev mode keeps EN. */
  const localizedPages = React.useMemo<SitePage[]>(() => {
    const base = liveMode === "dev" ? DEV_PAGES : CLIENT_PAGES;
    if (liveMode === "dev" || lang !== "ar") return base;
    return base.map((p) => ({ ...p, ...arContent.pages[p.id as keyof typeof arContent.pages] }));
  }, [liveMode, lang]);

  const value = React.useMemo<PrefsValue>(() => {
    const effectiveLang: Lang = liveMode === "dev" ? "en" : lang;
    const t = effectiveLang === "ar" ? arContent : enContent;
    return {
      lang: effectiveLang,
      setLang,
      t,
      dir: t.dir,
      isRtl: t.dir === "rtl",
      palette,
      setPalette,
      localizedPages,
    };
  }, [lang, palette, liveMode, setLang, setPalette, localizedPages]);

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

/**
 * Gradient title helper — renders {pre, grad, post} content heads with
 * the animated brand sweep on the middle segment.
 */
export function GradTitle({ parts }: { parts: { pre: string; grad: string; post: string } }) {
  return (
    <>
      {parts.pre}
      <span className="brand-gradient-text">{parts.grad}</span>
      {parts.post}
    </>
  );
}
