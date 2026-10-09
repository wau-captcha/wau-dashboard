"use client";

import { Plus } from "lucide-react";
import { useActionState, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Tooltip } from "@/components/ui/tooltip";
import { formMessageText, type FormMessage } from "@/lib/form-message";
import { useI18n } from "@/lib/i18n/client";
import { createKeyAction, type KeyFormState } from "../actions";

export function CreateKeyDialog({ disabled, limit }: { disabled: boolean; limit: number }) {
  const { t } = useI18n();
  const text = t.keys.create;
  const say = (message?: FormMessage) => (message ? formMessageText(message, t) : undefined);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<KeyFormState, FormData>(createKeyAction, {});

  const trigger = (
    <Button startIcon={<Plus />} disabled={disabled}>
      {text.button}
    </Button>
  );

  if (disabled) {
    return <Tooltip content={text.limitReached(limit)}>{trigger}</Tooltip>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          {state.error && (
            <Alert tone="negative" role="alert">
              {say(state.error)}
            </Alert>
          )}
          <Field label={text.name} error={say(state.fieldErrors?.name)} required>
            <TextInput name="name" placeholder="shop.example.com" maxLength={64} required autoFocus />
          </Field>
          <Field label={text.domain} description={text.domainHint} error={say(state.fieldErrors?.allowed_domains)}>
            <TextInput name="domain" placeholder="shop.example.com" maxLength={260} inputClassName="font-mono" />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              {text.cancel}
            </Button>
            <Button type="submit" loading={pending}>
              {text.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
