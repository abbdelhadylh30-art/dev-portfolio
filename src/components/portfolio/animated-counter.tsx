"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a numeric (or short string) value from 0 to its target
 * the first time it scrolls into view.
 */
export function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  // Parse a leading number out of the value (e.g. "Next.js 16" -> 16, "9" -> 9)
  const numericMatch = value.match(/(\d+(?:\.\d+)?)/);
  const target = numericMatch ? parseFloat(numericMatch[1]) : null;
  const prefix = numericMatch ? value.slice(0, numericMatch.index) : "";
  const suffix = numericMatch
    ? value.slice((numericMatch.index ?? 0) + numericMatch[0].length)
    : "";

  const isNumeric = target !== null;
  const [display, setDisplay] = useState<string>(isNumeric ? "0" : value);

  useEffect(() => {
    if (!isNumeric || target === null) return;
    const el = ref.current;
    if (!el) return;

    let started = false;
    const duration = 1100;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            const startTime = performance.now();
            const animate = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutExpo
              const eased =
                progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const current = target * eased;
              setDisplay(
                Number.isInteger(target)
                  ? Math.round(current).toString()
                  : current.toFixed(1)
              );
              if (progress < 1) requestAnimationFrame(animate);
              else setDisplay(target.toString());
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isNumeric, target]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
