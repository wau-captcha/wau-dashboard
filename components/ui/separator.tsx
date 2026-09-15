import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SeparatorProps = ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
  /** Purely visual separators are hidden from assistive technology. */
  decorative?: boolean;
};

export function Separator({ orientation = "horizontal", decorative = true, className, ...props }: SeparatorProps) {
  return (
    <div
      data-slot="separator"
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
      {...props}
    />
  );
}
