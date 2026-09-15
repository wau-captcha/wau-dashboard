import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardProps = ComponentProps<"div"> & {
  /** Adds the hover wash used for clickable cards. */
  interactive?: boolean;
};

export function Card({ interactive, className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        interactive && "cursor-pointer transition-colors hover:bg-card-hover",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex items-start justify-between gap-4 px-5 pt-5 last:pb-5", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("text-heading font-medium text-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("mt-1 text-body text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-5 py-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2 border-t border-border px-5 py-3", className)}
      {...props}
    />
  );
}

export type StatCardProps = Omit<ComponentProps<"div">, "title"> & {
  label: ReactNode;
  value: ReactNode;
  /** Secondary line under the value, e.g. a trend badge or a comparison. */
  hint?: ReactNode;
  icon?: ReactNode;
};

/** A compact metric tile. */
export function StatCard({ label, value, hint, icon, className, ...props }: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn("flex flex-col justify-between gap-3 rounded-lg border border-border bg-card p-4", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 text-body text-muted-foreground">
        <span className="truncate">{label}</span>
        {icon && <span className="shrink-0 [&_svg:not([class*='size-'])]:size-4">{icon}</span>}
      </div>
      <div className="grid gap-1">
        <span className="font-brand text-display font-semibold tracking-tight text-foreground tabular-nums">{value}</span>
        {hint && <div className="text-overline text-muted-foreground">{hint}</div>}
      </div>
    </div>
  );
}
