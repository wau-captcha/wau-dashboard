import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionalUser } from "@/lib/dal";
import { getGoogleClientId, getGoogleNonce } from "@/lib/google";
import { getI18n } from "@/lib/i18n/server";
import { GoogleSignIn } from "../_components/google-sign-in";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.login.metaTitle, description: t.auth.login.metaDescription };
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  // A still-valid session means there is nothing to sign in to. If wau-services is down the
  // page still renders, and signing in reports the problem.
  if (await getOptionalUser().catch(() => null)) redirect("/overview");
  const [{ next }, { t }, nonce] = await Promise.all([searchParams, getI18n(), getGoogleNonce()]);
  const text = t.auth.login;
  const clientId = getGoogleClientId();

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{text.title}</CardTitle>
          <CardDescription>{text.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {clientId ? (
          <GoogleSignIn clientId={clientId} nonce={nonce} next={next} />
        ) : (
          <Alert tone="warning" title={text.notConfiguredTitle}>
            {text.notConfigured}
          </Alert>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <CardDescription className="mt-0 text-center">{text.newAccount}</CardDescription>
      </CardFooter>
    </Card>
  );
}
