"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie } from "@/lib/session";

/** Signs out of the admin console only; a dashboard session in the same browser is kept. */
export async function adminLogoutAction() {
  await clearSessionCookie("admin");
  redirect("/admin/login");
}
