"use client";

import { useEditor } from "@/lib/store/editor-store";
import { TopBar } from "./TopBar";
import { SectionLibrary } from "./SectionLibrary";
import { Canvas } from "./Canvas";
import { Inspector } from "./Inspector";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function EditorShell() {
  const { libraryOpen, inspectorOpen, undo, redo, selectSection } = useEditor();

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isTyping) return;

      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (meta && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (e.key === "Escape") {
        selectSection(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, selectSection]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "shrink-0 overflow-hidden border-r bg-background transition-all",
            libraryOpen ? "w-64" : "w-0"
          )}
        >
          <div className="h-full w-64">
            <SectionLibrary />
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <Canvas />
        </main>
        <aside
          className={cn(
            "shrink-0 overflow-hidden border-l bg-background transition-all",
            inspectorOpen ? "w-80" : "w-0"
          )}
        >
          <div className="h-full w-80">
            <Inspector />
          </div>
        </aside>
      </div>
    </div>
  );
}
