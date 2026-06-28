"use client";

import { usePFStore } from "@/lib/pixelforge/store/pf-store";
import { SAMPLE_PAGE_HTML, sanitizeImportedHTML } from "@/lib/pixelforge/scoring/sample-page";
import { useState, useRef } from "react";
import {
  LayoutGrid, Undo2, Redo2, Upload, FileText, Download,
  BarChart3, GitCompare, FlaskConical, MoreHorizontal,
  Globe, X, ChevronRight,
} from "lucide-react";

interface TopBarProps {
  onOpenImport: () => void;
  onOpenCompetitor: () => void;
  onOpenAB: () => void;
  onOpenTools: () => void;
  onOpenExport: () => void;
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

export function TopBar({ onOpenImport, onOpenCompetitor, onOpenAB, onOpenTools, onOpenExport, onToast }: TopBarProps) {
  const {
    projectName, currentHTML, initialScore, scoreData, historyIndex, historyStack,
    undo, redo, canUndo, canRedo, setHTML, urlMode, setUrlMode, urlBarInput, setUrlBarInput,
    setUrlBarStatus, urlBarStatus, whitelabelActive, whitelabelBrand,
  } = usePFStore();
  const [fetching, setFetching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGo = async () => {
    const url = urlBarInput.trim();
    if (!url) return;
    if (urlMode === "live") {
      // Live mode: try to open in iframe directly (will be CORS-blocked for most sites)
      try {
        const fullUrl = url.startsWith("http") ? url : `https://${url}`;
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${fullUrl}</title><style>body,html{margin:0;height:100vh}iframe{width:100%;height:100%;border:none}</style></head><body><iframe src="${fullUrl}" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe></body></html>`;
        setHTML(html, { resetHistory: true });
        setUrlBarStatus(`Live view: ${fullUrl}`, "success");
        onToast("Live view loaded (may be limited by CORS)", "info");
      } catch (e: any) {
        setUrlBarStatus(`Error: ${e.message}`, "error");
      }
      return;
    }
    // Fetch mode: server-side proxy
    setFetching(true);
    setUrlBarStatus("Fetching…", "info");
    try {
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      const res = await fetch(`/api/fetch-url?url=${encodeURIComponent(fullUrl)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHTML(data.html, { resetHistory: true });
      setUrlBarStatus(`Fetched ${(data.size / 1024).toFixed(1)}KB`, "success");
      onToast(`Fetched ${data.finalUrl}`, "success");
    } catch (e: any) {
      setUrlBarStatus(`Error: ${e.message}`, "error");
      onToast(`Fetch failed: ${e.message}`, "error");
    } finally {
      setFetching(false);
    }
  };

  const handleDemo = () => {
    setHTML(SAMPLE_PAGE_HTML, { resetHistory: true });
    onToast("Demo page loaded", "success");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const html = sanitizeImportedHTML(String(reader.result));
      setHTML(html, { resetHistory: true });
      onToast(`Imported ${file.name}`, "success");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExport = () => {
    if (!currentHTML) {
      onToast("Import a page first", "warning");
      return;
    }
    onOpenExport();
  };

  return (
    <header className="flex items-center gap-2 px-3.5 py-1.5 bg-[var(--pf-panel)] border-b border-[var(--pf-border)] z-50 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 font-extrabold text-[15px] text-[var(--pf-text-bright)] tracking-tight">
        <div className="w-[26px] h-[26px] rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg,#5c8def,#a78bfa)" }}>
          <LayoutGrid className="w-4 h-4 text-white" />
        </div>
        {whitelabelActive ? whitelabelBrand : "PixelForge"}
      </div>

      <div className="w-px h-[22px] bg-[var(--pf-border)] mx-1.5" />

      {/* URL bar */}
      <div className="flex items-center gap-1.5 flex-1 min-w-[180px] max-w-[480px] mx-1">
        <div className="relative flex-1 flex items-center">
          <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--pf-text-dim)] pointer-events-none" />
          <input
            type="text"
            value={urlBarInput}
            onChange={(e) => setUrlBarInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGo()}
            placeholder="Enter URL to audit..."
            autoComplete="off"
            spellCheck={false}
            className="w-full pl-7 pr-7 py-1.5 bg-white/[0.06] border border-[var(--pf-border)] rounded-md text-[var(--pf-text-bright)] text-xs font-medium focus:border-[var(--pf-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--pf-accent-glow)]"
          />
          {urlBarInput && (
            <button
              onClick={() => { setUrlBarInput(""); setUrlBarStatus("", "info"); }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white/10 text-[var(--pf-text-dim)] text-[10px] flex items-center justify-center hover:bg-white/20 hover:text-[var(--pf-text)]"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
        <div className="flex rounded border border-[var(--pf-border)] overflow-hidden shrink-0">
          <button
            onClick={() => setUrlMode("live")}
            className={`px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${urlMode === "live" ? "text-[var(--pf-accent)] bg-[rgba(92,141,239,0.12)]" : "text-[var(--pf-text-dim)] hover:text-[var(--pf-text)] hover:bg-white/5"}`}
          >
            Live
          </button>
          <button
            onClick={() => setUrlMode("fetch")}
            className={`px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${urlMode === "fetch" ? "text-[var(--pf-accent)] bg-[rgba(92,141,239,0.12)]" : "text-[var(--pf-text-dim)] hover:text-[var(--pf-text)] hover:bg-white/5"}`}
          >
            Fetch
          </button>
        </div>
        <button
          onClick={handleGo}
          disabled={fetching}
          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--pf-accent)] text-white rounded-md text-[11.5px] font-semibold hover:bg-[#6f9cf5] hover:shadow-[0_0_14px_var(--pf-accent-glow)] disabled:opacity-50"
        >
          <ChevronRight className="w-3 h-3" />
          {fetching ? "..." : "Go"}
        </button>
        {urlBarStatus?.msg && (
          <span className={`text-[10px] truncate max-w-[140px] ${
            urlBarStatus.type === "error" ? "text-[var(--pf-error)]" :
            urlBarStatus.type === "success" ? "text-[var(--pf-success)]" :
            urlBarStatus.type === "warning" ? "text-[var(--pf-warning)]" :
            "text-[var(--pf-text-dim)]"
          }`}>
            {urlBarStatus.msg}
          </span>
        )}
      </div>

      <div className="w-px h-[22px] bg-[var(--pf-border)] mx-1.5" />

      {/* Actions */}
      <div className="flex items-center gap-1.5 ml-auto">
        <button
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
          className="pf-btn pf-btn-ghost pf-btn-sm disabled:opacity-40"
        >
          <Undo2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Undo</span>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Shift+Z)"
          className="pf-btn pf-btn-ghost pf-btn-sm disabled:opacity-40"
        >
          <Redo2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Redo</span>
        </button>

        <div className="w-px h-[22px] bg-[var(--pf-border)] mx-0.5" />

        <button onClick={onOpenImport} className="pf-btn pf-btn-ghost pf-btn-sm">
          <Upload className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Import</span>
        </button>
        <button onClick={handleDemo} className="pf-btn pf-btn-ghost pf-btn-sm">
          <FileText className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Demo</span>
        </button>

        <input ref={fileInputRef} type="file" accept=".html,.htm" onChange={handleFileUpload} className="hidden" />

        <div className="w-px h-[22px] bg-[var(--pf-border)] mx-0.5" />

        <button onClick={onOpenCompetitor} title="Compare with competitor" className="pf-btn pf-btn-ghost pf-btn-sm">
          <GitCompare className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Compare</span>
        </button>
        <button onClick={onOpenAB} title="A/B test two versions" className="pf-btn pf-btn-ghost pf-btn-sm">
          <FlaskConical className="w-3.5 h-3.5" /> <span className="hidden sm:inline">A/B</span>
        </button>
        <button onClick={onOpenTools} title="More tools" className="pf-btn pf-btn-ghost pf-btn-sm">
          <MoreHorizontal className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Tools</span>
        </button>

        <div className="w-px h-[22px] bg-[var(--pf-border)] mx-0.5" />

        <button onClick={handleExport} className="pf-btn pf-btn-primary pf-btn-sm">
          <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Download Improved</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>
    </header>
  );
}
