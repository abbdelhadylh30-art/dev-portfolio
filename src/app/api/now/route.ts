import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdminAuthorized, NOINDEX_HEADERS } from "@/lib/admin-auth";
import { nowSection } from "@/lib/now-notes";

export const dynamic = "force-dynamic";

/**
 * Public Now-content payload. Mirrors the in-memory `nowSection` shape
 * from `lib/now-notes.ts`, but with optional `bodyMarkdown` for the
 * admin-edited override (rendered to HTML on the client).
 */
type NowPayload = {
  source: "db" | "fallback";
  blurb: string;
  bodyMarkdown?: string;
  updatedAt: string;
};

type NowRow = {
  id: string;
  body: string;
  blurb: string;
  updatedAt: Date;
};

/**
 * Whether the Prisma client has the `nowContent` model accessor. If not
 * (the case after a schema change until the dev server is restarted),
 * we fall back to raw SQL via `$queryRawUnsafe` — the underlying SQLite
 * DB schema is already up-to-date because `prisma db push` ran.
 */
function hasNowModel(): boolean {
  try {
    return (
      typeof (db as unknown as { nowContent?: unknown }).nowContent !==
      "undefined"
    );
  } catch {
    return false;
  }
}

/**
 * Fetch the active NowContent row. Uses the Prisma model accessor when
 * available, otherwise falls back to raw SQL on the same DB.
 */
async function fetchActiveNow(): Promise<NowRow | null> {
  if (hasNowModel()) {
    return (db as unknown as {
      nowContent: {
        findFirst: (args: {
          where: { active: boolean };
          orderBy: { updatedAt: "desc" };
          select: { id: boolean; body: boolean; blurb: boolean; updatedAt: boolean };
        }) => Promise<NowRow | null>;
      };
    }).nowContent.findFirst({
      where: { active: true },
      orderBy: { updatedAt: "desc" },
      select: { id: true, body: true, blurb: true, updatedAt: true },
    });
  }
  // Raw-SQL fallback. Cast db to a minimal interface so we don't depend
  // on the Prisma type for `$queryRawUnsafe`.
  const rows = await (
    db as unknown as {
      $queryRawUnsafe: <T>(sql: string, ...params: unknown[]) => Promise<T[]>;
    }
  ).$queryRawUnsafe<NowRow>(
    "SELECT id, body, blurb, updatedAt FROM NowContent WHERE active = 1 ORDER BY updatedAt DESC LIMIT 1"
  );
  return rows[0] ?? null;
}

/**
 * Fetch ALL NowContent rows (active + inactive), newest first. Used by
 * the admin dashboard's "History" sub-tab inside the Now tab so the
 * admin can browse + restore previous snapshots.
 */
async function fetchNowHistory(
  limit = 10,
  offset = 0,
): Promise<NowRow[]> {
  const safeLimit = Math.min(Math.max(Math.floor(limit) || 10, 1), 50);
  const safeOffset = Math.max(Math.floor(offset) || 0, 0);
  if (hasNowModel()) {
    return (db as unknown as {
      nowContent: {
        findMany: (args: {
          orderBy: { updatedAt: "desc" };
          select: { id: boolean; body: boolean; blurb: boolean; updatedAt: boolean };
          take: number;
          skip: number;
        }) => Promise<NowRow[]>;
      };
    }).nowContent.findMany({
      orderBy: { updatedAt: "desc" },
      select: { id: true, body: true, blurb: true, updatedAt: true },
      take: safeLimit,
      skip: safeOffset,
    });
  }
  const rows = await (
    db as unknown as {
      $queryRawUnsafe: <T>(sql: string, ...params: unknown[]) => Promise<T[]>;
    }
  ).$queryRawUnsafe<NowRow>(
    "SELECT id, body, blurb, updatedAt FROM NowContent ORDER BY updatedAt DESC LIMIT ? OFFSET ?",
    safeLimit,
    safeOffset
  );
  return rows ?? [];
}

/** Total number of NowContent rows (active + inactive). */
async function countNowRows(): Promise<number> {
  const rows = await (
    db as unknown as {
      $queryRawUnsafe: <T>(sql: string, ...params: unknown[]) => Promise<T[]>;
    }
  ).$queryRawUnsafe<{ total: number }>(
    "SELECT COUNT(*) as total FROM NowContent"
  );
  return Number(rows[0]?.total ?? 0);
}

/**
 * Restore a specific historical Now content snapshot by id. Sets all
 * other rows to inactive, then sets the target row to active = 1.
 * Atomic via a single $transaction.
 */
