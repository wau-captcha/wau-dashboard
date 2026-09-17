import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PageHeaderProps = {
  title: ReactNode;
  /** 1 for the page title, 2 for a section inside the page. */
  level?: 1 | 2;
  description?: ReactNode;
  /** Buttons on the right of the title row. */
  actions?: ReactNode;
  /** Content beside the title, e.g. a status Badge. */
  children?: ReactNode;
  className?: string;
};

/** Title block that opens every page. */
export function PageHeader({ title, level = 1, description, actions, children, className }: PageHeaderProps) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div data-slot="page-header" className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="grid min-w-0 gap-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <Heading className="font-brand text-title font-semibold tracking-tight text-foreground">{title}</Heading>
          {children}
        </div>
        {description && <p className="max-w-2xl text-body text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
