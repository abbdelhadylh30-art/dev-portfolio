"use client";

import { useEditor, useCurrentPage } from "@/lib/store/editor-store";
import { SectionRenderer } from "../sections/SectionRenderer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Rocket,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Preview() {
  const { site, setView, device, setDevice, currentPageId, setCurrentPageId } = useEditor();
  const page = useCurrentPage();
  const [published, setPublished] = useState(false);

  const width =
    device === "mobile" ? 420 : device === "tablet" ? 820 : 1280;

  const handlePublish = () => {
    // Record event to analytics (simulated)
    try {
      const key = `lf:events:${site.id}`;
      const events = JSON.parse(localStorage.getItem(key) || "[]");
      events.push({ type: "publish", page: page?.slug, t: Date.now() });
      localStorage.setItem(key, JSON.stringify(events));
    } catch {}
    setPublished(true);
    toast.success("Site published! (simulated)");
    setTimeout(() => setPublished(false), 2500);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex h-12 items-center justify-between border-b px-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setView("editor")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">Preview</span>
          <span className="text-xs text-muted-foreground">— {site.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Page switcher */}
          {site.pages.length > 1 && (
            <select
              value={currentPageId || site.pages[0]?.id}
              onChange={(e) => setCurrentPageId(e.target.value)}
              className="h-8 rounded-md border bg-background px-2 text-xs"
            >
              {site.pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-0.5 rounded-md bg-muted/50 p-0.5">
            {([
              { id: "desktop", icon: Monitor },
              { id: "tablet", icon: Tablet },
              { id: "mobile", icon: Smartphone },
            ] as const).map((it) => {
              const Icon = it.icon;
              const active = device === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => setDevice(it.id)}
                  className={`grid h-6 w-7 place-items-center rounded transition-all ${
                    active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>

          <Button size="sm" onClick={handlePublish} disabled={published}>
            <Rocket className="mr-1.5 h-3.5 w-3.5" />
            {published ? "Published!" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Iframe-like preview area */}
      <div className="flex-1 overflow-auto bg-muted/30 p-6">
        <div
          className="mx-auto overflow-hidden rounded-lg border bg-white shadow-2xl transition-all"
          style={{ width: "100%", maxWidth: width }}
        >
          <div
            style={{
              background: site.themeTokens.background,
              fontFamily: site.themeTokens.font,
              color: site.themeTokens.foreground,
              minHeight: "100%",
            }}
          >
            {page && page.sections.length > 0 ? (
              page.sections.map((sec) => (
                <SectionRenderer key={sec.id} section={sec} theme={site.themeTokens} />
              ))
            ) : (
              <div className="grid h-[60vh] place-items-center text-center">
                <div>
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted">
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">Nothing to preview yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add sections in the editor first.
                  </p>
                  <Button size="sm" className="mt-3" onClick={() => setView("editor")}>
                    Open editor
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
