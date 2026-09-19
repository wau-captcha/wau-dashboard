import "server-only";

import { cookies, headers } from "next/headers";
import { GOOGLE_NONCE_COOKIE, GOOGLE_NONCE_HEADER } from "./session-cookie";

/** OAuth client ID for Google sign-in, read per request so it can change without a rebuild. */
export function getGoogleClientId(): string {
  return process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
}

/** The nonce for this browser: freshly issued by the proxy, or the one already in its cookie. */
export async function getGoogleNonce(): Promise<string> {
  const [requestHeaders, store] = await Promise.all([headers(), cookies()]);
  return requestHeaders.get(GOOGLE_NONCE_HEADER) || store.get(GOOGLE_NONCE_COOKIE)?.value || "";
}
