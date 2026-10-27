"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { Formatter } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { EmptyState } from "./empty-state";
import { useFormatter, useUIText } from "./locale";
import { Skeleton } from "./skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, type TableDensity } from "./table";

export type SortDirection = "asc" | "desc";
export type SortState = { columnId: string; direction: SortDirection } | null;
export type CellValue = string | number | boolean | Date | null | undefined;

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  /** Renders the cell. Defaults to the formatted accessor value. */
  cell?: (row: T, rowIndex: number) => ReactNode;
  /** Plain value used for default rendering and client-side sorting. */
  accessor?: (row: T) => CellValue;
  /** Requires `accessor` unless sorting is manual. */
  sortable?: boolean;
  align?: "left" | "center" | "right";
  /** Fixed width, e.g. 120 (px) or "30%". */
  width?: number | string;
  className?: string;
  headerClassName?: string;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: readonly T[];
  /** Stable id per row, e.g. `(key) => key.api_key_id`. */
  getRowId: (row: T, index: number) => string;
  /** With no rows: skeleton rows. With rows: dims them while refetching. */
  loading?: boolean;
  loadingRows?: number;
  emptyState?: ReactNode;
  sort?: SortState;
  defaultSort?: SortState;
  onSortChange?: (sort: SortState) => void;
  /** The server sorts `data`; the table only reports `onSortChange`. */
  manualSorting?: boolean;
  /** Adds a checkbox column. */
  selectable?: boolean;
  selectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  isRowSelectable?: (row: T) => boolean;
  /** Makes rows clickable and keyboard-activatable (Enter/Space). */
  onRowClick?: (row: T) => void;
  /** Extra classes per row, e.g. to dim the rows of hidden chart lines. */
  rowClassName?: (row: T) => string | undefined;
  density?: TableDensity;
  stickyHeader?: boolean;
  /** Rendered under the table inside the same frame, e.g. <Pagination />. */
  footer?: ReactNode;
  /** Classes for the outer frame. */
  className?: string;
  tableClassName?: string;
  "aria-label"?: string;
};

const alignClass = { left: "text-left", center: "text-center", right: "text-right" } as const;
const skeletonWidths = ["w-3/4", "w-1/2", "w-2/3", "w-5/6"];

function isEmptyValue(value: CellValue): value is null | undefined | "" {
  return value == null || value === "";
}

function compareValues(a: Exclude<CellValue, null | undefined>, b: Exclude<CellValue, null | undefined>, collator: Intl.Collator) {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  return collator.compare(String(a), String(b));
}

function formatCellValue(value: CellValue, format: Formatter, text: { yes: string; no: string }): ReactNode {
  if (isEmptyValue(value)) return <span className="text-faint-foreground">—</span>;
  if (value instanceof Date) return format.dateTime(value);
  if (typeof value === "number") return format.number(value);
  if (typeof value === "boolean") return value ? text.yes : text.no;
  return value;
}

function widthStyle(width: number | string | undefined): CSSProperties | undefined {
  if (width === undefined) return undefined;
  return { width: typeof width === "number" ? `${width}px` : width };
}

