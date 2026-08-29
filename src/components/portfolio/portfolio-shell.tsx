"use client";

import * as React from "react";
import type { PortfolioMode } from "@/lib/mode";
import { useModeTransform } from "@/lib/mode-transform";
import { PageRouterProvider, PageStage } from "@/components/portfolio/page-router";
import { Navbar } from "@/components/portfolio/navbar";
import { SectionRail } from "@/components/portfolio/section-rail";
import { ScrollProgress } from "@/components/portfolio/scroll-progress";
import { ModeSync } from "@/components/portfolio/mode-sync";
import { WhatsAppFab } from "@/components/portfolio/whatsapp-fab";
import { Contact, Footer } from "@/components/portfolio/contact";
import { CommandPalette } from "@/components/portfolio/command-palette";
import { DeepLinkHandler } from "@/components/portfolio/deep-link-handler";
import { ProjectModal } from "@/components/portfolio/project-modal";
import { KeyboardShortcutsOverlay } from "@/components/portfolio/keyboard-shortcuts-overlay";
import { AdminLinkHandler } from "@/components/portfolio/admin-link-handler";
import { AdminDashboard } from "@/components/portfolio/admin-dashboard";
import { ClientFooter } from "@/components/portfolio/client-mode/client-footer";

/**
 * PortfolioShell — the client-side cockpit of the site.
 *
 * The server (page.tsx) ships BOTH trees — the Business element set and
 * the Developer element set — and this shell decides which one is live:
 *
 *   • First paint renders the server mode (cookie-derived) so SSR HTML
 *     and hydration match exactly — zero flash of the wrong view.
 *   • After mount, the zustand `liveMode` owns the choice. The
 *     Transformers overlay swaps it while the screen is sealed, making
 *     the Business ⇄ Developer flip deterministic and instant — never
 *     dependent on a cookie write or a `router.refresh()` round-trip
 *     landing (both can silently fail in sandboxed preview iframes,
 *     which is what left the page stuck on the old view).
 *
 * The shell also keeps the document skin in lockstep — with FIXED skins:
 * the Business view is always the warm light palette and the Developer
 * view is always the original dark. Deterministic, no visitor theme to
 * save or restore — `<body data-view>` scopes the warm Business palette
 * from globals.css and the `<html>` theme class follows the mode.
 */
function applyViewSkin(mode: PortfolioMode) {
  if (typeof document === "undefined") return;
  document.body.dataset.view = mode;
  /* Fixed skins: Business = light, Developer = the original dark. */
  document.documentElement.classList.toggle("dark", mode === "dev");
}

export function PortfolioShell({
  serverMode,
  clientElements,
  devElements,
}: {
  serverMode: PortfolioMode;
  clientElements: Record<string, React.ReactNode>;
  devElements: Record<string, React.ReactNode>;
}) {
  const [mounted, setMounted] = React.useState(false);
  const liveMode = useModeTransform((s) => s.liveMode);

  /* Adopt the server mode exactly once (deep-link refreshes included —
     `hydrate` is a no-op after the first call so the client owns the
     mode from then on and stale refreshes can never revert it). */
  React.useEffect(() => {
    useModeTransform.getState().hydrate(serverMode);
    setMounted(true);
  }, [serverMode]);

  /* Keep <body data-view> + the html theme class in lockstep with the
     live mode — Business always light, Developer always dark. */
  React.useEffect(() => {
    if (!mounted) return;
    applyViewSkin(liveMode);
  }, [liveMode, mounted]);

  /* A later router.refresh() (form submissions, admin actions…) can
     reconcile the server tree's data-view / theme back to the cookie
     mode when the cookie write was blocked — re-assert the LIVE skin
     whenever the server prop changes after mount. */
  React.useEffect(() => {
    if (!mounted) return;
    applyViewSkin(useModeTransform.getState().liveMode);
  }, [serverMode, mounted]);

  /* First paint follows the server tree so hydration matches; from the
     first client update onwards the store is the single source of truth. */
  const mode: PortfolioMode = mounted ? liveMode : serverMode;

  return (
    <PageRouterProvider
      mode={mode}
      elements={mode === "client" ? clientElements : devElements}
    >
      {/* Shared chrome (inside the provider so navbar + rail read the
          active page from the router context) */}
      <ScrollProgress />
      <SectionRail mode={mode} />
      <Navbar mode={mode} />
      <ModeSync />
      <WhatsAppFab />

      <main className="flex-1">
        <PageStage />
      </main>

      {mode === "client" ? (
        <ClientFooter />
      ) : (
        <>
          <Footer />
          <CommandPalette />
          <DeepLinkHandler />
          <ProjectModal />
          <KeyboardShortcutsOverlay />
          <AdminLinkHandler />
          <AdminDashboard />
        </>
      )}
    </PageRouterProvider>
  );
}
