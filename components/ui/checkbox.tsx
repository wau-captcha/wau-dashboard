"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<BaseCheckbox.Root.Props, "className" | "children"> & {
  /** Text next to the box. Clicking it toggles the checkbox. */
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function Checkbox({ label, description, indeterminate, className, ...props }: CheckboxProps) {
  const descriptionId = useId();

  const box = (
    <BaseCheckbox.Root
      data-slot="checkbox"
      indeterminate={indeterminate}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-foreground/30 bg-muted text-primary-foreground outline-none",
        "transition-colors hover:border-foreground/50 focus-visible:border-focus-border focus-visible:shadow-focus",
        "data-[checked]:border-primary data-[checked]:bg-primary data-[indeterminate]:border-primary data-[indeterminate]:bg-primary",
        "data-[invalid]:border-error-border data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        !label && className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex items-center justify-center">
        {indeterminate ? <Minus className="size-3" strokeWidth={3} /> : <Check className="size-3" strokeWidth={3} />}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );

  if (!label) return box;

  return (
    <label
      data-slot="checkbox-label"
      className={cn(
        "inline-flex cursor-pointer items-start gap-2 has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50",
        className,
      )}
    >
      {box}
      <span className="grid gap-0.5">
        <span className="text-body leading-4 text-foreground">{label}</span>
        {description && (
          <span id={descriptionId} className="text-overline text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
