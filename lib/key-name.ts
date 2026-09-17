import type { ApiKey } from "@/lib/api/types";

/** Keys created before names existed have none; fall back to the start of the site key. */
export function keyDisplayName(key: Pick<ApiKey, "name" | "site_key">): string {
  return key.name || `${key.site_key.slice(0, 14)}…`;
}
