import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { PageHeader } from "@/components/ui/page-header";
import { listChallengeTypes } from "@/lib/api/api-keys";
import { getQuota } from "@/lib/api/usage";
import { getCurrentUser } from "@/lib/dal";
import { getI18n } from "@/lib/i18n/server";
import { LogoutButton } from "../_components/logout-button";
import { PlanBadge } from "@/app/_components/plan-badge";
import { QuotaMeter } from "@/app/_components/quota-meter";
import { ChallengeTypesTable } from "./_components/challenge-types-table";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.account.metaTitle, description: t.account.metaDescription };
}

export default async function AccountPage() {
  const [{ t, format }, user, challengeTypes, quota] = await Promise.all([
    getI18n(),
    getCurrentUser(),
    listChallengeTypes(),
    getQuota(),
  ]);
  const text = t.account;

  return (
    <>
      <PageHeader title={text.title} description={text.description} />

      <Card>
        <CardHeader>
          <CardTitle>{text.info.title}</CardTitle>
          <Link href="/billing" className={buttonVariants({ variant: "outline", size: "sm" })}>
            {text.info.managePlan}
          </Link>
        </CardHeader>
        <CardContent>
          <DescriptionList
            items={[
              { label: text.info.displayName, value: user.username },
              { label: text.info.email, value: user.email },
              { label: text.info.signInMethod, value: text.info.google },
              {
                label: text.info.plan,
                value: <PlanBadge tierId={user.tier_id} tierName={user.tier_name} expiresAt={user.tier_expires_at} />,
              },
              { label: text.info.joined, value: format.dateTime(user.create_date) },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <QuotaMeter used={quota.used} limit={quota.limit} minutesToReset={quota.minutes_to_reset} upgradeHref="/billing" />
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
