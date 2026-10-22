import { KeyRound, ScanEye, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, StatCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaCard } from "@/components/ui/media-card";
import { PageHeader } from "@/components/ui/page-header";
import { listApiKeys, listChallengeTypes } from "@/lib/api/api-keys";
import { CAPTCHAS } from "@/lib/captchas";
import { challengeTypeDescription, challengeTypeLabel } from "@/lib/challenge-types";
import { getQuota, getUsage } from "@/lib/api/usage";
import { getI18n } from "@/lib/i18n/server";
import { CaptchaIllustration } from "@/app/_components/captcha-illustration";
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
        </>
      )}

      <section className="grid gap-4">
        <PageHeader
          level={2}
          title={t.captchas.overview.title}
          description={t.captchas.overview.description}
          actions={
            <Link href="/captchas" className={buttonVariants({ variant: "outline", size: "sm" })}>
              {t.captchas.allCaptchas}
            </Link>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPTCHAS.map((captcha) => {
            const onPlan = challengeTypes.some((type) => type.id === captcha.id);
            return (
              <li key={captcha.id}>
                <MediaCard
                  href={`/captchas/${captcha.slug}`}
                  title={challengeTypeLabel(captcha.id, t.challengeTypes)}
                  meta={
                    <Badge tone={onPlan ? "positive" : "neutral"} size="sm">
                      {onPlan ? t.captchas.overview.onPlan : t.captchas.overview.notOnPlan}
                    </Badge>
                  }
                  description={challengeTypeDescription(captcha.id, t.challengeTypes)}
                  media={<CaptchaIllustration captcha={captcha} text={t.captchaGuides.types} compact />}
                  action={t.captchas.learnMore}
                />
              </li>
            );
          })}
        </ul>
      </section>

      {/* Not a captcha type: the check behind all of them, so it stands apart from their list. */}
      <section>
        <Card>
          <CardContent className="grid gap-3 py-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-start md:gap-6">
            <ScanEye aria-hidden className="size-6 text-accent-foreground" />
            <div className="grid gap-2">
              <h2 className="font-brand text-section font-semibold tracking-tight text-foreground">{t.captchas.overview.behaviorTitle}</h2>
              <p className="max-w-3xl text-body text-muted-foreground">{t.captchas.overview.behaviorBody}</p>
              <Link href="/captchas/behavior" className={buttonVariants({ variant: "link", className: "justify-self-start px-0" })}>
                {t.captchas.learnMore}
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
