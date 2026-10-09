import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Figure } from "@/components/ui/figure";
import { getI18n } from "@/lib/i18n/server";
import { BehaviorChart } from "@/app/_components/behavior-chart";
import { Bullets, Prose, SubHeading } from "../../docs/_components/doc-section";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  const text = t.captchaGuides.behavior;
  return { title: text.metaTitle, description: text.metaDescription };
}

const SITEVERIFY_REPLY = `{
  "success": true,
  "challenge_type": "image_distort",
  "challenge_ts": "2026-10-05T08:15:02Z",
  "behavior": { "verdict": "human", "score": 1, "reasons": [] }
}`;

/** The behaviour check behind every captcha: what is recorded, what it decides, what sites get. */
export default async function BehaviorPage() {
  const { t } = await getI18n();
  const text = t.captchaGuides.behavior;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-4">
        <Link href="/captchas" className={buttonVariants({ variant: "ghost", size: "sm", className: "justify-self-start" })}>
          <ArrowLeft /> {t.captchas.allCaptchas}
        </Link>
        <div className="grid max-w-3xl gap-3">
          <h1 className="font-brand text-hero font-semibold tracking-tight text-foreground">{text.title}</h1>
          <p className="text-prose font-medium text-foreground">{text.tagline}</p>
          <p className="text-prose text-muted-foreground">{text.intro}</p>
        </div>
      </div>

      <section className="grid gap-3">
        <SubHeading>{text.chartTitle}</SubHeading>
        <Figure caption={text.chartCaption} frameClassName="items-stretch bg-card">
          <BehaviorChart />
        </Figure>
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <section className="grid content-start gap-3">
          <SubHeading>{text.recordsTitle}</SubHeading>
          <Bullets items={text.records} />
        </section>
        <section className="grid content-start gap-3">
          <SubHeading>{text.neverTitle}</SubHeading>
          <Alert tone="positive">{text.never}</Alert>
        </section>
      </div>

      <section className="grid gap-3">
        <SubHeading>{text.rulesTitle}</SubHeading>
        <Bullets items={text.rules} />
      </section>

      <section className="grid gap-3">
        <SubHeading>{text.serverTitle}</SubHeading>
        <Prose>{text.serverBody}</Prose>
        <CodeBlock language="json" code={SITEVERIFY_REPLY} />
      </section>

      <section className="grid gap-3">
        <SubHeading>{text.notMeasuredTitle}</SubHeading>
        <Alert tone="neutral">{text.notMeasuredBody}</Alert>
      </section>

      <section id="what-we-collect" className="grid gap-3">
        <SubHeading>{text.collectTitle}</SubHeading>
        <Prose>{text.collect}</Prose>
        <Link href="/legal/privacy" className={buttonVariants({ variant: "link", className: "justify-self-start px-0" })}>
          {text.privacyLink}
        </Link>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Link href="/docs#security" className={buttonVariants()}>
          {t.captchas.index.docs}
        </Link>
        <Link href="/captchas" className={buttonVariants({ variant: "outline" })}>
          {t.captchas.allCaptchas}
        </Link>
      </div>
    </div>
  );
}
