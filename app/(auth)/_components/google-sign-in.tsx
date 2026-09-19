"use client";

import { startTransition, useActionState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Alert } from "@/components/ui/alert";
import { formMessageText, type FormFeedback } from "@/lib/form-message";
import { useI18n } from "@/lib/i18n/client";
import { googleSignInAction, type GoogleSignInInput } from "../actions";

export type GoogleSignInProps = {
  clientId: string;
  nonce: string;
  next?: string;
};

/** Hands the Google ID token to the sign-in action and shows why it failed, if it did. */
export function GoogleSignIn({ clientId, nonce, next }: GoogleSignInProps) {
  const { t } = useI18n();
  const [state, signIn, pending] = useActionState<FormFeedback, GoogleSignInInput>(googleSignInAction, {});

  return (
    <div className="grid gap-4">
      {state.error && (
        <Alert tone="negative" role="alert">
          {formMessageText(state.error, t)}
        </Alert>
      )}
      <GoogleSignInButton
        clientId={clientId}
        nonce={nonce}
        pending={pending}
        onCredential={(credential) => startTransition(() => signIn({ credential, next }))}
      />
    </div>
  );
}
