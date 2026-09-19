import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/dal";
import { clearSessionCookie } from "@/lib/session";

/**
 * Signs out a browser whose token wau-services rejects, e.g. because the account no longer
 * exists. Pages cannot delete cookies, so the data layer sends such visitors here.
 * A session that still works is kept, so a link here cannot sign anyone out.
 */
export async function GET() {
  // undefined: wau-services failed, so the token was not rejected and is kept.
  const user = await getOptionalUser().catch(() => undefined);
  if (user === null) await clearSessionCookie();
  redirect(user ? "/overview" : "/login");
}
