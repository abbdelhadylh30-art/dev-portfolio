"use client";

import { useEffect, useRef } from "react";
import { useUIStore } from "@/lib/ui-store";

/**
 * Reads `?admin=1` on mount and opens the AdminDashboard dialog.
 * Mirrors the DeepLinkHandler pattern used for `?p=<slug>`.
 *
 * Renders nothing — it's purely a side-effect mounting helper.
 */
export function AdminLinkHandler() {
  const openAdmin = useUIStore((s) => s.openAdmin);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    const url = new URL(window.location.href);
    if (url.searchParams.get("admin") === "1") {
      // Defer to next tick so AdminDashboard is mounted by then.
      const t = window.setTimeout(() => openAdmin(), 120);
      return () => window.clearTimeout(t);
    }
  }, [openAdmin]);

  return null;
}
