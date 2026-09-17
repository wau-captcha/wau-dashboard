"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { ChallengeTypeUsage, DailyUsage, Usage } from "@/lib/api/types";
import { challengeTypeLabel } from "@/lib/challenge-types";
import { parseISODate } from "@/lib/date";
import { useI18n } from "@/lib/i18n/client";
import { successRate } from "@/lib/usage-view";

/** Usage of one key or of the whole account, by day and by challenge type. */
export function UsageSummary({ usage }: { usage: Usage }) {
  const { t, format } = useI18n();
  const text = t.usage.summary;
  const days = useMemo(() => [...usage.days].reverse(), [usage.days]);

  const dayColumns: DataTableColumn<DailyUsage>[] = [
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
    { id: "total", header: text.solves, accessor: (row) => row.total, align: "right", sortable: true },
    { id: "success", header: text.successful, accessor: (row) => row.success, align: "right", sortable: true },
    { id: "rate", header: text.rate, align: "right", cell: (row) => successRate(row.total, row.success, format) },
  ];

  const typeColumns: DataTableColumn<ChallengeTypeUsage>[] = [
    {
      id: "challenge_type",
      header: text.type,
      accessor: (row) => row.challenge_type,
      cell: (row) => (
        <span className="grid gap-0.5">
          <span className="font-medium text-foreground">{challengeTypeLabel(row.challenge_type, t.challengeTypes)}</span>
          <span className="font-mono text-overline text-muted-foreground">{row.challenge_type}</span>
        </span>
      ),
      sortable: true,
    },
    { id: "total", header: text.solves, accessor: (row) => row.total, align: "right", sortable: true },
    { id: "success", header: text.successful, accessor: (row) => row.success, align: "right", sortable: true },
    { id: "rate", header: text.rate, align: "right", cell: (row) => successRate(row.total, row.success, format) },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{text.byDay}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            aria-label={text.byDayLabel}
            columns={dayColumns}
            data={days}
            getRowId={(row) => row.date}
            density="compact"
            stickyHeader
            className="max-h-96"
            emptyState={text.empty}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{text.byType}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            aria-label={text.byTypeLabel}
            columns={typeColumns}
            data={usage.challenge_types}
            getRowId={(row) => row.challenge_type}
            density="compact"
            emptyState={text.empty}
          />
        </CardContent>
      </Card>
    </div>
  );
}
