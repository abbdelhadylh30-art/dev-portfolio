"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Home,
  Globe,
  Trophy,
  Route,
  User,
  HelpCircle,
  Mail,
  Code2,
  Briefcase,
  Folder,
  Layers,
  Map,
  Zap,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import type { PortfolioMode } from "@/lib/mode";
import { pagesForMode, type SitePage } from "@/lib/site-pages";
import { trackEvent } from "@/lib/analytics";

/**
 * PageRouter — turns the former one-long-scroll portfolio into a paged
 * experience. Every section now owns a full page, addressed by a hash
 * micro-route (`#/services`, `#/work`, `#/` for home) inside the single
 * `/` Next.js route.
 *
 * Page swaps are instant: the content crossfades quickly (~300ms) and the
 * viewport hops to the top, so navigation feels immediate — no theatrics.
 *
 * Legacy in-page anchors (`#services`) are redirected to their page so
 * old links keep working.
 */

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type PageRouterValue = {
  mode: PortfolioMode;
  pages: SitePage[];
  page: SitePage;
  pageIndex: number;
  direction: 1 | -1;
  elements: Record<string, React.ReactNode>;
  navigate: (id: string) => void;
  goRelative: (delta: number) => void;
};

const PageRouterContext = React.createContext<PageRouterValue | null>(null);

