import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AppHeader } from "@/components/ui/app-header";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";
import { getCurrentUser } from "@/lib/dal";
import { getI18n } from "@/lib/i18n/server";
import { UserMenu } from "./_components/user-menu";

/** Every page below this layout is behind the session check in getCurrentUser. */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, { t }] = await Promise.all([getCurrentUser(), getI18n()]);
  const nav = t.common.nav;

  return (
    <div className="min-h-dvh">
      <AppHeader
        brand={<Logo href="/overview" className="shrink-0" />}
        navLabel={nav.label}
        nav={
          <>
            <NavLink href="/overview">{nav.overview}</NavLink>
            <NavLink href="/keys">{nav.keys}</NavLink>
            <NavLink href="/account">{nav.account}</NavLink>
            <NavLink href="/docs">{t.site.nav.docs}</NavLink>
          </>
        }
        settings={
          <>
            <LanguageSwitcher />
            <ThemeToggle />
          </>
        }
        actions={<UserMenu user={user} />}
      />
      <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
