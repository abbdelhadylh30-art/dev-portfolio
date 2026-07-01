"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { profile, navItems } from "@/lib/portfolio-data";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      // Track active section
      const sections = ["about", "work", "capabilities", "contact"];
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand — animated AG monogram */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group"
          aria-label="Back to top"
        >
          <span className="relative w-7 h-7 rounded-md overflow-hidden ring-1 ring-border group-hover:ring-foreground/30 transition-all">
            <svg viewBox="0 0 500 500" className="w-full h-full" aria-hidden="true">
              <defs>
                <style>{`.nav-ag{font-family:'Geist','DejaVu Sans',sans-serif;font-size:260px;font-weight:700;fill:#faf8f4}.nav-dot{fill:#10b981}`}</style>
              </defs>
              <rect width="500" height="500" fill="#08080c"/>
              <rect x="2" y="2" width="496" height="496" fill="none" stroke="#faf8f4" stroke-width="2" stroke-opacity="0.15"/>
              <text className="nav-ag" x="250" y="250" textAnchor="middle" dominantBaseline="central">AG</text>
              <circle className="nav-dot" cx="430" cy="430" r="28">
                <animate attributeName="r" values="28;32;28" dur="2.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;0.5;1" dur="2.2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </span>
          <span className="hidden sm:inline text-xs text-muted-foreground font-mono group-hover:text-foreground transition-colors">
            full-stack dev
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              className={`relative px-3.5 py-2 text-sm font-medium transition-colors rounded-md ${
                active === item.href.slice(1)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {active === item.href.slice(1) && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-3 -bottom-px h-px bg-foreground"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
          <button
            onClick={() => handleClick("#contact")}
            className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Let&apos;s talk
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleClick(item.href)}
                  className="text-left px-3 py-3 text-base font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleClick("#contact")}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-3 text-sm font-medium"
              >
                Let&apos;s talk
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
