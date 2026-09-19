import "server-only";

import { apiFetch } from "./client";
import type { AdminAuthReply, AuthReply, User } from "./types";

/** Exchanges a Google ID token for a session; the account is created on first sign-in. */
export function signInWithGoogle(input: { idToken: string; nonce: string }) {
  return apiFetch<AuthReply>("/v1/auth/google", {
    method: "POST",
    body: { id_token: input.idToken, nonce: input.nonce },
    auth: false,
  });
}

/**
 * Exchanges a Google ID token for an administrator session. Only a Google account whose email
 * is in the admins table gets one; a dashboard account with that email plays no part.
 */
export function signInAdminWithGoogle(input: { idToken: string; nonce: string }) {
  return apiFetch<AdminAuthReply>("/v1/auth/admin/google", {
    method: "POST",
    body: { id_token: input.idToken, nonce: input.nonce },
    auth: false,
  });
}

/** Pass a token to check one that is not in the cookie yet. */
export function getMe(token?: string) {
  return apiFetch<User>("/v1/me", { token });
}