async function restoreNow(id: string): Promise<NowRow | null> {
  const exec = (
    db as unknown as {
      $executeRawUnsafe: (sql: string, ...params: unknown[]) => Promise<number>;
      $transaction: <T>(fn: Promise<T>[]) => Promise<T[]>;
      $queryRawUnsafe: <T>(sql: string, ...params: unknown[]) => Promise<T[]>;
    }
  );

  if (typeof exec.$transaction === "function") {
    await exec.$transaction([
      exec.$executeRawUnsafe(
        "UPDATE NowContent SET active = 0 WHERE active = 1"
      ),
      exec.$executeRawUnsafe(
        "UPDATE NowContent SET active = 1, updatedAt = ? WHERE id = ?",
        new Date().toISOString(),
        id
      ),
    ]);
  } else {
    await exec.$executeRawUnsafe(
      "UPDATE NowContent SET active = 0 WHERE active = 1"
    );
    await exec.$executeRawUnsafe(
      "UPDATE NowContent SET active = 1, updatedAt = ? WHERE id = ?",
      new Date().toISOString(),
      id
    );
  }

  // Fetch the restored row.
  const rows = await exec.$queryRawUnsafe<NowRow>(
    "SELECT id, body, blurb, updatedAt FROM NowContent WHERE id = ? LIMIT 1",
    id
  );
  return rows[0] ?? null;
}

/**
 * Insert a new active NowContent row and flip any existing active rows
 * to inactive, in a single transaction. Uses raw SQL — works regardless
 * of whether the Prisma client model accessor is available.
 */
