import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AppHeader } from "@/components/ui/app-header";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";
import type { User } from "@/lib/api/types";
import { getI18n } from "@/lib/i18n/server";
import { UserMenu } from "./user-menu";

/**
 * The header of a signed-in user: the dashboard pages, and the public ones (captchas, docs, about)
 * while signed in, so the navigation stays the same wherever the user goes.
 */
export async function DashboardHeader({ user }: { user: User }) {
  const { t } = await getI18n();
  const nav = t.common.nav;

  return (
    <AppHeader
      brand={<Logo href="/overview" className="shrink-0" />}
      navLabel={nav.label}
      nav={
        <>
          <NavLink href="/overview">{nav.overview}</NavLink>
          <NavLink href="/keys">{nav.keys}</NavLink>
          <NavLink href="/billing">{nav.billing}</NavLink>
          <NavLink href="/account">{nav.account}</NavLink>
          <NavLink href="/captchas">{t.captchas.nav}</NavLink>
          <NavLink href="/docs">{t.site.nav.docs}</NavLink>
          <NavLink href="/about">{t.site.nav.about}</NavLink>
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
  );
}
