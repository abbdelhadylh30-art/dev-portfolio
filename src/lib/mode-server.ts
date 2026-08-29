import { cookies } from "next/headers";
import { MODE_COOKIE, type PortfolioMode } from "@/lib/mode";

/**
 * Server-only mode reader — reads the cookie inside RSC so `page.tsx`
 * can render the correct tree (Business vs Developer view) on the server.
 */
export async function getMode(): Promise<PortfolioMode> {
  const store = await cookies();
  return store.get(MODE_COOKIE)?.value === "dev" ? "dev" : "client";
}
