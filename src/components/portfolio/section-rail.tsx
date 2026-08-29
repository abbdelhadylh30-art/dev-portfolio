"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navLinks, clientNavLinks } from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";
import type { PortfolioMode } from "@/lib/mode";

/**
 * SectionRail — a fixed, right-edge dot navigation for the 7 main sections.
 * Desktop only (hidden below lg). Scroll-spy via IntersectionObserver mirrors
 * the navbar's active state: the current section's dot grows + turns brand,
 * hovering a dot reveals its label, and clicking scrolls smoothly to the
 * section. Doubles as a visual "how far down the page am I" indicator.
 */
export function SectionRail({ mode }: { mode: PortfolioMode }) {
  const [active, setActive] = useState<string>("");
  const links = mode === "client" ? clientNavLinks : navLinks;

  useEffect(() => {
    const sectionIds = links.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the viewport middle so fast scrolls
        // settle on the section actually in view.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight / 2) -
              Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight / 2)
          );
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  return (
    <nav
      aria-label="Section quick navigation"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="pointer-events-auto flex flex-col items-end gap-3 rounded-full border border-border/50 bg-background/60 py-3 pl-2 pr-2.5 backdrop-blur-md shadow-[0_8px_32px_-16px_rgba(0,0,0,0.55)]">
        {links.map((link, i) => {
          const isActive = active === link.href;
          return (
            <li key={link.href} className="group relative flex items-center">
              {/* Label — slides out on hover, always visible for active */}
              <span
                className={`pointer-events-none mr-2 whitespace-nowrap rounded-md border border-border/60 bg-card/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/85 shadow-sm backdrop-blur transition-all duration-200 ${
                  isActive
                    ? "translate-x-0 opacity-100"
                    : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                <span className="text-brand/70">{String(i + 1).padStart(2, "0")}</span>{" "}
                {link.label}
              </span>

              <a
                href={link.href}
                aria-label={`Jump to ${link.label}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() =>
                  trackEvent("rail_click", { label: link.href.replace("#", "") })
                }
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
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
