import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { PageHeader } from "@/components/ui/page-header";
import { SecretValue } from "@/components/ui/secret-value";
import { getApiKey } from "@/lib/api/api-keys";
import { ApiError, servicesUrl } from "@/lib/api/client";
import type { ApiKey } from "@/lib/api/types";
import { getUsage } from "@/lib/api/usage";
import { getI18n } from "@/lib/i18n/server";
import { keyDisplayName } from "@/lib/key-name";
import { parseRange, usageTotals } from "@/lib/usage-view";
import { RangeTabs } from "@/app/_components/range-tabs";
import { UsageByKeyChart, UsageByTypeChart } from "@/app/_components/usage-charts";
import { UsageSummary } from "@/app/_components/usage-summary";
import { IntegrationGuide } from "./_components/integration-guide";
import { AllowedOrigins } from "./_components/allowed-origins";
import { KeySettings } from "./_components/key-settings";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.keyDetail.metaTitle };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function loadKey(id: string): Promise<ApiKey> {
  try {
    return await getApiKey(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export default async function KeyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ days?: string }>;
}) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const days = parseRange((await searchParams).days);
  const [{ t, format }, apiKey] = await Promise.all([getI18n(), loadKey(id)]);
  const usage = await getUsage({ apiKeyId: id, days });
  const text = t.keyDetail;
  const totals = usageTotals(usage, format);

  return (
    <>
      <PageHeader
        title={keyDisplayName(apiKey)}
        description={text.created(format.dateTime(apiKey.create_date))}
        actions={
          <Link href="/keys" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeft /> {text.back}
          </Link>
        }
      >
        {apiKey.is_suspended ? (
          <Badge tone="negative" dot>
            {t.common.status.suspended}
          </Badge>
        ) : apiKey.is_active ? (
          <Badge tone="positive" dot>
            {t.common.status.active}
          </Badge>
        ) : (
          <Badge tone="warning" dot>
            {t.common.status.paused}
          </Badge>
        )}
      </PageHeader>

      {apiKey.is_suspended && (
        <Alert tone="negative" title={text.suspended.title}>
          {apiKey.suspend_reason === "SCRAPING" ? text.suspended.scraping : text.suspended.admin}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{text.info.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionList
            columns={1}
            items={[
              { label: text.info.siteKey, value: <SecretValue value={apiKey.site_key} /> },
              { label: text.info.secretKey, value: <SecretValue value={apiKey.secret_key} masked /> },
              { label: text.info.id, value: <span className="font-mono text-overline">{apiKey.id}</span> },
            ]}
          />
        </CardContent>
      </Card>

      <KeySettings apiKey={apiKey} />

      <AllowedOrigins apiKey={apiKey} />

      <div className="grid gap-6">
        <PageHeader level={2} title={text.usageTitle} actions={<RangeTabs value={days} />} />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label={t.usage.stats.solves} value={totals.total} />
          <StatCard label={t.usage.stats.successful} value={totals.success} />
          <StatCard label={t.usage.stats.rate} value={totals.rate} />
        </div>
        <UsageByKeyChart usage={usage} days={days} keys={[apiKey]} />
        <UsageByTypeChart usage={usage} days={days} />
        <UsageSummary usage={usage} />
      </div>

      {/* <IntegrationGuide siteKey={apiKey.site_key} servicesUrl={servicesUrl()} /> */}
    </>
  );
}
