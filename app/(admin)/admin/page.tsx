import { Activity, KeyRound, ShieldAlert, Users } from "lucide-react";
import type { Metadata } from "next";
import { StatCard } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminStats, getAdminUsage } from "@/lib/api/admin";
import { getI18n } from "@/lib/i18n/server";
import { parseRange, usageTotals } from "@/lib/usage-view";
import { RangeTabs } from "@/app/_components/range-tabs";
import { DailyUsageChart, UsageByTypeChart } from "@/app/_components/usage-charts";
import { UsageSummary } from "@/app/_components/usage-summary";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.overview.metaTitle };
}

export default async function AdminOverviewPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const days = parseRange((await searchParams).days);
  const [{ t, format }, stats, usage] = await Promise.all([getI18n(), getAdminStats(), getAdminUsage({ days })]);
  const text = t.admin.overview;
  const totals = usageTotals(usage, format);

  return (
    <>
      <PageHeader title={text.title} description={text.description(days)} actions={<RangeTabs value={days} />} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        <StatCard label={t.usage.stats.solves} value={totals.total} hint={`${t.usage.stats.rate}: ${totals.rate}`} icon={<Activity />} />
      </div>

      <div className="grid gap-6">
        <DailyUsageChart usage={usage} days={days} />
        <UsageByTypeChart usage={usage} days={days} />
      </div>
      <UsageSummary usage={usage} />
    </>
  );
}
