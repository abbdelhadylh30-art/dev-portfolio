"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { profile } from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";

/**
 * Floating WhatsApp action button — the primary business conversion path
 * (synced from the production deployment, where WhatsApp is labelled
 * "Fastest reply"). Appears after the user scrolls past the hero and
 * gracefully hides again once the contact section (with its own
 * WhatsApp card) is in view.
 */
export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);
  const [inContact, setInContact] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contact = document.getElementById("contact");
    let observer: IntersectionObserver | null = null;
    if (contact) {
      observer = new IntersectionObserver(
        ([entry]) => setInContact(entry.isIntersecting),
        { rootMargin: "-10% 0px -10% 0px" }
      );
      observer.observe(contact);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const show = visible && !inContact;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          initial={{ opacity: 0, y: 24, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.85 }}
          transition={
            reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 28 }
          }
          href={profile.whatsappUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat on WhatsApp — fastest reply"
          onClick={() => trackEvent("whatsapp_click", { label: "fab" })}
          className="whatsapp-fab group fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full shadow-xl sm:bottom-6 sm:right-6"
        >
          {/* Ping halo */}
          <span className="whatsapp-fab-ping" aria-hidden />
          {/* Label chip — slides in on hover (desktop) */}
          <span className="whatsapp-fab-label">
            Fastest reply
            <span className="sr-only">— chat on WhatsApp</span>
          </span>
          <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="currentColor" aria-hidden>
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
