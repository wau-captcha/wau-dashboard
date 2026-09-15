"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

/** App-wide client providers. Mounted once in the root layout. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delay={400}>
      <ToastProvider>{children}</ToastProvider>
    </TooltipProvider>
  );
}
