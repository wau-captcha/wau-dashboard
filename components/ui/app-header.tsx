import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HeaderMenu } from "./header-menu";

export type AppHeaderProps = {
  /** Product mark, usually <Logo href="/overview" />. */
  brand: ReactNode;
  /** Primary navigation, usually <NavLink /> items. */
  nav?: ReactNode;
  /** Controls that stay in the bar at every width, e.g. a user menu or a sign-in link. */
  actions?: ReactNode;
  /** Controls that move into the menu below lg, e.g. LanguageSwitcher and ThemeToggle. */
  settings?: ReactNode;
  /** Accessible name of the navigation landmark; pass the translated text. */
  navLabel?: string;
  className?: string;
};

/**
 * Sticky application bar, one row high at every width. From lg up the navigation and the
 * settings sit in the bar; below, they move into a menu that opens from a button.
 */
export function AppHeader({ brand, nav, actions, settings, navLabel = "Main navigation", className }: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={cn("sticky top-0 z-sticky border-b border-border bg-background/90 backdrop-blur", className)}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <div className="flex shrink-0 items-center">{brand}</div>
        {nav && (
          <nav aria-label={navLabel} className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-thin lg:flex">
            {nav}
          </nav>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {settings && <div className="hidden items-center gap-2 lg:flex">{settings}</div>}
          {actions}
          {(nav || settings) && <HeaderMenu nav={nav} navLabel={navLabel} settings={settings} className="lg:hidden" />}
        </div>
      </div>
    </header>
  );
}
