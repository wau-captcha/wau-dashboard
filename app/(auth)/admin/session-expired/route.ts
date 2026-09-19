import { redirect } from "next/navigation";
import { getOptionalAdmin } from "@/lib/dal";
import { clearSessionCookie } from "@/lib/session";

/**
 * Signs out of the admin console a browser whose administrator token wau-services rejects,
 * e.g. because the administrator was removed. A session that still works is kept.
 */
export async function GET() {
  // undefined: wau-services failed, so the token was not rejected and is kept.
  const admin = await getOptionalAdmin().catch(() => undefined);
  if (admin === null) await clearSessionCookie("admin");
  redirect(admin ? "/admin" : "/admin/login");
}
