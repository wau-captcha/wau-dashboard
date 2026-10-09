import { getStatus } from "@/lib/status";

export const dynamic = "force-dynamic";

/** What /status shows, as JSON for monitors: the same check, at most every 30 seconds. */
export async function GET() {
  return Response.json(await getStatus(), { headers: { "Cache-Control": "no-store" } });
}
