"use client";

import type { ReactElement } from "react";
import { ConfirmDialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import type { AdminUser } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { setUserBannedAction } from "../actions";

export type BanDialogProps = {
  user: Pick<AdminUser, "id" | "username" | "email" | "is_banned">;
  /** Opens the dialog; omit to control it with open/onOpenChange. */
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** Bans the user, or unbans a banned one, after confirmation. */
export function BanDialog({ user, trigger, open, onOpenChange }: BanDialogProps) {
  const text = useI18n().t.admin.ban;
  const name = user.username || user.email;
  const banning = !user.is_banned;

  async function confirm() {
    const { error } = await setUserBannedAction(user.id, banning);
    if (error) {
      toast.error(error);
      throw new Error(error);
    }
    toast.success(banning ? text.banned : text.unbanned);
  }

  return (
    <ConfirmDialog
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      tone={banning ? "destructive" : "default"}
      title={banning ? text.banTitle : text.unbanTitle}
      description={banning ? text.banDescription(name) : text.unbanDescription(name)}
      confirmLabel={banning ? text.ban : text.unban}
      onConfirm={confirm}
    />
  );
}
