"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  controlHeight,
  controlIconButton,
  controlTrigger,
  popupItem,
  popupMotion,
  popupSurface,
} from "./control";
import {
  groupOptions,
  joinOptionLabels,
  OptionContent,
  useSelection,
  type OptionGroup,
  type OptionValue,
  type SelectOption,
} from "./options";
import { Select, type SelectProps } from "./select";
import { useUIText } from "./locale";
import { Spinner } from "./spinner";

/** With `searchable="auto"`, lists longer than this get a search box. */
export const COMBOBOX_SEARCH_THRESHOLD = 8;

export type ComboboxProps<V extends OptionValue = string> = SelectProps<V> & {
  /**
   * `true` always shows the search box, `false` never does (renders a plain Select),
   * `"auto"` shows it for more than COMBOBOX_SEARCH_THRESHOLD options or when `onSearchChange` is set.
   */
  searchable?: boolean | "auto";
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;
  /**
   * Called as the user types. Setting it turns off built-in filtering:
   * fetch matching options and pass them back through `options`.
   */
  onSearchChange?: (query: string) => void;
  /** Shows a spinner in the search box while options are being fetched. */
  loading?: boolean;
};

/** Select with an optional search box; the same props as Select plus search options. */
export function Combobox<V extends OptionValue = string>(props: ComboboxProps<V>) {
  const { searchable = "auto", options, onSearchChange } = props;
  const withSearch =
    searchable === true || (searchable === "auto" && (options.length > COMBOBOX_SEARCH_THRESHOLD || !!onSearchChange));
  return withSearch ? <SearchableCombobox {...props} /> : <Select {...props} />;
}

function SearchableCombobox<V extends OptionValue>(props: ComboboxProps<V>) {
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
    searchPlaceholder,
    emptyMessage,
    onSearchChange,
    loading,
  } = props;
  const text = useUIText().select;
  const selection = useSelection(props);
  const [query, setQuery] = useState("");
  // Keeps labels of selected options that a remote search has since filtered out of `options`.
  const [rememberedOptions, setRememberedOptions] = useState<SelectOption<V>[]>([]);
  const groups = useMemo(() => groupOptions(options), [options]);

  const selectedOptions = selection.values.map(
    (value) =>
      options.find((option) => option.value === value) ??
      rememberedOptions.find((option) => option.value === value) ?? { value, label: String(value) },
  );
  const hasValue = selectedOptions.length > 0;
  const showClear = clearable && hasValue && !disabled && !readOnly;

  function handleValueChange(next: SelectOption<V> | SelectOption<V>[] | null) {
    const list = next == null ? [] : Array.isArray(next) ? next : [next];
    setRememberedOptions(list);
    selection.setValues(list.map((option) => option.value));
  }

  function handleQueryChange(next: string) {
    setQuery(next);
    onSearchChange?.(next);
  }

  const renderItem = (option: SelectOption<V>) => (
    <BaseCombobox.Item
      key={String(option.value)}
      value={option}
      disabled={option.disabled}
      className={cn(popupItem, "pr-8")}
    >
      {renderOption ? renderOption(option) : <OptionContent option={option} />}
      <BaseCombobox.ItemIndicator className="absolute right-2 flex items-center text-accent-foreground">
        <Check className="size-4" />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );

  return (
    <div data-slot="combobox" className={cn("relative w-full min-w-0", className)}>
      <BaseCombobox.Root<SelectOption<V>, boolean>
        items={groups ?? options}
        multiple={selection.multiple}
        value={selection.multiple ? selectedOptions : (selectedOptions[0] ?? null)}
        onValueChange={handleValueChange}
        inputValue={query}
        onInputValueChange={handleQueryChange}
        onOpenChange={(open) => {
          if (!open && query) handleQueryChange("");
        }}
        isItemEqualToValue={(item, value) => item.value === value.value}
        itemToStringLabel={(option) => option.label}
        itemToStringValue={(option) => String(option.value)}
        filter={onSearchChange ? null : undefined}
        autoHighlight
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        name={name}
        id={id}
      >
        <BaseCombobox.Trigger
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          className={cn("group", controlTrigger, controlHeight[size])}
        >
          {/* mr-6 leaves room for the clear button, which sits over the trigger just before the chevron. */}
          <span className={cn("min-w-0 flex-1 truncate", !hasValue && "text-muted-foreground", showClear && "mr-6")}>
            {hasValue ? joinOptionLabels(selectedOptions.map((option) => option.label)) : (placeholder ?? text.placeholder)}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-data-[popup-open]:rotate-180" />
        </BaseCombobox.Trigger>
        <BaseCombobox.Portal>
          <BaseCombobox.Positioner align="start" sideOffset={4} className="z-popover outline-none">
            <BaseCombobox.Popup
              aria-busy={loading || undefined}
              className={cn(
                popupSurface,
                popupMotion,
                "flex max-h-[min(var(--available-height),24rem)] w-(--anchor-width) min-w-60 flex-col overflow-hidden",
                popupClassName,
              )}
            >
              <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <BaseCombobox.Input
                  placeholder={searchPlaceholder ?? text.searchPlaceholder}
                  className="h-full w-full min-w-0 bg-transparent text-body text-foreground outline-none placeholder:text-muted-foreground/50 pointer-coarse:text-base"
                />
                {loading && <Spinner className="text-muted-foreground" />}
              </div>
              <BaseCombobox.Empty>
                {!loading && <div className="px-3 py-6 text-center text-body text-muted-foreground">{emptyMessage ?? text.noResults}</div>}
              </BaseCombobox.Empty>
              <BaseCombobox.List className="min-h-0 flex-1 overflow-y-auto p-1 scrollbar-thin data-[empty]:p-0">
                {groups
                  ? (group: OptionGroup<V>) => (
                      <BaseCombobox.Group key={group.value} items={group.items} className="py-0.5">
                        {group.value && (
                          <BaseCombobox.GroupLabel className="px-2 py-1.5 text-overline font-medium text-muted-foreground">
                            {group.value}
                          </BaseCombobox.GroupLabel>
                        )}
                        <BaseCombobox.Collection>{(option: SelectOption<V>) => renderItem(option)}</BaseCombobox.Collection>
                      </BaseCombobox.Group>
                    )
                  : (option: SelectOption<V>) => renderItem(option)}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
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
