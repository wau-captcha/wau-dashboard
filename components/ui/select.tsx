"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown, X } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  controlHeight,
  controlIconButton,
  controlTrigger,
  popupItem,
  popupMotion,
  popupSurface,
  type ControlSize,
} from "./control";
import {
  groupOptions,
  joinOptionLabels,
  OptionContent,
  useSelection,
  type OptionValue,
  type SelectionProps,
  type SelectOption,
} from "./options";
import { useUIText } from "./locale";

export type SelectBaseProps<V extends OptionValue> = {
  options: readonly SelectOption<V>[];
  placeholder?: string;
  size?: ControlSize;
  /** Shows a clear button while something is selected. */
  clearable?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Submits the selected value(s) with the enclosing form. */
  name?: string;
  id?: string;
  /** Classes for the outer element (width, margins). */
  className?: string;
  popupClassName?: string;
  "aria-label"?: string;
  /** Custom row content. Defaults to icon, label and description. */
  renderOption?: (option: SelectOption<V>) => ReactNode;
};

export type SelectProps<V extends OptionValue = string> = SelectBaseProps<V> & SelectionProps<V>;

/**
 * Picks one or several options from a short list, without search.
 * For long lists use Combobox, which adds a search box.
 */
export function Select<V extends OptionValue = string>(props: SelectProps<V>) {
  const {
    options,
    placeholder,
    size = "md",
    clearable,
    invalid,
    disabled,
    readOnly,
    required,
    name,
    id,
    className,
    popupClassName,
    "aria-label": ariaLabel,
    renderOption,
  } = props;
  const text = useUIText().select;
  const selection = useSelection(props);
  const items = useMemo(() => options.map(({ value, label }) => ({ value, label })), [options]);
  const groups = useMemo(() => groupOptions(options), [options]);
  const labels = selection.values.map((value) => options.find((option) => option.value === value)?.label ?? String(value));
  const hasValue = labels.length > 0;
  const showClear = clearable && hasValue && !disabled && !readOnly;

  const renderItem = (option: SelectOption<V>) => (
    <BaseSelect.Item
      key={String(option.value)}
      value={option.value}
      disabled={option.disabled}
      label={option.label}
      className={cn(popupItem, "pr-8")}
    >
      {renderOption ? renderOption(option) : <OptionContent option={option} />}
      <BaseSelect.ItemIndicator className="absolute right-2 flex items-center text-accent-foreground">
        <Check className="size-4" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );

  return (
    <div data-slot="select" className={cn("relative w-full min-w-0", className)}>
      <BaseSelect.Root<V, boolean>
        items={items}
        multiple={selection.multiple}
        value={selection.multiple ? selection.values : (selection.values[0] ?? null)}
        onValueChange={(next) => selection.setValues(next == null ? [] : Array.isArray(next) ? next : [next])}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        name={name}
        id={id}
      >
        <BaseSelect.Trigger
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          className={cn("group", controlTrigger, controlHeight[size])}
        >
          {/* mr-6 leaves room for the clear button, which sits over the trigger just before the chevron. */}
          <span className={cn("min-w-0 flex-1 truncate", !hasValue && "text-muted-foreground", showClear && "mr-6")}>
            {hasValue ? joinOptionLabels(labels) : (placeholder ?? text.placeholder)}
          </span>
          <BaseSelect.Icon className="flex shrink-0 text-muted-foreground transition-transform duration-150 group-data-[popup-open]:rotate-180">
            <ChevronDown className="size-4" />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner alignItemWithTrigger={false} align="start" sideOffset={4} className="z-popover outline-none">
            <BaseSelect.Popup
              className={cn(
                popupSurface,
                popupMotion,
                "max-h-[min(var(--available-height),24rem)] min-w-(--anchor-width) overflow-y-auto p-1 scrollbar-thin",
                popupClassName,
              )}
            >
              <BaseSelect.List>
                {options.length === 0 && (
                  <div className="px-2 py-4 text-center text-body text-muted-foreground">{text.noOptions}</div>
                )}
                {groups
                  ? groups.map((group) => (
                      <BaseSelect.Group key={group.value} className="py-0.5">
                        {group.value && (
                          <BaseSelect.GroupLabel className="px-2 py-1.5 text-overline font-medium text-muted-foreground">
                            {group.value}
                          </BaseSelect.GroupLabel>
                        )}
                        {group.items.map(renderItem)}
                      </BaseSelect.Group>
                    ))
                  : options.map(renderItem)}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
      {showClear && (
        <button
          type="button"
          aria-label={text.clear}
          onClick={() => selection.setValues([])}
          className={cn(controlIconButton, "absolute right-8 top-1/2 -translate-y-1/2")}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
