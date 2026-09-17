"use client";

import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SegmentedOption<V extends string> = {
  value: V;
  /** Visible content: short text, an icon, or both. */
  label: ReactNode;
  /** Accessible name when the label is an icon or an abbreviation. */
  ariaLabel?: string;
  /** Hover hint, usually the same as ariaLabel. */
  title?: string;
};

export type SegmentedControlProps<V extends string> = {
  options: readonly SegmentedOption<V>[];
  value: V;
  onValueChange: (value: V) => void;
  "aria-label": string;
  disabled?: boolean;
  className?: string;
};

/**
 * One choice among a few always-visible options (theme, language). Arrow keys move between
 * options; exactly one stays pressed.
 */
export function SegmentedControl<V extends string>({
  options,
  value,
  onValueChange,
  disabled,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<V>) {
  return (
    <ToggleGroup<V>
      data-slot="segmented-control"
      aria-label={ariaLabel}
      value={[value]}
      onValueChange={(next) => {
        // Pressing the active option empties the group; ignore that so one option stays selected.
        if (next.length > 0 && next[0] !== value) onValueChange(next[0]);
      }}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border bg-muted p-0.5 data-[disabled]:opacity-60",
        className,
      )}
    >
      {options.map((option) => (
        <Toggle<V>
          key={option.value}
          value={option.value}
          data-value={option.value}
          aria-label={option.ariaLabel}
          title={option.title}
          className={cn(
            "flex h-6 cursor-pointer items-center justify-center gap-1 rounded-sm px-2 text-overline font-medium text-muted-foreground outline-none transition-colors",
            "hover:text-accent-foreground focus-visible:shadow-focus data-[disabled]:cursor-not-allowed",
            "data-[pressed]:bg-background data-[pressed]:text-accent-foreground data-[pressed]:shadow-sm",
            "[&_svg:not([class*='size-'])]:size-3.5",
          )}
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
