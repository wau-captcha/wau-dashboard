import "server-only";

import { apiFetch } from "./client";
import type { Usage } from "./types";

/** int64 fields arrive as strings in proto JSON. */
type RawCount = { total: string | number; success: string | number };
type RawUsage = RawCount & {
  days: (RawCount & { date: string })[];
  challenge_types: (RawCount & { challenge_type: string })[];
};

function toNumber(value: string | number): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

export async function getUsage(params: { apiKeyId?: string; days: number }): Promise<Usage> {
  const query = new URLSearchParams({ days: String(params.days) });
  if (params.apiKeyId) query.set("api_key_id", params.apiKeyId);
  const raw = await apiFetch<RawUsage>(`/v1/usage?${query.toString()}`);

  return {
    total: toNumber(raw.total),
    success: toNumber(raw.success),
    days: (raw.days ?? []).map((day) => ({
      date: day.date,
      total: toNumber(day.total),
      success: toNumber(day.success),
    })),
    challenge_types: (raw.challenge_types ?? []).map((entry) => ({
      challenge_type: entry.challenge_type,
      total: toNumber(entry.total),
      success: toNumber(entry.success),
    })),
  };
}