/** Table with sorting, row selection, loading and empty states. Pagination is rendered via `footer`. */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading,
  loadingRows = 5,
  emptyState,
  sort,
  defaultSort = null,
  onSortChange,
  manualSorting,
  selectable,
  selectedRowIds,
  onSelectedRowIdsChange,
  isRowSelectable,
  onRowClick,
  rowClassName,
  density,
  stickyHeader,
  footer,
  className,
  tableClassName,
  "aria-label": ariaLabel,
}: DataTableProps<T>) {
  const text = useUIText().table;
  const format = useFormatter();
  const [uncontrolledSort, setUncontrolledSort] = useState<SortState>(defaultSort);
  const sortState = sort !== undefined ? sort : uncontrolledSort;
  const [uncontrolledSelection, setUncontrolledSelection] = useState<string[]>([]);
  const selectedIds = selectedRowIds ?? uncontrolledSelection;
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const rows = useMemo(() => {
    if (manualSorting || !sortState) return data;
    const accessor = columns.find((column) => column.id === sortState.columnId)?.accessor;
    if (!accessor) return data;
    const collator = new Intl.Collator(format.intl, { numeric: true, sensitivity: "base" });
    return [...data].sort((x, y) => {
      const a = accessor(x);
      const b = accessor(y);
      // Empty values always go last, whatever the direction.
      if (isEmptyValue(a) || isEmptyValue(b)) return isEmptyValue(a) === isEmptyValue(b) ? 0 : isEmptyValue(a) ? 1 : -1;
      const result = compareValues(a, b, collator);
      return sortState.direction === "asc" ? result : -result;
    });
  }, [columns, data, manualSorting, sortState, format.intl]);

  const rowIds = rows.map((row, index) => getRowId(row, index));
  const selectableIds = selectable ? rowIds.filter((_, index) => isRowSelectable?.(rows[index]) ?? true) : [];
  const selectedCount = selectableIds.filter((id) => selectedSet.has(id)).length;
  const allSelected = selectableIds.length > 0 && selectedCount === selectableIds.length;
  const columnCount = columns.length + (selectable ? 1 : 0);
  const showSkeleton = loading && rows.length === 0;

  function toggleSort(columnId: string) {
    const next: SortState =
      sortState?.columnId !== columnId
        ? { columnId, direction: "asc" }
        : sortState.direction === "asc"
          ? { columnId, direction: "desc" }
          : null;
    if (sort === undefined) setUncontrolledSort(next);
    onSortChange?.(next);
  }

  function setSelection(ids: string[]) {
    if (selectedRowIds === undefined) setUncontrolledSelection(ids);
    onSelectedRowIdsChange?.(ids);
  }

  function toggleAll(checked: boolean) {
    // Keep selections made on other pages.
    const others = selectedIds.filter((id) => !selectableIds.includes(id));
    setSelection(checked ? [...others, ...selectableIds] : others);
  }

  function toggleRow(id: string, checked: boolean) {
    setSelection(checked ? [...selectedIds, id] : selectedIds.filter((selectedId) => selectedId !== id));
  }

  const table = (
    <Table
      density={density}
      stickyHeader={stickyHeader}
      framed={!footer}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={tableClassName}
      containerClassName={footer ? undefined : className}
    >
      <TableHeader>
        <TableRow>
          {selectable && (
            <TableHead className="w-10 pr-0">
              <Checkbox
                aria-label={text.selectAll}
                checked={allSelected}
                indeterminate={selectedCount > 0 && !allSelected}
                disabled={selectableIds.length === 0}
                onCheckedChange={toggleAll}
              />
            </TableHead>
          )}
          {columns.map((column) => {
            const direction = sortState?.columnId === column.id ? sortState.direction : null;
            return (
              <TableHead
                key={column.id}
                style={widthStyle(column.width)}
                aria-sort={
                  column.sortable
                    ? direction === "asc"
                      ? "ascending"
                      : direction === "desc"
                        ? "descending"
                        : "none"
                    : undefined
                }
                className={cn(alignClass[column.align ?? "left"], column.headerClassName)}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(column.id)}
                    className={cn(
                      "-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 outline-none transition-colors hover:text-foreground focus-visible:shadow-focus",
                      direction && "text-foreground",
                      column.align === "right" && "flex-row-reverse",
                    )}
                  >
                    {column.header}
                    {direction === "asc" ? (
                      <ArrowUp className="size-3.5" />
                    ) : direction === "desc" ? (
                      <ArrowDown className="size-3.5" />
                    ) : (
                      <ArrowUpDown className="size-3.5 opacity-40" />
                    )}
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody className={cn(loading && rows.length > 0 && "opacity-60 transition-opacity")}>
        {showSkeleton ? (
          Array.from({ length: loadingRows }, (_, rowIndex) => (
            <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
              {selectable && (
                <TableCell className="pr-0">
                  <Skeleton className="size-4 rounded-sm" />
                </TableCell>
              )}
              {columns.map((column, columnIndex) => (
                <TableCell key={column.id}>
                  <Skeleton
                    className={cn(
                      "h-4",
                      skeletonWidths[(rowIndex + columnIndex) % skeletonWidths.length],
                      column.align === "right" && "ml-auto",
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columnCount} className="whitespace-normal p-0">
              {emptyState ?? <EmptyState title={text.emptyTitle} description={text.emptyDescription} />}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, index) => {
            const id = rowIds[index];
            const selected = selectedSet.has(id);
            return (
              <TableRow
                key={id}
                data-state={selected ? "selected" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={
                  onRowClick
                    ? (event) => {
                        // A menu a row opens sits in a portal, outside the row, yet React still
                        // bubbles its clicks here: only clicks inside the row open it.
                        if (event.currentTarget.contains(event.target as Node)) onRowClick(row);
                      }
                    : undefined
                }
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
                        event.preventDefault();
                        onRowClick(row);
                      }
                    : undefined
                }
                className={cn(onRowClick && "cursor-pointer outline-none focus-visible:bg-card-hover", rowClassName?.(row))}
              >
                {selectable && (
                  <TableCell className="pr-0" onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      aria-label={text.selectRow}
                      checked={selected}
                      disabled={!(isRowSelectable?.(row) ?? true)}
                      onCheckedChange={(checked) => toggleRow(id, checked)}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.id} className={cn(alignClass[column.align ?? "left"], column.className)}>
                    {column.cell ? column.cell(row, index) : formatCellValue(column.accessor?.(row), format, text)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  if (!footer) return table;

  return (
    <div data-slot="data-table" className={cn("overflow-hidden rounded-lg border border-border bg-table", className)}>
      {table}
      <div className="border-t border-border">{footer}</div>
    </div>
  );
}
