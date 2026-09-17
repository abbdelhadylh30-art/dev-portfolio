import { copyFileSync, existsSync, renameSync } from "fs";
import path from "path";

/* ── serverless SQLite seed (Vercel): copy the bundled db to the DATABASE_URL
   target before the first PrismaClient opens it. The lambda filesystem is
   read-only except /tmp; the seed db travels inside the function bundle via
   outputFileTracingIncludes (next.config.ts). Atomic staging+rename is safe
   under the concurrent cold-start requests a lambda can receive. */
if (process.env.VERCEL && process.env.DATABASE_URL?.startsWith("file:")) {
  try {
    const target = process.env.DATABASE_URL.slice("file:".length);
    if (!existsSync(target)) {
      const source = path.join(process.cwd(), "db", "custom.db");
      const staging = `${target}.${process.pid}.${Date.now()}.tmp`;
      copyFileSync(source, staging);
      renameSync(staging, target);
    }
  } catch (e) {
    console.error("[db] serverless seed copy failed", e);
  }
}

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Returns a Prisma client, re-creating it if the cached instance is stale
 * (i.e. missing a model that was added since the cache was populated —
 * happens when `prisma db push` regenerates the client but the dev server
 * still holds the old singleton).
 *
 * As a belt-and-suspenders fallback for the Turbopack dev-server scenario
 * (where the @prisma/client ESM module is cached separately from the
 * Node `require` cache), this also invalidates any matching `require.cache`
 * entries so a fresh PrismaClient picks up the regenerated runtime spec.
 */
function getClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (
    cached &&
    typeof (cached as unknown as { event?: unknown }).event !== "undefined" &&
    typeof (cached as unknown as { nowContent?: unknown }).nowContent !== "undefined"
  ) {
    return cached;
  }
  // Invalidate the require cache for @prisma/client + .prisma/client so a
  // freshly constructed PrismaClient picks up the regenerated runtime spec.
  // This is best-effort — under Turbopack the ESM module graph is cached
  // separately, but the underlying @prisma/client (which uses CJS) will
  // pick this up.
  try {
    for (const key of Object.keys(require.cache)) {
      if (key.includes('@prisma/client') || key.includes('.prisma/client')) {
        delete require.cache[key];
      }
    }
  } catch {
    // require.cache may not exist in some bundler contexts — ignore.
  }
  const fresh = new PrismaClient({
    // Query logging is great locally but noisy (and slow) in serverless
    // production — only log errors there.
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  });
  globalForPrisma.prisma = fresh;
  return fresh;
}

export const db = getClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
