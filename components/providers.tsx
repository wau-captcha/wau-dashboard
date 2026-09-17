"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/ui/locale";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Locale } from "@/lib/i18n/config";

/** App-wide client providers. Mounted once in the root layout. */
export function Providers({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <LocaleProvider locale={locale}>
      <TooltipProvider delay={400}>
        <ToastProvider>{children}</ToastProvider>
      </TooltipProvider>
    </LocaleProvider>
  );
}
