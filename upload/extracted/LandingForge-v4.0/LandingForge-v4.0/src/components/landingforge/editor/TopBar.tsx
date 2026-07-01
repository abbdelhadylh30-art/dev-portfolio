"use client";

import { useEditor } from "@/lib/store/editor-store";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Download,
  Eye,
  Layout,
  BarChart3,
  PanelLeft,
  PanelRight,
  Palette,
  Sparkles,
  Home,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEME_PRESETS } from "@/lib/sections/types";
import { useState } from "react";
import { ExportDialog } from "./ExportDialog";
import { cn } from "@/lib/utils";

export function TopBar() {
  const {
    view,
    setView,
    device,
    setDevice,
    undo,
    redo,
    canUndo,
    canRedo,
    site,
    applyThemePreset,
    libraryOpen,
    setLibraryOpen,
    inspectorOpen,
    setInspectorOpen,
    currentPageId,
    setCurrentPageId,
  } = useEditor();
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-background px-3">
        {/* Left: logo + view tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("dashboard")}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-muted"
            title="Dashboard"
          >
            <div className="grid h-6 w-6 place-items-center rounded bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="hidden text-sm font-semibold sm:block">LandingForge</span>
          </button>
          <span className="text-muted-foreground/40">/</span>
          <ViewTabs current={view} onChange={setView} />
        </div>

        {/* Center: device preview (editor only) */}
        {view === "editor" && (
          <div className="flex items-center gap-1">
            <DeviceToggle device={device} onChange={setDevice} />
            <div className="mx-2 h-6 w-px bg-border" />
            <PageSwitcher
              pages={site.pages}
              currentId={currentPageId || site.pages[0]?.id || ""}
              onChange={setCurrentPageId}
            />
          </div>
        )}

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          {view === "editor" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={undo}
                disabled={!canUndo()}
                title="Undo (Cmd+Z)"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={redo}
                disabled={!canRedo()}
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              <div className="mx-1 h-6 w-px bg-border" />
              <ThemePicker onApply={applyThemePreset} current={site.themeTokens.primary} />
              <div className="mx-1 h-6 w-px bg-border" />
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", !libraryOpen && "bg-muted")}
                onClick={() => setLibraryOpen(!libraryOpen)}
                title="Toggle library"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", !inspectorOpen && "bg-muted")}
                onClick={() => setInspectorOpen(!inspectorOpen)}
                title="Toggle inspector"
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="default"
            size="sm"
            className="ml-2 h-8"
            onClick={() => setExportOpen(true)}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </header>
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </>
  );
}

function ViewTabs({
  current,
  onChange,
}: {
  current: string;
  onChange: (v: any) => void;
}) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "templates", label: "Templates", icon: Layout },
    { id: "editor", label: "Editor", icon: Sparkles },
    { id: "preview", label: "Preview", icon: Eye },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];
  return (
    <div className="flex items-center gap-0.5 rounded-md bg-muted/50 p-0.5">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = current === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-all",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden md:block">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function DeviceToggle({
  device,
  onChange,
}: {
  device: "desktop" | "tablet" | "mobile";
  onChange: (d: any) => void;
}) {
  const items = [
    { id: "desktop", icon: Monitor, label: "Desktop" },
    { id: "tablet", icon: Tablet, label: "Tablet" },
    { id: "mobile", icon: Smartphone, label: "Mobile" },
  ];
  return (
    <div className="flex items-center gap-0.5 rounded-md bg-muted/50 p-0.5">
      {items.map((it) => {
        const Icon = it.icon;
        const active = device === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={cn(
              "grid h-6 w-7 place-items-center rounded transition-all",
              active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            title={it.label}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}

function PageSwitcher({
  pages,
  currentId,
  onChange,
}: {
  pages: import("@/lib/sections/types").PageData[];
  currentId: string;
  onChange: (id: string) => void;
}) {
  const addPage = useEditor((s) => s.addPage);
  if (pages.length === 0) return null;
  return (
    <div className="flex items-center gap-1">
      <Select value={currentId} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue placeholder="Page" />
        </SelectTrigger>
        <SelectContent>
          {pages.map((p) => (
            <SelectItem key={p.id} value={p.id} className="text-xs">
              {p.name} {p.isHome && "•"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() => {
          const name = prompt("Page name:");
          if (name) addPage(name);
        }}
      >
        + Page
      </Button>
    </div>
  );
}

function ThemePicker({
  onApply,
  current,
}: {
  onApply: (t: import("@/lib/sections/types").ThemeTokens) => void;
  current: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs">
          <Palette className="h-3.5 w-3.5" />
          <span
            className="h-3 w-3 rounded-full border"
            style={{ background: current, borderColor: "rgba(0,0,0,0.1)" }}
          />
          <span className="hidden sm:block">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme presets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEME_PRESETS.map((p) => (
          <DropdownMenuItem
            key={p.name}
            onClick={() => onApply(p.tokens)}
            className="gap-2"
          >
            <div className="flex gap-0.5">
              <span
                className="h-3 w-3 rounded-full border"
                style={{ background: p.tokens.primary, borderColor: "rgba(0,0,0,0.1)" }}
              />
              <span
                className="h-3 w-3 rounded-full border"
                style={{ background: p.tokens.accent, borderColor: "rgba(0,0,0,0.1)" }}
              />
            </div>
            {p.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
