"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePFStore } from "@/lib/pixelforge/store/pf-store";
import { runScoring } from "@/lib/pixelforge/scoring/engine";
import type { DeviceMode } from "@/lib/pixelforge/types";

const DEVICE_DIMENSIONS: Record<DeviceMode, { width: number; height: number }> = {
  desktop: { width: 1280, height: 800 },
  laptop: { width: 1024, height: 640 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

export function Preview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentHTML = usePFStore((s) => s.currentHTML);
  const mode = usePFStore((s) => s.mode);
  const device = usePFStore((s) => s.device);
  const setScoreData = usePFStore((s) => s.setScoreData);
  const setAnalyzing = usePFStore((s) => s.setAnalyzing);
  const setSelectedSelector = usePFStore((s) => s.setSelectedSelector);
  const selectedSelector = usePFStore((s) => s.selectedSelector);
  const analyzing = usePFStore((s) => s.analyzing);
  const scoreData = usePFStore((s) => s.scoreData);

  // Write HTML to the iframe via srcdoc (CSP-safe, no network)
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (!currentHTML) {
      iframe.srcdoc = "<!DOCTYPE html><html><body style='font-family:sans-serif;color:#999;display:grid;place-items:center;height:100vh;margin:0'><div style='text-align:center'><h2 style='margin:0 0 8px;color:#666'>No page imported</h2><p style='margin:0;font-size:14px'>Click Import or Demo to start.</p></div></body></html>";
      return;
    }
    iframe.srcdoc = currentHTML;
  }, [currentHTML]);

  // Re-score whenever HTML or device changes (after iframe loads)
  const rescore = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc || !doc.body) return;
    setAnalyzing(true);
    // Use rAF so the DOM has time to lay out (needed for getBoundingClientRect)
    requestAnimationFrame(() => {
      try {
        const sd = runScoring({ doc, viewportWidth: DEVICE_DIMENSIONS[device].width });
        setScoreData(sd);
      } catch (e) {
        console.error("Scoring error:", e);
      } finally {
        setAnalyzing(false);
      }
    });
  }, [device, setAnalyzing, setScoreData]);

  // Wait for iframe to load, then attach listeners + score
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      attachListeners();
      rescore();
    };
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [currentHTML, mode, device]);

  // Re-score on device change
  useEffect(() => {
    rescore();
  }, [device, rescore]);

  // Click-to-select in edit mode
  const attachListeners = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    // Remove previous PF listeners
    doc.querySelectorAll("[data-pf-selected]").forEach((el) => {
      el.removeAttribute("data-pf-selected");
      (el as HTMLElement).style.outline = "";
    });
    if (mode !== "edit") return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      // Compute selector
      const selector = computeSelector(target);
      // Clear previous selection
      doc.querySelectorAll("[data-pf-selected]").forEach((el) => {
        el.removeAttribute("data-pf-selected");
        (el as HTMLElement).style.outline = "";
      });
      target.setAttribute("data-pf-selected", "1");
      target.style.outline = "2px solid #5c8def";
      target.style.outlineOffset = "1px";
      setSelectedSelector(selector);
    };
    // Attach to body (capture so we catch all clicks)
    doc.addEventListener("click", handler, true);
    return () => {
      doc.removeEventListener("click", handler, true);
    };
  }, [mode, setSelectedSelector]);

  // Re-highlight when selectedSelector changes externally
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.querySelectorAll("[data-pf-selected]").forEach((el) => {
      el.removeAttribute("data-pf-selected");
      (el as HTMLElement).style.outline = "";
    });
    if (!selectedSelector) return;
    try {
      const el = doc.querySelector(selectedSelector);
      if (el) {
        el.setAttribute("data-pf-selected", "1");
        (el as HTMLElement).style.outline = "2px solid #5c8def";
        (el as HTMLElement).style.outlineOffset = "1px";
      }
    } catch {
      /* invalid selector */
    }
  }, [selectedSelector]);

  const dims = DEVICE_DIMENSIONS[device];

  return (
    <div className="flex h-full flex-col bg-[#080a0e]">
      {analyzing && <div className="pf-analyzing-bar" />}
      <div className="flex-1 overflow-auto pf-scroll p-5 flex justify-center items-start">
        <div
          className={`pf-canvas-frame pf-device-${device}`}
          style={{ width: dims.width, height: dims.height }}
        >
          {device === "mobile" && <div className="pf-phone-notch" />}
          <iframe
            ref={iframeRef}
            title="preview"
            sandbox="allow-same-origin allow-popups allow-forms"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              pointerEvents: mode === "edit" ? "none" : "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function computeSelector(el: HTMLElement): string {
  if (el.id) {
    return "#" + (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(el.id) : el.id.replace(/([^\w-])/g, "\\$1"));
  }
  const parts: string[] = [];
  let cursor: HTMLElement | null = el;
  while (cursor && cursor.tagName && cursor.tagName !== "HTML" && cursor.tagName !== "BODY") {
    let sel = cursor.tagName.toLowerCase();
    if (cursor.id) {
      parts.unshift("#" + (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(cursor.id) : cursor.id));
      break;
    }
    const parent = cursor.parentElement;
    if (parent) {
      const sibs = Array.from(parent.children).filter((c) => c.tagName === cursor!.tagName);
      if (sibs.length > 1) {
        sel += `:nth-of-type(${sibs.indexOf(cursor) + 1})`;
      }
    }
    parts.unshift(sel);
    cursor = cursor.parentElement;
  }
  return parts.join(" > ");
}
