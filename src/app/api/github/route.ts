import { NextResponse } from "next/server";
import { getCachedGitHubStats } from "@/lib/github-stats";

export const dynamic = "force-dynamic";
export const revalidate = 600;

export async function GET() {
  const stats = await getCachedGitHubStats();
  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
    },
  });
}
