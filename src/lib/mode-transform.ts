"use client";

import { create } from "zustand";
import type { PortfolioMode } from "@/lib/mode";

/**
 * State machine for the Transformers-style mode-shift sequence that plays
 * when the visitor flips between the Business and Developer views:
 *
 *   idle → cover → hold → reveal → idle
 *
 * `cover`   — armor plates slam shut over the screen (~690ms)
 * `hold`    — screen sealed: the live tree swaps to the TARGET mode here,
 *             purely client-side and deterministic. The visual flip is
 *             never gated on a server round-trip (cookies can be blocked
 *             in sandboxed iframes and `router.refresh()` may never land
 *             with the new mode — that race used to leave the page stuck
 *             on the old view while the transition played anyway).
 * `reveal`  — plates retract, staggered, uncovering the new view
 *
 * `liveMode` is the single client-side source of truth for which tree is
 * on screen. It is hydrated ONCE from the server-rendered (cookie) mode
 * on first mount — afterwards it is owned entirely by the client, so a
 * late/failed refresh can never clobber the visitor's chosen view.
 */
export type TransformPhase = "idle" | "cover" | "hold" | "reveal";

type ModeTransformState = {
  phase: TransformPhase;
  target: PortfolioMode | null;
  startedAt: number;
  /** Which tree (Business vs Developer) is on screen right now. */
  liveMode: PortfolioMode;
  /** True once the server mode has been adopted on first mount. */
  hydrated: boolean;
  begin: (target: PortfolioMode) => void;
  setPhase: (phase: TransformPhase) => void;
  end: () => void;
  /** One-time adoption of the server-rendered (cookie) mode. */
  hydrate: (mode: PortfolioMode) => void;
  /** Direct live-mode swap (deep links) — no ceremony, no server. */
  setLiveMode: (mode: PortfolioMode) => void;
};

export const useModeTransform = create<ModeTransformState>((set, get) => ({
  phase: "idle",
  target: null,
  startedAt: 0,
  liveMode: "client",
  hydrated: false,
  begin: (target) => set({ phase: "cover", target, startedAt: Date.now() }),
  setPhase: (phase) => set({ phase }),
  end: () => set({ phase: "idle", target: null, startedAt: 0 }),
  hydrate: (mode) => {
    if (get().hydrated) return;
    set({ liveMode: mode, hydrated: true });
  },
  setLiveMode: (mode) => set({ liveMode: mode, hydrated: true }),
}));
