"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setModeCookie, type PortfolioMode } from "@/lib/mode";

/**
 * Deep-link support for the view mode: `/` (or any path) with `?mode=dev`
 * switches the cookie to `dev` and refreshes so the server tree matches.
 * The query param is then stripped from the URL for clean sharing.
 * Renders nothing.
 */
export function ModeSync({ mode }: { mode: PortfolioMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const raw = searchParams.get("mode");
    if (raw !== "dev" && raw !== "client") return;

    const url = new URL(window.location.href);
    url.searchParams.delete("mode");
    window.history.replaceState(null, "", url.pathname + (url.search || ""));

    if (raw !== mode) {
      setModeCookie(raw);
      router.refresh();
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
    // Intentionally runs once on mount — mode/searchParams identity changes
    // are covered by the early return + replaceState cleanup above.
  }, []);

  return null;
}
