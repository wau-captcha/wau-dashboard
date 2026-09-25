import "server-only";

import type { UsageRange } from "@/lib/usage-view";
import { apiFetch } from "./client";
import type { DailyUsage, Quota, Usage, UsageCount, UsageSeries } from "./types";

/** int64 fields arrive as strings in proto JSON, and zero ones do not arrive at all. */
type Count = string | number;
type RawCount = { challenges?: Count; verifications?: Count; successes?: Count };
type RawDay = RawCount & { date: string };
type RawSeries = RawCount & { id: string; days?: RawDay[]; name?: string; deleted?: boolean; create_date?: string };
export type RawUsage = RawCount & {
  days?: RawDay[];
  by_api_key?: RawSeries[];
  by_challenge_type?: RawSeries[];
};

export function toNumber(value: Count | undefined): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function toCount(raw: RawCount): UsageCount {
  return {
    challenges: toNumber(raw.challenges),
    verifications: toNumber(raw.verifications),
    successes: toNumber(raw.successes),
  };
}

function toDays(days: RawDay[] | undefined): DailyUsage[] {
  return (days ?? []).map((day) => ({ date: day.date, ...toCount(day) }));
}

function toSeries(series: RawSeries[] | undefined): UsageSeries[] {
  return (series ?? []).map((entry) => ({
    id: entry.id,
    ...toCount(entry),
    days: toDays(entry.days),
    name: entry.name ?? "",
    deleted: entry.deleted ?? false,
    create_date: entry.create_date ?? "",
  }));
}

export function toUsage(raw: RawUsage): Usage {
  return {
    ...toCount(raw),
    days: toDays(raw.days),
    by_api_key: toSeries(raw.by_api_key),
    by_challenge_type: toSeries(raw.by_challenge_type),
  };
}

/** The query of a usage window: `days=7`, or `all_time=true`. */
export function rangeQuery(range: UsageRange): URLSearchParams {
  return new URLSearchParams(range === "all" ? { all_time: "true" } : { days: String(range) });
}

export async function getUsage(params: { apiKeyId?: string; range: UsageRange }): Promise<Usage> {
  const query = rangeQuery(params.range);
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
