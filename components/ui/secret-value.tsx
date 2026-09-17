"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CopyButton } from "./copy-button";
import { useUIText } from "./locale";
import { Tooltip } from "./tooltip";

export type SecretValueProps = {
  value: string;
  /** Hides the value until revealed. Use for secret keys; leave off for public site keys. */
  masked?: boolean;
  copyable?: boolean;
  className?: string;
  "aria-label"?: string;
};

/** "sk_c582fa0b…3c2a" → "sk_••••••••••••••••••••••3c2a". Keeps the type prefix and the last 4 characters. */
export function maskSecret(value: string) {
  const prefix = /^[a-z]+_/i.exec(value)?.[0] ?? "";
  const body = value.length - prefix.length;
  const tail = body > 8 ? 4 : 0;
  return prefix + "•".repeat(Math.min(Math.max(body - tail, 8), 24)) + (tail ? value.slice(-tail) : "");
}

/** Read-only monospace value with optional reveal and copy, e.g. site_key / secret_key. */
export function SecretValue({ value, masked = false, copyable = true, className, "aria-label": ariaLabel }: SecretValueProps) {
  const text = useUIText().secret;
  const [revealed, setRevealed] = useState(false);
  const hidden = masked && !revealed;

  return (
    <div
      data-slot="secret-value"
      className={cn("flex h-9 w-full min-w-0 items-center gap-1 rounded-md border border-border bg-muted pl-3 pr-1", className)}
    >
      <code
        aria-label={ariaLabel}
        translate="no"
        className="min-w-0 flex-1 truncate font-mono text-body text-foreground"
      >
        {hidden ? maskSecret(value) : value}
      </code>
      {masked && (
        <Tooltip content={revealed ? text.hide : text.show} closeOnClick={false}>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={revealed ? text.hideValue : text.showValue}
            aria-pressed={revealed}
            onClick={() => setRevealed((shown) => !shown)}
          >
            {revealed ? <EyeOff /> : <Eye />}
          </Button>
        </Tooltip>
      )}
      {copyable && <CopyButton value={value} size="icon-xs" />}
    </div>
  );
}
