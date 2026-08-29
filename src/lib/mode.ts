/**
 * Portfolio viewing mode — shared (client-safe) primitives.
 *
 * `client` — the default "Business view": a clean, outcome-focused page for
 *            business owners and non-technical visitors.
 * `dev`    — the full technical portfolio (repos, skills, commit feeds…).
 *
 * Stored in a cookie so the correct tree is rendered on the server with
 * zero flash-of-wrong-mode; toggling writes the cookie and calls
 * `router.refresh()`. Deep links (`?mode=dev`) are handled by ModeSync.
 *
 * (Server-only helpers live in `mode-server.ts` — importing next/headers
 * here would poison client bundles.)
 */
export type PortfolioMode = "client" | "dev";

export const MODE_COOKIE = "ag-mode";

/** Client-side cookie writer shared by the toggle and the deep-link sync.
 *  Returns whether the write verifiably took — sandboxed iframes (preview
 *  panels) can silently block cookie writes, and callers should only
 *  `router.refresh()` when the server will actually see the new mode. */
export function setModeCookie(mode: PortfolioMode): boolean {
  if (typeof document === "undefined") return false;
  document.cookie = `${MODE_COOKIE}=${mode}; path=/; max-age=31536000; samesite=lax`;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${MODE_COOKIE}=${mode}`));
}
