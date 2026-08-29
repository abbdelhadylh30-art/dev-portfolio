"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Code2 } from "lucide-react";
import type { PortfolioMode } from "@/lib/mode";
import { useModeTransform } from "@/lib/mode-transform";

/**
 * Transformers-style mode-shift overlay.
 *
 * When the visitor flips Business ⇄ Developer, six armor plates (3×2
 * grid, tinted by the DESTINATION palette — Autobot-warm coral/amber
 * for Business, gunmetal/emerald for Developer) slam shut over the
 * screen with a 3D stagger. While sealed, the mode cookie is written
 * and the server tree refreshes underneath; a scan beam sweeps the
 * plates, a hex emblem counter-rotates and the HUD glitches
 * "TRANSFORMING ». BUSINESS MODE". Plates then retract center-out,
 * uncovering the fully re-skinned view.
 *
 * Reduced-motion visitors get a quick, calm fade instead.
 */

/* --- Choreography timing (ms) — shared contract with ModeToggle --- */
export const TF_COVER_MS = 690; // plates sealed
export const TF_HOLD_MIN_MS = 1550; // earliest reveal (from start)
export const TF_HOLD_MAX_MS = 3200; // hard safety cap
export const TF_REVEAL_MS = 720; // plates retracted

/* --- Destination palettes (inline CSS vars consumed by .tf-* utils) --- */
const CLIENT_PALETTE: React.CSSProperties = {
  "--tf-1": "oklch(0.66 0.2 36)", // coral
  "--tf-2": "oklch(0.8 0.16 75)", // amber
  "--tf-deep": "oklch(0.3 0.08 44)", // copper
  "--tf-text": "oklch(0.99 0.015 85)", // cream
} as React.CSSProperties;

const DEV_PALETTE: React.CSSProperties = {
  "--tf-1": "oklch(0.72 0.17 165)", // emerald
  "--tf-2": "oklch(0.68 0.13 195)", // teal
  "--tf-deep": "oklch(0.16 0.025 175)", // gunmetal
  "--tf-text": "oklch(0.96 0.01 180)",
} as React.CSSProperties;

const HUD_CORNERS = [
  "top-3 left-3 border-t-2 border-l-2 rounded-tl-md",
  "top-3 right-3 border-t-2 border-r-2 rounded-tr-md",
  "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-md",
  "bottom-3 right-3 border-b-2 border-r-2 rounded-br-md",
];

const EASE_SLAM = [0.22, 1.1, 0.36, 1] as [number, number, number, number];
const EASE_OPEN = [0.7, 0, 0.84, 0] as [number, number, number, number];

