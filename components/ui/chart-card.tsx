import type { ComponentProps, ReactNode } from "react";
import { Card } from "./card";
import { cn } from "@/lib/utils";

export type ChartCardProps = Omit<ComponentProps<"div">, "title"> & {
  /** What is measured and over which period, e.g. "Solves in the last 30 days". */
  label: ReactNode;
  /** The headline figure of that period, e.g. the total. */
  value: ReactNode;
  /** Chart. */
  children: ReactNode;
  /** Line between the chart and the footer, e.g. "2 API keys". */
  caption?: ReactNode;
  /** Under the chart, e.g. a <SeriesTable /> of the same numbers. */
  footer?: ReactNode;
};

/**
 * A chart spanning its card, in the style of OpenRouter's activity page: a muted label, the
 * period's figure in large type, the chart, then a count and a table of the series.
 */
export function ChartCard({ label, value, children, caption, footer, className, ...props }: ChartCardProps) {
  return (
    <Card data-slot="chart-card" className={cn("gap-5 p-5", className)} {...props}>
      <div className="grid gap-1">
        <h3 className="text-body text-muted-foreground">{label}</h3>
        <p className="font-brand text-display font-semibold tracking-tight text-foreground">{value}</p>
      </div>
      {children}
      {(caption || footer) && (
        <div className="grid gap-3">
          {caption && <p className="text-body text-muted-foreground">{caption}</p>}
          {footer}
        </div>
      )}
    </Card>
  );
}
