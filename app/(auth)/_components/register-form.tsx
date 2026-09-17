"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { formMessageText, type FormMessage } from "@/lib/form-message";
import { useI18n } from "@/lib/i18n/client";
import { registerAction, type AuthFormState } from "../actions";

export function RegisterForm() {
  const { t } = useI18n();
  const text = t.auth.register;
  const say = (message?: FormMessage) => (message ? formMessageText(message, t) : undefined);
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(registerAction, {});

  return (
    <form action={formAction} className="grid gap-4">
      {state.error && (
        <Alert tone="negative" role="alert">
          {say(state.error)}
        </Alert>
      )}
      <Field label={text.username} description={text.usernameHint} error={say(state.fieldErrors?.username)} required>
        <TextInput
          name="username"
          autoComplete="username"
          placeholder="john_doe"
          defaultValue={state.values?.username}
          required
          minLength={3}
          maxLength={32}
        />
      </Field>
      <Field label={text.email} error={say(state.fieldErrors?.email)} required>
        <TextInput
          name="email"
          type="email"
          autoComplete="email"
          placeholder={text.emailPlaceholder}
          defaultValue={state.values?.email}
          required
        />
      </Field>
      <Field label={text.password} description={text.passwordHint} error={say(state.fieldErrors?.password)} required>
        <TextInput
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          minLength={8}
        />
      </Field>
      <Button type="submit" loading={pending} className="w-full">
        {text.submit}
      </Button>
      <p className="text-center text-body text-muted-foreground">
        {text.haveAccount}{" "}
        <Link href="/login" className="text-foreground underline decoration-current/40 underline-offset-2 hover:decoration-current">
          {text.switchLink}
        </Link>
      </p>
    </form>
  );
}