export function ModeTransformOverlay({ mode }: { mode: PortfolioMode }) {
  const phase = useModeTransform((s) => s.phase);
  const target = useModeTransform((s) => s.target);
  const reduced = !!useReducedMotion();
  const active = phase !== "idle" && target !== null;

  /* Latest server-rendered mode (flips once router.refresh() lands). */
  const modeRef = React.useRef(mode);
  React.useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  /* cover → hold, reveal → idle. */
  React.useEffect(() => {
    if (phase === "cover") {
      const t = window.setTimeout(
        () => useModeTransform.getState().setPhase("hold"),
        reduced ? 200 : TF_COVER_MS
      );
      return () => window.clearTimeout(t);
    }
    if (phase === "reveal") {
      const t = window.setTimeout(
        () => useModeTransform.getState().end(),
        reduced ? 260 : TF_REVEAL_MS
      );
      return () => window.clearTimeout(t);
    }
  }, [phase, reduced]);

  /* hold → reveal: once the refreshed tree has arrived (mode === target)
     and the emblem has had its moment on stage — hard cap as a fallback. */
  React.useEffect(() => {
    if (phase !== "hold" || !target) return;
    const iv = window.setInterval(() => {
      const s = useModeTransform.getState();
      const elapsed = Date.now() - s.startedAt;
      const arrived = modeRef.current === s.target;
      if ((arrived && elapsed >= TF_HOLD_MIN_MS) || elapsed >= TF_HOLD_MAX_MS) {
        s.setPhase("reveal");
      }
    }, 64);
    return () => window.clearInterval(iv);
  }, [phase, target]);

  /* Lock the page scroll while transforming. */
  React.useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  if (!active || !target) return null;

  const palette = target === "client" ? CLIENT_PALETTE : DEV_PALETTE;
  const label = target === "client" ? "Business Mode" : "Developer Mode";
  const EmblemIcon = target === "client" ? Briefcase : Code2;
  const revealing = phase === "reveal";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100] overflow-hidden ${
        phase === "hold" && !reduced ? "tf-shake" : ""
      }`}
      style={{ ...palette, background: "var(--tf-deep)" }}
    >
      {/* Faint HUD tech grid */}
      <div aria-hidden className="tf-grid absolute inset-0" />

      {/* Armor plates — 3 cols × 2 rows, slam shut with 3D stagger */}
      <div
        aria-hidden
        className="absolute inset-0 grid grid-cols-3 grid-rows-2"
        style={{ perspective: 1200 }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const fromY = row === 0 ? "-105%" : "105%";
          return (
            <motion.div
              key={i}
              className="tf-plate"
              style={{
                transformOrigin: `${col === 0 ? "left" : col === 2 ? "right" : "center"} ${
                  row === 0 ? "bottom" : "top"
                }`,
              }}
              initial={{ y: fromY, rotateX: row === 0 ? -16 : 16, opacity: 0 }}
              animate={
                revealing
                  ? { y: fromY, rotateX: row === 0 ? -14 : 14, opacity: 0 }
                  : { y: "0%", rotateX: 0, opacity: 1 }
              }
              transition={
                revealing
                  ? {
                      duration: 0.5,
                      delay: (1 - Math.abs(col - 1)) * 0.09 + (row === 0 ? 0.02 : 0.07),
                      ease: EASE_OPEN,
                    }
                  : {
                      duration: 0.52,
                      delay: reduced ? 0 : col * 0.07 + (row === 0 ? 0 : 0.05),
                      ease: reduced ? "linear" : EASE_SLAM,
                    }
              }
            />
          );
        })}
      </div>

      {/* Vignette to focus the center stage */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 42%, color-mix(in oklch, var(--tf-deep) 85%, transparent) 100%)",
        }}
      />

      {/* Scan beam sweeping the sealed plates */}
      {!reduced && <div aria-hidden className="tf-scanline pointer-events-none absolute inset-x-0" />}

      {/* HUD corner brackets */}
      {HUD_CORNERS.map((c) => (
        <span
          key={c}
          aria-hidden
          className={`absolute h-8 w-8 ${c}`}
          style={{ borderColor: "color-mix(in oklch, var(--tf-2) 60%, transparent)" }}
        />
      ))}

      {/* Center stage: emblem + HUD text + progress */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center"
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={
          revealing
            ? { opacity: 0, scale: 1.06, y: -8 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={
          revealing
            ? { duration: 0.24, ease: "easeIn" }
            : { duration: 0.4, delay: reduced ? 0 : 0.32, ease: "easeOut" }
        }
      >
        {/* Emblem — hex core + counter-rotating rings */}
        <div className="relative grid place-items-center">
          {!reduced && (
            <>
              <motion.svg
                viewBox="0 0 100 100"
                className="absolute h-36 w-36"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                aria-hidden
              >
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  strokeWidth="1"
                  strokeDasharray="12 16"
                  style={{ stroke: "color-mix(in oklch, var(--tf-2) 65%, transparent)" }}
                />
              </motion.svg>
              <motion.svg
                viewBox="0 0 100 100"
                className="absolute h-28 w-28"
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                aria-hidden
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  strokeWidth="1"
                  strokeDasharray="4 11"
                  style={{ stroke: "color-mix(in oklch, var(--tf-1) 75%, transparent)" }}
                />
              </motion.svg>
            </>
          )}

          {/* Core glow */}
          <span
            aria-hidden
            className="tf-core absolute h-24 w-24 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--tf-1) 60%, transparent), transparent 70%)",
            }}
          />

          {/* Hexagon shell */}
          <svg
            viewBox="0 0 100 100"
            className="relative h-20 w-20"
            style={{
              filter:
                "drop-shadow(0 0 18px color-mix(in oklch, var(--tf-1) 55%, transparent))",
            }}
            aria-hidden
          >
            <polygon
              points="50,6 88,28 88,72 50,94 12,72 12,28"
              strokeLinejoin="round"
              strokeWidth="2.5"
              style={{
                fill: "color-mix(in oklch, var(--tf-deep) 72%, black)",
                stroke: "var(--tf-1)",
              }}
            />
          </svg>
          <EmblemIcon
            className="absolute h-8 w-8"
            style={{ color: "var(--tf-text)" }}
            aria-hidden
          />
        </div>

        {/* HUD headline */}
        <div>
          <p
            className="tf-glitch font-mono text-xl font-bold uppercase tracking-[0.35em] sm:text-3xl"
            style={{ color: "var(--tf-text)" }}
            data-text="Transforming"
          >
            Transforming
          </p>
          <p
            className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] sm:text-xs"
            style={{ color: "var(--tf-2)" }}
          >
            » {label}
          </p>
        </div>

        {/* Progress rail */}
        <div
          className="h-[3px] w-48 overflow-hidden rounded-full sm:w-64"
          style={{ background: "color-mix(in oklch, var(--tf-text) 12%, transparent)" }}
          aria-hidden
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--tf-1), var(--tf-2))" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Footer ticker */}
      <p
        aria-hidden
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em]"
        style={{ color: "color-mix(in oklch, var(--tf-text) 55%, transparent)" }}
      >
        AG · Mode-Shift Engine <span className="tf-caret">▌</span>
      </p>

      {/* Screen-reader announcement */}
      <span className="sr-only">Switching to {label}…</span>
    </div>
  );
}
