import "server-only";

import { apiFetch } from "./client";
import type { DailyUsage, Quota, Usage, UsageSeries } from "./types";

/** int64 fields arrive as strings in proto JSON. */
type Count = string | number;
type RawCount = { total: Count; success: Count };
type RawDay = RawCount & { date: string };
type RawSeries = RawCount & { id: string; days?: RawDay[] };
export type RawUsage = RawCount & {
  days?: RawDay[];
  challenge_types?: (RawCount & { challenge_type: string })[];
  by_api_key?: RawSeries[];
  by_challenge_type?: RawSeries[];
};

export function toNumber(value: Count | undefined): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function toDays(days: RawDay[] | undefined): DailyUsage[] {
  return (days ?? []).map((day) => ({ date: day.date, total: toNumber(day.total), success: toNumber(day.success) }));
}

function toSeries(series: RawSeries[] | undefined): UsageSeries[] {
  return (series ?? []).map((entry) => ({
    id: entry.id,
    total: toNumber(entry.total),
    success: toNumber(entry.success),
    days: toDays(entry.days),
  }));
}

export function toUsage(raw: RawUsage): Usage {
  return {
    total: toNumber(raw.total),
    success: toNumber(raw.success),
    days: toDays(raw.days),
    challenge_types: (raw.challenge_types ?? []).map((entry) => ({
      challenge_type: entry.challenge_type,
      total: toNumber(entry.total),
      success: toNumber(entry.success),
    })),
    by_api_key: toSeries(raw.by_api_key),
    by_challenge_type: toSeries(raw.by_challenge_type),
  };
}

export async function getUsage(params: { apiKeyId?: string; days: number }): Promise<Usage> {
  const query = new URLSearchParams({ days: String(params.days) });
  if (params.apiKeyId) query.set("api_key_id", params.apiKeyId);
  return toUsage(await apiFetch<RawUsage>(`/v1/usage?${query.toString()}`));
}

export async function getQuota(): Promise<Quota> {
  const raw = await apiFetch<{ used: Count; limit: Count; date: string; resets_at: string }>("/v1/quota");
  const minutes = Math.ceil((new Date(raw.resets_at).getTime() - Date.now()) / 60_000);
  return {
    used: toNumber(raw.used),
    limit: toNumber(raw.limit),
    date: raw.date,
    resets_at: raw.resets_at,
    minutes_to_reset: Number.isFinite(minutes) ? Math.max(0, minutes) : 0,
  };
}
