/**
 * LandingForge v4.0 — Editor Store (Zustand)
 * ------------------------------------------
 * Holds the working site, current page, selected section, view state,
 * device preview, theme, and undo/redo history.
 *
 * History strategy:
 *   - On every mutating action, push the previous site snapshot to undo stack
 *   - undo() pops undo → pushes to redo; redo() pops redo → pushes to undo
 *   - History is capped at 50 entries
 */

import { create } from "zustand";
import { v4 as uuid } from "uuid";
import type {
  PageData,
  SectionInstance,
  SectionKind,
  SiteData,
  ThemeTokens,
} from "@/lib/sections/types";
import { createSection, getSectionType } from "@/lib/sections/registry";
import { DEFAULT_THEME } from "@/lib/sections/types";

export type ViewMode = "dashboard" | "editor" | "preview" | "templates" | "analytics";
export type DeviceMode = "desktop" | "tablet" | "mobile";

const MAX_HISTORY = 50;

interface EditorState {
  // Top-level navigation
  view: ViewMode;
  setView: (v: ViewMode) => void;

  // Working site
  site: SiteData;
  siteId: string; // for analytics routing

  // Selected page within the site
  currentPageId: string;
  setCurrentPageId: (id: string) => void;

  // Selected section (within current page)
  selectedSectionId: string | null;
  selectSection: (id: string | null) => void;

  // Inspector + library panel open state
  inspectorOpen: boolean;
  libraryOpen: boolean;
  setInspectorOpen: (b: boolean) => void;
  setLibraryOpen: (b: boolean) => void;

  // Device preview
  device: DeviceMode;
  setDevice: (d: DeviceMode) => void;

  // Theme
  setThemeTokens: (t: Partial<ThemeTokens>) => void;
  applyThemePreset: (tokens: ThemeTokens) => void;

  // Section operations
  addSection: (kind: SectionKind, index?: number) => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  reorderSections: (newOrder: SectionInstance[]) => void;
  updateSectionConfig: (id: string, patch: Record<string, unknown>) => void;
  updateSectionConfigByPath: (id: string, path: string, value: unknown) => void;

  // Page operations
  addPage: (name: string) => void;
  removePage: (id: string) => void;
  updatePageMeta: (id: string, patch: Partial<Pick<PageData, "name" | "slug" | "path" | "isHome" | "seo">>) => void;

  // Site operations
  setSiteName: (name: string) => void;
  setSiteDescription: (desc: string) => void;
  loadSite: (site: SiteData) => void;
  newBlankSite: (name: string) => void;

  // History
  undoStack: SiteData[];
  redoStack: SiteData[];
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Internal helper
  _commit: (next: SiteData, opts?: { skipHistory?: boolean }) => void;
}

function clone<T>(v: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));
}

function blankSite(name: string): SiteData {
  const homePage: PageData = {
    id: uuid(),
    name: "Home",
    slug: "home",
    path: "/",
    isHome: true,
    sections: [],
  };
  return {
    id: uuid(),
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description: "",
    themeTokens: clone(DEFAULT_THEME),
    pages: [homePage],
  };
}

