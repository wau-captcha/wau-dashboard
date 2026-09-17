"use client";

import { Input } from "@base-ui/react/input";
import { CalendarDays, X } from "lucide-react";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  addDays,
  addMonths,
  compareDay,
  isSameDay,
  parseDisplayDate,
  startOfDay,
  startOfMonth,
  toISODate,
  type WeekStart,
} from "@/lib/date";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Calendar, type DateRange } from "./calendar";
import {
  controlBox,
  controlHeight,
  controlIconButton,
  controlInput,
  controlTrigger,
  type ControlSize,
} from "./control";
import { useFormatter, useUIText } from "./locale";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DateConstraints = {
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  weekStartsOn?: WeekStart;
  /** Intl tag for the calendar; defaults to the active language. */
  locale?: string;
};

function isAllowed(date: Date, { min, max, isDateDisabled }: DateConstraints) {
  if (min && compareDay(date, min) < 0) return false;
  if (max && compareDay(date, max) > 0) return false;
  return !isDateDisabled?.(date);
}

/** Focuses the selected (or today's) day when a calendar popup opens. */
function focusCalendarDay(popup: HTMLElement | null) {
  return popup?.querySelector<HTMLElement>("button[data-focused]") ?? true;
}

export type DateInputProps = DateConstraints & {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  size?: ControlSize;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** Submits the date as yyyy-mm-dd with the enclosing form. */
  name?: string;
  id?: string;
  /** Classes for the outer box (width, margins). */
  className?: string;
  "aria-label"?: string;
};

/**
 * Date field: type day/month/year (e.g. 15/09/2026) or pick from the calendar (button or Alt+↓).
 * Invalid or out-of-range text reverts to the last valid date on blur.
 */
