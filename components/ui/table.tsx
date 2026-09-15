import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type TableDensity = "compact" | "regular" | "expanded";

export type TableProps = ComponentProps<"table"> & {
  /** Cell padding: compact 6×10px, regular 10×16px, expanded 14×16px. */
  density?: TableDensity;
  /** Draws the rounded frame. Turn off when the table sits inside a Card. */
  framed?: boolean;
  /** Pins the header while the body scrolls; give the container a max height. */
  stickyHeader?: boolean;
  /** Classes for the scroll container (e.g. `max-h-[480px]`). */
  containerClassName?: string;
};

/** Low-level table primitives. For sorting, selection and loading states use DataTable. */
export function Table({
  density = "regular",
  framed = true,
  stickyHeader,
  containerClassName,
  className,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      data-density={density}
      data-sticky-header={stickyHeader || undefined}
      className={cn(
        "group/table relative w-full overflow-auto bg-table scrollbar-thin",
        framed && "rounded-lg border border-border",
        containerClassName,
      )}
    >
      <table data-slot="table" className={cn("w-full caption-bottom border-collapse text-body", className)} {...props} />
    </div>
  );
}

const cellPadding =
  "px-4 py-2.5 group-data-[density=compact]/table:px-2.5 group-data-[density=compact]/table:py-1.5 group-data-[density=expanded]/table:py-3.5";

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:hover:bg-transparent", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&>tr:last-child>td]:border-b-0", className)} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-border bg-muted font-medium [&_td]:border-b-0 [&_td]:text-foreground", className)}
      {...props}
    />
  );
}

/** Set `data-state="selected"` to highlight a row. */
export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("transition-colors hover:bg-card-hover data-[state=selected]:bg-selected", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "whitespace-nowrap border-b border-border bg-table text-left align-middle text-body font-medium text-muted-foreground",
        cellPadding,
        "group-data-[sticky-header]/table:sticky group-data-[sticky-header]/table:top-0 group-data-[sticky-header]/table:z-sticky",
        "group-data-[sticky-header]/table:shadow-[inset_0_-1px_0_var(--border)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("whitespace-nowrap border-b border-border align-middle text-muted-foreground", cellPadding, className)}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("mt-3 text-overline text-muted-foreground", className)} {...props} />;
}
