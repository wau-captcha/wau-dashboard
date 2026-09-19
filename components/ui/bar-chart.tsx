"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { ChartLegend, ChartTooltip, seriesColor, useChartWidth, type ChartColumn, type ChartSeries } from "./chart-parts";
import { isLabeledBand, roundedTopBar, valueTicks } from "./chart-scale";

export type BarChartProps = {
  columns: ChartColumn[];
  /** Stacked bottom to top in this order. A legend is shown for two or more. */
  series: ChartSeries[];
  "aria-label": string;
  formatValue?: (value: number) => string;
  /** Tooltip label of the stacked total; shown for two or more series. */
  totalLabel?: string;
  /** Shown over the plot when every value is zero. */
  emptyLabel?: string;
  /** Plot height in pixels, without the x-axis band. */
  height?: number;
  /**
   * "auto" shows a legend for two or more series, when the title already names a single one;
   * "always" also names a single series, for charts whose title does not.
   */
  legend?: "auto" | "always";
  className?: string;
};

const TOP = 8;
const AXIS_BAND = 24;
const GAP = 2;
const MAX_BAR = 24;
const RADIUS = 4;
const LABEL_WIDTH = 44;
/** Half the width of a "dd/mm" label, to keep edge labels inside the chart. */
const LABEL_HALF = 18;

/**
 * Stacked columns over time, one column per x value. Hover or arrow keys show every series
 * of a column in one tooltip; pair the chart with a table of the same numbers.
 */
export function BarChart({
  columns,
  series,
  formatValue = String,
  totalLabel,
  emptyLabel,
  height = 200,
  legend = "auto",
  className,
  "aria-label": ariaLabel,
}: BarChartProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const width = useChartWidth(frameRef);
  const [active, setActive] = useState<number | null>(null);

  const totals = columns.map((column) => series.reduce((sum, s) => sum + (column.values[s.id] ?? 0), 0));
  const ticks = valueTicks(Math.max(0, ...totals));
  const top = ticks[ticks.length - 1];
  const tickText = ticks.map(formatValue);
  const left = Math.max(...tickText.map((text) => text.length)) * 7 + 12;
  const band = columns.length > 0 ? Math.max(0, width - left - 4) / columns.length : 0;
  const bar = Math.max(1, Math.min(MAX_BAR, band * 0.6));
  const y = (value: number) => TOP + height - (value / top) * height;

  function onKeyDown(event: KeyboardEvent) {
    const last = columns.length - 1;
    const moves: Record<string, number> = {
      ArrowLeft: Math.max(0, (active ?? last) - 1),
      ArrowRight: Math.min(last, (active ?? last) + 1),
      Home: 0,
      End: last,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    setActive(moves[event.key]);
  }

  return (
    <div data-slot="bar-chart" className={cn("grid gap-3", className)}>
      {series.length > (legend === "always" ? 0 : 1) && <ChartLegend series={series} />}
      <div
        ref={frameRef}
        role="img"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setActive((current) => current ?? columns.length - 1)}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className="relative rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        style={{ height: TOP + height + AXIS_BAND }}
      >
        {width > 0 && (
          <svg width={width} height={TOP + height + AXIS_BAND} className="block" aria-hidden>
            {ticks.map((tick, i) => (
              <g key={tick}>
                <line x1={left} x2={width} y1={y(tick)} y2={y(tick)} stroke="var(--border)" shapeRendering="crispEdges" />
                <text x={left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-overline tabular-nums">
                  {tickText[i]}
                </text>
              </g>
            ))}
            {active !== null && <rect x={left + active * band} y={TOP} width={band} height={height} className="fill-muted" />}
            {columns.map((column, i) => (
              <g key={i}>
                <Stack column={column} series={series} x={left + i * band + (band - bar) / 2} width={bar} y={y} />
                {isLabeledBand(i, columns.length, band, LABEL_WIDTH) && (
                  <text
                    x={Math.min(Math.max(left + (i + 0.5) * band, left + LABEL_HALF), width - LABEL_HALF)}
                    y={TOP + height + 17}
                    textAnchor="middle"
                    className="fill-muted-foreground text-overline tabular-nums"
                  >
                    {column.label}
                  </text>
                )}
                <rect x={left + i * band} y={0} width={band} height={TOP + height + AXIS_BAND} fill="transparent" onPointerEnter={() => setActive(i)} />
              </g>
            ))}
          </svg>
        )}
        {emptyLabel && totals.every((total) => total === 0) && (
          <p className="pointer-events-none absolute inset-x-0 top-1/3 text-center text-body text-muted-foreground" style={{ paddingLeft: left }}>
            {emptyLabel}
          </p>
        )}
        {active !== null && columns[active] && (
          <ChartTooltip
            column={columns[active]}
            // Top of the stack first, as it reads on the chart.
            series={[...series].reverse()}
            total={totals[active]}
            totalLabel={series.length > 1 ? totalLabel : undefined}
            formatValue={formatValue}
            x={left + (active + 0.5) * band}
            flip={left + (active + 0.5) * band > width / 2}
          />
        )}
      </div>
    </div>
  );
}

function Stack({ column, series, x, width, y }: {
  column: ChartColumn; series: ChartSeries[]; x: number; width: number; y: (value: number) => number;
}) {
  let sum = 0;
  const segments = series.flatMap((s) => {
    const value = column.values[s.id] ?? 0;
    if (value <= 0) return [];
    const segment = { id: s.id, color: seriesColor(s.color), top: y(sum + value), bottom: y(sum) };
    sum += value;
    return [segment];
  });
  return segments.map((segment, k) => {
    // A surface-coloured gap separates stacked segments; only the top one gets rounded corners.
    const bottom = segment.bottom - (k === 0 ? 0 : GAP);
    const segmentHeight = bottom - segment.top;
    if (segmentHeight < 0.5) return null;
    return k === segments.length - 1 ? (
      <path key={segment.id} d={roundedTopBar(x, segment.top, width, segmentHeight, RADIUS)} fill={segment.color} />
    ) : (
      <rect key={segment.id} x={x} y={segment.top} width={width} height={segmentHeight} fill={segment.color} />
    );
  });
}
