import { Inbox } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EmptyStateProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Defaults to an inbox icon. */
  icon?: ReactNode;
  /** Buttons that resolve the empty state, e.g. "Tạo khóa API". */
  action?: ReactNode;
};

/** Shown when a list or table has nothing to display. */
export function EmptyState({ title, description, icon, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}
      {...props}
    >
      <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground [&_svg:not([class*='size-'])]:size-5">
        {icon ?? <Inbox />}
      </div>
      <div className="grid max-w-sm gap-1">
        <p className="text-heading font-medium text-foreground">{title}</p>
        {description && <p className="text-body text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  );
}
