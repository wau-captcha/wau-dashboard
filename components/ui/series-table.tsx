"use client";

import type { ReactNode } from "react";
import { seriesColor, type ChartSeries } from "./chart-parts";
import { DataTable, type DataTableColumn } from "./data-table";
import { useFormatter, useUIText } from "./locale";

/** Min, max and average over the periods with any activity; null when there were none. */
export type SeriesStats = { min: number | null; max: number | null; avg: number | null; total: number };

export type SeriesTableRow = ChartSeries & SeriesStats;

export type SeriesTableProps = {
  rows: SeriesTableRow[];
  /** Header of the name column, e.g. "API key". */
  nameHeader: ReactNode;
  formatValue?: (value: number) => string;
  "aria-label"?: string;
  className?: string;
};

/**
 * Stats of a series' values, skipping empty periods like OpenRouter's activity table: a key
 * used on two days of thirty averages over those two. The average keeps one decimal.
 */
export function seriesStats(values: number[]): SeriesStats {
  const active = values.filter((value) => value > 0);
  const total = active.reduce((sum, value) => sum + value, 0);
  if (active.length === 0) return { min: null, max: null, avg: null, total };
  return {
    min: Math.min(...active),
    max: Math.max(...active),
    avg: Math.round((total / active.length) * 10) / 10,
    total,
  };
}

/**
 * The numbers behind a line chart, one row per series, keyed by the series colour so the
 * table doubles as the chart's legend. Sortable; largest total first.
 */
export function SeriesTable({ rows, nameHeader, formatValue, className, "aria-label": ariaLabel }: SeriesTableProps) {
  const text = useUIText().seriesTable;
  const format = useFormatter();
  const value = (number: number | null) =>
    number === null ? <span className="text-faint-foreground">—</span> : (formatValue ?? format.number)(number);
  const stat = (id: keyof SeriesStats, header: string): DataTableColumn<SeriesTableRow> => ({
    id,
    header,
    accessor: (row) => row[id],
    cell: (row) => value(row[id]),
    sortable: true,
    align: "right",
    width: "15%",
    className: "tabular-nums",
  });

  return (
    <DataTable
      data={rows}
      getRowId={(row) => row.id}
      defaultSort={{ columnId: "total", direction: "desc" }}
      aria-label={ariaLabel}
      className={className}
      columns={[
        {
          id: "label",
          header: nameHeader,
          accessor: (row) => row.label,
          cell: (row) => (
            <span className="flex min-w-0 items-center gap-2.5">
              <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: seriesColor(row.color) }} />
              <span className="truncate">{row.label}</span>
            </span>
          ),
          sortable: true,
        },
        stat("min", text.min),
        stat("max", text.max),
        stat("avg", text.avg),
        stat("total", text.total),
      ]}
    />
  );
}
