"use client";

/**
 * Tiny client-side analytics helper.
 *
 * Posts events to `/api/events` using `navigator.sendBeacon` when available
 * (so events still flush on tab close / navigation), falling back to
 * `fetch(..., { keepalive: true })`. Includes a per-type throttle so we
 * don't double-fire on rapid re-renders or Fast Refresh remounts.
 *
 * Every event is ALSO mirrored onto `window.dataLayer` so Google Tag
 * Manager (loaded in app/layout.tsx) can forward it to GA4 — triggers in
 * the GTM container match on the `event` key. Pushing is harmless when
 * GTM isn't loaded (it's just an array), so no gating is needed.
 */

declare global {
  interface Window {
    /** Google Tag Manager data layer — initialised by the GTM loader
     *  snippet in app/layout.tsx; trackEvent() pushes onto it. */
    dataLayer?: Record<string, unknown>[];
  }
}

export type AnalyticsEventType =
  | "page_nav"
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

  /* Mirror onto the GTM dataLayer — see the file-level doc. */
  try {
    const dataLayer = (window.dataLayer = window.dataLayer ?? []);
    const entry: Record<string, unknown> = {
      event: type,
      event_slug: meta.slug ?? "",
      event_label: meta.label ?? "",
    };
    if (type === "page_nav") {
      /* Virtual pageview — the site is a single `/` route with a hash
         micro-router, so GA4 would only ever record "/" without this.
         applyNavigation() updates location.hash BEFORE calling
         trackEvent, so href already carries the destination `#/slug`. */
      entry.page_location = window.location.href;
      entry.page_title = meta.label ?? "";
    }
    dataLayer.push(entry);
  } catch {
    // analytics must never break the page
  }

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
