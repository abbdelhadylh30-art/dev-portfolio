"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Github, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/portfolio-data";
import { ModeToggle } from "@/components/portfolio/mode-toggle";
import { usePageRouter } from "@/components/portfolio/page-router";
import type { PortfolioMode } from "@/lib/mode";

/**
 * Navbar — now page-based: links route through the micro-router
 * (`#/services`, `#/work`, …) instead of scrolling one long page.
 * The active pill follows the current page; the logo returns home.
 */
export function Navbar({ mode }: { mode: PortfolioMode }) {
  const { pages, page, navigate, pageIndex } = usePageRouter();
  const links = pages.filter((p) => p.id !== "home");
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <button
          type="button"
          onClick={() => navigate("home")}
          className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 rounded-md"
          aria-label="Back to home page"
        >
          <span className="grad-badge icon-bob grid h-8 w-8 place-items-center rounded-lg font-bold">
            AG
          </span>
          <span className="hidden sm:inline text-foreground/90 group-hover:text-brand transition-colors">
            abdelhady<span className="text-brand">.dev</span>
          </span>
          {/* Page counter chip — reinforces the paged feel */}
          <span
            className="ml-1 hidden rounded-full border border-border/70 bg-card/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground md:inline-block"
            aria-hidden
          >
            {String(pageIndex + 1).padStart(2, "0")}/{String(pages.length).padStart(2, "0")}
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = page.id === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => navigate(link.id)}
                data-active={isActive ? "true" : "false"}
                aria-current={isActive ? "page" : undefined}
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
              </button>
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
          {/* No theme toggle — skins are fixed per view: Business is
              always warm light, Developer is always the original dark. */}
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
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("home");
              }}
              className={`rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                page.id === "home"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Home
            </button>
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(link.id);
                }}
                className={`rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  page.id === link.id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
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
