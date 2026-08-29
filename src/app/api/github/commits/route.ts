import { NextRequest, NextResponse } from "next/server";
import { getRecentCommits } from "@/lib/github-stats";
import { projects } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";
export const revalidate = 600;

/**
 * GET /api/github/commits?take=9
 * Public. Returns the most recent commit per known repo (merged, newest
 * first) for the "Recently shipped" strip on the homepage.
 *
 * `take` is clamped to [1, projects.length] (default 6). The server always
 * fetches the latest commit for every repo (with ETag conditional requests
 * so 304s are free), so asking for all 9 costs nothing extra — the UI uses
 * `take=9` so the per-repo filter chips have the full picture.
 *
 * Response: `{ commits: RepoCommit[], fetchedAt, source }` — the UI hides
 * the strip gracefully when `commits` is empty (e.g. GitHub unreachable).
 */
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("take");
  let take = 6;
  if (raw !== null) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed)) {
      take = Math.min(Math.max(parsed, 1), projects.length);
    }
  }
  const data = await getRecentCommits(take);
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
    },
  });
}
