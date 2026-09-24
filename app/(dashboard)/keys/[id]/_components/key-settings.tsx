"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { InlineEdit } from "@/components/ui/inline-edit";
import { SecretValue } from "@/components/ui/secret-value";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import type { ApiKey } from "@/lib/api/types";
import { formMessageText, type FormMessage } from "@/lib/form-message";
import { useI18n } from "@/lib/i18n/client";
import { keyDisplayName } from "@/lib/key-name";
import {
  deleteKeyAction,
  renameKeyAction,
  revokePreviousSecretAction,
  rotateSecretAction,
  setKeyActiveAction,
} from "../../actions";

export function KeySettings({ apiKey }: { apiKey: ApiKey }) {
  const { t, format } = useI18n();
  const text = t.keyDetail.settings;
  const router = useRouter();
  const [nameError, setNameError] = useState<FormMessage>();
  const [pending, startTransition] = useTransition();

  function toggleActive(next: boolean) {
    startTransition(async () => {
      const { error } = await setKeyActiveAction(apiKey.id, next);
      if (error) toast.error(error);
      else toast.success(next ? t.keys.toast.activated : t.keys.toast.paused);
    });
  }

  async function rename(name: string) {
    const { error, fieldErrors } = await renameKeyAction(apiKey.id, name);
    setNameError(error ?? fieldErrors?.name);
  }

  async function run(action: () => Promise<{ error?: string }>, success: string) {
    const { error } = await action();
    if (error) {
      toast.error(error);
      throw new Error(error);
    }
    toast.success(success);
  }

  async function remove() {
    await run(() => deleteKeyAction(apiKey.id), t.keys.toast.deleted);
    router.push("/keys");
  }

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{text.title}</CardTitle>
          <CardDescription>{text.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <InlineEdit
          label={text.name}
          value={apiKey.name}
          maxLength={64}
          error={nameError && formMessageText(nameError, t)}
          onSave={rename}
          className="max-w-xl"
        />

        <Separator />

        <Switch
          label={text.active}
          description={apiKey.is_suspended ? t.keyDetail.suspended.switchHint : text.activeHint}
          labelPosition="start"
          checked={apiKey.is_active && !apiKey.is_suspended}
          disabled={pending || apiKey.is_suspended}
          onCheckedChange={toggleActive}
        />

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-md text-body text-muted-foreground">{text.rotateHint}</p>
          <ConfirmDialog
            trigger={<Button variant="outline">{text.rotate}</Button>}
            title={text.rotateTitle}
            description={text.rotateDescription}
            confirmLabel={text.rotateConfirm}
            onConfirm={() => run(() => rotateSecretAction(apiKey.id), t.keys.toast.rotated)}
          />
        </div>

        {apiKey.previous_secret_key && apiKey.previous_secret_key_expires_at && (
          <>
            <Separator />
            <div className="grid grid-cols-1 gap-3">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{text.previousTitle}</p>
                <p className="text-body text-muted-foreground">
                  {text.previousHint(format.dateTime(apiKey.previous_secret_key_expires_at))}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <SecretValue value={apiKey.previous_secret_key} masked className="min-w-0 grow basis-64" />
                <ConfirmDialog
                  trigger={<Button variant="destructive-outline">{text.previousRevoke}</Button>}
                  tone="destructive"
                  title={text.previousRevokeTitle}
                  description={text.previousRevokeDescription}
                  confirmLabel={text.previousRevokeConfirm}
                  onConfirm={() => run(() => revokePreviousSecretAction(apiKey.id), t.keys.toast.revoked)}
                />
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-md text-body text-muted-foreground">{text.deleteHint}</p>
          <ConfirmDialog
            trigger={<Button variant="destructive-outline">{t.keys.rowActions.delete}</Button>}
            tone="destructive"
            title={t.keys.deleteDialog.title}
            description={t.keys.deleteDialog.description(keyDisplayName(apiKey))}
            confirmLabel={t.keys.deleteDialog.confirm}
            onConfirm={remove}
          />
        </div>
      </CardContent>
    </Card>
  );
}
