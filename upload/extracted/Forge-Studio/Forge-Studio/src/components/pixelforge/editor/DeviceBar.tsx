"use client";

import { usePFStore } from "@/lib/pixelforge/store/pf-store";
import type { DeviceMode, EditorMode } from "@/lib/pixelforge/types";
import { Monitor, Laptop, Tablet, Smartphone, Pencil, Eye } from "lucide-react";

const DEVICES: { id: DeviceMode; label: string; icon: any }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "laptop", label: "Laptop", icon: Laptop },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "mobile", label: "Mobile", icon: Smartphone },
];

const MODES: { id: EditorMode; label: string; icon: any }[] = [
  { id: "edit", label: "Edit", icon: Pencil },
  { id: "preview", label: "Preview", icon: Eye },
];

export function DeviceBar() {
  const { mode, setMode, device, setDevice } = usePFStore();
  return (
    <div className="flex items-center justify-center gap-1 px-3 py-1.5 bg-[var(--pf-panel)] border-b border-[var(--pf-border)] shrink-0">
      <div className="flex items-center gap-0.5">
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              title={m.id === "edit" ? "Edit mode — click to select elements" : "Preview mode — interact normally"}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11.5px] font-semibold transition-colors ${
                active
                  ? "text-[var(--pf-accent)] bg-[rgba(92,141,239,0.12)]"
                  : "text-[var(--pf-text-dim)] hover:text-[var(--pf-text)] hover:bg-white/5"
              }`}
            >
              <Icon className="w-3 h-3" /> {m.label}
            </button>
          );
        })}
      </div>
      <div className="w-px h-[18px] bg-[var(--pf-border)] mx-1" />
      {DEVICES.map((d) => {
        const Icon = d.icon;
        const active = device === d.id;
        return (
          <button
            key={d.id}
            onClick={() => setDevice(d.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11.5px] font-medium transition-colors ${
              active
                ? "text-[var(--pf-accent)] bg-[rgba(92,141,239,0.12)]"
                : "text-[var(--pf-text-dim)] hover:text-[var(--pf-text)] hover:bg-white/5"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {d.label}
          </button>
        );
      })}
    </div>
  );
}
