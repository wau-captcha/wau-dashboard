"use client";

import { startTransition, useActionState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Alert } from "@/components/ui/alert";
import { formMessageText, type FormFeedback } from "@/lib/form-message";
import { useI18n } from "@/lib/i18n/client";
import type { GoogleSignInInput } from "../actions";

export type GoogleSignInProps = {
  clientId: string;
  nonce: string;
  next?: string;
  /** Server action that trades the token for a session: a user's or an administrator's. */
  action: (previous: FormFeedback, input: GoogleSignInInput) => Promise<FormFeedback>;
};

/** Hands the Google ID token to the sign-in action and shows why it failed, if it did. */
export function GoogleSignIn({ clientId, nonce, next, action }: GoogleSignInProps) {
  const { t } = useI18n();
  const [state, signIn, pending] = useActionState<FormFeedback, GoogleSignInInput>(action, {});

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
