"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Code2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { setModeCookie, type PortfolioMode } from "@/lib/mode";
import { useModeTransform } from "@/lib/mode-transform";
import { TF_COVER_MS } from "@/components/portfolio/mode-transform-overlay";

/**
 * Business ⇄ Developer view toggle (segmented pill, lives in the navbar).
 * Flipping it launches the Transformers mode-shift sequence: armor plates
 * slam shut, and only once the screen is sealed do we write the mode
 * cookie + router.refresh() — the server tree re-composes behind the
 * cover and the plates retract onto the fully re-skinned view.
 */
export function ModeToggle({ mode, compact = false }: { mode: PortfolioMode; compact?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const switchTo = (next: PortfolioMode) => {
    if (next === mode || pending) return;
    setPending(true);

    // 1) Kick off the Transformers sequence (plates slam shut). The tree
    //    swap happens client-side the moment the screen seals — the flip
    //    never depends on the cookie or the refresh below.
    useModeTransform.getState().begin(next);
    trackEvent("mode_switch", { label: next });

    // 2) Just before full cover: persist the choice in the cookie and —
    //    ONLY when the write verifiably took — refresh the server tree
    //    so metadata (OG tags, titles) follows. If the cookie was
    //    blocked (sandboxed iframe), skip the refresh entirely: it would
    //    re-render the OLD mode server-side and fight the live client
    //    tree. The visitor still gets the full flip either way.
    window.setTimeout(
      () => {
        if (setModeCookie(next)) router.refresh();
      },
      Math.max(200, TF_COVER_MS - 140)
    );

    // 3) Re-enable after the whole sequence has had time to play out.
    window.setTimeout(() => setPending(false), 2300);
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
