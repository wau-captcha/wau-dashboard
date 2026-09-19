import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionalAdmin } from "@/lib/dal";
import { getGoogleClientId, getGoogleNonce } from "@/lib/google";
import { getI18n } from "@/lib/i18n/server";
import { GoogleSignIn } from "../../_components/google-sign-in";
import { adminGoogleSignInAction } from "../../actions";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.adminLogin.metaTitle, description: t.auth.adminLogin.metaDescription };
}

/** Sign-in of the admin console. It never looks at, or creates, a dashboard session. */
export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getOptionalAdmin().catch(() => null)) redirect("/admin");
  const [{ next }, { t }, nonce] = await Promise.all([searchParams, getI18n(), getGoogleNonce()]);
  const text = t.auth.adminLogin;
  const clientId = getGoogleClientId();

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{text.title}</CardTitle>
          <CardDescription>{text.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {clientId ? (
          <GoogleSignIn clientId={clientId} nonce={nonce} next={next} action={adminGoogleSignInAction} />
        ) : (
          <Alert tone="warning" title={t.auth.login.notConfiguredTitle}>
            {t.auth.login.notConfigured}
          </Alert>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/login" className={buttonVariants({ variant: "link", size: "sm" })}>
          {text.userLogin}
        </Link>
      </CardFooter>
    </Card>
  );
}
