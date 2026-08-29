"use client";

import { create } from "zustand";

type UIState = {
  /** Slug of the project whose detail modal is open (null = closed). */
  modalSlug: string | null;
  openModal: (slug: string) => void;
  closeModal: () => void;

  /** ⌘K command palette open state. */
  paletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;

  /** `?` keyboard shortcuts overlay open state. */
  shortcutsOpen: boolean;
  openShortcuts: () => void;
  closeShortcuts: () => void;
  toggleShortcuts: () => void;

  /** Admin dashboard (messages inbox) open state. Opened via `?admin=1`
   *  deep-link or the command palette "Admin inbox" entry. */
  adminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  modalSlug: null,
  openModal: (slug) => set({ modalSlug: slug }),
  closeModal: () => set({ modalSlug: null }),

  paletteOpen: false,
  openPalette: () => set({ paletteOpen: true }),
  closePalette: () => set({ paletteOpen: false }),
  togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),

  shortcutsOpen: false,
  openShortcuts: () => set({ shortcutsOpen: true }),
  closeShortcuts: () => set({ shortcutsOpen: false }),
  toggleShortcuts: () => set((s) => ({ shortcutsOpen: !s.shortcutsOpen })),

  adminOpen: false,
  openAdmin: () => set({ adminOpen: true }),
  closeAdmin: () => set({ adminOpen: false }),
}));
