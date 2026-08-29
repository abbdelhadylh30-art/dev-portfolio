/**
 * Tiny in-memory sliding-window rate limiter, keyed by IP (or scope+IP).
 *
 * Defaults: 3 submissions per IP per 60s (the contact-form bucket). Pass an
 * `opts.scope` + `opts.max` + `opts.windowMs` to use a separate bucket —
 * e.g. the analytics events endpoint uses `scope: "events"`, `max: 30`.
 *
 * State lives in process memory — fine for a single-server deployment. For
 * multi-instance prod, swap this for Redis or an edge rate-limit provider.
 */

const DEFAULT_LIMIT = 3;
const DEFAULT_WINDOW_MS = 60_000;
const MAX_IPS_TRACKED = 10_000;

type RateLimitConfig = {
  /** Override the per-IP request count allowed in the window. */
  max?: number;
  /** Override the sliding window length (ms). */
  windowMs?: number;
  /** Separate bucket namespace — different scopes get independent maps. */
  scope?: string;
};

/** Map of `scope` -> `ip -> timestamps`. */
const buckets = new Map<string, Map<string, number[]>>();
const DEFAULT_SCOPE = "contact";

type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

function getBucket(scope: string): Map<string, number[]> {
  let m = buckets.get(scope);
  if (!m) {
    m = new Map();
    buckets.set(scope, m);
  }
  return m;
}

export function rateLimit(
  ip: string,
  opts: RateLimitConfig = {}
): RateLimitResult {
  const now = Date.now();
  const limit = opts.max ?? DEFAULT_LIMIT;
  const windowMs = opts.windowMs ?? DEFAULT_WINDOW_MS;
  const scope = opts.scope ?? DEFAULT_SCOPE;

  const hits = getBucket(scope);

  // Bound the map size to avoid unbounded growth from spoofed IPs.
  if (hits.size > MAX_IPS_TRACKED) {
    hits.clear();
  }

  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);

  if (arr.length >= limit) {
    const oldest = Math.min(...arr);
    const retryAfter = Math.max(
      1,
      Math.ceil((windowMs - (now - oldest)) / 1000)
    );
    hits.set(ip, arr);
    return { ok: false, retryAfter };
  }

  arr.push(now);
  hits.set(ip, arr);
  return { ok: true };
}

/** Best-effort client IP extraction from common proxy headers. */
export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
