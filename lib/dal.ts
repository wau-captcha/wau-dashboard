import "server-only";

import { cache } from "react";
import { getAdmin } from "@/lib/api/admin";
import { getMe } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { Admin, User } from "@/lib/api/types";
import { endAdminSession, endSession, getSessionToken } from "@/lib/session";

/**
 * The signed-in user, verified against the API on every render. Cached per
 * request so a layout and its pages share one call.
 */
export const getCurrentUser = cache(async (): Promise<User> => {
  const token = await getSessionToken();
  if (!token) return endSession();
  try {
    // Passed explicitly so a rejection comes back here instead of redirecting.
    return await getMe(token);
  } catch (error) {
    if (isBanned(error)) return endSession("banned");
    if (isRejected(error)) return endSession();
    throw error;
  }
});

/** Null when there is no session, or the stored token is no longer accepted. */
export async function getOptionalUser(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await getMe(token);
  } catch (error) {
    if (isRejected(error) || isBanned(error)) return null;
    throw error;
  }
}

/** The signed-in administrator, checked like getCurrentUser. The user session plays no part. */
export const getCurrentAdmin = cache(async (): Promise<Admin> => {
  const token = await getSessionToken("admin");
  if (!token) return endAdminSession();
  try {
    return await getAdmin(token);
  } catch (error) {
    if (isRejected(error)) return endAdminSession();
    throw error;
  }
});

/** Null when there is no administrator session, or its token is no longer accepted. */
export async function getOptionalAdmin(): Promise<Admin | null> {
  const token = await getSessionToken("admin");
  if (!token) return null;
  try {
    return await getAdmin(token);
  } catch (error) {
    if (isRejected(error)) return null;
    throw error;
  }
}

function isRejected(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

function isBanned(error: unknown): boolean {
  return error instanceof ApiError && error.reason === "ACCOUNT_BANNED";
}
