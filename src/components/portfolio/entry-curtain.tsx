"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ENTRY_EASE } from "@/components/portfolio/reveal";
import type { PortfolioMode } from "@/lib/mode";

/**
 * ── EntryCurtain ──────────────────────────────────────────────────────
 * A one-shot, mode-aware first-paint sequence that sets the Sun/Moon
 * identity before the page content arrives:
 *
 *   • Sun (Business view)  — warm cream field, a coral sun disc rising
 *     over a glowing horizon, seven light rays sweeping outward, then
 *     the whole curtain wipes upward like a sunrise.
 *   • Moon (Developer view) — deep jade night, an emerald-glow crescent
 *     drifting into place inside a sixteen-star twinkling field, then
 *     the night irises open onto the page.
 *
 * Timing: 1.7s scene → 1.05s exit (~2.75s total). The exported
 * `entrySequenceDone` flag lets the heroes stagger their own entrance
 * under the curtain exactly once per load (later page navigations skip
 * the base delay).
 *
 * Safety: skipped entirely for reduced-motion visitors, hidden instantly
 * on repeat visits (sessionStorage + layout-effect pre-paint check), and
 * a pure-CSS failsafe removes it even if JS never runs.
 * ─────────────────────────────────────────────────────────────────────
 */

const STORAGE_KEY = "dp-entry-played";

/** Module-level flag: true once the entry sequence has finished (or been skipped). */
export let entrySequenceDone = false;

/** Deterministic star field — [left%, top%, size(px), delay(s)] — no Math.random so SSR/CSR match. */
const STARS: ReadonlyArray<readonly [number, number, number, number]> = [
  [6, 14, 2, 0.0], [14, 32, 1.5, 0.35], [23, 9, 2, 0.7], [31, 24, 1.5, 0.15],
  [39, 12, 2, 0.55], [47, 30, 1.5, 0.9], [55, 8, 2, 0.25], [63, 22, 1.5, 0.65],
  [71, 15, 2, 0.45], [79, 33, 1.5, 0.05], [86, 11, 2, 0.8], [93, 27, 1.5, 0.5],
  [11, 44, 1.5, 0.95], [44, 40, 2, 0.6], [68, 42, 1.5, 0.2], [90, 47, 2, 0.75],
];

/** Seven rays around the sun disc — angle, delay. */
const RAYS: ReadonlyArray<readonly [number, number]> = [
  [-81, 0.0], [-54, 0.12], [-27, 0.24], [0, 0.36], [27, 0.24], [54, 0.12], [81, 0.0],
];

type Phase = "play" | "out" | "done";

export function EntryCurtain({ mode }: { mode: PortfolioMode }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = React.useState<Phase>("play");

  /* Decide skip BEFORE first paint: repeat visits (sessionStorage) and
     reduced-motion visitors must never see a flash of the overlay. */
  React.useLayoutEffect(() => {
    if (reduce || sessionStorage.getItem(STORAGE_KEY)) {
      entrySequenceDone = true;
      setPhase("done");
    }
  }, [reduce]);

  /* Pure-CSS failsafe: if JS never runs, a 3.2s keyframe hides the
     overlay (see .entry-curtain-failsafe in globals.css). */
  if (phase === "done") return null;

  const isSun = mode === "client";
  const playClip = isSun ? "inset(0% 0% 0% 0%)" : "circle(152% at 50% 44%)";
  const exitClip = isSun ? "inset(0% 0% 100% 0%)" : "circle(0% at 50% 44%)";

  const beginExit = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode — the in-memory flag still covers this load */
    }
    entrySequenceDone = true;
    setPhase("out");
  };

  return (
    <motion.div
      className={`entry-curtain entry-curtain-failsafe ${isSun ? "entry-curtain--sun" : "entry-curtain--moon"}`}
      aria-hidden
      role="presentation"
      initial={{ clipPath: playClip, pointerEvents: "auto" as const }}
      animate={{
        clipPath: phase === "out" ? exitClip : playClip,
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
      transition={
        phase === "out"
          ? { duration: 1.05, ease: isSun ? [0.7, 0, 0.3, 1] : ENTRY_EASE }
          : { duration: 0 }
      }
      onAnimationComplete={() => {
        if (phase === "out") setPhase("done");
      }}
    >
      {isSun ? (
        <SunScene phase={phase} onExit={beginExit} />
      ) : (
        <MoonScene phase={phase} onExit={beginExit} />
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Sun (Business) scene                                                */
/* ------------------------------------------------------------------ */

function SunScene({ phase, onExit }: { phase: Phase; onExit: () => void }) {
  React.useEffect(() => {
    const t = window.setTimeout(onExit, 1700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="entry-scene entry-scene--sun">
      {/* Warm sky wash */}
      <div className="entry-sun-sky" aria-hidden />

      {/* Rising sun disc + halo */}
      <div className="entry-sun-disc" aria-hidden />

      {/* Seven sweeping rays */}
      {RAYS.map(([angle, delay]) => (
        <span
          key={angle}
          className="entry-sun-ray"
          aria-hidden
          style={
            {
              "--ray-a": `${angle}deg`,
              animationDelay: `${delay + 0.08}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Glowing horizon */}
      <div className="entry-sun-horizon" aria-hidden />

      {/* Name plate */}
      <motion.div
        className="entry-nameplate"
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={
          phase === "out"
            ? { opacity: 0, y: -10, filter: "blur(4px)" }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        transition={{ duration: phase === "out" ? 0.45 : 0.9, ease: ENTRY_EASE, delay: phase === "out" ? 0 : 0.35 }}
      >
        <span className="entry-nameplate-glyph entry-nameplate-glyph--sun" aria-hidden />
        <span className="entry-nameplate-text">Abdelhady Gabriel</span>
        <span className="entry-nameplate-sub">Daylight · Business view</span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Moon (Developer) scene                                              */
/* ------------------------------------------------------------------ */

function MoonScene({ phase, onExit }: { phase: Phase; onExit: () => void }) {
  React.useEffect(() => {
    const t = window.setTimeout(onExit, 1700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="entry-scene entry-scene--moon">
      {/* Night sky wash */}
      <div className="entry-moon-sky" aria-hidden />

      {/* Twinkling star field */}
      {STARS.map(([left, top, size, delay], i) => (
        <span
          key={i}
          className="entry-star"
          aria-hidden
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}

      {/* Crescent moon drifting in */}
      <div className="entry-moon-disc" aria-hidden />

      {/* Name plate */}
      <motion.div
        className="entry-nameplate"
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={
          phase === "out"
            ? { opacity: 0, y: -10, filter: "blur(4px)" }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        transition={{ duration: phase === "out" ? 0.45 : 0.9, ease: ENTRY_EASE, delay: phase === "out" ? 0 : 0.35 }}
      >
        <span className="entry-nameplate-glyph entry-nameplate-glyph--moon" aria-hidden />
        <span className="entry-nameplate-text">Abdelhady Gabriel</span>
        <span className="entry-nameplate-sub">Moonlight · Developer view</span>
      </motion.div>
    </div>
  );
}
