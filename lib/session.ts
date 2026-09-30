import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_PATH, ADMIN_SESSION_COOKIE, SESSION_COOKIE } from "./session-cookie";

export { SESSION_COOKIE };

/**
 * Dashboard users and administrators sign in apart and hold separate sessions. The admin
 * cookie is only sent to the admin console.
 */
export type SessionKind = "user" | "admin";

const sessionCookies = {
  user: { name: SESSION_COOKIE, path: "/" },
  admin: { name: ADMIN_SESSION_COOKIE, path: ADMIN_PATH },
} as const;

/** The access token of the current visitor, if they have one. */
export async function getSessionToken(kind: SessionKind = "user"): Promise<string | null> {
  const store = await cookies();
  return store.get(sessionCookies[kind].name)?.value ?? null;
}

/**
 * Stores the access token. httpOnly keeps it away from page scripts, so the
 * token only ever travels between this server and wau-services (tenant, billing).
 * Only callable from a Server Action or a Route Handler.
 */
export async function setSessionCookie(token: string, expiresInSeconds: number, kind: SessionKind = "user") {
  const store = await cookies();
  const { name, path } = sessionCookies[kind];
  store.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path,
    expires: new Date(Date.now() + expiresInSeconds * 1000),
  });
}

export async function clearSessionCookie(kind: SessionKind = "user") {
  const store = await cookies();
  store.delete(sessionCookies[kind]);
}

/** Why a session was ended, shown on the login page. */
export type SessionEndReason = "banned";

/**
 * Signs the browser out because wau-services no longer accepts its session, e.g. the account
 * was deleted or banned. Server Functions drop the cookie right away; a page render cannot
 * change cookies (that throws), so it goes through the /session-expired route handler instead.
 */
export async function endSession(reason?: SessionEndReason): Promise<never> {
  const query = reason ? `?reason=${reason}` : "";
  try {
    await clearSessionCookie();
  } catch {
    redirect(`/session-expired${query}`);
  }
  redirect(`/login${query}`);
}

/** endSession for the admin console: the administrator was removed, or the token expired. */
export async function endAdminSession(): Promise<never> {
  try {
    await clearSessionCookie("admin");
  } catch {
    redirect(`${ADMIN_PATH}/session-expired`);
  }
  redirect(`${ADMIN_PATH}/login`);
}
