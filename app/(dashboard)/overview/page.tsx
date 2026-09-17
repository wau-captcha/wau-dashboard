import { Activity, CircleCheck, KeyRound, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listApiKeys, listChallengeTypes } from "@/lib/api/api-keys";
import { getUsage } from "@/lib/api/usage";
import { getI18n } from "@/lib/i18n/server";
import { parseRange, usageTotals } from "@/lib/usage-view";
import { RangeTabs } from "../_components/range-tabs";
import { UsageSummary } from "../_components/usage-summary";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.usage.overview.metaTitle, description: t.usage.overview.metaDescription };
}

export default async function OverviewPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const days = parseRange((await searchParams).days);
  const [{ t, format }, keys, usage, challengeTypes] = await Promise.all([
    getI18n(),
    listApiKeys(),
    getUsage({ days }),
    listChallengeTypes(),
  ]);
  const text = t.usage.overview;
  const activeKeys = keys.api_keys.filter((key) => key.is_active).length;
  const totals = usageTotals(usage, format);

  return (
    <>
      <PageHeader title={text.title} description={text.description(days)} actions={<RangeTabs value={days} />} />

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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={t.usage.stats.solves} value={totals.total} icon={<Activity />} />
            <StatCard label={t.usage.stats.rate} value={totals.rate} icon={<CircleCheck />} />
            <StatCard
              label={text.activeKeys}
              value={`${format.number(activeKeys)}/${format.number(keys.api_keys.length)}`}
              hint={text.keyLimit(keys.max_api_keys)}
              icon={<KeyRound />}
            />
            <StatCard label={text.challengeTypes} value={format.number(challengeTypes.length)} icon={<ShieldCheck />} />
          </div>
          <UsageSummary usage={usage} />
        </>
      )}
    </>
  );
}
