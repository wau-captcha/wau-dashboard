import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionalUser } from "@/lib/dal";
import { getI18n } from "@/lib/i18n/server";
import { LoginForm } from "../_components/login-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.login.metaTitle, description: t.auth.login.metaDescription };
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  // A still-valid session means there is nothing to log in to.
  if (await getOptionalUser()) redirect("/overview");
  const [{ next }, { t }] = await Promise.all([searchParams, getI18n()]);

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{t.auth.login.title}</CardTitle>
          <CardDescription>{t.auth.login.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <LoginForm next={next} />
      </CardContent>
    </Card>
  );
}
