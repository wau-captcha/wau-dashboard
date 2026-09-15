import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "border-border bg-muted text-muted-foreground",
  primary: "border-accent-border bg-accent text-accent-foreground",
  info: "border-info/14 bg-info/12 text-info-text",
  positive: "border-positive/14 bg-positive/12 text-positive-text",
  warning: "border-warning/14 bg-warning/12 text-warning-text",
  negative: "border-negative/14 bg-negative/12 text-negative-text",
  outline: "border-border bg-background text-foreground",
} as const;

const sizes = {
  sm: "px-1.5 py-0",
  md: "px-2.5 py-0.5",
} as const;

export type BadgeTone = keyof typeof tones;

export type BadgeProps = ComponentProps<"span"> & {
  tone?: BadgeTone;
  size?: keyof typeof sizes;
  /** Shows a status dot before the label. */
  dot?: boolean;
};

/** Small pill for statuses, tiers and counts. */
export function Badge({ tone = "neutral", size = "md", dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border text-overline font-medium",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
        tones[tone],
        sizes[size],
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}
