"use client";

import { ReceiptText } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import type { Transaction, TransactionStatus } from "@/lib/api/types";
import { tierTone } from "@/lib/billing";
import { useI18n } from "@/lib/i18n/client";

const statusTone: Record<TransactionStatus, BadgeTone> = {
  pending: "warning",
  succeeded: "positive",
  expired: "neutral",
};

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const { t, format } = useI18n();
  const text = t.billing.history;

  const columns: DataTableColumn<Transaction>[] = [
    {
      id: "create_date",
      header: text.date,
      accessor: (transaction) => new Date(transaction.create_date),
      cell: (transaction) => format.dateTime(transaction.create_date),
      sortable: true,
    },
    {
      id: "plan",
      header: text.plan,
      accessor: (transaction) => transaction.tier_name,
      cell: (transaction) => <Badge tone={tierTone(transaction.tier_id)}>{transaction.tier_name}</Badge>,
      sortable: true,
    },
    {
      id: "period",
      header: text.period,
      accessor: (transaction) => transaction.period,
      cell: (transaction) => text.periods[transaction.period],
      sortable: true,
    },
    {
      id: "amount",
      header: text.amount,
      align: "right",
      accessor: (transaction) => transaction.amount,
      cell: (transaction) => (
        <span className="text-foreground tabular-nums">{format.number(transaction.amount, { style: "currency", currency: "VND" })}</span>
      ),
      sortable: true,
    },
    {
      id: "status",
      header: text.status,
      accessor: (transaction) => transaction.status,
      cell: (transaction) => (
        <Badge tone={statusTone[transaction.status] ?? "neutral"} dot>
          {text.statuses[transaction.status] ?? transaction.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "paid_at",
      header: text.paidAt,
      accessor: (transaction) => (transaction.paid_at ? new Date(transaction.paid_at) : null),
      cell: (transaction) => (transaction.paid_at ? format.dateTime(transaction.paid_at) : "—"),
      sortable: true,
    },
    {
      id: "code",
      header: text.code,
      cell: (transaction) => <span className="font-mono text-overline text-muted-foreground">{transaction.payment_code}</span>,
    },
  ];

  return (
    <DataTable
      aria-label={text.tableLabel}
      columns={columns}
      data={transactions}
      getRowId={(transaction) => transaction.id}
      defaultSort={{ columnId: "create_date", direction: "desc" }}
      emptyState={<EmptyState icon={<ReceiptText />} title={text.emptyTitle} description={text.emptyDescription} />}
    />
  );
}
