"use client";

import { usePFStore } from "@/lib/pixelforge/store/pf-store";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

interface OGPanelProps {
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

export function OGPanel({ onToast }: OGPanelProps) {
  const { currentHTML, setHTML, pushHistory } = usePFStore();
  const [og, setOG] = useState({ title: "", description: "", image: "", url: "", type: "website" });
  const [favicon, setFavicon] = useState("");

  useEffect(() => {
    if (!currentHTML) return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(currentHTML, "text/html");
      setOG({
        title: doc.querySelector('meta[property="og:title"]')?.getAttribute("content") || "",
        description: doc.querySelector('meta[property="og:description"]')?.getAttribute("content") || "",
        image: doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || "",
        url: doc.querySelector('meta[property="og:url"]')?.getAttribute("content") || "",
        type: doc.querySelector('meta[property="og:type"]')?.getAttribute("content") || "website",
      });
      setFavicon(doc.querySelector('link[rel="icon"]')?.getAttribute("href") || "");
    } catch {}
  }, [currentHTML]);

  const update = (property: string, value: string) => {
    setOG((s) => ({ ...s, [property]: value }));
    // Persist to HTML
    const iframe = document.querySelector("iframe[title='preview']") as HTMLIFrameElement | null;
    const doc = iframe?.contentDocument;
    if (!doc || !doc.head) return;
    pushHistory();
    let meta = doc.querySelector(`meta[property="og:${property}"]`);
    if (!meta) {
      meta = doc.createElement("meta");
      meta.setAttribute("property", `og:${property}`);
      doc.head.appendChild(meta);
    }
    if (value) meta.setAttribute("content", value);
    else meta.remove();
    setHTML("<!DOCTYPE html>\n" + doc.documentElement.outerHTML);
  };

  const updateFavicon = (href: string) => {
    setFavicon(href);
    const iframe = document.querySelector("iframe[title='preview']") as HTMLIFrameElement | null;
    const doc = iframe?.contentDocument;
    if (!doc || !doc.head) return;
    pushHistory();
    let link = doc.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!link) {
      link = doc.createElement("link");
      link.setAttribute("rel", "icon");
      doc.head.appendChild(link);
    }
    if (href) {
      link.setAttribute("href", href);
      link.setAttribute("type", "image/svg+xml");
    } else {
      link.remove();
    }
    setHTML("<!DOCTYPE html>\n" + doc.documentElement.outerHTML);
  };

  if (!currentHTML) {
    return (
      <div className="text-center text-[var(--pf-text-dim)] py-6 px-4 text-[12.5px] leading-relaxed">
        <Globe className="w-7 h-7 mx-auto mb-1.5 opacity-25" />
        Import a page first to manage its social sharing and favicon settings.
      </div>
    );
  }

  return (
    <div>
      {/* Live preview card */}
      <div className="p-3.5 border-b border-[var(--pf-border)]">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--pf-text-dim)] mb-2">Social Preview</div>
        <div className="rounded-lg overflow-hidden border border-[var(--pf-border)] bg-[var(--pf-panel-hover)]">
          {og.image ? (
            <img src={og.image} alt="OG preview" className="w-full aspect-[1.91/1] object-cover" />
          ) : (
            <div className="w-full aspect-[1.91/1] grid place-items-center bg-[var(--pf-panel)] text-[var(--pf-text-dim)] text-xs">
              No og:image set
            </div>
          )}
          <div className="p-3">
            <div className="text-[10px] uppercase tracking-wider text-[var(--pf-text-dim)] truncate">{og.url || "yoursite.com"}</div>
            <div className="text-[13px] font-semibold text-[var(--pf-text-bright)] truncate mt-0.5">{og.title || "No og:title set"}</div>
            <div className="text-[11px] text-[var(--pf-text-dim)] line-clamp-2 mt-0.5">{og.description || "No og:description set"}</div>
          </div>
        </div>
      </div>

      {/* OG fields */}
      <div className="p-3.5 space-y-3 border-b border-[var(--pf-border)]">
        <Field label="og:title">
          <input className="pf-edit-input" value={og.title} onChange={(e) => update("title", e.target.value)} placeholder="Your page title" />
        </Field>
        <Field label="og:description">
          <textarea className="pf-edit-input" rows={2} value={og.description} onChange={(e) => update("description", e.target.value)} placeholder="Short description for social sharing" />
        </Field>
        <Field label="og:image URL">
          <input className="pf-edit-input" value={og.image} onChange={(e) => update("image", e.target.value)} placeholder="https://yoursite.com/og.jpg" />
        </Field>
        <Field label="og:url">
          <input className="pf-edit-input" value={og.url} onChange={(e) => update("url", e.target.value)} placeholder="https://yoursite.com" />
        </Field>
      </div>

      {/* Favicon */}
      <div className="p-3.5 space-y-3">
        <Field label="Favicon URL">
          <input className="pf-edit-input" value={favicon} onChange={(e) => updateFavicon(e.target.value)} placeholder="https://yoursite.com/favicon.ico" />
        </Field>
        {favicon && (
          <div className="flex items-center gap-2 p-2 rounded bg-[var(--pf-panel-hover)]">
            <img src={favicon} alt="favicon" className="w-6 h-6 rounded" />
            <span className="text-[11px] text-[var(--pf-text-dim)]">Current favicon</span>
          </div>
        )}
        <button
          onClick={() => {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#5c8def"/><text x="16" y="22" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">P</text></svg>`;
            const dataUri = "data:image/svg+xml;base64," + btoa(svg);
            updateFavicon(dataUri);
            onToast("Branded favicon generated", "success");
          }}
          className="pf-btn pf-btn-ghost pf-btn-sm w-full"
        >
          Generate branded favicon
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="pf-edit-label">{label}</label>
      {children}
    </div>
  );
}
