"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { AdminAppeal } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { keyDisplayName } from "@/lib/key-name";
import { decideAppealAction } from "../actions";

const statusTone = { pending: "info", approved: "positive", rejected: "neutral" } as const;

/** Appeals with their key and owner; a pending one is approved or rejected with a note to the owner. */
export function AppealsTable({ appeals }: { appeals: AdminAppeal[] }) {
  const { t, format } = useI18n();
  const text = t.appeals;
  const [target, setTarget] = useState<{ appeal: AdminAppeal; approve: boolean } | null>(null);
  const [note, setNote] = useState("");

  function open(appeal: AdminAppeal, approve: boolean) {
    setNote("");
    setTarget({ appeal, approve });
  }

  async function confirm() {
    if (!target) return;
    const { error } = await decideAppealAction(target.appeal.id, target.approve, note);
    if (error) {
      toast.error(error);
      throw new Error(error);
    }
    toast.success(target.approve ? text.approved : text.rejected);
    setTarget(null);
  }

  const columns: DataTableColumn<AdminAppeal>[] = [
    {
      id: "key",
      header: text.columns.key,
      cell: (appeal) => (
        <span className="grid gap-0.5">
          <span className="font-medium text-foreground">{keyDisplayName(appeal.api_key)}</span>
          <span className="flex flex-wrap gap-1">
            {appeal.api_key.is_suspended && (
              <Badge tone="negative" size="sm">
                {t.common.status.suspended}
              </Badge>
            )}
            {appeal.api_key.scraping_flagged && (
              <Badge tone="warning" size="sm">
                {text.flagged}
              </Badge>
            )}
          </span>
        </span>
      ),
    },
    {
      id: "owner",
      header: text.columns.owner,
      cell: (appeal) => (
        <Link href={`/admin/users/${appeal.user_id}`} className="grid gap-0.5 hover:underline">
          <span className="text-foreground">{appeal.user_name}</span>
          <span className="text-overline text-muted-foreground">{appeal.user_email}</span>
        </Link>
      ),
    },
    {
      id: "today",
      header: text.columns.today,
      cell: (appeal) => {
        const key = appeal.api_key;
        const n = format.number;
        return (
          <span className="text-overline tabular-nums text-muted-foreground">
            {text.today(n(key.challenges_today), n(key.verifications_today), n(key.solved_today), n(key.automated_today))}
          </span>
        );
      },
    },
    {
      id: "message",
      header: text.columns.message,
      cell: (appeal) => (
        <span className="grid max-w-md gap-0.5 whitespace-pre-line">
          <span className="text-foreground">{appeal.message}</span>
          {appeal.admin_note && <span className="text-overline text-muted-foreground">{text.note(appeal.admin_note)}</span>}
        </span>
      ),
    },
    {
      id: "requested",
      header: text.columns.requested,
      cell: (appeal) => <span className="tabular-nums text-muted-foreground">{format.dateTime(appeal.create_date)}</span>,
    },
    {
      id: "status",
      header: text.columns.status,
      align: "right",
      cell: (appeal) =>
        appeal.status === "pending" ? (
          <span className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => open(appeal, false)}>
              {text.reject}
            </Button>
            <Button size="sm" onClick={() => open(appeal, true)}>
              {text.approve}
            </Button>
          </span>
        ) : (
          <Badge tone={statusTone[appeal.status]} dot>
            {text.statuses[appeal.status]}
          </Badge>
        ),
    },
  ];

  const name = target ? keyDisplayName(target.appeal.api_key) : "";

  return (
    <>
      <DataTable aria-label={text.tableLabel} columns={columns} data={appeals} getRowId={(appeal) => appeal.id} emptyState={text.empty} />
      <ConfirmDialog
        open={target !== null}
        onOpenChange={(isOpen) => !isOpen && setTarget(null)}
        title={target?.approve ? text.approveTitle : text.rejectTitle}
        description={target?.approve ? text.approveDescription(name) : text.rejectDescription(name)}
        confirmLabel={target?.approve ? text.approve : text.reject}
        onConfirm={confirm}
      >
        <Field label={text.noteLabel}>
          <Textarea value={note} onValueChange={setNote} maxLength={2000} rows={3} />
        </Field>
      </ConfirmDialog>
    </>
  );
}
