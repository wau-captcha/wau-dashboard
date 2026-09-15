"use client";

import { Input } from "@base-ui/react/input";
import type { Ref } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = Omit<Input.Props, "className" | "render" | "size" | "type" | "ref"> & {
  ref?: Ref<HTMLTextAreaElement>;
  rows?: number;
  /** Grows with the content up to 20rem (Chromium); other browsers fall back to `rows`. */
  autoResize?: boolean;
  invalid?: boolean;
  className?: string;
};

/** Multi-line text input. Works inside Field like TextInput. */
export function Textarea({ ref, rows = 3, autoResize, invalid, className, ...props }: TextareaProps) {
  return (
    <Input
      ref={ref as Ref<HTMLInputElement>}
      data-slot="textarea"
      render={<textarea rows={rows} />}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex min-h-20 w-full min-w-0 resize-y rounded-md border border-input bg-input-bg px-3 py-2 text-body text-foreground outline-none",
        "transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/50 pointer-coarse:text-base",
        "focus-visible:border-focus-border focus-visible:shadow-focus",
        "data-[invalid]:border-error-border aria-[invalid=true]:border-error-border",
        "data-[invalid]:focus-visible:shadow-error aria-[invalid=true]:focus-visible:shadow-error",
        "disabled:cursor-not-allowed disabled:opacity-50",
        autoResize && "field-sizing-content max-h-80 resize-none",
        className,
      )}
      {...props}
    />
  );
}
