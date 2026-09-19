"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { ChartLegend, ChartTooltip, seriesColor, useChartWidth, type ChartColumn, type ChartSeries } from "./chart-parts";
import { isLabeledBand, valueTicks } from "./chart-scale";

export type LineChartProps = {
  columns: ChartColumn[];
  series: ChartSeries[];
  "aria-label": string;
  formatValue?: (value: number) => string;
  /** Tooltip label of the sum of all series; shown for two or more. */
  totalLabel?: string;
  /** Shown over the plot when every value is zero. */
  emptyLabel?: string;
  /** Plot height in pixels, without the x-axis band. */
  height?: number;
  /** Swatches above the plot. Off when a table next to the chart names the series instead. */
  legend?: boolean;
  className?: string;
};

const TOP = 8;
const AXIS_BAND = 28;
/** Least distance between the centres of two x labels, e.g. "20 Aug" or "20 thg 8". */
const LABEL_WIDTH = 64;
/** Half the widest x label: the plot keeps this much room at both ends for the edge labels. */
const LABEL_HALF = 28;

/**
 * One line per series over time. The pointer, or arrow keys once focused, picks the nearest
 * x value; a crosshair marks it and one tooltip lists every series there. A single series
 * gets a light area wash. Pair the chart with a table of the same numbers.
 */
export function LineChart({
  columns,
  series,
  formatValue = String,
  totalLabel,
  emptyLabel,
  height = 240,
  legend = false,
  className,
  "aria-label": ariaLabel,
}: LineChartProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const width = useChartWidth(frameRef);
  const [active, setActive] = useState<number | null>(null);

  const totals = columns.map((column) => series.reduce((sum, s) => sum + (column.values[s.id] ?? 0), 0));
  const peak = Math.max(0, ...columns.flatMap((column) => series.map((s) => column.values[s.id] ?? 0)));
  const ticks = valueTicks(peak);
  const top = ticks[ticks.length - 1];
  // Like OpenRouter, the baseline carries no label, which leaves the corner to the first x
  // label; an empty chart has no scale to show.
  const labeled = peak > 0 ? ticks.slice(1).map((tick) => ({ tick, text: formatValue(tick) })) : [];
  const left = Math.max(LABEL_HALF, Math.max(1, ...labeled.map(({ text }) => text.length)) * 7 + 14);
  const count = columns.length;
  const plot = Math.max(0, width - left - LABEL_HALF);
  const step = count > 1 ? plot / (count - 1) : 0;
  const x = (i: number) => (count > 1 ? left + i * step : left + plot / 2);
  const y = (value: number) => TOP + height - (value / top) * height;

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    if (count === 0) return;
    const offset = event.clientX - event.currentTarget.getBoundingClientRect().left;
    setActive(count > 1 ? Math.min(count - 1, Math.max(0, Math.round((offset - left) / (step || 1)))) : 0);
  }

  function onKeyDown(event: KeyboardEvent) {
    const last = count - 1;
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
    <div data-slot="line-chart" className={cn("grid gap-3", className)}>
      {legend && series.length > 1 && <ChartLegend series={series} dot />}
      <div
        ref={frameRef}
        role="img"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setActive((current) => current ?? count - 1)}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className="relative rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        style={{ height: TOP + height + AXIS_BAND }}
      >
        {width > 0 && count > 0 && (
          <svg
            width={width}
            height={TOP + height + AXIS_BAND}
            className="block"
            aria-hidden
            onPointerMove={onPointerMove}
            onPointerDown={onPointerMove}
          >
            {labeled.map(({ tick, text }) => (
              <text key={tick} x={left - 12} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-overline tabular-nums">
                {text}
              </text>
            ))}
            {columns.map((column, i) =>
              isLabeledBand(i, count, step || width, LABEL_WIDTH) ? (
                <text
                  key={i}
                  x={x(i)}
                  y={TOP + height + 20}
                  textAnchor="middle"
                  className="fill-muted-foreground text-overline"
                >
                  {column.label}
                </text>
              ) : null,
            )}
            {active !== null && (
              <line x1={x(active)} x2={x(active)} y1={TOP} y2={TOP + height} stroke="currentColor" className="text-muted-foreground/40" shapeRendering="crispEdges" />
            )}
            {series.map((s) => {
              const line = columns.map((column, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(column.values[s.id] ?? 0)}`).join("");
              return (
                <g key={s.id}>
                  {series.length === 1 && count > 1 && (
                    <path d={`${line}L${x(count - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={seriesColor(s.color)} fillOpacity={0.1} />
                  )}
                  <path d={line} fill="none" stroke={seriesColor(s.color)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                </g>
              );
            })}
            {active !== null &&
              series.map((s) => (
                <circle
                  key={s.id}
                  cx={x(active)}
                  cy={y(columns[active].values[s.id] ?? 0)}
                  r={4}
                  fill={seriesColor(s.color)}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
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
            // Highest line first, as it reads on the chart.
            series={[...series].sort((a, b) => (columns[active].values[b.id] ?? 0) - (columns[active].values[a.id] ?? 0))}
            total={totals[active]}
            totalLabel={series.length > 1 ? totalLabel : undefined}
            formatValue={formatValue}
            x={x(active)}
            flip={x(active) > width / 2}
          />
        )}
      </div>
    </div>
  );
}
