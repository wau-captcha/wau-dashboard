import "server-only";

import { apiFetch } from "./client";
import type { ApiKey, ApiKeySet, ChallengeType } from "./types";

export function listApiKeys() {
  return apiFetch<ApiKeySet>("/v1/api-keys");
}

export function getApiKey(id: string) {
  return apiFetch<ApiKey>(`/v1/api-keys/${encodeURIComponent(id)}`);
}

export function createApiKey(name: string) {
  return apiFetch<ApiKey>("/v1/api-keys", { method: "POST", body: { name } });
}

/** Sends only the fields given. Field mask paths are camelCase in JSON. */
export function updateApiKey(id: string, patch: { name?: string; isActive?: boolean }) {
  const apiKey: Record<string, unknown> = { id };
  const paths: string[] = [];
  if (patch.name !== undefined) {
    apiKey.name = patch.name;
    paths.push("name");
  }
  if (patch.isActive !== undefined) {
    apiKey.is_active = patch.isActive;
    paths.push("isActive");
  }
  return apiFetch<ApiKey>(`/v1/api-keys/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { api_key: apiKey, update_mask: paths.join(",") },
  });
}

/** Replaces the addresses allowed to use the site key; an empty list allows every address. */
export function setAllowedOrigins(id: string, origins: { ip_address: string; description: string }[]) {
  return apiFetch<ApiKey>(`/v1/api-keys/${encodeURIComponent(id)}/allowed-origins`, {
    method: "PUT",
    body: { id, allowed_origins: origins },
  });
}

/** Issues a new secret key; the replaced one keeps working until it expires. */
export function rotateSecretKey(id: string) {
  return apiFetch<ApiKey>(`/v1/api-keys/${encodeURIComponent(id)}/rotate-secret`, { method: "POST" });
}

/** Stops the replaced secret key before its grace period is over. */
export function revokePreviousSecret(id: string) {
  return apiFetch<ApiKey>(`/v1/api-keys/${encodeURIComponent(id)}/revoke-previous-secret`, { method: "POST" });
}

export async function deleteApiKey(id: string) {
  await apiFetch<Record<string, never>>(`/v1/api-keys/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Challenge types the tier of the signed-in user may request. */
export async function listChallengeTypes() {
  const set = await apiFetch<{ challenge_types: ChallengeType[] }>("/v1/challenge-types");
  return set.challenge_types ?? [];
}
