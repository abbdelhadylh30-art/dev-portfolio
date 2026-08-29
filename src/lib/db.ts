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
