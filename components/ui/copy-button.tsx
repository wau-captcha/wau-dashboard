"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "./button";
import { Tooltip } from "./tooltip";

export type CopyButtonProps = Omit<ButtonProps, "onClick" | "value"> & {
  value: string;
  label?: string;
  copiedLabel?: string;
  onCopied?: () => void;
};

async function writeClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // The Clipboard API is unavailable on insecure origins (e.g. http://192.168.x.x in development).
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

/** Copies `value` to the clipboard and confirms with a check icon. Icon-only by default. */
export function CopyButton({
  value,
  label = "Sao chép",
  copiedLabel = "Đã sao chép",
  onCopied,
  variant = "ghost",
  size = "icon-sm",
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    await writeClipboard(value);
    setCopied(true);
    onCopied?.();
  }

  return (
    <Tooltip content={copied ? copiedLabel : label} closeOnClick={false}>
      <Button variant={variant} size={size} aria-label={children ? undefined : label} onClick={copy} {...props}>
        {copied ? <Check className="text-positive-text" /> : <Copy />}
        {children}
      </Button>
    </Tooltip>
  );
}
