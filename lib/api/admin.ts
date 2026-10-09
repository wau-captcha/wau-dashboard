import "server-only";

import { apiFetch, type ApiFetchOptions } from "./client";
import type { Admin, AdminApiKey, AdminAppeal, AdminStats, AdminUser, AppealStatus, Usage, UserPage } from "./types";
import type { UsageRange } from "@/lib/usage-view";
import { rangeQuery, toNumber, toUsage, type RawUsage } from "./usage";

/** Every call here carries the administrator session; a rejected one signs out of the console. */
function adminFetch<T>(path: string, options: Omit<ApiFetchOptions, "session"> = {}): Promise<T> {
  return apiFetch<T>(path, { ...options, session: "admin" });
}

/** The signed-in administrator. Pass a token to check one that is not in the cookie yet. */
export function getAdmin(token?: string): Promise<Admin> {
  return adminFetch<Admin>("/v1/admin/me", { token });
}

/** Numeric fields of these messages that proto JSON sends as strings (int64). */
type Raw<T> = { [K in keyof T]: T[K] extends number ? string | number : T[K] };

function toAdminUser(raw: Raw<AdminUser>): AdminUser {
  return {
    ...raw,
    api_key_count: toNumber(raw.api_key_count),
    quota_used: toNumber(raw.quota_used),
    daily_quota: toNumber(raw.daily_quota),
  };
}

function toAdminApiKey(raw: Raw<AdminApiKey>): AdminApiKey {
  return {
    ...raw,
    challenges_today: toNumber(raw.challenges_today),
    verifications_today: toNumber(raw.verifications_today),
    solved_today: toNumber(raw.solved_today),
    automated_today: toNumber(raw.automated_today),
  };
}

type RawAppeal = Omit<AdminAppeal, "api_key"> & { api_key: Raw<AdminApiKey> };

const toAdminAppeal = (raw: RawAppeal): AdminAppeal => ({ ...raw, api_key: toAdminApiKey(raw.api_key) });

/** Appeals with a status, or all of them, newest first. */
export async function listAppeals(status: AppealStatus | "all"): Promise<AdminAppeal[]> {
  const set = await adminFetch<{ appeals?: RawAppeal[] }>(`/v1/admin/appeals?status=${encodeURIComponent(status)}`);
  return (set.appeals ?? []).map(toAdminAppeal);
}

/** Approves a pending appeal, which lifts the suspension and the flag of the key, or rejects it. */
export async function decideAppeal(id: string, approve: boolean, note: string): Promise<AdminAppeal> {
  return toAdminAppeal(
    await adminFetch<RawAppeal>(`/v1/admin/appeals/${encodeURIComponent(id)}/decision`, {
      method: "POST",
      body: { appeal_id: id, approve, note },
    }),
  );
}

const userPath = (id: string) => `/v1/admin/users/${encodeURIComponent(id)}`;

export async function getAdminStats(): Promise<AdminStats> {
  const raw = await adminFetch<Raw<AdminStats>>("/v1/admin/stats");
  return {
    users: toNumber(raw.users),
    banned_users: toNumber(raw.banned_users),
    api_keys: toNumber(raw.api_keys),
    suspended_api_keys: toNumber(raw.suspended_api_keys),
    scraping_api_keys: toNumber(raw.scraping_api_keys),
  };
}

export async function listUsers(params: { query?: string; page: number; pageSize: number }): Promise<UserPage> {
  const query = new URLSearchParams({ page: String(params.page), page_size: String(params.pageSize) });
  if (params.query) query.set("query", params.query);
  const raw = await adminFetch<{ users?: Raw<AdminUser>[]; total_size?: number }>(`/v1/admin/users?${query.toString()}`);
  return { users: (raw.users ?? []).map(toAdminUser), total_size: toNumber(raw.total_size) };
}

export async function getAdminUser(id: string): Promise<AdminUser> {
  return toAdminUser(await adminFetch<Raw<AdminUser>>(userPath(id)));
}

export async function setUserBanned(id: string, banned: boolean): Promise<AdminUser> {
  return toAdminUser(await adminFetch<Raw<AdminUser>>(`${userPath(id)}/banned`, { method: "POST", body: { banned } }));
}

export async function listUserApiKeys(id: string): Promise<AdminApiKey[]> {
  const raw = await adminFetch<{ api_keys?: Raw<AdminApiKey>[] }>(`${userPath(id)}/api-keys`);
  return (raw.api_keys ?? []).map(toAdminApiKey);
}

export async function setApiKeySuspended(id: string, suspended: boolean): Promise<AdminApiKey> {
  const raw = await adminFetch<Raw<AdminApiKey>>(`/v1/admin/api-keys/${encodeURIComponent(id)}/suspended`, {
    method: "POST",
    body: { suspended },
  });
  return toAdminApiKey(raw);
}

export async function getAdminUsage(params: { userId?: string; apiKeyId?: string; range: UsageRange }): Promise<Usage> {
  const query = rangeQuery(params.range);
  if (params.userId) query.set("user_id", params.userId);
  if (params.apiKeyId) query.set("api_key_id", params.apiKeyId);
  return toUsage(await adminFetch<RawUsage>(`/v1/admin/usage?${query.toString()}`));
}
