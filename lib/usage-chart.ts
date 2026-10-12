import type { ChartColumn, ChartSeries } from "@/components/ui/chart-parts";
import type { DailyUsage, UsageCount } from "@/lib/api/types";
import { parseISODate } from "@/lib/date";
import type { Formatter } from "@/lib/format";

/** A chart series with its daily usage, over the same days as Usage.days, and its totals. */
export type ChartSeriesData = ChartSeries & UsageCount & { days: DailyUsage[] };

/** The charts fold series past this many into one, keeping eight colours at most. */
export const MAX_NAMED_SERIES = 7;

/**
 * Fixed colour slot per challenge type, so a type keeps its colour on every chart and in
 * every range. Types without a slot fold into "Other".
 */
const CHALLENGE_TYPE_SLOTS: Record<string, number> = {
  image_distort: 1,
  motion_noise: 2,
  slide_puzzle: 3,
  behavioral_advanced: 4,
  animal_jump: 5,
  object_rotate: 6,
};

export function challengeTypeSlot(id: string): number | undefined {
  return CHALLENGE_TYPE_SLOTS[id];
}

/**
 * One column per day with the /challenge/verify calls of each series; the axis reads
 * "20 Aug" / "20 thg 8".
 */
export function chartColumns(days: DailyUsage[], series: ChartSeriesData[], format: Formatter): ChartColumn[] {
  return days.map((day, i) => {
    const date = parseISODate(day.date);
    return {
      label: date ? format.dayMonth(date) : day.date,
      title: date ? format.date(date) : day.date,
      values: Object.fromEntries(series.map((s) => [s.id, s.days[i]?.verifications ?? 0])),
    };
  });
}

/** Adds up several series into one, e.g. the keys folded together: day by day and in total. */
export function sumSeries(days: DailyUsage[], series: (UsageCount & { days: DailyUsage[] })[]): UsageCount & { days: DailyUsage[] } {
  const add = (sum: UsageCount, count: UsageCount): UsageCount => ({
    challenges: sum.challenges + count.challenges,
    verifications: sum.verifications + count.verifications,
    successes: sum.successes + count.successes,
  });
  const zero: UsageCount = { challenges: 0, verifications: 0, successes: 0 };
  return {
    ...series.reduce(add, zero),
    days: days.map((day, i) => ({
      date: day.date,
      ...series.reduce((sum, s) => (s.days[i] ? add(sum, s.days[i]) : sum), zero),
    })),
  };
}
