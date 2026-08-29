"use client";

import { create } from "zustand";
import type { PortfolioMode } from "@/lib/mode";

/**
 * State machine for the Transformers-style mode-shift sequence that
 * plays when the visitor flips between the Business and Developer
 * views:
 *
 *   idle → cover → hold → reveal → idle
 *
 * `cover`   — armor plates slam shut over the screen (~640ms)
 * `hold`    — scan line + emblem; the mode cookie is written and the
 *             server tree is refreshed while everything is hidden
 * `reveal`  — plates retract, staggered, uncovering the new view
 *
 * The overlay component drives the phase transitions itself (it knows
 * when the refreshed tree has arrived via its `mode` prop); the toggle
 * only calls `begin(target)` and schedules the cookie+refresh swap.
 */
export type TransformPhase = "idle" | "cover" | "hold" | "reveal";

type ModeTransformState = {
  phase: TransformPhase;
  target: PortfolioMode | null;
  startedAt: number;
  begin: (target: PortfolioMode) => void;
  setPhase: (phase: TransformPhase) => void;
  end: () => void;
};

export const useModeTransform = create<ModeTransformState>((set) => ({
  phase: "idle",
  target: null,
  startedAt: 0,
  begin: (target) => set({ phase: "cover", target, startedAt: Date.now() }),
  setPhase: (phase) => set({ phase }),
  end: () => set({ phase: "idle", target: null, startedAt: 0 }),
}));
