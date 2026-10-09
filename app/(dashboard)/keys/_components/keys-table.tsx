"use client";

import { Ellipsis, Eye, Pause, Play, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { KeyStatusBadge } from "@/app/_components/key-status-badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { ConfirmDialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import type { ApiKey } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { keyDisplayName } from "@/lib/key-name";
import { deleteKeyAction, setKeyActiveAction } from "../actions";

export function KeysTable({ keys }: { keys: ApiKey[] }) {
  const { t, format } = useI18n();
  const text = t.keys;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);

  function toggleActive(key: ApiKey) {
    startTransition(async () => {
      const { error } = await setKeyActiveAction(key.id, !key.is_active);
      if (error) toast.error(error);
      else toast.success(key.is_active ? text.toast.paused : text.toast.activated);
    });
  }

  async function confirmDelete() {
    if (!keyToDelete) return;
    const { error } = await deleteKeyAction(keyToDelete.id);
    if (error) {
      toast.error(error);
      throw new Error(error);
    }
    toast.success(text.toast.deleted);
    setKeyToDelete(null);
  }

  const columns: DataTableColumn<ApiKey>[] = [
    {
      id: "name",
      header: text.columns.name,
      accessor: (key) => key.name,
      cell: (key) => <span className="font-medium text-foreground">{keyDisplayName(key)}</span>,
      sortable: true,
    },
    {
      id: "site_key",
      header: text.columns.siteKey,
      cell: (key) => <span className="font-mono text-overline text-muted-foreground">{key.site_key.slice(0, 14)}…</span>,
    },
    {
      id: "status",
      header: text.columns.status,
      accessor: (key) => (key.is_suspended ? 0 : key.scraping_flagged ? 1 : key.is_active ? 3 : 2),
      cell: (key) => <KeyStatusBadge apiKey={key} />,
      sortable: true,
    },
    {
      id: "create_date",
      header: text.columns.created,
      accessor: (key) => new Date(key.create_date),
      cell: (key) => format.dateTime(key.create_date),
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      align: "right",
      width: 64,
      cell: (key) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label={text.rowActions.label(keyDisplayName(key))} />}
            onClick={(event) => event.stopPropagation()}
          >
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => router.push(`/keys/${key.id}`)}>
              <Eye /> {text.rowActions.view}
            </DropdownMenuItem>
            {/* A suspended key stays blocked whatever its own switch says. */}
            {!key.is_suspended && (
              <DropdownMenuItem onClick={() => toggleActive(key)}>
                {key.is_active ? <Pause /> : <Play />} {key.is_active ? text.rowActions.pause : text.rowActions.activate}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem variant="destructive" onClick={() => setKeyToDelete(key)}>
              <Trash2 /> {text.rowActions.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        aria-label={text.list.tableLabel}
        columns={columns}
        data={keys}
        getRowId={(key) => key.id}
        loading={pending}
        onRowClick={(key) => router.push(`/keys/${key.id}`)}
        defaultSort={{ columnId: "create_date", direction: "desc" }}
      />
      <ConfirmDialog
        open={keyToDelete !== null}
        onOpenChange={(open) => !open && setKeyToDelete(null)}
        tone="destructive"
        title={text.deleteDialog.title}
        description={text.deleteDialog.description(keyToDelete ? keyDisplayName(keyToDelete) : "")}
        confirmLabel={text.deleteDialog.confirm}
        onConfirm={confirmDelete}
      />
    </>
  );
}
