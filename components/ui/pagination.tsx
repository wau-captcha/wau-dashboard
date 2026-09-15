"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Select } from "./select";

export type PaginationProps = {
  /** Current page, starting at 1. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Shows the page-size select when set. */
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
};

export type PageItem = number | "gap";

/**
 * Page buttons with a fixed slot count so the control does not jump:
 * getPageItems(10, 20) → [1, "gap", 9, 10, 11, "gap", 20].
 */
export function getPageItems(page: number, pageCount: number, siblings = 1): PageItem[] {
  const slots = siblings * 2 + 5;
  const pages = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
  if (pageCount <= slots) return pages(1, pageCount);

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  const showLeftGap = left > 3;
  const showRightGap = right < pageCount - 2;
  const edgeCount = siblings * 2 + 3;

  if (!showLeftGap) return [...pages(1, edgeCount), "gap", pageCount];
  if (!showRightGap) return [1, "gap", ...pages(pageCount - edgeCount + 1, pageCount)];
  return [1, "gap", ...pages(left, right), "gap", pageCount];
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  return (
    <div
      data-slot="pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 text-body text-muted-foreground",
        className,
      )}
    >
      <p className="tabular-nums">
        {total === 0 ? (
          "Không có bản ghi"
        ) : (
          <>
            Hiển thị{" "}
            <span className="font-medium text-foreground">
              {formatNumber(from)}–{formatNumber(to)}
            </span>{" "}
            trong <span className="font-medium text-foreground">{formatNumber(total)}</span>
          </>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">Số dòng</span>
            <Select<number>
              size="sm"
              className="w-20"
              aria-label="Số dòng mỗi trang"
              options={pageSizeOptions.map((size) => ({ value: size, label: String(size) }))}
              value={pageSize}
              onValueChange={(size: number | null) => {
                if (size !== null) onPageSizeChange(size);
              }}
            />
          </div>
        )}
        <nav aria-label="Phân trang" className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Trang trước"
            disabled={current <= 1}
            onClick={() => onPageChange(current - 1)}
          >
            <ChevronLeft />
          </Button>
          {getPageItems(current, pageCount).map((item, index) =>
            item === "gap" ? (
              <span key={`gap-${index}`} aria-hidden className="flex size-8 items-center justify-center">
                …
              </span>
            ) : (
              <Button
                key={item}
                variant={item === current ? "outline" : "ghost"}
                size="sm"
                aria-label={`Trang ${item}`}
                aria-current={item === current ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={cn("min-w-8 px-2 tabular-nums", item === current && "text-foreground")}
              >
                {item}
              </Button>
            ),
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Trang sau"
            disabled={current >= pageCount}
            onClick={() => onPageChange(current + 1)}
          >
            <ChevronRight />
          </Button>
        </nav>
      </div>
    </div>
  );
}
