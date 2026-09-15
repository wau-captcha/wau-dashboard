"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  addDays,
  addMonths,
  compareDay,
  compareMonth,
  getCalendarWeeks,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  type WeekStart,
} from "@/lib/date";
import { DEFAULT_LOCALE, getDateFormatter } from "@/lib/format";
import { cn } from "@/lib/utils";

export type DateRange = { from: Date | null; to: Date | null };

type CalendarBaseProps = {
  /** First visible month when controlled. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  numberOfMonths?: 1 | 2;
  /** 1 = Monday (default), 0 = Sunday. */
  weekStartsOn?: WeekStart;
  locale?: string;
  className?: string;
};

export type SingleCalendarProps = CalendarBaseProps & {
  mode?: "single";
  value: Date | null;
  onValueChange: (date: Date) => void;
};

export type RangeCalendarProps = CalendarBaseProps & {
  mode: "range";
  value: DateRange;
  onValueChange: (range: DateRange) => void;
};

export type CalendarProps = SingleCalendarProps | RangeCalendarProps;

const navButton =
  "flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground outline-none transition-colors " +
  "hover:bg-accent-subtle hover:text-accent-foreground focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-40";

/**
 * Month grid for picking a date or a date range.
 * Keyboard: arrows move by day/week, Home/End to week edges, PageUp/PageDown by month (Shift: by year).
 */
