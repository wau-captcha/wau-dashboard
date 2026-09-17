import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DescriptionItem = {
  label: ReactNode;
  value: ReactNode;
};

export type DescriptionListProps = {
  items: DescriptionItem[];
  /** Columns from the `sm` breakpoint up; one column on phones. */
  columns?: 1 | 2 | 3;
  className?: string;
};

const columnClass = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
} as const;

/** Label and value pairs, e.g. account or key details. */
export function DescriptionList({ items, columns = 2, className }: DescriptionListProps) {
  return (
    <dl data-slot="description-list" className={cn("grid gap-4 sm:gap-5", columnClass[columns], className)}>
      {items.map((item, index) => (
        <div key={index} className="grid min-w-0 gap-1">
          <dt className="text-overline font-medium text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 text-body text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
