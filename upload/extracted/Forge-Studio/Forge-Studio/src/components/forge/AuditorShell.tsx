"use client";

import { useEffect } from "react";
import { usePFStore } from "@/lib/pixelforge/store/pf-store";
import { useForge } from "@/lib/forge/store";
import { useBuilder } from "@/lib/builder/store/builder-store";
import { AppShell } from "@/components/pixelforge/editor/AppShell";
import { ArrowLeft, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Wraps the PixelForge AppShell with:
 * 1. A "Back to Dashboard" + "Edit in builder" header button
 * 2. Logic to consume any pending transfer HTML (from the Builder → Auditor flow)
 */
export function AuditorShell() {
  const { setView, consumeTransfer } = useForge();
  const { setHTML, projectName, currentHTML, setProjectName } = usePFStore();
  const { loadFromHTML } = useBuilder();

  // Consume pending transfer on mount
  useEffect(() => {
    const transfer = consumeTransfer();
    if (transfer && transfer.source === "builder") {
      setHTML(transfer.html, { resetHistory: true });
      setProjectName(transfer.name);
    }
  }, []);

  const handleEditInBuilder = () => {
    if (!currentHTML) return;
    loadFromHTML(currentHTML, projectName);
    setView("builder");
  };

  return (
    <div className="relative">
      {/* Floating transfer controls — appear above the auditor's own top bar */}
      <div className="fixed top-1.5 left-2 z-[600] flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[11px] text-[var(--pf-text-dim)] hover:text-[var(--pf-text-bright)] hover:bg-white/5"
          onClick={() => setView("dashboard")}
        >
          <ArrowLeft className="mr-1 h-3 w-3" /> Dashboard
        </Button>
      </div>
      <div className="fixed top-1.5 right-2 z-[600]">
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 border-[var(--pf-border)] bg-[var(--pf-panel)] text-[11px] text-[var(--pf-text)] hover:bg-[var(--pf-panel-hover)]"
          onClick={handleEditInBuilder}
          disabled={!currentHTML}
          title="Send the current HTML to the Builder for further editing"
        >
          <Layout className="h-3 w-3" /> Edit in builder
        </Button>
      </div>
      <AppShell />
    </div>
  );
}
