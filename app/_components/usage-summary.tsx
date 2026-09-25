"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { DailyUsage, Usage } from "@/lib/api/types";
import { parseISODate } from "@/lib/date";
import { useI18n } from "@/lib/i18n/client";
import { rate, type UsageRange } from "@/lib/usage-view";

/**
 * The window day by day, newest first: challenges, verifications, right answers and the two
 * rates. All time lists only the days that had challenges.
 */
export function UsageSummary({ usage, range }: { usage: Usage; range: UsageRange }) {
  const { t, format } = useI18n();
  const text = t.usage.summary;
  const columnText = t.usage.columns;
  const days = useMemo(
    () => [...usage.days].reverse().filter((day) => range !== "all" || day.challenges > 0),
    [usage.days, range],
  );

  const columns: DataTableColumn<DailyUsage>[] = [
    {
      id: "date",
      header: text.date,
      accessor: (row) => row.date,
      cell: (row) => {
        const date = parseISODate(row.date);
        return date ? format.date(date) : row.date;
      },
      sortable: true,
    },
    { id: "challenges", header: columnText.challenges, accessor: (row) => row.challenges, align: "right", sortable: true },
    { id: "verifications", header: columnText.verifications, accessor: (row) => row.verifications, align: "right", sortable: true },
    { id: "successes", header: columnText.successes, accessor: (row) => row.successes, align: "right", sortable: true },
    {
      id: "verifyRate",
      header: columnText.verifyRate,
      align: "right",
      cell: (row) => rate(row.verifications, row.challenges, format),
    },
    {
      id: "successRate",
      header: columnText.successRate,
      align: "right",
      cell: (row) => rate(row.successes, row.verifications, format),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{text.byDay}</CardTitle>
          {range === "all" && <CardDescription>{text.activeDays}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          aria-label={text.byDayLabel}
          columns={columns}
          data={days}
          getRowId={(row) => row.date}
          density="compact"
          stickyHeader
          className="max-h-96"
          emptyState={text.empty}
        />
      </CardContent>
    </Card>
  );
}
