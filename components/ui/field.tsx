"use client";

import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FieldProps = Omit<BaseField.Root.Props, "children"> & {
  label?: ReactNode;
  /** Helper text under the control. */
  description?: ReactNode;
  /** Error message. Setting it marks the field invalid; omit it to show native validation messages. */
  error?: ReactNode;
  /** Adds a required marker to the label. Put `required` on the control itself for validation. */
  required?: boolean;
  /** Content aligned to the right of the label, e.g. a "Forgot password?" link. */
  labelAction?: ReactNode;
  /**
   * Set to false when the control is a button (Select, Combobox, DateInput) so clicking the label
   * does not press it.
   */
  nativeLabel?: boolean;
  children: ReactNode;
};

/**
 * Labels, describes and validates one form control.
 * Works with TextInput, Textarea, NumberInput, Select, Combobox, Checkbox and Switch.
 */
export function Field({
  label,
  description,
  error,
  required,
  labelAction,
  nativeLabel = true,
  invalid,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <BaseField.Root
      data-slot="field"
      invalid={invalid ?? (error ? true : undefined)}
      className={cn("flex min-w-0 flex-col gap-1.5", className)}
      {...props}
    >
      {(label || labelAction) && (
        <div className="flex min-h-4 items-center justify-between gap-2">
          {label && (
            <FieldLabel required={required} nativeLabel={nativeLabel} render={nativeLabel ? undefined : <div />}>
              {label}
            </FieldLabel>
          )}
          {labelAction && <div className="text-body">{labelAction}</div>}
        </div>
      )}
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      {error ? <FieldError match>{error}</FieldError> : <FieldError />}
    </BaseField.Root>
  );
}

export type FieldLabelProps = BaseField.Label.Props & { required?: boolean };

export function FieldLabel({ required, className, children, ...props }: FieldLabelProps) {
  return (
    <BaseField.Label
      data-slot="field-label"
      className={cn(
        "inline-flex items-center gap-1 text-body font-medium leading-none text-foreground data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden className="text-negative">
          *
        </span>
      )}
    </BaseField.Label>
  );
}

export function FieldDescription({ className, ...props }: BaseField.Description.Props) {
  return (
    <BaseField.Description
      data-slot="field-description"
      className={cn("text-overline text-muted-foreground", className)}
      {...props}
    />
  );
}

export function FieldError({ className, ...props }: BaseField.Error.Props) {
  return (
    <BaseField.Error
      data-slot="field-error"
      className={cn("text-overline font-medium text-negative-text", className)}
      {...props}
    />
  );
}

export type LabelProps = ComponentProps<"label"> & { required?: boolean };

/** A standalone label for controls used outside of Field. */
export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn("inline-flex items-center gap-1 text-body font-medium leading-none text-foreground", className)}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden className="text-negative">
          *
        </span>
      )}
    </label>
  );
}
