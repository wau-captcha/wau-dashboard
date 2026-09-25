import type { UsageCount } from "@/lib/api/types";
import type { Formatter } from "@/lib/format";

/** A usage window: the last 7, 15 or 30 days, or all time. */
export type UsageRange = 7 | 15 | 30 | "all";

/** Windows the usage screens offer. */
export const USAGE_RANGES: readonly UsageRange[] = [7, 15, 30, "all"];
export const DEFAULT_RANGE: UsageRange = 30;

/** Reads `?days=`, "7" or "all" for instance, and keeps it within the offered windows. */
export function parseRange(value: string | undefined): UsageRange {
  if (value === "all") return "all";
  return USAGE_RANGES.find((range) => String(range) === value) ?? DEFAULT_RANGE;
}

/** A share formatted as a percentage; "—" rather than 0% when nothing was measured. */
export function rate(part: number, whole: number, format: Formatter): string {
  return whole === 0 ? "—" : format.percent(part / whole);
}

/** Totals formatted for StatCard values. */
export function usageTotals(usage: UsageCount, format: Formatter) {
  return {
    challenges: format.number(usage.challenges),
    verifications: format.number(usage.verifications),
    successes: format.number(usage.successes),
    /** (/challenge/verify)/(/challenge/new). */
    verifyRate: rate(usage.verifications, usage.challenges, format),
    /** Successful /challenge/verify over all of them. */
    successRate: rate(usage.successes, usage.verifications, format),
  };
}
