"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/ui-store";
import { projects } from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";

/**
 * Reads `?p=<slug>` from the URL on first load and, if it matches a known
 * project, opens the project modal. The modal then keeps the URL in sync
 * (adding/removing the param) so links are shareable.
 *
 * Renders nothing — it's a side-effect-only component.
 */
export function DeepLinkHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("p");
    if (!slug) return;
    if (!projects.some((p) => p.slug === slug)) return;
    // Defer so the rest of the page has mounted + the modal is ready.
    const id = window.setTimeout(() => {
      trackEvent("project_modal_open", { slug, label: "deep_link" });
      useUIStore.getState().openModal(slug);
    }, 120);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}