export function DateInput({
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  isDateDisabled,
  weekStartsOn,
  locale: localeProp,
  size = "md",
  placeholder = "dd/mm/yyyy",
  clearable = true,
  disabled,
  readOnly,
  required,
  invalid,
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: DateInputProps) {
  const labels = useUIText().dateInput;
  const format = useFormatter();
  const locale = localeProp ?? format.intl;
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(defaultValue);
  const current = value !== undefined ? value : uncontrolledValue;
  const [text, setText] = useState(() => (current ? formatDate(current, locale) : ""));
  const [textSource, setTextSource] = useState(current);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Re-sync the text when the value changes from outside the input.
  if (!isSameDay(textSource, current)) {
    setTextSource(current);
    setText(current ? formatDate(current, locale) : "");
  }

  function commit(next: Date | null) {
    if (isSameDay(next, current)) {
      setText(current ? formatDate(current, locale) : "");
      return;
    }
    if (value === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  }

  function commitText() {
    const trimmed = text.trim();
    if (!trimmed) {
      commit(null);
      return;
    }
    const parsed = parseDisplayDate(trimmed);
    if (parsed && isAllowed(parsed, { min, max, isDateDisabled })) commit(parsed);
    else setText(current ? formatDate(current, locale) : "");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      commitText();
    } else if (event.key === "ArrowDown" && event.altKey) {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div ref={boxRef} data-slot="date-input" className={cn(controlBox, controlHeight[size], className)}>
        <Input
          id={id}
          value={text}
          onValueChange={(next) => setText(next)}
          onBlur={commitText}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          inputMode="numeric"
          autoComplete="off"
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          className={cn(controlInput, "pr-1 tabular-nums")}
        />
        {clearable && current && !disabled && !readOnly && (
          <button
            type="button"
            aria-label={labels.clearDate}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => commit(null)}
            className={controlIconButton}
          >
            <X className="size-3.5" />
          </button>
        )}
        <PopoverTrigger aria-label={labels.openCalendar} disabled={disabled || readOnly} className={cn(controlIconButton, "mr-2")}>
          <CalendarDays />
        </PopoverTrigger>
      </div>
      <PopoverContent
        ref={popupRef}
        anchor={boxRef}
        align="start"
        sideOffset={4}
        initialFocus={() => focusCalendarDay(popupRef.current)}
        className="w-auto p-0"
      >
        <Calendar
          value={current}
          onValueChange={(date) => {
            commit(date);
            setOpen(false);
          }}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
          weekStartsOn={weekStartsOn}
          locale={locale}
        />
      </PopoverContent>
      {name && <input type="hidden" name={name} value={current ? toISODate(current) : ""} />}
    </Popover>
  );
}

export type DateRangePreset = {
  label: string;
  /** Receives today at 00:00 local time. */
  getRange: (today: Date) => DateRange;
};

/** Common ranges for reports and usage filters, labelled in the active language. */
export function useDateRangePresets(): DateRangePreset[] {
  const labels = useUIText().dateInput.presets;
  return useMemo(
    () => [
      { label: labels.today, getRange: (today) => ({ from: today, to: today }) },
      { label: labels.last7Days, getRange: (today) => ({ from: addDays(today, -6), to: today }) },
      { label: labels.last30Days, getRange: (today) => ({ from: addDays(today, -29), to: today }) },
      { label: labels.thisMonth, getRange: (today) => ({ from: startOfMonth(today), to: today }) },
      {
        label: labels.lastMonth,
        getRange: (today) => ({ from: addMonths(startOfMonth(today), -1), to: addDays(startOfMonth(today), -1) }),
      },
    ],
    [labels],
  );
}

const EMPTY_RANGE: DateRange = { from: null, to: null };

export type DateRangeInputProps = DateConstraints & {
  value?: DateRange;
  defaultValue?: DateRange;
  /** Fires once both ends are picked, a preset is chosen, or the range is cleared. */
  onValueChange?: (range: DateRange) => void;
  /** Quick picks shown beside the calendar, e.g. `useDateRangePresets()`. */
  presets?: DateRangePreset[];
  numberOfMonths?: 1 | 2;
  size?: ControlSize;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  /** Classes for the outer element (width, margins). */
  className?: string;
  "aria-label"?: string;
};

/** Picks a from–to range of calendar dates. */
export function DateRangeInput({
  value,
  defaultValue = EMPTY_RANGE,
  onValueChange,
  presets,
  numberOfMonths = 1,
  min,
  max,
  isDateDisabled,
  weekStartsOn,
  locale: localeProp,
  size = "md",
  placeholder: placeholderProp,
  clearable = true,
  disabled,
  invalid,
  id,
  className,
  "aria-label": ariaLabel,
}: DateRangeInputProps) {
  const text = useUIText().dateInput;
  const format = useFormatter();
  const locale = localeProp ?? format.intl;
  const placeholder = placeholderProp ?? text.rangePlaceholder;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const current = value ?? uncontrolledValue;
  const [draft, setDraft] = useState<DateRange>(current);
  const [open, setOpen] = useState(false);
  const [today] = useState(() => startOfDay(new Date()));
  const popupRef = useRef<HTMLDivElement>(null);
  const hasValue = current.from !== null;

  function commit(next: DateRange) {
    if (value === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  }

  function handleOpenChange(next: boolean) {
    if (next) setDraft(current);
    setOpen(next);
  }

  function handleSelect(next: DateRange) {
    setDraft(next);
    if (next.from && next.to) {
      commit(next);
      setOpen(false);
    }
  }

  return (
    <div data-slot="date-range-input" className={cn("relative w-full min-w-0", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          id={id}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          className={cn(controlTrigger, controlHeight[size], clearable && hasValue && "pr-9")}
        >
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          <span className={cn("min-w-0 flex-1 truncate tabular-nums", !hasValue && "text-muted-foreground")}>
            {current.from
              ? `${formatDate(current.from, locale)} – ${current.to ? formatDate(current.to, locale) : "…"}`
              : placeholder}
          </span>
        </PopoverTrigger>
        <PopoverContent
          ref={popupRef}
          align="start"
          sideOffset={4}
          initialFocus={() => focusCalendarDay(popupRef.current)}
          className="flex w-auto p-0"
        >
          {presets && presets.length > 0 && (
            <div className="flex w-36 shrink-0 flex-col gap-0.5 border-r border-border p-2">
              {presets.map((preset) => {
                const presetRange = preset.getRange(today);
                const active = isSameDay(presetRange.from, current.from) && isSameDay(presetRange.to, current.to);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      commit(preset.getRange(startOfDay(new Date())));
                      setOpen(false);
                    }}
                    className={cn(
                      "cursor-pointer rounded-sm px-2 py-1.5 text-left text-body font-medium text-foreground outline-none transition-colors",
                      "hover:bg-card-hover hover:text-accent-foreground focus-visible:shadow-focus",
                      active && "bg-accent text-accent-foreground hover:bg-accent",
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          )}
          <Calendar
            mode="range"
            value={draft}
            onValueChange={handleSelect}
            numberOfMonths={numberOfMonths}
            min={min}
            max={max}
            isDateDisabled={isDateDisabled}
            weekStartsOn={weekStartsOn}
            locale={locale}
          />
        </PopoverContent>
      </Popover>
      {clearable && hasValue && !disabled && (
        <button
          type="button"
          aria-label={text.clearRange}
          onClick={() => commit(EMPTY_RANGE)}
          className={cn(controlIconButton, "absolute right-2 top-1/2 -translate-y-1/2")}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
