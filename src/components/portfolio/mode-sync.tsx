"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setModeCookie } from "@/lib/mode";
import { useModeTransform } from "@/lib/mode-transform";

/**
 * Deep-link support for the view mode: `/` (or any path) with `?mode=dev`
 * switches to the dev view and refreshes so the server tree matches.
 * The swap itself is client-side and instant (no ceremony for links);
 * the cookie write + refresh are best-effort persistence — skipped when
 * the cookie was blocked so a stale server render can never fight the
 * live client tree. The query param is stripped from the URL for clean
 * sharing. Renders nothing.
 */
export function ModeSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /* Wait until the shell has adopted the server (cookie) mode — child
     effects run BEFORE the parent's hydrate effect, so reading the
     store on first paint would race against an unhydrated default. */
  const hydrated = useModeTransform((s) => s.hydrated);

  React.useEffect(() => {
    if (!hydrated) return;
    const raw = searchParams.get("mode");
    if (raw !== "dev" && raw !== "client") return;

    const url = new URL(window.location.href);
    url.searchParams.delete("mode");
    window.history.replaceState(null, "", url.pathname + (url.search || ""));

    const { liveMode, setLiveMode } = useModeTransform.getState();
    if (raw !== liveMode) {
      setLiveMode(raw);
      if (setModeCookie(raw)) {
        router.refresh();
      }
      // Next's router state can momentarily restore the ?mode= param
      // during the refresh — strip it again once navigation settles.
      window.setTimeout(() => {
        if (new URLSearchParams(window.location.search).has("mode")) {
          const url = new URL(window.location.href);
          url.searchParams.delete("mode");
          window.history.replaceState(null, "", url.pathname + (url.search || ""));
        }
      }, 400);
    }
    // Intentionally gated on `hydrated` (runs once after adoption) —
    // mode/searchParams identity changes are covered by the early
    // return + replaceState cleanup above.
  }, [hydrated]);

  return null;
}
