"use client";

import { LineChart } from "@/components/ui/line-chart";
import type { ChartColumn } from "@/components/ui/chart-parts";
import { useI18n } from "@/lib/i18n/client";

const DISTANCE = 210;
const DURATION = 1000;
const STEP = 50;

/** A hand: speeds up, overshoots the target by a few pixels as it brakes, and corrects. */
function hand(t: number): number {
  const share = t / DURATION;
  if (share >= 0.85) return Math.round(DISTANCE + 6 * (1 - (share - 0.85) / 0.15));
  const s = share / 0.85;
  return Math.round((DISTANCE + 6) * (10 * s ** 3 - 15 * s ** 4 + 6 * s ** 5));
}

/** The distance a hand and a script cover in the same second, for the behaviour check page. */
export function BehaviorChart() {
  const text = useI18n().t.captchaGuides.behavior;
  const columns: ChartColumn[] = [];
  for (let t = 0; t <= DURATION; t += STEP) {
    columns.push({ label: `${t} ms`, title: `${t} ms`, values: { hand: hand(t), script: Math.round((DISTANCE * t) / DURATION) } });
  }

  return (
    <LineChart
      aria-label={text.chartLabel}
      columns={columns}
      series={[
        { id: "hand", label: text.chartHand, color: 1 },
        { id: "script", label: text.chartScript, color: 4 },
      ]}
      formatValue={(value) => `${value} px`}
      height={200}
    />
  );
}
