"use client";

import { Ban, Ellipsis, Eye, ShieldCheck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import type { AdminUser } from "@/lib/api/types";
import { tierTone } from "@/lib/billing";
import { useI18n } from "@/lib/i18n/client";
import { BanDialog } from "./ban-dialog";

export type UsersTableProps = {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
};

/** One page of accounts; paging rewrites ?page= so the search is kept. */
export function UsersTable({ users, total, page, pageSize }: UsersTableProps) {
  const { t, format } = useI18n();
  const text = t.admin.users;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState<AdminUser | null>(null);

  function goToPage(next: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(next));
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  const columns: DataTableColumn<AdminUser>[] = [
    {
      id: "user",
      header: text.columns.user,
      cell: (user) => (
        // Wide enough to read on a phone, where the table scrolls sideways instead of squeezing it.
        <span className="grid min-w-40 max-w-72 gap-0.5">
          <span className="truncate font-medium text-foreground">{user.username}</span>
          <span className="truncate text-overline text-muted-foreground">{user.email}</span>
        </span>
      ),
    },
    {
      id: "plan",
      header: text.columns.plan,
      cell: (user) => <Badge tone={tierTone(user.tier_id)}>{user.tier_name}</Badge>,
    },
    { id: "keys", header: text.columns.keys, align: "right", cell: (user) => format.number(user.api_key_count) },
    {
      id: "today",
      header: text.columns.today,
      align: "right",
      cell: (user) => `${format.number(user.quota_used)} / ${format.number(user.daily_quota)}`,
    },
    {
      id: "status",
      header: text.columns.status,
      cell: (user) =>
        user.is_banned ? (
          <Badge tone="negative" dot>
            {t.common.status.banned}
          </Badge>
        ) : (
          <Badge tone="positive" dot>
            {t.common.status.active}
          </Badge>
        ),
    },
    { id: "joined", header: text.columns.joined, cell: (user) => format.dateTime(user.create_date) },
    {
      id: "actions",
      header: "",
      align: "right",
      width: 64,
      cell: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label={`${text.view}: ${user.username}`} />}
            onClick={(event) => event.stopPropagation()}
          >
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
              <Eye /> {text.view}
            </DropdownMenuItem>
            <DropdownMenuItem variant={user.is_banned ? "default" : "destructive"} onClick={() => setTarget(user)}>
              {user.is_banned ? <ShieldCheck /> : <Ban />} {user.is_banned ? t.admin.ban.unban : t.admin.ban.ban}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        aria-label={text.tableLabel}
        columns={columns}
        data={users}
        getRowId={(user) => user.id}
        loading={pending}
        onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
        emptyState={text.empty}
        footer={<Pagination page={page} pageSize={pageSize} total={total} onPageChange={goToPage} />}
      />
      {target && (
        <BanDialog user={target} open onOpenChange={(open) => !open && setTarget(null)} />
      )}
    </>
  );
}
