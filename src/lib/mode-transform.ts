"use client";

import { create } from "zustand";
import type { PortfolioMode } from "@/lib/mode";

/**
 * Live-mode store — the single client-side source of truth for which
 * tree (Business vs Developer) is on screen.
 *
 * `liveMode` is hydrated ONCE from the server-rendered (cookie) mode on
 * first mount — afterwards it is owned entirely by the client, so a
 * late/failed `router.refresh()` can never clobber the visitor's chosen
 * view.
 *
 * `beginFlip(mode)` starts the 450ms clip-path flip ceremony: the
 * ModeFlipOverlay seals the screen in the NEW mode's skin tint, the
 * tree swap happens underneath at the midpoint, then the seal irises
 * open. Components should call `beginFlip` instead of `setLiveMode`
 * when the switch is user-initiated; `setLiveMode` stays for direct,
 * ceremony-free swaps (deep links, reduced motion inside beginFlip).
 */
type LiveModeState = {
  /** Which tree (Business vs Developer) is on screen right now. */
  liveMode: PortfolioMode;
  /** True once the server mode has been adopted on first mount. */
  hydrated: boolean;
  /** Mode a flip ceremony is currently switching TO (null = idle). */
  flipTo: PortfolioMode | null;
  /** One-time adoption of the server-rendered (cookie) mode. */
  hydrate: (mode: PortfolioMode) => void;
  /** Swap the live tree immediately — no ceremony. */
  setLiveMode: (mode: PortfolioMode) => void;
  /** User-initiated switch: play the clip-path flip, swap at midpoint. */
  beginFlip: (mode: PortfolioMode) => void;
  /** Ceremony finished — clear the overlay state. */
  endFlip: () => void;
};

/** Honor OS-level reduced-motion by skipping the ceremony. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const useModeTransform = create<LiveModeState>((set, get) => ({
  liveMode: "client",
  hydrated: false,
  flipTo: null,
  hydrate: (mode) => {
    if (get().hydrated) return;
    set({ liveMode: mode, hydrated: true });
  },
  setLiveMode: (mode) => set({ liveMode: mode, hydrated: true, flipTo: null }),
  beginFlip: (mode) => {
    if (mode === get().liveMode || get().flipTo) return;
    if (prefersReducedMotion()) {
      set({ liveMode: mode, hydrated: true, flipTo: null });
      return;
    }
    set({ flipTo: mode });
  },
  endFlip: () => set({ flipTo: null }),
}));
