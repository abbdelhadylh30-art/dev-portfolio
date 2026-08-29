"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Github, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks, clientNavLinks, profile } from "@/lib/portfolio-data";
import { ModeToggle } from "@/components/portfolio/mode-toggle";
import type { PortfolioMode } from "@/lib/mode";

export function Navbar({ mode }: { mode: PortfolioMode }) {
  const links = mode === "client" ? clientNavLinks : navLinks;
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string>("");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const sectionIds = links.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/75 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      {/* Animated gradient hairline — fades in with the scrolled state */}
      <div
        aria-hidden
        className={`grad-divider pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-300 ${
          scrolled ? "opacity-50" : "opacity-0"
        }`}
      />
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
        >
          <span className="grad-badge icon-bob grid h-8 w-8 place-items-center rounded-lg font-bold">
            AG
          </span>
          <span className="hidden sm:inline text-foreground/90 group-hover:text-brand transition-colors">
            abdelhady<span className="text-brand">.dev</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                data-active={isActive ? "true" : "false"}
                className={`link-underline focus-ring relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-brand"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-md bg-brand/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle mode={mode} />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden h-9 px-3 text-muted-foreground hover:text-foreground lg:inline-flex"
          >
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </a>
          </Button>
          {/* Light/dark toggle only in the Developer view — the Business
              view is deliberately locked to its friendly warm-light skin. */}
          {mode === "dev" && <ThemeToggle />}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl overflow-hidden"
        >
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
