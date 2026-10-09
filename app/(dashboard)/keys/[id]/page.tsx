import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { PageHeader } from "@/components/ui/page-header";
import { SecretValue } from "@/components/ui/secret-value";
import { getApiKey, listApiKeyEvents } from "@/lib/api/api-keys";
import { ApiError } from "@/lib/api/client";
import type { ApiKey } from "@/lib/api/types";
import { getUsage } from "@/lib/api/usage";
import { getI18n } from "@/lib/i18n/server";
import { keyDisplayName } from "@/lib/key-name";
import { parseRange } from "@/lib/usage-view";
import { KeyStatusBadge } from "@/app/_components/key-status-badge";
import { RangeTabs } from "@/app/_components/range-tabs";
import { UsageByKeyChart, UsageByTypeChart } from "@/app/_components/usage-charts";
import { UsageStatCards } from "@/app/_components/usage-stats";
import { UsageSummary } from "@/app/_components/usage-summary";
import { AllowedDomains } from "./_components/allowed-domains";
import { AllowedOrigins } from "./_components/allowed-origins";
import { KeyActivity } from "./_components/key-activity";
import { KeyReview } from "./_components/key-review";
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

  const range = parseRange((await searchParams).days);
  const [{ t, format }, apiKey] = await Promise.all([getI18n(), loadKey(id)]);
  const [usage, events] = await Promise.all([getUsage({ apiKeyId: id, range }), listApiKeyEvents(id)]);
  const text = t.keyDetail;

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
        <KeyStatusBadge apiKey={apiKey} />
      </PageHeader>

      <KeyReview apiKey={apiKey} />

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

      <AllowedDomains apiKey={apiKey} />

      <AllowedOrigins apiKey={apiKey} />

      <div className="grid gap-6">
        <PageHeader level={2} title={text.usageTitle} actions={<RangeTabs value={range} />} />
        <div className="grid gap-4 sm:grid-cols-3">
          <UsageStatCards usage={usage} />
        </div>
        <UsageByKeyChart usage={usage} range={range} keys={[apiKey]} />
        <UsageByTypeChart usage={usage} range={range} />
      </div>

      <KeyActivity events={events} />
    </>
  );
}
