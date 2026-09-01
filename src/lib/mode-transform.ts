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
 * view. Mode switches are instant: the store flips, the shell re-renders
 * the other tree, and the skin follows.
 *
 * (This module used to drive a full-screen Transformers-style transform
 * sequence; it was retired in favour of an instant swap. The export name
 * is kept so existing consumers stay stable.)
 */
type LiveModeState = {
  /** Which tree (Business vs Developer) is on screen right now. */
  liveMode: PortfolioMode;
  /** True once the server mode has been adopted on first mount. */
  hydrated: boolean;
  /** One-time adoption of the server-rendered (cookie) mode. */
  hydrate: (mode: PortfolioMode) => void;
  /** Swap the live tree (toggles, deep links) — no ceremony, no server. */
  setLiveMode: (mode: PortfolioMode) => void;
};

export const useModeTransform = create<LiveModeState>((set, get) => ({
  liveMode: "client",
  hydrated: false,
  hydrate: (mode) => {
    if (get().hydrated) return;
    set({ liveMode: mode, hydrated: true });
  },
  setLiveMode: (mode) => set({ liveMode: mode, hydrated: true }),
}));
