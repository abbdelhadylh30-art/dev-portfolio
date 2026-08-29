"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Typing-style role rotator. Cycles through a list of role strings with a
 * typewriter effect (type → hold → delete → next).
 *
 * All setState calls happen inside setTimeout callbacks so we never trigger
 * a synchronous state update during the effect body (avoids cascading renders).
 */
export function RoleRotator({
  roles,
  className,
}: {
  roles: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (roles.length === 0) return;
    const current = roles[index % roles.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && sub === current) {
      // Fully typed — hold, then start deleting.
      timer = setTimeout(() => setDeleting(true), 1500);
    } else if (deleting && sub === "") {
      // Fully deleted — breathe, then advance to next role.
      timer = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % roles.length);
      }, 220);
    } else {
      // Type or delete one character.
      const delta = deleting ? -1 : 1;
      const next = current.substring(0, sub.length + delta);
      timer = setTimeout(() => setSub(next), deleting ? 40 : 80);
    }
    return () => clearTimeout(timer);
  }, [sub, deleting, index, roles]);

  return (
    <span className={className} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={sub}
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {sub}
        </motion.span>
      </AnimatePresence>
      <motion.span
        aria-hidden="true"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
        className="ml-0.5 inline-block text-brand"
      >
        |
      </motion.span>
    </span>
  );
}
