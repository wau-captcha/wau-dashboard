import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Placeholder block shown while content loads. Size it with width/height classes. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="skeleton" aria-hidden className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
  );
}
