"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUIStore } from "@/lib/ui-store";
import { projects } from "@/lib/portfolio-data";
import { Keyboard } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type ShortcutRow = {
  keys: string[];
  label: string;
};

const GLOBAL_SHORTCUTS: ShortcutRow[] = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["?"], label: "Open this shortcuts panel" },
  { keys: ["Esc"], label: "Close any open panel/modal" },
  { keys: ["⌘", "/"], label: "Toggle theme (use ⌘K → theme)" },
  { keys: ["←", "→"], label: "Browse prev/next project (modal open)" },
];

const SECTION_SHORTCUTS: ShortcutRow[] = [
  { keys: ["g"], label: "Then press a section letter below" },
  { keys: ["g h"], label: "Home / top" },
  { keys: ["g w"], label: "Selected work" },
  { keys: ["g l"], label: "Client work (case studies)" },
  { keys: ["g s"], label: "Skills" },
  { keys: ["g j"], label: "Journey" },
  { keys: ["g p"], label: "Shipped (latest pushes)" },
  { keys: ["g n"], label: "Now" },
  { keys: ["g c"], label: "Contact" },
];

function Kbd({ children }: { children: string[] }) {
  return (
    <span className="inline-flex items-center gap-1">
      {children.map((k, i) => (
        <kbd
          key={i}
          className="rounded-md border border-border/60 bg-muted/70 px-2 py-1 font-mono text-[11px] font-medium text-foreground/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.18)]"
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}

function ShortcutGroup({
  title,
  rows,
}: {
  title: string;
  rows: ShortcutRow[];
}) {
  return (
    <div className="space-y-1.5">
      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-4 rounded-md px-2 py-1.5 hover:bg-accent/40 transition-colors"
          >
            <span className="text-sm text-foreground/80">{row.label}</span>
            <Kbd>{row.keys}</Kbd>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KeyboardShortcutsOverlay() {
  const open = useUIStore((s) => s.shortcutsOpen);
  const setOpen = useUIStore((s) => s.openShortcuts);
  const close = useUIStore((s) => s.closeShortcuts);
  const openPalette = useUIStore((s) => s.openPalette);
  const openModal = useUIStore((s) => s.openModal);

  // Toggle with `?` (Shift+/) — ignore when typing in form fields.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isField =
        tag === "input" || tag === "textarea" || tag === "select" ||
        target?.isContentEditable;
      if (isField) return;
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        trackEvent("shortcuts_open", { label: "shortcut" });
        useUIStore.getState().toggleShortcuts();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // `g <letter>` chord for section jumps (only when overlay open).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const map: Record<string, string> = {
        h: "#top",
        w: "#work",
        a: "#about",
        l: "#clients",
        s: "#skills",
        j: "#journey",
        p: "#shipped",
        n: "#now",
        c: "#contact",
      };
      if (k in map) {
        e.preventDefault();
        close();
        setTimeout(() => {
          const el = document.querySelector(map[k]);
          if (el) (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
        }, 80);
      }
      // Number keys 1-9 → open project N
      const n = parseInt(k, 10);
      if (!isNaN(n) && n >= 1 && n <= projects.length) {
        e.preventDefault();
        const p = projects[n - 1];
        if (p) {
          close();
          setTimeout(() => openModal(p.slug), 80);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, openModal]);

  const projectShortcuts: ShortcutRow[] = projects.slice(0, 9).map((p, i) => ({
    keys: [String(i + 1)],
    label: `Open ${p.name}`,
  }));

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => (o ? setOpen() : close())}
    >
      <DialogContent
        className="max-w-2xl rounded-2xl border-border/60 bg-card/95 backdrop-blur-xl p-6 sm:p-7"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Keyboard shortcuts</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border/50 pb-4">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 text-brand">
            <Keyboard className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Keyboard shortcuts
            </h2>
            <p className="text-xs text-muted-foreground">
              Press <Kbd>{["?"]}</Kbd> anywhere to toggle this panel.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mt-5">
          <ShortcutGroup title="Global" rows={GLOBAL_SHORTCUTS} />
          <ShortcutGroup title="Navigation" rows={SECTION_SHORTCUTS} />
        </div>

        <div className="mt-5 space-y-1.5">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Projects · number keys
          </h3>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            {projectShortcuts.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-4 rounded-md px-2 py-1.5 hover:bg-accent/40 transition-colors"
              >
                <span className="text-sm text-foreground/80">{row.label}</span>
                <Kbd>{row.keys}</Kbd>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
          <p className="text-[11px] text-muted-foreground/70">
            Tip: open the command palette for fuzzy search across everything.
          </p>
          <button
            onClick={() => {
              close();
              setTimeout(() => openPalette(), 80);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 font-mono text-[11px] text-foreground/80 hover:border-brand/40 hover:text-brand transition-colors"
          >
            Open ⌘K
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
