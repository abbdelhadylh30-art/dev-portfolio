"use client";

import { usePFStore } from "@/lib/pixelforge/store/pf-store";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Layers } from "lucide-react";

/** Layer panel — shows the iframe's DOM tree as a clickable list */
export function LayerPanel() {
  const { currentHTML, layerCollapsed, toggleLayer, setSelectedSelector, selectedSelector, mode } = usePFStore();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [layers, setLayers] = useState<{ tag: string; selector: string; text: string; depth: number }[]>([]);

  // Find the preview iframe (it's not a direct child) — query globally
  useEffect(() => {
    const iframe = document.querySelector("iframe[title='preview']") as HTMLIFrameElement | null;
    iframeRef.current = iframe;
    const update = () => {
      const doc = iframe?.contentDocument;
      if (!doc || !doc.body) {
        setLayers([]);
        return;
      }
      const out: { tag: string; selector: string; text: string; depth: number }[] = [];
      const walk = (el: Element, depth: number) => {
        if (depth > 4) return;
        const tag = el.tagName.toLowerCase();
        if (["script", "style", "link", "meta"].includes(tag)) return;
        const text = (el.textContent || "").trim().slice(0, 60);
        const selector = computeSel(el);
        out.push({ tag, selector, text, depth });
        Array.from(el.children).slice(0, 8).forEach((c) => walk(c, depth + 1));
      };
      walk(doc.body, 0);
      setLayers(out.slice(0, 80));
    };
    const interval = setInterval(update, 800);
    update();
    return () => clearInterval(interval);
  }, [currentHTML]);

  if (layerCollapsed) {
    return (
      <button
        onClick={toggleLayer}
        className="w-8 flex flex-col items-center justify-start py-3 bg-[var(--pf-panel)] border-r border-[var(--pf-border)] text-[var(--pf-text-dim)] hover:text-[var(--pf-text)]"
      >
        <Layers className="w-3.5 h-3.5 mb-2" />
        <ChevronLeft className="w-3 h-3 rotate-180" />
      </button>
    );
  }

  return (
    <aside className="w-[220px] bg-[var(--pf-panel)] border-r border-[var(--pf-border)] flex flex-col overflow-hidden shrink-0 transition-all">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--pf-border)]">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--pf-text-dim)]">Layers</span>
        <button onClick={toggleLayer} className="text-[var(--pf-text-dim)] hover:text-[var(--pf-text)] p-0.5 rounded hover:bg-white/5">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pf-scroll p-1.5">
        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-9 text-center text-[var(--pf-text-dim)] gap-2.5">
            <Layers className="w-10 h-10 opacity-25" />
            <p className="text-xs leading-relaxed">Import an HTML page to<br />see its layer structure</p>
          </div>
        ) : (
          layers.map((layer, i) => {
            const selected = layer.selector === selectedSelector;
            return (
              <button
                key={i}
                onClick={() => mode === "edit" && setSelectedSelector(layer.selector)}
                className={`w-full text-left flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors ${
                  selected
                    ? "bg-[var(--pf-accent-dim)] text-[var(--pf-accent)]"
                    : "hover:bg-[var(--pf-panel-hover)]"
                }`}
                style={{ paddingLeft: `${8 + layer.depth * 8}px` }}
              >
                <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-white/[0.06] text-[var(--pf-text-dim)] font-semibold uppercase tracking-wider">
                  {layer.tag}
                </span>
                <span className="text-[var(--pf-text-dim)] truncate text-[11px]">{layer.text}</span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

function computeSel(el: Element): string {
  if (el.id) return "#" + (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(el.id) : el.id);
  const parts: string[] = [];
  let cursor: Element | null = el;
  while (cursor && cursor.tagName && cursor.tagName !== "HTML" && cursor.tagName !== "BODY") {
    let sel = cursor.tagName.toLowerCase();
    if (cursor.id) {
      parts.unshift("#" + (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(cursor.id) : cursor.id));
      break;
    }
    const parent = cursor.parentElement;
    if (parent) {
      const sibs = Array.from(parent.children).filter((c) => c.tagName === cursor!.tagName);
      if (sibs.length > 1) sel += `:nth-of-type(${sibs.indexOf(cursor) + 1})`;
    }
    parts.unshift(sel);
    cursor = cursor.parentElement;
  }
  return parts.join(" > ");
}
