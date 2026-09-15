import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones: Record<AlertTone, { box: string; icon: string; Icon: LucideIcon }> = {
  neutral: { box: "border-border bg-muted", icon: "text-muted-foreground", Icon: Info },
  info: { box: "border-info/30 bg-info-bg", icon: "text-info-text", Icon: Info },
  positive: { box: "border-positive/30 bg-positive-bg", icon: "text-positive-text", Icon: CircleCheck },
  warning: { box: "border-warning/30 bg-warning-bg", icon: "text-warning-text", Icon: TriangleAlert },
  negative: { box: "border-negative/30 bg-negative-bg", icon: "text-negative-text", Icon: CircleAlert },
};

export type AlertTone = "neutral" | "info" | "positive" | "warning" | "negative";

export type AlertProps = Omit<ComponentProps<"div">, "title"> & {
  tone?: AlertTone;
  title?: ReactNode;
  /** Replaces the tone icon; pass `null` to hide it. */
  icon?: ReactNode;
  /** Content on the right, e.g. a small button. */
  action?: ReactNode;
};

/**
 * Inline message inside page content. For transient feedback use `toast`.
 * Add `role="alert"` only when the message appears in response to a user action.
 */
export function Alert({ tone = "info", title, icon, action, className, children, ...props }: AlertProps) {
  const { box, icon: iconClassName, Icon } = tones[tone];

  return (
    <div
      data-slot="alert"
      data-tone={tone}
      className={cn("flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-body text-foreground", box, className)}
      {...props}
    >
      {icon === undefined ? (
        <Icon aria-hidden className={cn("mt-[3px] size-4 shrink-0", iconClassName)} />
      ) : (
        icon && <span className={cn("mt-[3px] flex shrink-0 [&_svg]:size-4", iconClassName)}>{icon}</span>
      )}
      <div className="grid min-w-0 flex-1 gap-0.5">
        {title && <p className="font-medium text-foreground">{title}</p>}
        {children && <div className="text-muted-foreground">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
