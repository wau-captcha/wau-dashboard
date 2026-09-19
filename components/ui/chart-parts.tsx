import { useEffect, useState, type RefObject } from "react";

/** One series of a chart. */
export type ChartSeries = {
  id: string;
  label: string;
  /** Categorical slot 1-8, fixed per entity so colours survive filtering; "other" for a folded tail. */
  color: number | "other";
};

/** One x position of a chart, with the value of each series there. */
export type ChartColumn = {
  /** Short x-axis label, e.g. "20 Aug". */
  label: string;
  /** Tooltip heading, e.g. "20/08/2026". */
  title: string;
  /** Value per series id; a missing one is zero. */
  values: Record<string, number>;
};

/** Fill of a series: its categorical slot, or the recessive grey of a folded tail. */
export function seriesColor(color: ChartSeries["color"]): string {
  return color === "other" ? "var(--chart-other)" : `var(--chart-${color})`;
}

/** Key and label per series: squares for bars, dots for lines. */
export function ChartLegend({ series, dot }: { series: ChartSeries[]; dot?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-overline text-muted-foreground">
      {series.map((s) => (
        <li key={s.id} className="flex min-w-0 items-center gap-1.5">
          <span aria-hidden className={dot ? "size-2.5 shrink-0 rounded-full" : "size-2.5 shrink-0 rounded-[3px]"} style={{ background: seriesColor(s.color) }} />
          <span className="truncate">{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Every series of one column, values first, keyed by a short stroke of the series colour.
 * Series are listed in the given order, which the chart picks to match what the eye sees.
 */
export function ChartTooltip({ column, series, total, totalLabel, formatValue, x, flip }: {
  column: ChartColumn; series: ChartSeries[]; total: number; totalLabel?: string;
  formatValue: (value: number) => string; x: number; flip: boolean;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 z-10 grid min-w-40 gap-1 rounded-md border border-border bg-popover px-3 py-2 text-overline text-popover-foreground shadow-md"
      style={{ left: x, transform: flip ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}
    >
      <p className="text-muted-foreground">{column.title}</p>
      {series.map((s) => (
        <div key={s.id} className="flex items-center gap-2">
          <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: seriesColor(s.color) }} />
          <span className="font-medium tabular-nums">{formatValue(column.values[s.id] ?? 0)}</span>
          <span className="truncate text-muted-foreground">{s.label}</span>
        </div>
      ))}
      {totalLabel && (
        <div className="mt-0.5 flex items-center gap-2 border-t border-border pt-1">
          <span className="w-3 shrink-0" />
          <span className="font-medium tabular-nums">{formatValue(total)}</span>
          <span className="text-muted-foreground">{totalLabel}</span>
        </div>
      )}
    </div>
  );
}

/** Content width of an element, 0 until measured. */
export function useChartWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}
