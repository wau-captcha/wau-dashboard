import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <Logo href="/" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
      <main className="grid place-items-center py-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
