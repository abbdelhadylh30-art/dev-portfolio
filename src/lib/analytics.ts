"use client";

/**
 * Tiny client-side analytics helper.
 *
 * Posts events to `/api/events` using `navigator.sendBeacon` when available
 * (so events still flush on tab close / navigation), falling back to
 * `fetch(..., { keepalive: true })`. Includes a per-type throttle so we
 * don't double-fire on rapid re-renders or Fast Refresh remounts.
 */

export type AnalyticsEventType =
  | "project_card_click"
  | "project_modal_open"
  | "project_share"
  | "project_live_click"
  | "project_repo_click"
  | "palette_open"
  | "shortcuts_open"
  | "theme_toggle"
  | "filter_select"
  | "contact_submit"
  | "admin_open"
  | "whatsapp_click"
  | "contact_copy_email"
  | "contact_call"
  | "rail_click"
  | "modal_nav"
  | "shipped_click"
  | "mode_switch"
  | "faq_open"
  | "service_click"
  | "result_card_click";

const THROTTLE_MS = 1000;
const lastSent = new Map<string, number>();

/**
 * Track a single event. Fire-and-forget; failures are swallowed
 * (analytics must never break the user experience).
 */
export function trackEvent(
  type: AnalyticsEventType,
  meta: { slug?: string; label?: string } = {}
): void {
  if (typeof window === "undefined") return;

  // Throttle: 1 event per `THROTTLE_MS` per (type + slug).
  const key = `${type}:${meta.slug ?? ""}`;
  const now = Date.now();
  const last = lastSent.get(key) ?? 0;
  if (now - last < THROTTLE_MS) return;
  lastSent.set(key, now);

  const body = JSON.stringify({
    type,
    slug: meta.slug ?? "",
    label: meta.label ?? "",
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/events", blob);
      if (ok) return;
    }
  } catch {
    // fall through to fetch
  }

  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // analytics must never break the page
  }
}
