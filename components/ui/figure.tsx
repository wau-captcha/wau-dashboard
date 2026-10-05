import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FigureProps = Omit<ComponentProps<"figure">, "children"> & {
  children: ReactNode;
  caption?: ReactNode;
  /** Classes for the frame around the media, e.g. a fixed aspect ratio. */
  frameClassName?: string;
};

/** A framed illustration: the media centred on the muted surface, with an optional caption under it. */
export function Figure({ caption, className, frameClassName, children, ...props }: FigureProps) {
  return (
    <figure data-slot="figure" className={cn("grid min-w-0 content-start gap-2", className)} {...props}>
      <div
        className={cn(
          "flex min-w-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-border bg-muted p-4 sm:p-6",
          frameClassName,
        )}
      >
        {children}
      </div>
      {caption && <figcaption className="text-overline text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
