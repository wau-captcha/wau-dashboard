import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Share of the limit from which the meter warns. */
const WARNING_RATIO = 0.8;

const tones = {
  normal: { track: "bg-primary/15", fill: "bg-primary" },
  warning: { track: "bg-warning/20", fill: "bg-warning" },
  full: { track: "bg-negative/20", fill: "bg-negative" },
} as const;

export type MeterProps = {
  label: ReactNode;
  value: number;
  max: number;
  /** Under the label, e.g. when the count resets. */
  description?: ReactNode;
  /** Right of the bar, e.g. "12% used". */
  valueLabel?: ReactNode;
  /** Under the bar, e.g. the exact count. */
  caption?: ReactNode;
  /** Spoken value, e.g. "120 of 1,000 verifications". */
  valueText?: string;
  className?: string;
};

/**
 * Usage of a limit as a thin bar, in the style of Claude's usage page. The fill turns amber
 * from 80% and red when the limit is reached; the track is a light step of the same colour.
 */
export function Meter({ label, value, max, description, valueLabel, caption, valueText, className }: MeterProps) {
  const ratio = max > 0 ? value / max : 1;
  const tone = tones[ratio >= 1 ? "full" : ratio >= WARNING_RATIO ? "warning" : "normal"];

  return (
    <div
      data-slot="meter"
      className={cn("grid items-center gap-x-6 gap-y-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto]", className)}
    >
      <div className="grid min-w-0 gap-0.5">
        <span className="font-medium text-foreground">{label}</span>
        {description && <span className="text-body text-muted-foreground">{description}</span>}
      </div>
      <div className="grid gap-1.5">
        <div
          role="meter"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={Math.min(value, max)}
          aria-valuetext={valueText}
          aria-label={typeof label === "string" ? label : undefined}
          className={cn("h-2 overflow-hidden rounded-full", tone.track)}
        >
          <div className={cn("h-full rounded-full transition-[width]", tone.fill)} style={{ width: `${Math.min(1, ratio) * 100}%` }} />
        </div>
        {caption && <span className="text-overline text-muted-foreground tabular-nums">{caption}</span>}
      </div>
      {valueLabel && <span className="text-body text-muted-foreground tabular-nums sm:text-right">{valueLabel}</span>}
    </div>
  );
}
