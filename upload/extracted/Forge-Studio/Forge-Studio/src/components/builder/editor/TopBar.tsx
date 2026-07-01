"use client";

import { useBuilder } from "@/lib/builder/store/builder-store";
import { useForge } from "@/lib/forge/store";
import { SECTION_TYPES } from "@/lib/builder/sections/registry";
import type { SectionKind } from "@/lib/builder/sections/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LayoutTemplate, Sparkles, Images, Star, type LucideIcon, ArrowLeft, Monitor, Tablet, Smartphone, Undo2, Redo2, Download, Eye, Palette, PanelLeft, PanelRight, ShieldCheck } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { THEME_PRESETS } from "@/lib/builder/sections/types";
import { useState } from "react";
import { ExportDialog } from "./ExportDialog";

const CATEGORY_LABELS: Record<string, { label: string; icon: LucideIcon }> = {
  structure: { label: "Structure", icon: LayoutTemplate },
  conversion: { label: "Conversion", icon: Sparkles },
  social: { label: "Social proof", icon: Star },
  media: { label: "Media", icon: Images },
};

export function BuilderTopBar() {
  const {
    site, device, setDevice, undo, redo, canUndo, canRedo,
    applyThemePreset, libraryOpen, setLibraryOpen, inspectorOpen, setInspectorOpen,
    currentPageId, setCurrentPageId, addPage, exportHTML,
  } = useBuilder();
  const { setView, transferToAuditor } = useForge();
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-white px-3 text-slate-900 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => setView("dashboard")} className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-slate-100" title="Back to Dashboard">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="hidden text-sm font-semibold sm:block">{site.name || "Untitled"}</span>
          <span className="text-xs text-slate-400">/ Builder</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 rounded-md bg-slate-100 p-0.5">
            {([
              { id: "desktop", icon: Monitor, label: "Desktop" },
              { id: "tablet", icon: Tablet, label: "Tablet" },
              { id: "mobile", icon: Smartphone, label: "Mobile" },
            ] as const).map((it) => {
              const Icon = it.icon; const active = device === it.id;
              return (
                <button key={it.id} onClick={() => setDevice(it.id)} className={cn("grid h-6 w-7 place-items-center rounded transition-all", active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900")} title={it.label}>
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>
          <div className="mx-2 h-6 w-px bg-slate-200" />
          <Select value={currentPageId || site.pages[0]?.id} onValueChange={setCurrentPageId}>
            <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Page" /></SelectTrigger>
            <SelectContent>
              {site.pages.map((p) => <SelectItem key={p.id} value={p.id} className="text-xs">{p.name} {p.isHome && "•"}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => { const name = prompt("Page name:"); if (name) addPage(name); }}>+ Page</Button>
          <div className="mx-2 h-6 w-px bg-slate-200" />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={!canUndo()} title="Undo"><Undo2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={!canRedo()} title="Redo"><Redo2 className="h-4 w-4" /></Button>
          <div className="mx-1 h-6 w-px bg-slate-200" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs">
                <Palette className="h-3.5 w-3.5" />
                <span className="h-3 w-3 rounded-full border" style={{ background: site.themeTokens.primary, borderColor: "rgba(0,0,0,0.1)" }} />
                <span className="hidden sm:block">Theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Theme presets</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {THEME_PRESETS.map((p) => (
                <DropdownMenuItem key={p.name} onClick={() => applyThemePreset(p.tokens)} className="gap-2">
                  <div className="flex gap-0.5">
                    <span className="h-3 w-3 rounded-full border" style={{ background: p.tokens.primary, borderColor: "rgba(0,0,0,0.1)" }} />
                    <span className="h-3 w-3 rounded-full border" style={{ background: p.tokens.accent, borderColor: "rgba(0,0,0,0.1)" }} />
                  </div>
                  {p.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className={cn("h-8 w-8", !libraryOpen && "bg-slate-100")} onClick={() => setLibraryOpen(!libraryOpen)} title="Toggle library"><PanelLeft className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className={cn("h-8 w-8", !inspectorOpen && "bg-slate-100")} onClick={() => setInspectorOpen(!inspectorOpen)} title="Toggle inspector"><PanelRight className="h-4 w-4" /></Button>
          <div className="mx-1 h-6 w-px bg-slate-200" />
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => transferToAuditor(exportHTML(), site.name)} title="Send this page to the Auditor for scoring">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:block">Audit this page</span>
            <span className="sm:hidden">Audit</span>
          </Button>
          <Button variant="default" size="sm" className="h-8 ml-1 bg-slate-900 hover:bg-slate-700" onClick={() => setExportOpen(true)}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </header>
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </>
  );
}

export function SectionLibrary() {
  const addSection = useBuilder((s) => s.addSection);
  const categories = Object.keys(CATEGORY_LABELS);
  return (
    <div className="flex h-full flex-col bg-white text-slate-900">
      <div className="border-b p-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Section library</div>
        <div className="mt-0.5 text-[11px] text-slate-400">Click to add to the current page</div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-3">
          {categories.map((cat) => {
            const types = SECTION_TYPES.filter((t) => t.category === cat);
            if (types.length === 0) return null;
            const CatIcon = CATEGORY_LABELS[cat].icon;
            return (
              <div key={cat}>
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <CatIcon className="h-3 w-3" />{CATEGORY_LABELS[cat].label}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {types.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button key={t.kind} type="button" onClick={() => addSection(t.kind as SectionKind)} className="group flex items-start gap-2 rounded-md border border-slate-200 bg-white p-2 text-left transition-all hover:border-violet-400 hover:shadow-sm active:scale-[0.98]">
                        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold">{t.label}</div>
                          <div className="line-clamp-2 text-[10px] text-slate-500">{t.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
