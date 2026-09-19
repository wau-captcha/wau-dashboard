"use client";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { toast } from "@/components/ui/toast";

export function GoogleButtonDemo({ clientId, pending }: { clientId: string; pending?: boolean }) {
  return (
    <GoogleSignInButton
      clientId={clientId}
      nonce="demo"
      pending={pending}
      onCredential={(credential) =>
        toast.success("Đã nhận ID token", { description: `${credential.slice(0, 24)}… (${credential.length} ký tự)` })
      }
    />
  );
}
