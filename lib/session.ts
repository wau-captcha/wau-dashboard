import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./session-cookie";

export { SESSION_COOKIE };

/** The access token of the current visitor, if they have one. */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/**
 * Stores the access token. httpOnly keeps it away from page scripts, so the
 * token only ever travels between this server and the gateway.
 * Only callable from a Server Action or a Route Handler.
 */
export async function setSessionCookie(token: string, expiresInSeconds: number) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + expiresInSeconds * 1000),
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
