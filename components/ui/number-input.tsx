"use client";

import { NumberField } from "@base-ui/react/number-field";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";
import { DEFAULT_LOCALE } from "@/lib/format";
import { cn } from "@/lib/utils";
import { controlAdornment, controlBox, controlHeight, controlInput, type ControlSize } from "./control";

export type NumberInputProps = Omit<NumberField.Root.Props, "className" | "render" | "children" | "style"> & {
  size?: ControlSize;
  placeholder?: string;
  /** Icon or text before the value, e.g. "₫". */
  startAdornment?: ReactNode;
  /** Icon or text after the value, e.g. "giây". */
  endAdornment?: ReactNode;
  /** Hides the increment/decrement buttons. Arrow keys still step the value. */
  hideStepper?: boolean;
  invalid?: boolean;
  /** Classes for the outer element (width, margins). */
  className?: string;
  inputClassName?: string;
};

const stepperButton =
  "flex min-h-0 flex-1 cursor-pointer items-center justify-center text-muted-foreground outline-none transition-colors " +
  "hover:bg-muted hover:text-foreground active:bg-muted/80 focus-visible:bg-muted " +
  "disabled:pointer-events-none disabled:opacity-40 data-[disabled]:pointer-events-none data-[disabled]:opacity-40";

/**
 * Numeric input with locale formatting, min/max clamping and stepping
 * (↑/↓ = step, Shift = largeStep, Alt = smallStep).
 * `onValueChange` receives a number or null when empty.
 */
export function NumberInput({
  size = "md",
  placeholder,
  startAdornment,
  endAdornment,
  hideStepper,
  invalid,
  className,
  inputClassName,
  locale = DEFAULT_LOCALE,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: NumberInputProps) {
  return (
    <NumberField.Root data-slot="number-input" locale={locale} className={cn("w-full min-w-0", className)} {...props}>
      <NumberField.Group className={cn(controlBox, controlHeight[size])}>
        {startAdornment && <span className={cn(controlAdornment, "pl-3")}>{startAdornment}</span>}
        <NumberField.Input
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={invalid || undefined}
          className={cn(controlInput, "tabular-nums", startAdornment && "pl-2", endAdornment && "pr-2", inputClassName)}
        />
        {endAdornment && <span className={cn(controlAdornment, hideStepper ? "pr-3" : "pr-2")}>{endAdornment}</span>}
        {!hideStepper && (
          <span className="flex h-full w-7 shrink-0 flex-col border-l border-input">
            <NumberField.Increment aria-label="Tăng" className={stepperButton}>
              <ChevronUp className="size-3.5" />
            </NumberField.Increment>
            <NumberField.Decrement aria-label="Giảm" className={cn(stepperButton, "border-t border-input")}>
              <ChevronDown className="size-3.5" />
            </NumberField.Decrement>
          </span>
        )}
      </NumberField.Group>
    </NumberField.Root>
  );
}
