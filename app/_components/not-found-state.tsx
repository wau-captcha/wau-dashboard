import { cookies } from "next/headers";
import Link from "next/link";
import { ThemeRestore } from "@/components/theme/theme-restore";
import { buttonVariants } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { getI18n } from "@/lib/i18n/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

/**
 * What every 404 says, wherever it renders: back home, then the dashboard for a signed-in user or
 * the docs for a visitor, and a few pages that exist.
 */
export async function NotFoundState() {
  const [{ t }, cookieStore] = await Promise.all([getI18n(), cookies()]);
  const text = t.common.notFound;
  const signedIn = cookieStore.has(SESSION_COOKIE);

  return (
    <>
      <ThemeRestore />
      <ErrorState
        code="404"
        title={text.title}
        description={text.description}
        actions={
          <>
            <Link href="/" className={buttonVariants()}>
              {text.home}
            </Link>
            <Link href={signedIn ? "/overview" : "/docs"} className={buttonVariants({ variant: "outline" })}>
              {signedIn ? text.dashboard : text.docs}
            </Link>
          </>
        }
        linksLabel={text.elsewhere}
        links={[
          { href: "/captchas", label: t.captchas.nav },
          { href: "/pricing", label: t.site.nav.pricing },
          { href: "/about", label: t.site.nav.about },
          { href: "/changelog", label: t.site.footer.changelog },
          { href: "/status", label: t.site.footer.status },
        ]}
      />
    </>
  );
}
