/**
 * Forge Studio — Unified App Store
 * --------------------------------
 * Top-level navigation: dashboard / builder / auditor
 * Transfer bridge: a slot for HTML that one tool hands off to the other.
 */

import { create } from "zustand";

export type ForgeView = "dashboard" | "builder" | "auditor" | "templates";

interface TransferPayload {
  html: string;
  name: string;
  source: "builder" | "auditor";
  timestamp: number;
}

interface ForgeStore {
  view: ForgeView;
  setView: (v: ForgeView) => void;

  pendingTransfer: TransferPayload | null;
  transferToAuditor: (html: string, name: string) => void;
  transferToBuilder: (html: string, name: string) => void;
  consumeTransfer: () => TransferPayload | null;
}

export const useForge = create<ForgeStore>((set, get) => ({
  view: "dashboard",
  setView: (v) => set({ view: v }),

  pendingTransfer: null,

  transferToAuditor: (html, name) => {
    set({
      view: "auditor",
      pendingTransfer: { html, name, source: "builder", timestamp: Date.now() },
    });
  },

  transferToBuilder: (html, name) => {
    set({
      view: "builder",
      pendingTransfer: { html, name, source: "auditor", timestamp: Date.now() },
    });
  },

  consumeTransfer: () => {
    const p = get().pendingTransfer;
    if (p) set({ pendingTransfer: null });
    return p;
  },
}));
