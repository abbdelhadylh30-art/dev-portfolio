"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Code2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { setModeCookie, type PortfolioMode } from "@/lib/mode";
import { useModeTransform } from "@/lib/mode-transform";

/**
 * Business ⇄ Developer view toggle (segmented pill, lives in the navbar).
 * Flipping it swaps the live tree instantly via the live-mode store, then
 * persists the choice in the cookie and refreshes the server tree so
 * metadata (OG tags, titles) follows — skipped when the cookie write was
 * blocked (sandboxed iframe) so a stale server render can never fight the
 * live client tree.
 */
export function ModeToggle({ mode, compact = false }: { mode: PortfolioMode; compact?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const switchTo = (next: PortfolioMode) => {
    if (next === mode || pending) return;
    setPending(true);

    // 1) Instant, deterministic client-side swap.
    useModeTransform.getState().setLiveMode(next);
    trackEvent("mode_switch", { label: next });

    // 2) Persist + refresh server metadata when the cookie verifiably
    //    took; skip the refresh if cookies are blocked.
    if (setModeCookie(next)) router.refresh();

    // 3) Brief guard against double-flips while the trees swap.
    window.setTimeout(() => setPending(false), 650);
  };

  const options: { value: PortfolioMode; label: string; icon: typeof Briefcase }[] = [
    { value: "client", label: "Business", icon: Briefcase },
    { value: "dev", label: "Developer", icon: Code2 },
  ];

  return (
    <div
      role="group"
      aria-label="Choose audience view"
      title="Business view for clients · Developer view for the full technical portfolio"
      className={`relative flex items-center rounded-full border border-border/70 bg-background/60 p-0.5 backdrop-blur ${
        pending ? "opacity-70" : ""
      }`}
    >
      {options.map((opt) => {
        const active = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            disabled={pending}
            onClick={() => switchTo(opt.value)}
            className={`relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors duration-200 ${
              active
                ? "text-brand-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active && (
              <motion.span
                layoutId="mode-toggle-pill"
                className="absolute inset-0 -z-10 rounded-full bg-brand shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <opt.icon className="h-3.5 w-3.5" />
            {!compact && <span>{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
