import { KeyRound, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, StatCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listApiKeys, listChallengeTypes } from "@/lib/api/api-keys";
import { getQuota, getUsage } from "@/lib/api/usage";
import { getI18n } from "@/lib/i18n/server";
import { parseRange } from "@/lib/usage-view";
import { QuotaMeter } from "@/app/_components/quota-meter";
import { RangeTabs } from "@/app/_components/range-tabs";
import { UsageByKeyChart, UsageByTypeChart } from "@/app/_components/usage-charts";
import { UsageStatCards } from "@/app/_components/usage-stats";
import { UsageSummary } from "@/app/_components/usage-summary";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.usage.overview.metaTitle, description: t.usage.overview.metaDescription };
}

export default async function OverviewPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const range = parseRange((await searchParams).days);
  const [{ t, format }, keys, usage, challengeTypes, quota] = await Promise.all([
    getI18n(),
    listApiKeys(),
    getUsage({ range }),
    listChallengeTypes(),
    getQuota(),
  ]);
  const text = t.usage.overview;
  const activeKeys = keys.api_keys.filter((key) => key.is_active).length;

  return (
    <>
      <PageHeader title={text.title} description={text.description(range)} actions={<RangeTabs value={range} />} />

      <Card>
        <CardContent>
          <QuotaMeter used={quota.used} limit={quota.limit} minutesToReset={quota.minutes_to_reset} upgradeHref="/billing" />
        </CardContent>
      </Card>

      {keys.api_keys.length === 0 ? (
        <EmptyState
          icon={<KeyRound />}
          title={text.emptyTitle}
          description={text.emptyDescription}
          action={
            <Link href="/keys" className={buttonVariants()}>
              {text.emptyAction}
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <UsageStatCards usage={usage} />
            <StatCard
              label={text.activeKeys}
              value={`${format.number(activeKeys)}/${format.number(keys.api_keys.length)}`}
              hint={text.keyLimit(keys.max_api_keys)}
              icon={<KeyRound />}
            />
            <StatCard label={text.challengeTypes} value={format.number(challengeTypes.length)} icon={<ShieldCheck />} />
          </div>
          <div className="grid gap-6">
            <UsageByKeyChart usage={usage} range={range} keys={keys.api_keys} />
            <UsageByTypeChart usage={usage} range={range} />
          </div>
          <UsageSummary usage={usage} range={range} />
        </>
      )}
    </>
  );
}
