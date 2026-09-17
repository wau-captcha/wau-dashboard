import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AppHeaderProps = {
  /** Product mark, usually <Logo href="/overview" />. */
  brand: ReactNode;
  /** Primary navigation, usually <NavLink /> items. */
  nav?: ReactNode;
  /** Right-hand controls, e.g. LanguageSwitcher, ThemeToggle and a user menu. */
  actions?: ReactNode;
  /** Accessible name of the navigation landmark; pass the translated text. */
  navLabel?: string;
  className?: string;
};

/**
 * Sticky application bar. On phones the navigation gets its own scrollable row under the
 * brand and actions, so the controls on the right never squeeze it out of view.
 */
export function AppHeader({ brand, nav, actions, navLabel = "Main navigation", className }: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={cn("sticky top-0 z-sticky border-b border-border bg-background/90 backdrop-blur", className)}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 px-4 sm:flex-nowrap sm:px-6">
        <div className="flex h-14 shrink-0 items-center">{brand}</div>
        {nav && (
          <nav
            aria-label={navLabel}
            className={cn(
              "order-last -mx-4 flex w-[calc(100%+2rem)] items-center gap-1 overflow-x-auto border-t border-border px-4 py-1.5 scrollbar-thin",
              "sm:order-none sm:mx-0 sm:w-auto sm:min-w-0 sm:flex-1 sm:border-t-0 sm:px-0 sm:py-0",
            )}
          >
            {nav}
          </nav>
        )}
        {actions && <div className="ml-auto flex h-14 shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
