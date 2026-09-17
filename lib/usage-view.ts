import type { Usage } from "@/lib/api/types";
import type { Formatter } from "@/lib/format";

/** Windows the usage screens offer. */
export const USAGE_RANGES = [7, 30, 90] as const;
export const DEFAULT_RANGE = 30;

/** Reads `?days=` and keeps it within the offered windows. */
export function parseRange(value: string | undefined): number {
  const days = Number(value);
  return USAGE_RANGES.includes(days as (typeof USAGE_RANGES)[number]) ? days : DEFAULT_RANGE;
}

/** "—" rather than 0% when nothing was measured. */
export function successRate(total: number, success: number, format: Formatter): string {
  return total === 0 ? "—" : format.percent(success / total);
}

/** Totals formatted for StatCard values. */
export function usageTotals(usage: Usage, format: Formatter) {
  return {
    total: format.number(usage.total),
    success: format.number(usage.success),
    rate: successRate(usage.total, usage.success, format),
  };
}
