"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { ChallengeType } from "@/lib/api/types";
import { challengeTypeDescription, challengeTypeLabel } from "@/lib/challenge-types";
import { useI18n } from "@/lib/i18n/client";

export function ChallengeTypesTable({ challengeTypes }: { challengeTypes: ChallengeType[] }) {
  const { t } = useI18n();
  const text = t.account.types;

  const columns: DataTableColumn<ChallengeType>[] = [
    {
      id: "type",
      header: text.type,
      accessor: (row) => row.id,
      cell: (row) => (
        <span className="grid gap-0.5">
          <span className="font-medium text-foreground">{challengeTypeLabel(row.id, t.challengeTypes)}</span>
          <span className="font-mono text-overline text-muted-foreground">{row.id}</span>
        </span>
      ),
      sortable: true,
    },
    {
      id: "description",
      header: text.details,
      cell: (row) => challengeTypeDescription(row.id, t.challengeTypes),
    },
    {
      id: "price",
      header: text.price,
      align: "right",
      width: 120,
      cell: () => <Badge tone="positive">{text.free}</Badge>,
    },
  ];

  return (
    <DataTable
      aria-label={text.tableLabel}
      columns={columns}
      data={challengeTypes}
      getRowId={(row) => row.id}
      emptyState={text.empty}
    />
  );
}
