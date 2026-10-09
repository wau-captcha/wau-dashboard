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
 * Public pages: the home page, the captcha pages, pricing, the docs and the pages about the
 * service (legal, status, about, security, changelog). Anyone may read them. A signed-in
 * visitor keeps the dashboard header, so opening the docs does not look like signing out.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  // If wau-services is down the pages still render, just with the sign-in button.
  const [{ t }, user] = await Promise.all([getI18n(), getOptionalUser().catch(() => null)]);
  const nav = t.site.nav;
  const footer = t.site.footer;
  const footerNavs = [
    {
      label: footer.product,
      links: [
        { href: "/captchas", label: t.captchas.nav },
        { href: "/pricing", label: nav.pricing },
        { href: "/docs", label: nav.docs },
        { href: "/changelog", label: footer.changelog },
        { href: "/status", label: footer.status },
        { href: "/overview", label: nav.dashboard },
      ],
    },
    {
      label: footer.company,
      links: [
        { href: "/about", label: footer.about },
        { href: "/security", label: footer.security },
        { href: "/legal/privacy", label: footer.privacy },
        { href: "/legal/terms", label: footer.terms },
      ],
    },
  ];

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
              <NavLink href="/pricing">{nav.pricing}</NavLink>
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
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 text-body text-muted-foreground sm:grid-cols-2 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-x-16">
          <div className="grid content-start gap-1 sm:col-span-2 md:col-span-1">
            <Logo />
            <p>{footer.tagline}</p>
          </div>
          {footerNavs.map((group) => (
            <nav key={group.label} aria-label={group.label} className="grid content-start gap-2">
              <p className="text-overline font-medium uppercase tracking-wide text-foreground">{group.label}</p>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} className="justify-self-start hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
          <p className="text-overline sm:col-span-2 md:col-span-3">{footer.rights(new Date().getFullYear())}</p>
        </div>
      </footer>
    </div>
  );
}
