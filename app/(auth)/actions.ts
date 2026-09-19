"use server";

import { refresh } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { signInAdminWithGoogle, signInWithGoogle } from "@/lib/api/auth";
import { toApiFailure } from "@/lib/api/errors";
import { formFailure, type FormFeedback } from "@/lib/form-message";
import { setSessionCookie, type SessionKind } from "@/lib/session";
import { ADMIN_PATH, GOOGLE_NONCE_COOKIE, GOOGLE_NONCE_HEADER } from "@/lib/session-cookie";

export type GoogleSignInInput = {
  /** ID token from Google Identity Services. */
  credential: string;
  /** Where to go once signed in. */
  next?: string;
};

/** Only same-site paths are accepted, so the link cannot bounce users elsewhere. */
function safeNext(value: unknown, home: string): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : home;
}

type Exchange = (input: { idToken: string; nonce: string }) => Promise<{ access_token: string; expires_in: number }>;

/** Signs a dashboard user in; the first sign-in of a Google account creates its account. */
export async function googleSignInAction(_previous: FormFeedback, input: GoogleSignInInput): Promise<FormFeedback> {
  return signIn(input, signInWithGoogle, "user", "/overview");
}

/**
 * Signs an administrator in to the admin console, apart from any dashboard session. Only a
 * Google account whose email is in the admins table gets through.
 */
export async function adminGoogleSignInAction(_previous: FormFeedback, input: GoogleSignInInput): Promise<FormFeedback> {
  return signIn(input, signInAdminWithGoogle, "admin", ADMIN_PATH);
}

async function signIn(input: GoogleSignInInput, exchange: Exchange, kind: SessionKind, home: string): Promise<FormFeedback> {
  const [store, requestHeaders] = await Promise.all([cookies(), headers()]);
  // The proxy only issues a nonce when the browser had none, so the page's nonce has expired.
  const nonce = requestHeaders.has(GOOGLE_NONCE_HEADER) ? undefined : store.get(GOOGLE_NONCE_COOKIE)?.value;
  if (!nonce) {
    // The page outlived its nonce; the proxy issued a new one, so re-render with it.
    refresh();
    return { error: { kind: "googleSessionExpired" } };
  }

  try {
    const credential = typeof input?.credential === "string" ? input.credential : "";
    const reply = await exchange({ idToken: credential, nonce });
    await setSessionCookie(reply.access_token, reply.expires_in, kind);
  } catch (error) {
    // Re-render too, so the button picks up the nonce this browser holds now.
    refresh();
    return formFailure(toApiFailure(error));
  }
  // A nonce is good for one sign-in.
  store.delete({ name: GOOGLE_NONCE_COOKIE, path: "/" });
  // redirect throws, so it must run outside the try block.
  redirect(safeNext(input?.next, home));
}
