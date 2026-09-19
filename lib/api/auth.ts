import "server-only";

import { apiFetch } from "./client";
import type { AuthReply, User } from "./types";

/** Exchanges a Google ID token for a session; the account is created on first sign-in. */
export function signInWithGoogle(input: { idToken: string; nonce: string }) {
  return apiFetch<AuthReply>("/v1/auth/google", {
    method: "POST",
    body: { id_token: input.idToken, nonce: input.nonce },
    auth: false,
  });
}

/** Pass a token to check one that is not in the cookie yet. */
export function getMe(token?: string) {
  return apiFetch<User>("/v1/me", { token });
}
