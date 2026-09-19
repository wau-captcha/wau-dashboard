import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { PageHeader } from "@/components/ui/page-header";
import { listChallengeTypes } from "@/lib/api/api-keys";
import { getCurrentUser } from "@/lib/dal";
import { getI18n } from "@/lib/i18n/server";
import { LogoutButton } from "../_components/logout-button";
import { ChallengeTypesTable } from "./_components/challenge-types-table";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.account.metaTitle, description: t.account.metaDescription };
}

export default async function AccountPage() {
  const [{ t, format }, user, challengeTypes] = await Promise.all([getI18n(), getCurrentUser(), listChallengeTypes()]);
  const text = t.account;

  return (
    <>
      <PageHeader title={text.title} description={text.description} />

      <Card>
        <CardHeader>
          <CardTitle>{text.info.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionList
            items={[
              { label: text.info.displayName, value: user.username },
              { label: text.info.email, value: user.email },
              { label: text.info.signInMethod, value: text.info.google },
              {
                label: text.info.plan,
                value: <Badge tone={user.tier_id === "premium" ? "primary" : "neutral"}>{user.tier_name}</Badge>,
              },
              { label: text.info.joined, value: format.dateTime(user.create_date) },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="min-w-0">
            <CardTitle>{text.types.title}</CardTitle>
            <CardDescription>{text.types.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ChallengeTypesTable challengeTypes={challengeTypes} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="min-w-0">
            <CardTitle>{text.session.title}</CardTitle>
            <CardDescription>{text.session.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LogoutButton />
        </CardContent>
      </Card>
    </>
  );
}
