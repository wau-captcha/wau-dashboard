import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { getMe } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/lib/api/types";
import { getSessionToken } from "@/lib/session";

/**
 * The signed-in user, verified against the API on every render. Cached per
 * request so a layout and its pages share one call.
 */
export const getCurrentUser = cache(async (): Promise<User> => {
  const user = await getOptionalUser();
  if (!user) redirect("/login");
  return user;
});

/** Null when there is no session, or the stored token is no longer accepted. */
export async function getOptionalUser(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await getMe();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}