export function usePageRouter(): PageRouterValue {
  const ctx = React.useContext(PageRouterContext);
  if (!ctx) throw new Error("usePageRouter must be used inside <PageRouterProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function PageRouterProvider({
  mode,
  elements,
  children,
}: {
  mode: PortfolioMode;
  elements: Record<string, React.ReactNode>;
  children: React.ReactNode;
}) {
  const pages = React.useMemo(() => pagesForMode(mode), [mode]);

  const [state, setState] = React.useState<{
    id: string;
    direction: 1 | -1;
  }>({ id: "home", direction: 1 });

  const stateRef = React.useRef(state);
  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /* Hash writes we initiated ourselves (so the hashchange they fire
     doesn't re-enter as a duplicate navigation). */
  const selfHashRef = React.useRef<string | null>(null);

  const idFromHash = React.useCallback((): string | null => {
    const h = window.location.hash;
    if (!h || h === "#" || h === "#/" || h === "#top") return "home";
    const m = h.match(/^#\/([a-z][\w-]*)/i);
    if (m) {
      const id = m[1].toLowerCase();
      if (pages.some((p) => p.id === id)) return id;
      return null;
    }
    // Legacy plain anchor (`#services`) → its page.
    const plain = h.replace(/^#/, "").toLowerCase();
    if (pages.some((p) => p.id === plain)) return plain;
    return null;
  }, [pages]);

  const applyNavigation = React.useCallback(
    (id: string, opts?: { updateHash?: boolean }) => {
      const current = stateRef.current;
      const target = pages.find((p) => p.id === id);
      if (!target) return;
      if (target.id === current.id) {
        // Same page → treat as "back to top" (smooth).
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const from = pages.findIndex((p) => p.id === current.id);
      const to = pages.indexOf(target);
      setState({
        id: target.id,
        direction: to > from ? 1 : -1,
      });
      if (opts?.updateHash !== false) {
        const h = target.id === "home" ? "#/" : `#/${target.id}`;
        if (window.location.hash !== h) {
          selfHashRef.current = h;
          window.location.hash = h;
        }
      }
      trackEvent("page_nav", { slug: target.id, label: target.id });

      // Hop straight to the top of the incoming page and hand it focus.
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      const stage = document.getElementById("page-stage");
      stage?.focus({ preventScroll: true });
    },
    [pages]
  );

  /* Initial hash sync (deep links) + browser back/forward. */
  React.useEffect(() => {
    const sync = () => {
      /* Our own hash write — the router state already moved. */
      if (selfHashRef.current !== null && selfHashRef.current === window.location.hash) {
        selfHashRef.current = null;
        return;
      }
      const id = idFromHash();
      if (id && id !== stateRef.current.id) applyNavigation(id);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [idFromHash, applyNavigation]);

  /* If the mode flips underneath us (Business ⇄ Developer refresh), make
     sure the current page exists in the new page set. */
  React.useEffect(() => {
    if (!pages.some((p) => p.id === stateRef.current.id)) {
      applyNavigation("home");
    }
  }, [pages, applyNavigation]);

  const navigate = React.useCallback((id: string) => applyNavigation(id), [applyNavigation]);

  const goRelative = React.useCallback(
    (delta: number) => {
      const i = pages.findIndex((p) => p.id === stateRef.current.id);
      const next = pages[Math.min(pages.length - 1, Math.max(0, i + delta))];
      if (next) applyNavigation(next.id);
    },
    [pages, applyNavigation]
  );

  /* ← / → page flipping (skipped while typing or inside dialogs). */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      )
        return;
      if (document.querySelector('[role="dialog"][data-state="open"]')) return;
      if (e.key === "ArrowRight") goRelative(1);
      else if (e.key === "ArrowLeft") goRelative(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goRelative]);

  const page = pages.find((p) => p.id === state.id) ?? pages[0];
  const value: PageRouterValue = {
    mode,
    pages,
    page,
    pageIndex: pages.indexOf(page),
    direction: state.direction,
    elements,
    navigate,
    goRelative,
  };

  return <PageRouterContext.Provider value={value}>{children}</PageRouterContext.Provider>;
}

/* ------------------------------------------------------------------ */
/* PageLink — anchor that routes through the micro-router              */
/* ------------------------------------------------------------------ */

export function PageLink({
  to,
  children,
  className,
  onClick,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const { navigate } = usePageRouter();
  return (
    <a
      href={to === "home" ? "#/" : `#/${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* PageStage — mounts the active page with a quick crossfade           */
/* ------------------------------------------------------------------ */

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function PageStage() {
  const { page, elements, mode } = usePageRouter();
  /* Keyed by mode AND page so a Business ⇄ Developer flip or a page
     navigation remounts the stage and the incoming tree fades in. */
  const stageKey = `${mode}:${page.id}`;

  return (
    <div
      id="page-stage"
      tabIndex={-1}
      className="relative focus:outline-none"
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stageKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_OUT } }}
          exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeIn" } }}
        >
          {elements[page.id] ?? null}
          {page.id === "home" && <PageIndexGrid />}
          <PageFooterNav />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PageFooterNav — prev / dots / next strip under every page           */
/* ------------------------------------------------------------------ */

function PageFooterNav() {
  const { pages, pageIndex, navigate } = usePageRouter();
  const prev = pageIndex > 0 ? pages[pageIndex - 1] : null;
  const next =
    pageIndex < pages.length - 1 ? pages[pageIndex + 1] : pages[0]; /* wrap → home */

  return (
    <nav
      aria-label="Pages"
      className="mx-auto w-full max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-16"
    >
      <div className="border-t border-border/70" />
      <div className="mt-5 flex items-center justify-between gap-3">
        {/* Previous */}
        {prev ? (
          <button
            type="button"
            onClick={() => navigate(prev.id)}
            className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-border/70 bg-card/60 px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-brand/50 hover:text-foreground hover:shadow-[0_8px_30px_-14px_color-mix(in_oklch,var(--brand)_55%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">{prev.label}</span>
            <span className="sr-only sm:hidden">Previous page: {prev.label}</span>
          </button>
        ) : (
          <span aria-hidden className="w-2" />
        )}

        {/* Dots + counter */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="All pages">
            {pages.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === pageIndex}
                aria-label={p.label}
                title={p.label}
                onClick={() => navigate(p.id)}
                className="grid h-6 w-6 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === pageIndex
                      ? "h-2.5 w-2.5 bg-brand ring-4 ring-brand/15"
                      : "h-1.5 w-1.5 bg-muted-foreground/35 hover:bg-foreground/60"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
            {String(pageIndex + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
            <span className="mx-2 hidden sm:inline" aria-hidden>
              ·
            </span>
            <span className="hidden sm:inline">← → to flip</span>
          </p>
        </div>

        {/* Next / wrap back home */}
        <button
          type="button"
          onClick={() => navigate(next.id)}
          className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand/35 bg-brand/[0.07] px-3 py-2 text-sm font-semibold text-foreground transition-all hover:border-brand/60 hover:bg-brand/15 hover:shadow-[0_8px_30px_-14px_color-mix(in_oklch,var(--brand)_55%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
        >
          <span className="hidden sm:inline">
            {pageIndex < pages.length - 1 ? next.label : "Back to start"}
          </span>
          <span className="sr-only sm:hidden">
            {pageIndex < pages.length - 1 ? `Next page: ${next.label}` : "Back to start"}
          </span>
          <ChevronRight className="h-4 w-4 text-brand transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* PageIndexGrid — table-of-contents cards on the home page            */
/* ------------------------------------------------------------------ */

const PAGE_ICONS: Record<SitePage["icon"], LucideIcon> = {
  home: Home,
  globe: Globe,
  trophy: Trophy,
  route: Route,
  user: User,
  help: HelpCircle,
  mail: Mail,
  code: Code2,
  briefcase: Briefcase,
  folder: Folder,
  layers: Layers,
  map: Map,
  zap: Zap,
};

function PageIndexGrid() {
  const { pages, navigate, mode } = usePageRouter();
  const rest = pages.slice(1);

  return (
    <section
      aria-label="Site index"
      className="mx-auto w-full max-w-6xl px-4 pb-4 pt-6 sm:px-6"
    >
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            {mode === "client" ? "Where to next?" : "Mission index"}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {mode === "client" ? "Take a look around" : "Pick a deck"}
          </h2>
        </div>
        <p className="hidden max-w-56 text-right text-xs leading-relaxed text-muted-foreground sm:block">
          Every section is its own page — flip with the arrows below or the keys{" "}
          <kbd className="rounded border border-border/70 bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            ←
          </kbd>{" "}
          <kbd className="rounded border border-border/70 bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            →
          </kbd>
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => {
          const Icon = PAGE_ICONS[p.icon];
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => navigate(p.id)}
                className="group relative flex w-full items-start gap-4 overflow-hidden rounded-xl border border-border/70 bg-card/70 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[0_18px_50px_-24px_color-mix(in_oklch,var(--brand)_50%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
              >
                {/* Index number */}
                <span className="absolute right-3 top-3 font-mono text-[10px] font-semibold text-muted-foreground/40 transition-colors group-hover:text-brand/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {p.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </span>
                </span>
                <ArrowRight className="absolute bottom-3 right-3 h-3.5 w-3.5 -translate-x-1 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
