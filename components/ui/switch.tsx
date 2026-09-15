"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SwitchProps = Omit<BaseSwitch.Root.Props, "className" | "children"> & {
  /** Text next to the switch. Clicking it toggles the switch. */
  label?: ReactNode;
  description?: ReactNode;
  /** Puts the label before the switch, as in settings rows. */
  labelPosition?: "start" | "end";
  className?: string;
};

export function Switch({ label, description, labelPosition = "end", className, ...props }: SwitchProps) {
  const descriptionId = useId();

  const control = (
    <BaseSwitch.Root
      data-slot="switch"
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-foreground/30 outline-none",
        "transition-colors hover:bg-foreground/40 focus-visible:border-focus-border focus-visible:shadow-focus",
        "data-[checked]:bg-primary data-[checked]:hover:bg-primary-hover",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        !label && className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb className="pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform duration-150 ease-smooth-out group-data-[checked]:translate-x-4" />
    </BaseSwitch.Root>
  );

  if (!label) return control;

  const text = (
    <span className="grid gap-0.5">
      <span className="text-body leading-5 text-foreground">{label}</span>
      {description && (
        <span id={descriptionId} className="text-overline text-muted-foreground">
          {description}
        </span>
      )}
    </span>
  );

  return (
    <label
      data-slot="switch-label"
      className={cn(
        "inline-flex cursor-pointer items-start gap-3 has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50",
        labelPosition === "start" && "justify-between",
        className,
      )}
    >
      {labelPosition === "start" ? (
        <>
          {text}
          {control}
        </>
      ) : (
        <>
          {control}
          {text}
        </>
      )}
    </label>
  );
}
