import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionalUser } from "@/lib/dal";
import { getI18n } from "@/lib/i18n/server";
import { RegisterForm } from "../_components/register-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.register.metaTitle, description: t.auth.register.metaDescription };
}

export default async function RegisterPage() {
  if (await getOptionalUser()) redirect("/overview");
  const { t } = await getI18n();

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{t.auth.register.title}</CardTitle>
          <CardDescription>{t.auth.register.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
