import { useState, type ReactNode } from "react";

/** Values a Select or Combobox option can carry. Primitive so they serialize cleanly to forms and URLs. */
export type OptionValue = string | number;

export type SelectOption<V extends OptionValue = string> = {
  value: V;
  label: string;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  /** Options sharing a group are listed under that heading, in first-seen order. */
  group?: string;
};

export type OptionGroup<V extends OptionValue> = {
  value: string;
  items: SelectOption<V>[];
};

/** Value props shared by Select and Combobox: single (`V | null`) or multiple (`V[]`). */
export type SelectionProps<V extends OptionValue> =
  | {
      multiple?: false;
      value?: V | null;
      defaultValue?: V | null;
      onValueChange?: (value: V | null) => void;
    }
  | {
      multiple: true;
      value?: V[];
      defaultValue?: V[];
      onValueChange?: (value: V[]) => void;
    };

function toArray<V>(value: V | V[] | null | undefined): V[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

/** Normalizes single and multiple selection to an array, supporting controlled and uncontrolled use. */
export function useSelection<V extends OptionValue>(props: SelectionProps<V>) {
  const [uncontrolled, setUncontrolled] = useState<V[]>(() => toArray(props.defaultValue));
  const values = props.value !== undefined ? toArray(props.value) : uncontrolled;

  function setValues(next: V[]) {
    if (props.value === undefined) setUncontrolled(next);
    if (props.multiple === true) props.onValueChange?.(next);
    else props.onValueChange?.(next[0] ?? null);
  }

  return { multiple: props.multiple === true, values, setValues };
}

/** Returns groups when any option has a `group`, otherwise null. */
export function groupOptions<V extends OptionValue>(options: readonly SelectOption<V>[]): OptionGroup<V>[] | null {
  if (!options.some((option) => option.group)) return null;
  const groups = new Map<string, SelectOption<V>[]>();
  for (const option of options) {
    const key = option.group ?? "";
    const items = groups.get(key);
    if (items) items.push(option);
    else groups.set(key, [option]);
  }
  return Array.from(groups, ([value, items]) => ({ value, items }));
}

/** "A", "A, B", "A, B +3" */
export function joinOptionLabels(labels: string[]) {
  if (labels.length <= 2) return labels.join(", ");
  return `${labels[0]}, ${labels[1]} +${labels.length - 2}`;
}

/** Default row content: icon, label and an optional description line. */
export function OptionContent<V extends OptionValue>({ option }: { option: SelectOption<V> }) {
  return (
    <>
      {option.icon && <span className="flex shrink-0 text-muted-foreground">{option.icon}</span>}
      <span className="flex min-w-0 flex-col">
        <span className="truncate">{option.label}</span>
        {option.description && (
          <span className="truncate text-overline font-normal text-muted-foreground">{option.description}</span>
        )}
      </span>
    </>
  );
}
