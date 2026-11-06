"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useModeTransform } from "@/lib/mode-transform";

/**
 * ── ModeFlipOverlay ───────────────────────────────────────────────────
 * The Business ⇄ Developer flip ceremony, restored.
 *
 * When `flipTo` is set in the live-mode store, this overlay seals the
 * screen with a clip-path circle in the NEW mode's skin tint (0.6s),
 * the tree swap happens underneath at the midpoint, then the seal irises
 * closed into the new view (0.9s) — ~1.5s of ceremony total, so the
 * swap reads as a deliberate "day ⇄ night" cut instead of an abrupt
 * content blink.
 *
 * Reduced-motion visitors never see this: `beginFlip` skips straight to
 * `setLiveMode` and `flipTo` stays null.
 * ─────────────────────────────────────────────────────────────────────
 */

/** Duration of the seal (cover) phase in ms. */
const COVER_MS = 600;
/** Duration of the iris (reveal) phase in ms. */
const IRIS_MS = 900;

export function ModeFlipOverlay() {
  const flipTo = useModeTransform((s) => s.flipTo);
  const [swapped, setSwapped] = React.useState(false);

  React.useEffect(() => {
    if (!flipTo) return;
    setSwapped(false);
    /* Midpoint: the live tree swaps underneath the fully-sealed overlay.
       swapLiveMode (NOT setLiveMode): setLiveMode would null `flipTo`
       and unmount this overlay at the seal's peak, skipping the iris —
       swapLiveMode keeps `flipTo` set so the 0.9s iris plays, and
       `endFlip` below releases the overlay when the ceremony completes. */
    const swap = window.setTimeout(() => {
      useModeTransform.getState().swapLiveMode(flipTo);
      setSwapped(true);
    }, COVER_MS);
    /* Ceremony complete: release the overlay. */
    const done = window.setTimeout(
      () => useModeTransform.getState().endFlip(),
      COVER_MS + IRIS_MS + 40,
    );
    return () => {
      window.clearTimeout(swap);
      window.clearTimeout(done);
    };
  }, [flipTo]);

  if (!flipTo) return null;

  const toSun = flipTo === "client";

  return (
    <div
      className="fixed inset-0 z-[120]"
      aria-hidden
      role="presentation"
      style={{ pointerEvents: "auto" }}
    >
      {/* Skin tint of the DESTINATION mode — the swap hides underneath it. */}
      <motion.div
        className={`flip-tint ${toSun ? "flip-tint--sun" : "flip-tint--moon"}`}
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={
          swapped
            ? { clipPath: "circle(0% at 50% 50%)" }
            : { clipPath: "circle(142% at 50% 50%)" }
        }
        transition={
          swapped
            ? { duration: IRIS_MS / 1000, ease: [0.16, 1, 0.3, 1], delay: 0.02 }
            : { duration: COVER_MS / 1000, ease: [0.65, 0, 0.35, 1] }
        }
      >
        {/* Celestial glyph surfacing at the seal's midpoint */}
        <motion.span
          className={`flip-glyph ${toSun ? "flip-glyph--sun" : "flip-glyph--moon"}`}
          initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
          animate={
            swapped
              ? { opacity: 0, scale: 1.35, filter: "blur(6px)" }
              : { opacity: 1, scale: 1, filter: "blur(0px)" }
          }
          transition={{
            duration: swapped ? IRIS_MS / 1000 : COVER_MS / 1000,
            ease: "easeOut",
            delay: swapped ? 0 : COVER_MS / 2000,
          }}
          aria-hidden
        />
      </motion.div>
    </div>
  );
}
