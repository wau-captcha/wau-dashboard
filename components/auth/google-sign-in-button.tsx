"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useDarkMode } from "@/components/theme/use-dark-mode";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { loadGoogleIdentity } from "./google-identity";

/** Width limits of Google's standard button. */
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

export type GoogleSignInButtonProps = {
  /** OAuth client ID the ID token is issued for. */
  clientId: string;
  /** Copied into the ID token so the server can tie it to this browser. */
  nonce: string;
  /** Receives the ID token after the user picks an account. */
  onCredential: (credential: string) => void;
  /** Covers the button while the token is being exchanged. */
  pending?: boolean;
  className?: string;
};

type Status = "loading" | "ready" | "scriptFailed" | "notDrawn";

/**
 * "Sign in with Google", drawn by Google Identity Services: ID tokens are only handed out
 * through Google's own button. Follows the active theme and language, and fills its
 * container up to 400 px.
 */
export function GoogleSignInButton({ clientId, nonce, onCredential, pending = false, className }: GoogleSignInButtonProps) {
  const { locale, t } = useI18n();
  const text = t.auth.google;
  const dark = useDarkMode();
  const frameRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const width = useButtonWidth(frameRef);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const onCredentialRef = useRef(onCredential);

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || !width) return;
    let current = true;
    loadGoogleIdentity(locale).then(
      async (google) => {
        if (!current) return;
        // Re-initialising replaces the previous configuration, e.g. after a new nonce.
        google.initialize({
          client_id: clientId,
          nonce,
          ux_mode: "popup",
          callback: (response) => onCredentialRef.current(response.credential),
        });
        slot.replaceChildren();
        google.renderButton(slot, {
          type: "standard",
          theme: dark ? "outline_dark" : "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width: String(width),
          locale,
        });
        // Google leaves the slot empty when it refuses the page, e.g. an address that is
        // not an authorised JavaScript origin of the client ID. Never leave a blank box.
        const ok = await drawn(slot);
        if (current) setStatus(ok ? "ready" : "notDrawn");
      },
      () => {
        if (current) setStatus("scriptFailed");
      },
    );
    return () => {
      current = false;
    };
  }, [clientId, nonce, dark, locale, width, attempt]);

  function retry() {
    setStatus("loading");
    setAttempt((value) => value + 1);
  }

  return (
    <div ref={frameRef} className={cn("relative w-full", className)} aria-busy={pending || status === "loading"}>
      {status === "scriptFailed" || status === "notDrawn" ? (
        <Alert
          tone="negative"
          role="alert"
          action={
            <Button variant="outline" size="sm" onClick={retry}>
              {text.retry}
            </Button>
          }
        >
          {status === "scriptFailed" ? text.loadFailed : text.notDrawn}
        </Alert>
      ) : (
        <>
          {/* Google owns the children of this element; React never renders into it. */}
          <div ref={slotRef} inert={pending} className={cn("flex min-h-11 justify-center", status === "loading" && "invisible")} />
          {status === "loading" && (
            <>
              <Skeleton className="absolute inset-0" />
              <span className="sr-only">{text.loading}</span>
            </>
          )}
          {pending && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-md bg-card/85 text-body text-muted-foreground">
              <Spinner /> {text.pending}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Whether Google put a button in the slot; it renders one frame after renderButton returns. */
async function drawn(slot: HTMLElement, timeout = 4000): Promise<boolean> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (slot.childElementCount > 0) return true;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
}

/** Container width clamped to what Google's button accepts; 0 until measured. */
function useButtonWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.floor(entry.contentRect.width))));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}
