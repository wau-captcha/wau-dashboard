"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { formMessageText, type FormMessage } from "@/lib/form-message";
import { useI18n } from "@/lib/i18n/client";
import { loginAction, type AuthFormState } from "../actions";

export function LoginForm({ next }: { next?: string }) {
  const { t } = useI18n();
  const text = t.auth.login;
  const say = (message?: FormMessage) => (message ? formMessageText(message, t) : undefined);
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="grid gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && (
        <Alert tone="negative" role="alert">
          {say(state.error)}
        </Alert>
      )}
      <Field label={text.identifier} error={say(state.fieldErrors?.identifier)} required>
        <TextInput
          name="identifier"
          autoComplete="username"
          placeholder="john_doe"
          defaultValue={state.values?.identifier}
          required
        />
      </Field>
      <Field label={text.password} error={say(state.fieldErrors?.password)} required>
        <TextInput name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
      </Field>
      <Button type="submit" loading={pending} className="w-full">
        {text.submit}
      </Button>
      <p className="text-center text-body text-muted-foreground">
        {text.noAccount}{" "}
        <Link href="/register" className="text-foreground underline decoration-current/40 underline-offset-2 hover:decoration-current">
          {text.switchLink}
        </Link>
      </p>
    </form>
  );
}
