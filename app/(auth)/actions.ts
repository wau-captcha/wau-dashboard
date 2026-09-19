"use server";

import { refresh } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { signInWithGoogle } from "@/lib/api/auth";
import { toApiFailure } from "@/lib/api/errors";
import { formFailure, type FormFeedback } from "@/lib/form-message";
import { setSessionCookie } from "@/lib/session";
import { GOOGLE_NONCE_COOKIE, GOOGLE_NONCE_HEADER } from "@/lib/session-cookie";

export type GoogleSignInInput = {
  /** ID token from Google Identity Services. */
  credential: string;
  /** Where to go once signed in. */
  next?: string;
};

/** Only same-site paths are accepted, so the link cannot bounce users elsewhere. */
function safeNext(value: unknown): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/overview";
}

export async function googleSignInAction(_previous: FormFeedback, input: GoogleSignInInput): Promise<FormFeedback> {
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
    const reply = await signInWithGoogle({ idToken: credential, nonce });
    await setSessionCookie(reply.access_token, reply.expires_in);
  } catch (error) {
    // Re-render too, so the button picks up the nonce this browser holds now.
    refresh();
    return formFailure(toApiFailure(error));
  }
  // A nonce is good for one sign-in.
  store.delete({ name: GOOGLE_NONCE_COOKIE, path: "/" });
  // redirect throws, so it must run outside the try block.
  redirect(safeNext(input?.next));
}
