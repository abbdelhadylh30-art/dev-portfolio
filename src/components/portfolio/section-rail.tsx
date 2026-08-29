"use client";

import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { usePageRouter } from "@/components/portfolio/page-router";
import type { PortfolioMode } from "@/lib/mode";

/**
 * SectionRail — a fixed, right-edge dot navigation for the site's pages.
 * Desktop only (hidden below lg). Page-based: the current page's dot
 * turns brand, clicking routes through the paged micro-router.
 *
 * "Ghost" behaviour: at rest the rail is BARELY visible — just a column
 * of faint dots (no pill, no border, no shadow, no labels) so the right
 * edge of the page stays clean. Hovering the rail (or focusing it with
 * the keyboard) fades in the full pill: background, border, shadow,
 * brighter dots and the labels. Everything remains clickable/focusable
 * in the resting state — only the appearance is dialed down.
 */
export function SectionRail({ mode: _mode }: { mode: PortfolioMode }) {
  const { pages, page, pageIndex, navigate } = usePageRouter();

  return (
    <nav
      aria-label="Page quick navigation"
      className="pointer-events-none fixed right-7 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="group/rail pointer-events-auto flex flex-col items-end gap-3 rounded-full border border-transparent py-3 pl-2 pr-2.5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 hover:border-border/50 hover:bg-background/60 hover:shadow-[0_8px_32px_-16px_rgba(0,0,0,0.55)] hover:backdrop-blur-md focus-within:border-border/50 focus-within:bg-background/60 focus-within:shadow-[0_8px_32px_-16px_rgba(0,0,0,0.55)] focus-within:backdrop-blur-md">
        {pages.map((p, i) => {
          const isActive = page.id === p.id;
          return (
            <li key={p.id} className="group relative flex items-center">
              {/* Label — hidden at rest (ghost), slides in on hover of the
                  rail (active label) or of its own dot (any label) */}
              <span
                className={`pointer-events-none mr-2 whitespace-nowrap rounded-md border border-border/60 bg-card/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/85 shadow-sm backdrop-blur transition-all duration-200 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover/rail:translate-x-0 ${
                  isActive ? "group-hover/rail:opacity-100" : ""
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
                    className="block h-2.5 w-2.5 rounded-full bg-brand/45 ring-2 ring-brand/15 transition-colors duration-200 group-hover/rail:bg-brand group-hover/rail:ring-4 group-hover/rail:ring-brand/20"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                ) : (
                  <span className="block h-1.5 w-1.5 rounded-full bg-foreground/20 transition-colors duration-200 group-hover/rail:bg-foreground/55 group-hover:bg-foreground/70" />
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
