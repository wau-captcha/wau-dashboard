import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { NotFoundState } from "./_components/not-found-state";

/**
 * Every URL no route serves, and every notFound() outside a group with a not-found of its own.
 * Only the root layout wraps it, so it brings the bar of the sign-in pages along.
 */
export default function NotFound() {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] overflow-x-clip px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4">
        <Logo href="/" />
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
      <main className="grid place-items-center py-16">
        <NotFoundState />
      </main>
    </div>
  );
}
