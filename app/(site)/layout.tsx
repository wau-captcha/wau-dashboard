import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AppHeader } from "@/components/ui/app-header";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";
import { getOptionalUser } from "@/lib/dal";
import { getI18n } from "@/lib/i18n/server";
import { DashboardHeader } from "@/app/_components/dashboard-header";

/**
 * Public pages: the home page, the captcha pages and the docs. Anyone may read them. A signed-in visitor keeps the
 * dashboard header, so opening the docs does not look like signing out.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  // If wau-services is down the pages still render, just with the sign-in button.
  const [{ t }, user] = await Promise.all([getI18n(), getOptionalUser().catch(() => null)]);
  const nav = t.site.nav;

  return (
    <div className="flex min-h-dvh flex-col">
      {user ? (
        <DashboardHeader user={user} />
      ) : (
        <AppHeader
          brand={<Logo href="/" className="shrink-0" />}
          navLabel={nav.label}
          nav={
            <>
              <NavLink href="/" exact>
                {nav.home}
              </NavLink>
              <NavLink href="/captchas">{t.captchas.nav}</NavLink>
              <NavLink href="/docs">{nav.docs}</NavLink>
              {/* On phones the bar has no room for the button below, so the menu offers it. */}
              <NavLink href="/login" className="sm:hidden">
                {nav.signIn}
              </NavLink>
            </>
          }
          settings={
            <>
              <LanguageSwitcher />
              <ThemeToggle />
            </>
          }
          actions={
            <Link href="/login" className={buttonVariants({ size: "sm", className: "max-sm:hidden" })}>
              {nav.signIn}
            </Link>
          }
        />
      )}
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-body text-muted-foreground sm:px-6">
          <div className="grid gap-1">
            <Logo />
            <p>{t.site.footer.tagline}</p>
          </div>
          <nav aria-label={t.site.footer.product} className="flex flex-wrap gap-4">
            <Link href="/captchas" className="hover:text-foreground">
              {t.captchas.nav}
            </Link>
            <Link href="/docs" className="hover:text-foreground">
              {nav.docs}
            </Link>
            <Link href="/overview" className="hover:text-foreground">
              {nav.dashboard}
            </Link>
          </nav>
          <p className="w-full text-overline">{t.site.footer.rights(new Date().getFullYear())}</p>
        </div>
      </footer>
    </div>
  );
}
