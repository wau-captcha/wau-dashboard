"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie } from "@/lib/session";

/** Signing out drops the cookie; the token itself stays valid until it expires. */
export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