export const useEditor = create<EditorState>((set, get) => ({
  view: "dashboard",
  setView: (v) => set({ view: v }),

  site: blankSite("Untitled site"),
  siteId: "",

  currentPageId: "",
  setCurrentPageId: (id) => set({ currentPageId: id, selectedSectionId: null }),

  selectedSectionId: null,
  selectSection: (id) => set({ selectedSectionId: id }),

  inspectorOpen: true,
  libraryOpen: true,
  setInspectorOpen: (b) => set({ inspectorOpen: b }),
  setLibraryOpen: (b) => set({ libraryOpen: b }),

  device: "desktop",
  setDevice: (d) => set({ device: d }),

  setThemeTokens: (t) => {
    const s = get().site;
    get()._commit({ ...s, themeTokens: { ...s.themeTokens, ...t } });
  },
  applyThemePreset: (tokens) => {
    const s = get().site;
    get()._commit({ ...s, themeTokens: clone(tokens) });
  },

  addSection: (kind, index) => {
    const s = get().site;
    const pageId = get().currentPageId || s.pages[0]?.id;
    const page = s.pages.find((p) => p.id === pageId);
    if (!page) return;
    const sec = createSection(kind);
    const newPage: PageData = {
      ...page,
      sections: [...page.sections],
    };
    if (typeof index === "number") newPage.sections.splice(index, 0, sec);
    else newPage.sections.push(sec);
    const newSite: SiteData = {
      ...s,
      pages: s.pages.map((p) => (p.id === page.id ? newPage : p)),
    };
    get()._commit(newSite);
    set({ selectedSectionId: sec.id });
  },

  removeSection: (id) => {
    const s = get().site;
    const pageId = get().currentPageId || s.pages[0]?.id;
    const page = s.pages.find((p) => p.id === pageId);
    if (!page) return;
    const newPage: PageData = {
      ...page,
      sections: page.sections.filter((sec) => sec.id !== id),
    };
    const newSite: SiteData = {
      ...s,
      pages: s.pages.map((p) => (p.id === page.id ? newPage : p)),
    };
    get()._commit(newSite);
    if (get().selectedSectionId === id) set({ selectedSectionId: null });
  },

  duplicateSection: (id) => {
    const s = get().site;
    const pageId = get().currentPageId || s.pages[0]?.id;
    const page = s.pages.find((p) => p.id === pageId);
    if (!page) return;
    const idx = page.sections.findIndex((sec) => sec.id === id);
    if (idx === -1) return;
    const orig = page.sections[idx];
    const copy: SectionInstance = {
      ...clone(orig),
      id: uuid(),
    };
    const newSections = [...page.sections];
    newSections.splice(idx + 1, 0, copy);
    const newPage: PageData = { ...page, sections: newSections };
    const newSite: SiteData = {
      ...s,
      pages: s.pages.map((p) => (p.id === page.id ? newPage : p)),
    };
    get()._commit(newSite);
    set({ selectedSectionId: copy.id });
  },

  moveSection: (fromIndex, toIndex) => {
    const s = get().site;
    const pageId = get().currentPageId || s.pages[0]?.id;
    const page = s.pages.find((p) => p.id === pageId);
    if (!page) return;
    if (fromIndex === toIndex) return;
    const arr = [...page.sections];
    const [moved] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, moved);
    const newPage: PageData = { ...page, sections: arr };
    const newSite: SiteData = {
      ...s,
      pages: s.pages.map((p) => (p.id === page.id ? newPage : p)),
    };
    get()._commit(newSite);
  },

  reorderSections: (newOrder) => {
    const s = get().site;
    const pageId = get().currentPageId || s.pages[0]?.id;
    const page = s.pages.find((p) => p.id === pageId);
    if (!page) return;
    const newPage: PageData = { ...page, sections: newOrder };
    const newSite: SiteData = {
      ...s,
      pages: s.pages.map((p) => (p.id === page.id ? newPage : p)),
    };
    get()._commit(newSite);
  },

  updateSectionConfig: (id, patch) => {
    const s = get().site;
    const pageId = get().currentPageId || s.pages[0]?.id;
    const page = s.pages.find((p) => p.id === pageId);
    if (!page) return;
    const newPage: PageData = {
      ...page,
      sections: page.sections.map((sec) =>
        sec.id === id ? { ...sec, config: { ...sec.config, ...patch } } : sec
      ),
    };
    const newSite: SiteData = {
      ...s,
      pages: s.pages.map((p) => (p.id === page.id ? newPage : p)),
    };
    get()._commit(newSite);
  },

  updateSectionConfigByPath: (id, path, value) => {
    const s = get().site;
    const pageId = get().currentPageId || s.pages[0]?.id;
    const page = s.pages.find((p) => p.id === pageId);
    if (!page) return;
    const newPage: PageData = {
      ...page,
      sections: page.sections.map((sec) => {
        if (sec.id !== id) return sec;
        const config = clone(sec.config);
        // Support dot path like "items.0.title" or "items[0].title"
        const parts = path.split(/[.[\]]/).filter(Boolean);
        let cursor: any = config;
        for (let i = 0; i < parts.length - 1; i++) {
          const k = parts[i];
          if (cursor[k] == null) cursor[k] = isNaN(Number(parts[i + 1])) ? {} : [];
          cursor = cursor[k];
        }
        cursor[parts[parts.length - 1]] = value;
        return { ...sec, config };
      }),
    };
    const newSite: SiteData = {
      ...s,
      pages: s.pages.map((p) => (p.id === page.id ? newPage : p)),
    };
    get()._commit(newSite);
  },

  addPage: (name) => {
    const s = get().site;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const newPage: PageData = {
      id: uuid(),
      name,
      slug,
      path: `/${slug}`,
      isHome: false,
      sections: [],
    };
    const newSite: SiteData = { ...s, pages: [...s.pages, newPage] };
    get()._commit(newSite);
    set({ currentPageId: newPage.id, selectedSectionId: null });
  },

  removePage: (id) => {
    const s = get().site;
    if (s.pages.length <= 1) return;
    const filtered = s.pages.filter((p) => p.id !== id);
    if (filtered.every((p) => !p.isHome) && filtered[0]) filtered[0].isHome = true;
    const newSite: SiteData = { ...s, pages: filtered };
    get()._commit(newSite);
    if (get().currentPageId === id) {
      set({ currentPageId: filtered[0]?.id ?? "", selectedSectionId: null });
    }
  },

  updatePageMeta: (id, patch) => {
    const s = get().site;
    const newSite: SiteData = {
      ...s,
      pages: s.pages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    };
    get()._commit(newSite);
  },

  setSiteName: (name) => {
    const s = get().site;
    get()._commit({ ...s, name });
  },
  setSiteDescription: (description) => {
    const s = get().site;
    get()._commit({ ...s, description });
  },

  loadSite: (site) => {
    set({
      site,
      siteId: site.id,
      currentPageId: site.pages[0]?.id ?? "",
      selectedSectionId: null,
      undoStack: [],
      redoStack: [],
      view: "editor",
    });
  },

  newBlankSite: (name) => {
    const s = blankSite(name);
    set({
      site: s,
      siteId: s.id,
      currentPageId: s.pages[0].id,
      selectedSectionId: null,
      undoStack: [],
      redoStack: [],
      view: "editor",
    });
  },

  undoStack: [],
  redoStack: [],

  undo: () => {
    const { undoStack, redoStack, site } = get();
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    set({
      site: prev,
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, site].slice(-MAX_HISTORY),
      selectedSectionId: null,
    });
  },

  redo: () => {
    const { undoStack, redoStack, site } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set({
      site: next,
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, site].slice(-MAX_HISTORY),
      selectedSectionId: null,
    });
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,

  _commit: (next, opts) => {
    const { site, undoStack } = get();
    if (opts?.skipHistory) {
      set({ site: next });
      return;
    }
    set({
      site: next,
      undoStack: [...undoStack, clone(site)].slice(-MAX_HISTORY),
      redoStack: [],
    });
  },
}));

// Convenience selector hook
export function useCurrentPage(): PageData | null {
  return useEditor((s) => {
    const id = s.currentPageId || s.site.pages[0]?.id;
    return s.site.pages.find((p) => p.id === id) ?? null;
  });
}

export function useSelectedSection(): SectionInstance | null {
  return useEditor((s) => {
    if (!s.selectedSectionId) return null;
    const pageId = s.currentPageId || s.site.pages[0]?.id;
    const page = s.site.pages.find((p) => p.id === pageId);
    return page?.sections.find((sec) => sec.id === s.selectedSectionId) ?? null;
  });
}

export { getSectionType };
