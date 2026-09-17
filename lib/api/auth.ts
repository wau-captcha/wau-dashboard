import "server-only";

import { apiFetch } from "./client";
import type { AuthReply, User } from "./types";

export function register(input: { username: string; email: string; password: string }) {
  return apiFetch<AuthReply>("/v1/auth/register", { method: "POST", body: input, auth: false });
}

export function login(input: { identifier: string; password: string }) {
  return apiFetch<AuthReply>("/v1/auth/login", { method: "POST", body: input, auth: false });
}

/** Pass a token to check one that is not in the cookie yet. */
export function getMe(token?: string) {
  return apiFetch<User>("/v1/me", { token });
}
