"use client";

import { ChartCard } from "@/components/ui/chart-card";
import { LineChart } from "@/components/ui/line-chart";
import { SeriesTable } from "@/components/ui/series-table";
import type { ApiKey, Usage, UsageSeries } from "@/lib/api/types";
import { challengeTypeLabel } from "@/lib/challenge-types";
import { useI18n } from "@/lib/i18n/client";
import { keyDisplayName } from "@/lib/key-name";
import { challengeTypeSlot, chartColumns, MAX_NAMED_SERIES, seriesRows, sumDays, type ChartSeriesData } from "@/lib/usage-chart";

type KeyInfo = Pick<ApiKey, "id" | "name" | "site_key" | "create_date">;

type ChartProps = { usage: Usage; days: number };

/**
 * A full-width card: the total of the period, one line per series, then, when a name column
 * is given, the count of series and their numbers in a table that also keys the lines.
 */
function UsageChart({ title, label, usage, series, table }: {
  title: string; label: string; usage: Usage; series: ChartSeriesData[]; table?: { caption: string; nameHeader: string };
}) {
  const { t, format } = useI18n();
  const number = (value: number) => format.number(value);
  const withTable = table && series.length > 0;
  return (
    <ChartCard
      label={title}
      value={number(usage.total)}
      caption={withTable ? table.caption : undefined}
      footer={withTable ? <SeriesTable rows={seriesRows(series)} nameHeader={table.nameHeader} formatValue={number} aria-label={title} /> : undefined}
    >
      <LineChart
        aria-label={label}
        columns={chartColumns(usage.days, series, format)}
        series={series}
        formatValue={number}
        totalLabel={t.usage.charts.total}
        emptyLabel={t.usage.charts.empty}
      />
    </ChartCard>
  );
}

/**
 * Solves per day, one line per API key. A key's colour follows the order keys were created in,
 * so it stays the same in every range; keys past the seventh and deleted keys fold into "Other".
 */
export function UsageByKeyChart({ usage, days, keys }: ChartProps & { keys: KeyInfo[] }) {
  const text = useI18n().t.usage.charts;
  const byCreation = [...keys].sort((a, b) => a.create_date.localeCompare(b.create_date));
  const slots = new Map(byCreation.slice(0, MAX_NAMED_SERIES).map((key, i) => [key.id, i + 1]));
  const names = new Map(keys.map((key) => [key.id, keyDisplayName(key)]));

  const named: ChartSeriesData[] = [];
  const folded: UsageSeries[] = [];
  for (const entry of usage.by_api_key) {
    const slot = slots.get(entry.id);
    if (slot) named.push({ id: entry.id, label: names.get(entry.id) ?? entry.id, color: slot, days: entry.days });
    else folded.push(entry);
  }
  named.sort((a, b) => Number(a.color) - Number(b.color));
  if (folded.length > 0) {
    named.push({ id: "other", label: text.otherKeys, color: "other", days: sumDays(usage.days, folded) });
  }
  return (
    <UsageChart
      title={text.byKeyTitle(days)}
      label={text.byKeyLabel(days)}
      usage={usage}
      series={named}
      table={{ caption: text.keyCount(usage.by_api_key.length), nameHeader: text.key }}
    />
  );
}

/** Solves per day, one line per challenge type, each type in its fixed colour. */
export function UsageByTypeChart({ usage, days }: ChartProps) {
  const { t } = useI18n();
  const text = t.usage.charts;
  const named: ChartSeriesData[] = [];
  const folded: UsageSeries[] = [];
  for (const entry of usage.by_challenge_type) {
    const slot = challengeTypeSlot(entry.id);
    if (slot) named.push({ id: entry.id, label: challengeTypeLabel(entry.id, t.challengeTypes), color: slot, days: entry.days });
    else folded.push(entry);
  }
  named.sort((a, b) => Number(a.color) - Number(b.color));
  if (folded.length > 0) {
    named.push({ id: "other", label: text.other, color: "other", days: sumDays(usage.days, folded) });
  }
  return (
    <UsageChart
      title={text.byTypeTitle(days)}
      label={text.byTypeLabel(days)}
      usage={usage}
      series={named}
      table={{ caption: text.typeCount(usage.by_challenge_type.length), nameHeader: text.type }}
    />
  );
}

/** Solves per day as one line; the card label names it, so there is no table. */
export function DailyUsageChart({ usage, days }: ChartProps) {
  const text = useI18n().t.usage.charts;
  const series: ChartSeriesData[] = [{ id: "solves", label: text.solves, color: 1, days: usage.days }];
  return <UsageChart title={text.dailyTitle(days)} label={text.dailyLabel(days)} usage={usage} series={series} />;
}
