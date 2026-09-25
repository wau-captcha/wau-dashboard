import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminUsage, getAdminUser, listUserApiKeys } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { AdminUser } from "@/lib/api/types";
import { getI18n } from "@/lib/i18n/server";
import { parseRange } from "@/lib/usage-view";
import { QuotaMeter } from "@/app/_components/quota-meter";
import { RangeTabs } from "@/app/_components/range-tabs";
import { UsageByKeyChart, UsageByTypeChart } from "@/app/_components/usage-charts";
import { UsageStatCards } from "@/app/_components/usage-stats";
import { UsageSummary } from "@/app/_components/usage-summary";
import { BanDialog } from "../../_components/ban-dialog";
import { UserKeysTable } from "../../_components/user-keys-table";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.user.metaTitle };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function loadUser(id: string): Promise<AdminUser> {
  try {
    return await getAdminUser(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export default async function AdminUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ days?: string }>;
}) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const range = parseRange((await searchParams).days);
  const [{ t, format }, user, keys, usage] = await Promise.all([
    getI18n(),
    loadUser(id),
    listUserApiKeys(id),
    getAdminUsage({ userId: id, range }),
  ]);
  const text = t.admin.user;

  return (
    <>
      <PageHeader
        title={user.username}
        description={user.email}
        actions={
          <>
            <Link href="/admin/users" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <ArrowLeft /> {text.back}
            </Link>
            <BanDialog
              user={user}
              trigger={
                <Button variant={user.is_banned ? "outline" : "destructive-outline"} size="sm">
                  {user.is_banned ? t.admin.ban.unban : t.admin.ban.ban}
                </Button>
              }
            />
          </>
        }
      >
        {user.is_banned ? (
          <Badge tone="negative" dot>
            {t.common.status.banned}
          </Badge>
        ) : (
          <Badge tone="positive" dot>
            {t.common.status.active}
          </Badge>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{text.details}</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList
              items={[
                { label: t.account.info.email, value: user.email },
                {
                  label: t.account.info.plan,
                  value: <Badge tone={user.tier_id === "premium" ? "primary" : "neutral"}>{user.tier_name}</Badge>,
                },
                { label: t.account.info.joined, value: format.dateTime(user.create_date) },
                { label: text.keysCount, value: format.number(user.api_key_count) },
                { label: text.userId, value: <span className="font-mono text-overline">{user.id}</span> },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{text.quotaTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuotaMeter used={user.quota_used} limit={user.daily_quota} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="min-w-0">
            <CardTitle>{text.keysTitle}</CardTitle>
            <CardDescription>{text.keysDescription}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <UserKeysTable userId={user.id} keys={keys} />
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <PageHeader level={2} title={text.usageTitle} actions={<RangeTabs value={range} />} />
        <div className="grid gap-4 sm:grid-cols-3">
          <UsageStatCards usage={usage} />
        </div>
        <UsageByKeyChart usage={usage} range={range} keys={keys} />
        <UsageByTypeChart usage={usage} range={range} />
        <UsageSummary usage={usage} range={range} />
      </div>
    </>
  );
}
