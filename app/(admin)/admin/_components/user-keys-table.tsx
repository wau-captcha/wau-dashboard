"use client";

import { useState } from "react";
import { KeyStatusBadge } from "@/app/_components/key-status-badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { ConfirmDialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import type { AdminApiKey } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { keyDisplayName } from "@/lib/key-name";
import { setKeySuspendedAction } from "../actions";

/** The keys of one account with their suspension, today's scraping counters, and suspend / lift. */
export function UserKeysTable({ userId, keys }: { userId: string; keys: AdminApiKey[] }) {
  const { t, format } = useI18n();
  const text = t.admin.keys;
  const [target, setTarget] = useState<AdminApiKey | null>(null);

  async function confirm() {
    if (!target) return;
    const suspending = !target.is_suspended;
    const { error } = await setKeySuspendedAction(userId, target.id, suspending);
    if (error) {
      toast.error(error);
      throw new Error(error);
    }
    toast.success(suspending ? text.suspended : text.lifted);
    setTarget(null);
  }

  const columns: DataTableColumn<AdminApiKey>[] = [
    {
      id: "name",
      header: text.name,
      cell: (key) => <span className="font-medium text-foreground">{keyDisplayName(key)}</span>,
    },
    {
      id: "site_key",
      header: text.siteKey,
      cell: (key) => <span className="font-mono text-overline text-muted-foreground">{key.site_key.slice(0, 14)}…</span>,
    },
    {
      id: "status",
      header: text.status,
      cell: (key) =>
        key.is_suspended ? (
          <span className="grid gap-0.5">
            <KeyStatusBadge apiKey={key} />
            <span className="text-overline text-muted-foreground">
              {key.suspend_reason === "SCRAPING" ? text.suspendedForScraping : text.suspendedByAdmin}
            </span>
          </span>
        ) : (
          <KeyStatusBadge apiKey={key} />
        ),
    },
    {
      id: "today",
      header: text.today,
      cell: (key) => (
        <span className="text-overline tabular-nums text-muted-foreground">
          {t.appeals.today(
            format.number(key.challenges_today),
            format.number(key.verifications_today),
            format.number(key.solved_today),
            format.number(key.automated_today),
          )}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      align: "right",
      cell: (key) => (
        <Button
          variant={key.is_suspended ? "outline" : "destructive-outline"}
          size="sm"
          onClick={() => setTarget(key)}
        >
          {key.is_suspended ? text.lift : text.suspend}
        </Button>
      ),
    },
  ];

  const name = target ? keyDisplayName(target) : "";
  const suspending = target ? !target.is_suspended : false;

  return (
    <>
      <DataTable
        aria-label={text.tableLabel}
        columns={columns}
        data={keys}
        getRowId={(key) => key.id}
        emptyState={t.admin.user.keysEmpty}
      />
      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        tone={suspending ? "destructive" : "default"}
        title={suspending ? text.suspendTitle : text.liftTitle}
        description={suspending ? text.suspendDescription(name) : text.liftDescription(name)}
        confirmLabel={suspending ? text.suspend : text.lift}
        onConfirm={confirm}
      />
    </>
  );
}
