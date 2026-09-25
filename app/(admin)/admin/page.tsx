import { KeyRound, ShieldAlert, Users } from "lucide-react";
import type { Metadata } from "next";
import { StatCard } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminStats, getAdminUsage } from "@/lib/api/admin";
import { getI18n } from "@/lib/i18n/server";
import { parseRange } from "@/lib/usage-view";
import { RangeTabs } from "@/app/_components/range-tabs";
import { DailyUsageChart, UsageByTypeChart } from "@/app/_components/usage-charts";
import { UsageStatCards } from "@/app/_components/usage-stats";
import { UsageSummary } from "@/app/_components/usage-summary";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.overview.metaTitle };
}

export default async function AdminOverviewPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const range = parseRange((await searchParams).days);
  const [{ t, format }, stats, usage] = await Promise.all([getI18n(), getAdminStats(), getAdminUsage({ range })]);
  const text = t.admin.overview;

  return (
    <>
      <PageHeader title={text.title} description={text.description(range)} actions={<RangeTabs value={range} />} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label={text.users}
          value={format.number(stats.users)}
          hint={text.banned(format.number(stats.banned_users))}
          icon={<Users />}
        />
        <StatCard label={text.keys} value={format.number(stats.api_keys)} icon={<KeyRound />} />
        <StatCard
          label={text.suspended}
          value={format.number(stats.suspended_api_keys)}
          hint={text.scraping(format.number(stats.scraping_api_keys))}
          icon={<ShieldAlert />}
        />
        <UsageStatCards usage={usage} />
      </div>

      <div className="grid gap-6">
        <DailyUsageChart usage={usage} range={range} />
        <UsageByTypeChart usage={usage} range={range} />
      </div>
      <UsageSummary usage={usage} range={range} />
    </>
  );
}
