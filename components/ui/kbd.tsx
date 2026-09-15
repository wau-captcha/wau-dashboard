import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Keyboard key hint, e.g. <Kbd>⌘</Kbd><Kbd>K</Kbd>. */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-muted px-1.5 py-0.5 font-mono text-overline leading-none text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
