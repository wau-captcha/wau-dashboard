import type { ChartColumn, ChartSeries } from "@/components/ui/chart-parts";
import { seriesStats, type SeriesTableRow } from "@/components/ui/series-table";
import type { DailyUsage } from "@/lib/api/types";
import { parseISODate } from "@/lib/date";
import type { Formatter } from "@/lib/format";

/** A chart series with its daily values, over the same days as Usage.days. */
export type ChartSeriesData = ChartSeries & { days: DailyUsage[] };

/** The charts fold series past this many into "Other", keeping eight colours at most. */
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
};

export function challengeTypeSlot(id: string): number | undefined {
  return CHALLENGE_TYPE_SLOTS[id];
}

/** One column per day with the total of each series; the axis reads "20 Aug" / "20 thg 8". */
export function chartColumns(days: DailyUsage[], series: ChartSeriesData[], format: Formatter): ChartColumn[] {
  return days.map((day, i) => {
    const date = parseISODate(day.date);
    return {
      label: date ? format.dayMonth(date) : day.date,
      title: date ? format.date(date) : day.date,
      values: Object.fromEntries(series.map((s) => [s.id, s.days[i]?.total ?? 0])),
    };
  });
}

/** Adds up several daily series into one, e.g. the keys folded into "Other". */
export function sumDays(days: DailyUsage[], series: { days: DailyUsage[] }[]): DailyUsage[] {
  return days.map((day, i) =>
    series.reduce(
      (sum, s) => ({ ...sum, total: sum.total + (s.days[i]?.total ?? 0), success: sum.success + (s.days[i]?.success ?? 0) }),
      { date: day.date, total: 0, success: 0 },
    ),
  );
}

/** A table row per series: its daily totals reduced to min, max, average and total. */
export function seriesRows(series: ChartSeriesData[]): SeriesTableRow[] {
  return series.map(({ days, ...s }) => ({ ...s, ...seriesStats(days.map((day) => day.total)) }));
}
