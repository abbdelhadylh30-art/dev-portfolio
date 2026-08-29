import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isAdminAuthorized, NOINDEX_HEADERS } from "@/lib/admin-auth";
import { projects } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

/**
 * Allowed event types — a closed enum keeps the analytics surface clean
 * and prevents abuse from arbitrary string submissions.
 */
const ALLOWED_TYPES = [
  "project_card_click",
  "project_modal_open",
  "modal_nav",
  "project_share",
  "project_live_click",
  "project_repo_click",
  "palette_open",
  "shortcuts_open",
  "rail_click",
  "theme_toggle",
  "filter_select",
  "contact_submit",
  "contact_copy_email",
  "admin_open",
  "shipped_click",
  "whatsapp_click",
  "contact_call",
  "mode_switch",
  "faq_open",
  "service_click",
  "result_card_click",
] as const;
const TypeSchema = z.enum(ALLOWED_TYPES);

const EventSchema = z.object({
  type: TypeSchema,
  slug: z.string().trim().max(80).optional().or(z.literal("")),
  label: z.string().trim().max(160).optional().or(z.literal("")),
});

/**
 * POST /api/events
 * Records a single analytics event. Rate-limited at 30 req / 60s per IP
 * (separate bucket from the contact form's 3/60s) to allow legitimate
 * usage tracking without enabling spam.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, { max: 30, windowMs: 60_000, scope: "events" });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many events. Slow down." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfter) },
      }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = EventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid event", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const event = await db.event.create({
      data: {
        type: parsed.data.type,
        slug: parsed.data.slug ?? "",
        label: parsed.data.label ?? "",
        ip,
      },
      select: { id: true, createdAt: true },
    });
    return NextResponse.json(
      { ok: true, id: event.id, createdAt: event.createdAt },
      { status: 201 }
    );
  } catch (err) {
    // Analytics is non-critical: on deployments without a writable database
    // (e.g. Vercel serverless) accept-and-drop rather than surface errors to
    // the visitor. Keeps every tracked interaction "free" client-side.
    console.error("[api/events] failed to persist event (dropped)", err);
    return NextResponse.json(
      { ok: true, dropped: true },
      { status: 201 }
    );
  }
}

type AggRow = { type: string; count: number };
type SlugRow = { slug: string; count: number };
// Unused here — retained for future Prisma groupBy use if the API stabilises.
export type { AggRow, SlugRow };

/**
 * GET /api/events
 * Admin-only. Returns aggregate analytics:
 *  - total events
 *  - events in the last 24h (and previous 24h for delta)
 *  - top event types (count by type)
 *  - top project slugs (count by slug, excluding empty slug)
 *  - recent events (last 20, newest first)
 *  - series: last-7-day per-type buckets for sparkline rendering.
 *    Shape: `{ labels: ["6d","5d","4d","3d","2d","1d","today"], types: { type: number[7] } }`
 */
export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: NOINDEX_HEADERS }
    );
  }

  const now = Date.now();
  const last24Start = new Date(now - 24 * 60 * 60 * 1000);
  const prev24Start = new Date(now - 48 * 60 * 60 * 1000);
  // 7-day window for the sparkline series. Each bucket is a calendar day
  // aligned to the local day boundary (so "today" always means
  // "since midnight" and the chart reads naturally).
  const dayMs = 24 * 60 * 60 * 1000;
  const seriesStart = new Date(now - 6 * dayMs);
  // Align seriesStart to the start of its day in local time so the
  // buckets are calendar-day aligned.
  seriesStart.setHours(0, 0, 0, 0);

  // Fetch a bounded slice of recent events + counts for the time windows.
  // We aggregate `byType` and `bySlug` in JS to avoid Prisma version-specific
  // groupBy quirks — the dataset is small enough that this is plenty fast.
  let total: number, last24: number, prev24: number,
    recentRaw: { id: string; type: string; slug: string; label: string; createdAt: Date }[],
    allRecent: { type: string; slug: string; createdAt: Date }[],
    seriesRaw: { type: string; createdAt: Date }[];
  try {
    [total, last24, prev24, recentRaw, allRecent, seriesRaw] = await Promise.all([
      db.event.count(),
      db.event.count({ where: { createdAt: { gte: last24Start } } }),
      db.event.count({
        where: {
          AND: [
            { createdAt: { gte: prev24Start } },
            { createdAt: { lt: last24Start } },
          ],
        },
      }),
      db.event.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          type: true,
          slug: true,
          label: true,
          createdAt: true,
        },
      }),
      db.event.findMany({
        orderBy: { createdAt: "desc" },
        take: 5000,
        select: { type: true, slug: true, createdAt: true },
      }),
      db.event.findMany({
        where: { createdAt: { gte: seriesStart } },
        orderBy: { createdAt: "asc" },
        take: 5000,
        select: { type: true, createdAt: true },
      }),
    ]);
  } catch (err) {
    // No database behind this deployment (e.g. Vercel serverless) — return
    // an explicit, descriptive error instead of an unhandled 500.
    console.error("[api/events] aggregation failed", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Analytics storage is unavailable on this deployment (no database connected).",
      },
      { status: 503, headers: NOINDEX_HEADERS }
    );
  }

  // Aggregate top event types + top project slugs in JS. The slug list is
  // defensively filtered to known project slugs so no client-supplied
  // junk (or future non-project slugs) can pollute the "top projects"
  // ranking.
  const knownSlugs = new Set(projects.map((p) => p.slug));
  const typeMap = new Map<string, number>();
  const slugMap = new Map<string, number>();
  for (const e of allRecent) {
    typeMap.set(e.type, (typeMap.get(e.type) ?? 0) + 1);
    if (e.slug && knownSlugs.has(e.slug)) {
      slugMap.set(e.slug, (slugMap.get(e.slug) ?? 0) + 1);
    }
  }
  const topTypes = [...typeMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([type, count]) => ({ type, count }));
  const topSlugs = [...slugMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([slug, count]) => ({ slug, count }));

  // 7-day per-type buckets. Build a 7-element array for every type seen in
  // the series window. Day 0 = 6 days ago, day 6 = today.
  const seriesBuckets: Record<string, number[]> = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayZeroMs = today.getTime();
  for (const e of seriesRaw) {
    const d = new Date(e.createdAt);
    d.setHours(0, 0, 0, 0);
    const idx = Math.floor((d.getTime() - dayZeroMs) / dayMs);
    if (idx < 0 || idx > 6) continue;
    if (!seriesBuckets[e.type]) {
      seriesBuckets[e.type] = [0, 0, 0, 0, 0, 0, 0];
    }
    seriesBuckets[e.type][idx] += 1;
  }
  // Only emit series for the top-6 types by total volume to keep the Stats
  // tab sparklines visually tight.
  const seriesTypes = topTypes.slice(0, 6).map((t) => t.type);
  const series = {
    labels: ["6d", "5d", "4d", "3d", "2d", "1d", "today"],
    types: seriesTypes.reduce<Record<string, number[]>>((acc, t) => {
      acc[t] = seriesBuckets[t] ?? [0, 0, 0, 0, 0, 0, 0];
      return acc;
    }, {}),
  };

  return NextResponse.json({
    ok: true,
    total,
    last24,
    prev24,
    delta24: last24 - prev24,
    topTypes,
    topSlugs,
    recent: recentRaw,
    series,
  }, { headers: NOINDEX_HEADERS });
}
