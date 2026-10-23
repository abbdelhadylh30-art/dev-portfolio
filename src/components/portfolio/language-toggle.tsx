"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { motion } from "framer-motion";
import { usePrefs, type Lang } from "@/lib/i18n/language";

/**
 * AR ⇄ EN language toggle (segmented pill, navbar).
 * Renders both segments in their own script so each is instantly
 * recognisable to its speaker — "ع" is the Arabic switch, "EN" the
 * English one. Business view only (the Developer view stays English).
 */
export function LanguageToggle() {
  const { lang, setLang, t } = usePrefs();
  const [pending, setPending] = React.useState(false);

  const switchTo = (next: Lang) => {
    if (next === lang || pending) return;
    setPending(true);
    setLang(next);
    window.setTimeout(() => setPending(false), 250);
  };

  const options: { value: Lang; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "ar", label: "ع" },
  ];

  return (
    <div
      role="group"
      aria-label={t.nav.langGroup}
      title={t.nav.langTitle}
      className={`relative flex items-center rounded-full border border-border/70 bg-background/60 p-0.5 backdrop-blur ${
        pending ? "opacity-70" : ""
      }`}
    >
      <Languages className="mx-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
      {options.map((opt) => {
        const active = lang === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => switchTo(opt.value)}
            className={`relative z-10 inline-flex h-8 min-w-9 items-center justify-center rounded-full px-2.5 text-xs font-bold transition-colors duration-200 ${
              active ? "text-brand-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-toggle-pill"
                className="absolute inset-0 -z-10 rounded-full bg-brand shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className={opt.value === "ar" ? "text-sm leading-none" : ""}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
