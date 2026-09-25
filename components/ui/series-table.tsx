"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { seriesColor, type ChartSeries } from "./chart-parts";
import { DataTable, type DataTableColumn } from "./data-table";
import { useFormatter, useUIText } from "./locale";

/** A number column of the table; `null` shows as a dash, e.g. a rate of nothing. */
export type SeriesTableColumn<T extends ChartSeries> = {
  id: string;
  header: ReactNode;
  value: (row: T) => number | null;
  /** How the number reads, e.g. as a percentage; plain number by default. */
  format?: (value: number) => string;
};

export type SeriesTableProps<T extends ChartSeries> = {
  rows: T[];
  /** Header of the name column, e.g. "API key". */
  nameHeader: ReactNode;
  columns: SeriesTableColumn<T>[];
  /** Column sorted on first, largest first; the first number column by default. */
  defaultSortColumnId?: string;
  /** Series whose line is hidden: their rows are dimmed. */
  hiddenIds?: ReadonlySet<string>;
  /** Called with the id of a clicked row, to hide or show its line. */
  onToggle?: (id: string) => void;
  "aria-label"?: string;
  className?: string;
};

/**
 * The numbers behind a line chart, one row per series, keyed by the series colour so the
 * table doubles as the chart's legend. Sortable. With `onToggle`, clicking a row, or Enter
 * and Space on it, hides its line and dims the row; again shows it.
 */
export function SeriesTable<T extends ChartSeries>({
  rows,
  nameHeader,
  columns,
  defaultSortColumnId,
  hiddenIds,
  onToggle,
  className,
  "aria-label": ariaLabel,
}: SeriesTableProps<T>) {
  const text = useUIText().seriesTable;
  const format = useFormatter();
  const hidden = (row: T) => hiddenIds?.has(row.id) ?? false;

  const numberColumns = columns.map(
    (column): DataTableColumn<T> => ({
      id: column.id,
      header: column.header,
      accessor: column.value,
      cell: (row) => {
        const value = column.value(row);
        if (value === null) return <span className="text-faint-foreground">—</span>;
        return (column.format ?? format.number)(value);
      },
      sortable: true,
      align: "right",
      className: "tabular-nums",
    }),
  );

  return (
    <DataTable
      data={rows}
      getRowId={(row) => row.id}
      defaultSort={{ columnId: defaultSortColumnId ?? columns[0]?.id ?? "label", direction: "desc" }}
      aria-label={ariaLabel}
      className={className}
      onRowClick={onToggle ? (row) => onToggle(row.id) : undefined}
      rowClassName={(row) => cn(hidden(row) && "opacity-40")}
      columns={[
        {
          id: "label",
          header: nameHeader,
          accessor: (row) => row.label,
          cell: (row) => (
            <span className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden
                className={cn("size-2.5 shrink-0 rounded-full", hidden(row) && "ring-1 ring-border")}
                style={{ background: hidden(row) ? "transparent" : seriesColor(row.color) }}
              />
              <span className="truncate">{row.label}</span>
              {hidden(row) && <span className="sr-only">({text.hidden})</span>}
            </span>
          ),
          sortable: true,
        },
        ...numberColumns,
      ]}
    />
  );
}
