"use client";

import { useRouter } from "next/navigation";
import { useActionState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TextInput } from "@/components/ui/text-input";
import { toast } from "@/components/ui/toast";
import type { ApiKey } from "@/lib/api/types";
import { formMessageText, type FormMessage } from "@/lib/form-message";
import { useI18n } from "@/lib/i18n/client";
import { keyDisplayName } from "@/lib/key-name";
import { deleteKeyAction, renameKeyAction, rotateSecretAction, setKeyActiveAction, type KeyFormState } from "../../actions";

export function KeySettings({ apiKey }: { apiKey: ApiKey }) {
  const { t } = useI18n();
  const text = t.keyDetail.settings;
  const say = (message?: FormMessage) => (message ? formMessageText(message, t) : undefined);
  const router = useRouter();
  const [state, formAction, renaming] = useActionState<KeyFormState, FormData>(renameKeyAction, {});
  const [pending, startTransition] = useTransition();

  function toggleActive(next: boolean) {
    startTransition(async () => {
      const { error } = await setKeyActiveAction(apiKey.id, next);
      if (error) toast.error(error);
      else toast.success(next ? t.keys.toast.activated : t.keys.toast.paused);
    });
  }

  async function rotate() {
    const { error } = await rotateSecretAction(apiKey.id);
    if (error) {
      toast.error(error);
      throw new Error(error);
    }
    toast.success(t.keys.toast.rotated);
  }

  async function remove() {
    const { error } = await deleteKeyAction(apiKey.id);
    if (error) {
      toast.error(error);
      throw new Error(error);
    }
    toast.success(t.keys.toast.deleted);
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
        {state.error && (
          <Alert tone="negative" role="alert">
            {say(state.error)}
          </Alert>
        )}
        <form action={formAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="id" value={apiKey.id} />
          <Field label={text.name} error={say(state.fieldErrors?.name)} className="min-w-64 flex-1">
            <TextInput name="name" defaultValue={apiKey.name} maxLength={64} required />
          </Field>
          <Button type="submit" variant="outline" loading={renaming}>
            {text.save}
          </Button>
        </form>

        <Separator />

        <Switch
          label={text.active}
          description={text.activeHint}
          labelPosition="start"
          checked={apiKey.is_active}
          disabled={pending}
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
            onConfirm={rotate}
          />
        </div>

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
