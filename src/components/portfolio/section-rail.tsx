"use client";

import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { usePageRouter } from "@/components/portfolio/page-router";
import type { PortfolioMode } from "@/lib/mode";

/**
 * SectionRail — a fixed, right-edge dot navigation for the site's pages.
 * Desktop only (hidden below lg). Now page-based: the current page's dot
 * grows + turns brand, hovering a dot reveals its label, and clicking
 * routes through the paged micro-router (with the plate page-turn).
 */
export function SectionRail({ mode: _mode }: { mode: PortfolioMode }) {
  const { pages, page, pageIndex, navigate } = usePageRouter();

  return (
    <nav
      aria-label="Page quick navigation"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="pointer-events-auto flex flex-col items-end gap-3 rounded-full border border-border/50 bg-background/60 py-3 pl-2 pr-2.5 backdrop-blur-md shadow-[0_8px_32px_-16px_rgba(0,0,0,0.55)]">
        {pages.map((p, i) => {
          const isActive = page.id === p.id;
          return (
            <li key={p.id} className="group relative flex items-center">
              {/* Label — slides out on hover, always visible for active */}
              <span
                className={`pointer-events-none mr-2 whitespace-nowrap rounded-md border border-border/60 bg-card/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/85 shadow-sm backdrop-blur transition-all duration-200 ${
                  isActive
                    ? "translate-x-0 opacity-100"
                    : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                <span className="text-brand/70">{String(i + 1).padStart(2, "0")}</span>{" "}
                {p.label}
              </span>

              <button
                type="button"
                aria-label={`Go to ${p.label} page`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  trackEvent("rail_click", { label: p.id });
                  navigate(p.id);
                }}
                className="rail-dot grid place-items-center outline-none focus-visible:ring-2 focus-visible:ring-brand/60 rounded-full p-1"
              >
                {isActive ? (
                  <motion.span
                    layoutId="rail-active-dot"
                    className="block h-2.5 w-2.5 rounded-full bg-brand ring-4 ring-brand/20"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                ) : (
                  <span className="block h-1.5 w-1.5 rounded-full bg-muted-foreground/40 transition-all duration-200 group-hover:bg-foreground/70" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {/* Screen-reader context */}
      <span className="sr-only">
        Page {pageIndex + 1} of {pages.length}
      </span>
    </nav>
  );
}
