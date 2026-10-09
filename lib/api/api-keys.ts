import "server-only";

import { apiFetch } from "./client";
import type { ApiKey, ApiKeyAppeal, ApiKeyEvent, ApiKeySet, ChallengeType } from "./types";
import { toNumber } from "./usage";

const keyPath = (id: string) => `/v1/api-keys/${encodeURIComponent(id)}`;

/** The counters are int64, which proto JSON sends as strings. */
function toApiKey(raw: ApiKey): ApiKey {
  const today = raw.today;
  if (!today) return raw;
  return {
    ...raw,
    today: {
      challenges: toNumber(today.challenges),
      answers: toNumber(today.answers),
      solved: toNumber(today.solved),
      automated: toNumber(today.automated),
    },
  };
}

export function listApiKeys() {
  return apiFetch<ApiKeySet>("/v1/api-keys");
}

export async function getApiKey(id: string) {
  return toApiKey(await apiFetch<ApiKey>(keyPath(id)));
}

/** Creates a key, allowed on the websites given (any when none). */
export function createApiKey(name: string, allowedDomains: string[] = []) {
  return apiFetch<ApiKey>("/v1/api-keys", { method: "POST", body: { name, allowed_domains: allowedDomains } });
}

/** Sends only the fields given. Field mask paths are camelCase in JSON. */
export function updateApiKey(id: string, patch: { name?: string; isActive?: boolean; requireBehavior?: boolean }) {
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
  if (patch.requireBehavior !== undefined) {
    apiKey.require_behavior = patch.requireBehavior;
    paths.push("requireBehavior");
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

/** Replaces the websites allowed to use the site key; an empty list allows any website. */
export function setAllowedDomains(id: string, domains: string[]) {
  return apiFetch<ApiKey>(`${keyPath(id)}/allowed-domains`, {
    method: "PUT",
    body: { id, allowed_domains: domains.map((domain) => ({ domain })) },
  });
}

/** Asks an administrator to review a suspended or flagged key. */
export function createAppeal(id: string, message: string) {
  return apiFetch<ApiKeyAppeal>(`${keyPath(id)}/appeals`, { method: "POST", body: { id, message } });
}

/** The latest 100 entries of the activity log of a key, newest first. */
export async function listApiKeyEvents(id: string): Promise<ApiKeyEvent[]> {
  const set = await apiFetch<{ events?: ApiKeyEvent[] }>(`${keyPath(id)}/events`);
  return (set.events ?? []).map((event) => ({ ...event, id: String(event.id) }));
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
