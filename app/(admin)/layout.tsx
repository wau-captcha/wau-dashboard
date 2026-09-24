import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AppHeader } from "@/components/ui/app-header";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";
import { getCurrentAdmin } from "@/lib/dal";
import { getI18n } from "@/lib/i18n/server";
import { AdminMenu } from "./_components/admin-menu";

/**
 * The admin console. Every page below is behind the administrator session checked by
 * getCurrentAdmin, which is separate from the dashboard's: signing in to one never signs in
 * to the other.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [admin, { t }] = await Promise.all([getCurrentAdmin(), getI18n()]);
  const nav = t.admin.nav;

  return (
    <div className="min-h-dvh">
      <AppHeader
        brand={
          <Logo href="/admin" className="shrink-0">
            <Badge tone="primary" size="sm">
              {nav.badge}
            </Badge>
          </Logo>
        }
        navLabel={nav.label}
        nav={
          <>
            <NavLink href="/admin" exact>
              {nav.overview}
            </NavLink>
            <NavLink href="/admin/users">{nav.users}</NavLink>
          </>
        }
        settings={
          <>
            <LanguageSwitcher />
            <ThemeToggle />
          </>
        }
        actions={<AdminMenu admin={admin} />}
      />
      <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
