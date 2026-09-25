"use client";

import { useState } from "react";
import { ChartCard } from "@/components/ui/chart-card";
import { LineChart } from "@/components/ui/line-chart";
import { SeriesTable, type SeriesTableColumn } from "@/components/ui/series-table";
import type { ApiKey, Usage, UsageSeries } from "@/lib/api/types";
import { challengeTypeLabel } from "@/lib/challenge-types";
import { useI18n } from "@/lib/i18n/client";
import { challengeTypeSlot, chartColumns, MAX_NAMED_SERIES, sumSeries, type ChartSeriesData } from "@/lib/usage-chart";
import type { UsageRange } from "@/lib/usage-view";

type ChartProps = { usage: Usage; range: UsageRange };

/** Challenges, verifications and right answers of each series, then the two rates. */
function useUsageColumns(): SeriesTableColumn<ChartSeriesData>[] {
  const { t, format } = useI18n();
  const text = t.usage.columns;
  const share = (part: number, whole: number) => (whole === 0 ? null : part / whole);
  return [
    { id: "challenges", header: text.challenges, value: (row) => row.challenges },
    { id: "verifications", header: text.verifications, value: (row) => row.verifications },
    { id: "successes", header: text.successes, value: (row) => row.successes },
    { id: "verifyRate", header: text.verifyRate, value: (row) => share(row.verifications, row.challenges), format: format.percent },
    { id: "successRate", header: text.successRate, value: (row) => share(row.successes, row.verifications), format: format.percent },
  ];
}

/**
 * A full-width card: the /challenge/verify calls of the period, one line per series, then, when
 * a name column is given, the count of series and their numbers in a table that also keys the
 * lines. Clicking a row hides its line and dims the row.
 */
function UsageChart({ title, label, usage, series, table }: {
  title: string; label: string; usage: Usage; series: ChartSeriesData[]; table?: { caption: string; nameHeader: string };
}) {
  const { t, format } = useI18n();
  const text = t.usage.charts;
  const columns = useUsageColumns();
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(() => new Set());
  const visible = series.filter((entry) => !hiddenIds.has(entry.id));
  const number = (value: number) => format.number(value);
  const withTable = table && series.length > 0;

  function toggle(id: string) {
    setHiddenIds((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  return (
    <ChartCard
      label={title}
      value={number(usage.verifications)}
      caption={withTable ? table.caption : undefined}
      footer={
        withTable ? (
          <>
            <SeriesTable
              rows={series}
              nameHeader={table.nameHeader}
              columns={columns}
              defaultSortColumnId="verifications"
              hiddenIds={hiddenIds}
              onToggle={toggle}
              aria-label={title}
            />
            <p className="text-overline text-muted-foreground">{text.note}</p>
          </>
        ) : undefined
      }
    >
      <LineChart
        aria-label={label}
        columns={chartColumns(usage.days, visible, format)}
        series={visible}
        formatValue={number}
        totalLabel={text.total}
        emptyLabel={series.length > 0 && visible.length === 0 ? text.allHidden : text.empty}
      />
    </ChartCard>
  );
}

/** Turns usage series into chart series, the given colour slots first and the rest folded into one. */
function namedSeries(entries: UsageSeries[], slotOf: (entry: UsageSeries) => number | undefined, label: (entry: UsageSeries) => string, foldLabel: string) {
  const named: ChartSeriesData[] = [];
  const folded: UsageSeries[] = [];
  for (const entry of entries) {
    const slot = slotOf(entry);
    if (slot) named.push({ ...entry, label: label(entry), color: slot });
    else folded.push(entry);
  }
  named.sort((a, b) => Number(a.color) - Number(b.color));
  return { named, folded, fold: (days: Usage["days"]): ChartSeriesData => ({ id: "other", label: foldLabel, color: "other", ...sumSeries(days, folded) }) };
}

/**
 * Verifications per day, one line per API key of this account, deleted keys included and
 * marked. A key's colour follows the order keys were created in, the current keys first, so it
 * stays the same in every range; keys past the seventh fold into "More keys".
 */
export function UsageByKeyChart({ usage, range, keys }: ChartProps & { keys: Pick<ApiKey, "id" | "create_date">[] }) {
  const text = useI18n().t.usage.charts;
  const current = [...keys].sort((a, b) => a.create_date.localeCompare(b.create_date)).map((key) => key.id);
  const deleted = usage.by_api_key
    .filter((entry) => !current.includes(entry.id))
    .sort((a, b) => a.create_date.localeCompare(b.create_date))
    .map((entry) => entry.id);
  const order = [...current, ...deleted];
  const slots = new Map(order.slice(0, MAX_NAMED_SERIES).map((id, i) => [id, i + 1]));
  const label = (entry: UsageSeries) => {
    const name = entry.name || text.unnamedKey(entry.id.slice(0, 8));
    return entry.deleted ? text.deleted(name) : name;
  };
  const { named, folded, fold } = namedSeries(usage.by_api_key, (entry) => slots.get(entry.id), label, text.moreKeys);
  const series = folded.length > 0 ? [...named, fold(usage.days)] : named;
  return (
    <UsageChart
      title={text.byKeyTitle(range)}
      label={text.byKeyLabel(range)}
      usage={usage}
      series={series}
      table={{ caption: text.keyCount(usage.by_api_key.length), nameHeader: text.key }}
    />
  );
}

/** Verifications per day, one line per challenge type, each type in its fixed colour. */
export function UsageByTypeChart({ usage, range }: ChartProps) {
  const { t } = useI18n();
  const text = t.usage.charts;
  const { named, folded, fold } = namedSeries(
    usage.by_challenge_type,
    (entry) => challengeTypeSlot(entry.id),
    (entry) => challengeTypeLabel(entry.id, t.challengeTypes),
    text.other,
  );
  const series = folded.length > 0 ? [...named, fold(usage.days)] : named;
  return (
    <UsageChart
      title={text.byTypeTitle(range)}
      label={text.byTypeLabel(range)}
      usage={usage}
      series={series}
      table={{ caption: text.typeCount(usage.by_challenge_type.length), nameHeader: text.type }}
    />
  );
}

/** Verifications per day as one line; the card label names it, so there is no table. */
export function DailyUsageChart({ usage, range }: ChartProps) {
  const text = useI18n().t.usage.charts;
  const series: ChartSeriesData[] = [{ id: "verifications", label: text.verifications, color: 1, ...usage }];
  return <UsageChart title={text.dailyTitle(range)} label={text.dailyLabel(range)} usage={usage} series={series} />;
}