async function saveNow(body: string, blurb: string): Promise<NowRow> {
  // We use $executeRawUnsafe for both UPDATE and INSERT so we don't depend
  // on the Prisma model accessor. Wrap them in a transaction for atomicity.
  const exec = (
    db as unknown as {
      $executeRawUnsafe: (sql: string, ...params: unknown[]) => Promise<number>;
      $transaction: <T>(fn: Promise<T>[]) => Promise<T[]>;
    }
  );

  // SQLite doesn't generate ISO timestamps automatically for `updatedAt`,
  // so we provide it explicitly.
  const nowIso = new Date().toISOString();
  const id = `now_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  if (typeof exec.$transaction === "function") {
    await exec.$transaction([
      exec.$executeRawUnsafe(
        "UPDATE NowContent SET active = 0 WHERE active = 1"
      ),
      exec.$executeRawUnsafe(
        "INSERT INTO NowContent (id, body, blurb, updatedAt, active) VALUES (?, ?, ?, ?, 1)",
        id,
        body,
        blurb,
        nowIso
      ),
    ]);
  } else {
    // Fallback: just run them sequentially.
    await exec.$executeRawUnsafe(
      "UPDATE NowContent SET active = 0 WHERE active = 1"
    );
    await exec.$executeRawUnsafe(
      "INSERT INTO NowContent (id, body, blurb, updatedAt, active) VALUES (?, ?, ?, ?, 1)",
      id,
      body,
      blurb,
      nowIso
    );
  }

  return {
    id,
    body,
    blurb,
    updatedAt: new Date(nowIso),
  };
}

/**
 * GET /api/now
 * Public. Returns the most recent `active = true` NowContent row.
 * If no row exists yet, falls back to the bundled `now-notes.ts`
 * payload so the section always has content.
 *
 * With `?history=1` query: admin-only. Returns ALL NowContent rows
 * (active + inactive), newest first, capped at 100. Used by the
 * admin dashboard's "History" sub-tab inside the Now tab.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const wantsHistory = url.searchParams.get("history") === "1";

  if (wantsHistory) {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401, headers: NOINDEX_HEADERS }
      );
    }
    try {
      const limitParam = Number(url.searchParams.get("limit") ?? "10");
      const offsetParam = Number(url.searchParams.get("offset") ?? "0");
      const [rows, total] = await Promise.all([
        fetchNowHistory(limitParam, offsetParam),
        countNowRows(),
      ]);
      const safeLimit = Math.min(Math.max(Math.floor(limitParam) || 10, 1), 50);
      const safeOffset = Math.max(Math.floor(offsetParam) || 0, 0);
      return NextResponse.json({
        ok: true,
        count: rows.length,
        total,
        hasMore: safeOffset + rows.length < total,
        nextOffset: safeOffset + rows.length,
        history: rows.map((r) => ({
          id: r.id,
          body: r.body,
          blurb: r.blurb,
          updatedAt:
            r.updatedAt instanceof Date
              ? r.updatedAt.toISOString()
              : new Date(r.updatedAt).toISOString(),
        })),
      }, { headers: NOINDEX_HEADERS });
    } catch (err) {
      console.error("[api/now] history fetch failed", err);
      return NextResponse.json(
        { ok: false, error: "Could not fetch history" },
        { status: 500, headers: NOINDEX_HEADERS }
      );
    }
  }

  try {
    const row = await fetchActiveNow();

    if (!row) {
      const fallback: NowPayload = {
        source: "fallback",
        blurb: nowSection.blurb,
        updatedAt: nowSection.updatedAt,
      };
      return NextResponse.json({ ok: true, ...fallback });
    }

    const payload: NowPayload = {
      source: "db",
      blurb: row.blurb || nowSection.blurb,
      bodyMarkdown: row.body,
      updatedAt:
        row.updatedAt instanceof Date
          ? row.updatedAt.toISOString()
          : new Date(row.updatedAt).toISOString(),
    };
    return NextResponse.json({ ok: true, ...payload });
  } catch (err) {
    console.error("[api/now] fetch failed", err);
    const fallback: NowPayload = {
      source: "fallback",
      blurb: nowSection.blurb,
      updatedAt: nowSection.updatedAt,
    };
    return NextResponse.json({ ok: true, ...fallback });
  }
}

const NowRestoreSchema = z.object({
  id: z.string().trim().min(8).max(80),
});

/**
 * PATCH /api/now
 * Admin-only. Restores a historical Now content snapshot by id. Sets
 * all other rows to `active = false`, sets the target row to
 * `active = true` with a fresh `updatedAt`. Atomic via $transaction.
 *
 * Request body: `{ id: string }`
 */
export async function PATCH(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: NOINDEX_HEADERS }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400, headers: NOINDEX_HEADERS }
    );
  }

  const parsed = NowRestoreSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 422, headers: NOINDEX_HEADERS }
    );
  }

  try {
    const restored = await restoreNow(parsed.data.id);
    if (!restored) {
      return NextResponse.json(
        { ok: false, error: "Snapshot not found" },
        { status: 404, headers: NOINDEX_HEADERS }
      );
    }
    return NextResponse.json({
      ok: true,
      source: "db",
      blurb: restored.blurb || nowSection.blurb,
      bodyMarkdown: restored.body,
      updatedAt:
        restored.updatedAt instanceof Date
          ? restored.updatedAt.toISOString()
          : new Date(restored.updatedAt).toISOString(),
    }, { headers: NOINDEX_HEADERS });
  } catch (err) {
    console.error("[api/now] restore failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not restore snapshot" },
      { status: 500, headers: NOINDEX_HEADERS }
    );
  }
}

const NowDeleteSchema = z.object({
  id: z.string().trim().min(8).max(80),
});

/**
 * DELETE /api/now
 * Admin-only. Permanently deletes a historical Now content snapshot by
 * id. Refuses to delete the row that is currently `active = true`
 * (status 409) — the live snapshot must be replaced (via POST/PATCH),
 * not removed, so the public section always has content.
 *
 * Request body: `{ id: string }`
 */
export async function DELETE(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: NOINDEX_HEADERS }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400, headers: NOINDEX_HEADERS }
    );
  }

  const parsed = NowDeleteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 422, headers: NOINDEX_HEADERS }
    );
  }

  try {
    const exec = (
      db as unknown as {
        $queryRawUnsafe: <T>(sql: string, ...params: unknown[]) => Promise<T[]>;
        $executeRawUnsafe: (sql: string, ...params: unknown[]) => Promise<number>;
      }
    );

    // Look up the target row first so we can refuse to delete the
    // active snapshot (the public section must always render content).
    // NOTE: `$queryRawUnsafe` returns SQLite booleans as JS booleans
    // (`true`/`false`), not numbers — check both to be safe.
    const rows = await exec.$queryRawUnsafe<{
      id: string;
      active: number | boolean;
    }>("SELECT id, active FROM NowContent WHERE id = ? LIMIT 1", parsed.data.id);

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Snapshot not found" },
        { status: 404, headers: NOINDEX_HEADERS }
      );
    }
    if (rows[0].active === 1 || rows[0].active === true) {
      return NextResponse.json(
        {
          ok: false,
          error: "Cannot delete the live snapshot — save or restore another version first.",
        },
        { status: 409, headers: NOINDEX_HEADERS }
      );
    }

    const deleted = await exec.$executeRawUnsafe(
      "DELETE FROM NowContent WHERE id = ?",
      parsed.data.id
    );

    return NextResponse.json(
      { ok: true, deleted, id: parsed.data.id },
      { headers: NOINDEX_HEADERS }
    );
  } catch (err) {
    console.error("[api/now] delete failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not delete snapshot" },
      { status: 500, headers: NOINDEX_HEADERS }
    );
  }
}

const NowSaveSchema = z.object({
  body: z.string().trim().max(20_000),
  blurb: z.string().trim().max(280).optional().or(z.literal("")),
});

/**
 * POST /api/now
 * Admin-only. Saves a new Now content snapshot. The previous active row
 * is flipped to `active = false` in the same transaction so we
 * keep a clean history but only ever render one row publicly.
 *
 * Request body: `{ body: string, blurb?: string }`
 */
export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: NOINDEX_HEADERS }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400, headers: NOINDEX_HEADERS }
    );
  }

  const parsed = NowSaveSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 422, headers: NOINDEX_HEADERS }
    );
  }

  try {
    const created = await saveNow(parsed.data.body, parsed.data.blurb ?? "");

    return NextResponse.json(
      {
        ok: true,
        source: "db",
        blurb: created.blurb || nowSection.blurb,
        bodyMarkdown: created.body,
        updatedAt:
          created.updatedAt instanceof Date
            ? created.updatedAt.toISOString()
            : new Date(created.updatedAt).toISOString(),
      },
      { status: 201, headers: NOINDEX_HEADERS }
    );
  } catch (err) {
    console.error("[api/now] save failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not save Now content" },
      { status: 500, headers: NOINDEX_HEADERS }
    );
  }
}