export function Calendar(props: CalendarProps) {
  const { min, max, isDateDisabled, numberOfMonths = 1, weekStartsOn = 1, locale = DEFAULT_LOCALE, className } = props;
  const range = props.mode === "range" ? props.value : null;
  const selectedDate = props.mode === "range" ? null : props.value;
  const anchor = range ? range.from : selectedDate;

  const [today] = useState(() => startOfDay(new Date()));
  const [uncontrolledMonth, setUncontrolledMonth] = useState(() => startOfMonth(props.defaultMonth ?? anchor ?? today));
  const month = props.month ? startOfMonth(props.month) : uncontrolledMonth;
  const lastMonth = addMonths(month, numberOfMonths - 1);
  const [focusedDate, setFocusedDate] = useState(() => startOfDay(anchor ?? today));
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const focusPendingRef = useRef(false);

  // Move DOM focus after keyboard navigation re-rendered the grid.
  useEffect(() => {
    if (!focusPendingRef.current) return;
    focusPendingRef.current = false;
    rootRef.current?.querySelector<HTMLButtonElement>("button[data-focused]")?.focus();
  });

  const isVisible = (date: Date) => compareMonth(date, month) >= 0 && compareMonth(date, lastMonth) <= 0;
  const isDisabled = (date: Date) =>
    (min !== undefined && compareDay(date, min) < 0) ||
    (max !== undefined && compareDay(date, max) > 0) ||
    Boolean(isDateDisabled?.(date));

  // The single day reachable with Tab; always inside a visible month.
  const tabbableDate = isVisible(focusedDate)
    ? focusedDate
    : anchor && isVisible(anchor)
      ? startOfDay(anchor)
      : isVisible(today)
        ? today
        : month;

  let bandStart: Date | null = null;
  let bandEnd: Date | null = null;
  if (range?.from) {
    const end = range.to ?? hoveredDate ?? range.from;
    [bandStart, bandEnd] = compareDay(end, range.from) < 0 ? [end, range.from] : [range.from, end];
  }

  function setMonth(next: Date) {
    const value = startOfMonth(next);
    if (!props.month) setUncontrolledMonth(value);
    props.onMonthChange?.(value);
  }

  function shiftMonths(delta: number) {
    setMonth(addMonths(month, delta));
    setFocusedDate(addMonths(tabbableDate, delta));
  }

  function moveFocus(date: Date) {
    let next = date;
    if (min !== undefined && compareDay(next, min) < 0) next = startOfDay(min);
    if (max !== undefined && compareDay(next, max) > 0) next = startOfDay(max);
    setFocusedDate(next);
    if (compareMonth(next, month) < 0) setMonth(next);
    else if (compareMonth(next, lastMonth) > 0) setMonth(addMonths(startOfMonth(next), 1 - numberOfMonths));
    focusPendingRef.current = true;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTableElement>) {
    const from = tabbableDate;
    const targets: Record<string, () => Date> = {
      ArrowLeft: () => addDays(from, -1),
      ArrowRight: () => addDays(from, 1),
      ArrowUp: () => addDays(from, -7),
      ArrowDown: () => addDays(from, 7),
      Home: () => startOfWeek(from, weekStartsOn),
      End: () => addDays(startOfWeek(from, weekStartsOn), 6),
      PageUp: () => addMonths(from, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(from, event.shiftKey ? 12 : 1),
    };
    const target = targets[event.key];
    if (!target) return;
    event.preventDefault();
    moveFocus(target());
  }

  function select(date: Date) {
    if (isDisabled(date)) return;
    setFocusedDate(date);
    if (props.mode === "range") {
      const { from, to } = props.value;
      if (!from || to) props.onValueChange({ from: date, to: null });
      else if (compareDay(date, from) < 0) props.onValueChange({ from: date, to: from });
      else props.onValueChange({ from, to: date });
    } else {
      props.onValueChange(date);
    }
  }

  const captionFormat = getDateFormatter(locale, { month: "long", year: "numeric" });
  const weekdayFormat = getDateFormatter(locale, { weekday: "narrow" });
  const weekdayLongFormat = getDateFormatter(locale, { weekday: "long" });
  const dayLabelFormat = getDateFormatter(locale, { dateStyle: "full" });
  const weekdays = getCalendarWeeks(month, weekStartsOn)[0];
  const months = Array.from({ length: numberOfMonths }, (_, index) => addMonths(month, index));

  function renderDay(day: Date, displayMonth: Date, column: number): ReactNode {
    const outside = !isSameMonth(day, displayMonth);
    if (outside && numberOfMonths > 1) return <td key={day.getTime()} className="size-9 p-0" />;

    const disabled = isDisabled(day);
    const isToday = isSameDay(day, today);
    const inBand = bandStart !== null && bandEnd !== null && compareDay(day, bandStart) >= 0 && compareDay(day, bandEnd) <= 0;
    const isEndpoint = range ? isSameDay(day, range.from) || isSameDay(day, range.to) : isSameDay(day, selectedDate);
    const selected = range ? inBand && (range.to !== null || isEndpoint) : isEndpoint;
    const focused = !outside && isSameDay(day, tabbableDate);

    return (
      <td
        key={day.getTime()}
        role="gridcell"
        aria-selected={selected || undefined}
        className={cn(
          "size-9 p-0",
          inBand && !outside && "bg-accent",
          inBand && (isSameDay(day, bandStart) || column === 0) && "rounded-l-md",
          inBand && (isSameDay(day, bandEnd) || column === 6) && "rounded-r-md",
        )}
      >
        <button
          type="button"
          tabIndex={focused ? 0 : -1}
          data-focused={focused || undefined}
          aria-label={dayLabelFormat.format(day)}
          aria-current={isToday ? "date" : undefined}
          aria-disabled={disabled || undefined}
          onClick={() => {
            select(day);
            if (outside && !disabled) setMonth(day);
          }}
          onFocus={() => {
            if (!isSameDay(day, focusedDate)) setFocusedDate(day);
          }}
          onMouseEnter={range?.from && !range.to ? () => setHoveredDate(day) : undefined}
          className={cn(
            "flex size-9 cursor-pointer items-center justify-center rounded-md text-body tabular-nums text-foreground outline-none transition-colors",
            "hover:bg-muted focus-visible:shadow-focus focus-visible:ring-1 focus-visible:ring-focus-border",
            outside && "text-muted-foreground/60",
            isToday && !isEndpoint && "font-semibold text-accent-foreground",
            inBand && !isEndpoint && "hover:bg-accent-border",
            isEndpoint && "bg-primary font-medium text-primary-foreground hover:bg-primary-hover",
            disabled && "cursor-not-allowed text-faint-foreground line-through hover:bg-transparent",
          )}
        >
          {day.getDate()}
        </button>
      </td>
    );
  }

  return (
    <div
      ref={rootRef}
      data-slot="calendar"
      className={cn("flex w-fit select-none gap-6 p-3", className)}
      onMouseLeave={() => setHoveredDate(null)}
    >
      {months.map((displayMonth, index) => (
        <div key={displayMonth.getTime()} className="flex flex-col gap-2">
          <div className="relative flex h-7 items-center justify-center">
            {index === 0 && (
              <div className="absolute left-0 flex items-center gap-0.5">
                <button
                  type="button"
                  aria-label="Năm trước"
                  disabled={min !== undefined && compareMonth(addMonths(month, -12), min) < 0}
                  onClick={() => shiftMonths(-12)}
                  className={navButton}
                >
                  <ChevronsLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Tháng trước"
                  disabled={min !== undefined && compareMonth(addMonths(month, -1), min) < 0}
                  onClick={() => shiftMonths(-1)}
                  className={navButton}
                >
                  <ChevronLeft className="size-4" />
                </button>
              </div>
            )}
            <span aria-live="polite" className="inline-block text-body font-medium text-foreground first-letter:uppercase">
              {captionFormat.format(displayMonth)}
            </span>
            {index === numberOfMonths - 1 && (
              <div className="absolute right-0 flex items-center gap-0.5">
                <button
                  type="button"
                  aria-label="Tháng sau"
                  disabled={max !== undefined && compareMonth(addMonths(lastMonth, 1), max) > 0}
                  onClick={() => shiftMonths(1)}
                  className={navButton}
                >
                  <ChevronRight className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Năm sau"
                  disabled={max !== undefined && compareMonth(addMonths(lastMonth, 12), max) > 0}
                  onClick={() => shiftMonths(12)}
                  className={navButton}
                >
                  <ChevronsRight className="size-4" />
                </button>
              </div>
            )}
          </div>
          <table
            role="grid"
            aria-label={captionFormat.format(displayMonth)}
            className="border-collapse"
            onKeyDown={handleKeyDown}
          >
            <thead>
              <tr>
                {weekdays.map((day) => (
                  <th
                    key={day.getDay()}
                    scope="col"
                    abbr={weekdayLongFormat.format(day)}
                    className="size-9 p-0 text-overline font-medium text-muted-foreground"
                  >
                    {weekdayFormat.format(day)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getCalendarWeeks(displayMonth, weekStartsOn).map((week) => (
                <tr key={week[0].getTime()}>{week.map((day, column) => renderDay(day, displayMonth, column))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
