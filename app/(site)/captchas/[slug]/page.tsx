import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DescriptionList } from "@/components/ui/description-list";
import { Figure } from "@/components/ui/figure";
import { CAPTCHAS, captchaBySlug, type CaptchaInfo } from "@/lib/captchas";
import { challengeTypeLabel } from "@/lib/challenge-types";
import { getI18n } from "@/lib/i18n/server";
import { CaptchaIllustration } from "@/app/_components/captcha-illustration";
import { docsBaseUrl } from "../../_components/base-url";
import { Bullets, Prose, Steps, SubHeading } from "../../docs/_components/doc-section";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const [{ t }, { slug }] = await Promise.all([getI18n(), params]);
  const captcha = captchaBySlug(slug);
  if (!captcha) return {};
  return { title: challengeTypeLabel(captcha.id, t.challengeTypes), description: t.captchaGuides.types[captcha.id].tagline };
}

/** How the three ways of asking for a type look, with the site's own API address. */
function usage(captcha: CaptchaInfo, baseUrl: string): string {
  return [
    `<WauCaptcha siteKey="pk_…" baseUrl="${baseUrl}" challengeType={ChallengeType.${captcha.constant}} />`,
    `<div data-wau-captcha data-site-key="pk_…" data-base-url="${baseUrl}" data-challenge-type="${captcha.id}"></div>`,
    `GET ${baseUrl}/challenge/new?site_key=pk_…&challenge_type=${captcha.id}`,
  ].join("\n\n");
}

/** One captcha type: what it looks like, what the person does and when to choose it. */
export default async function CaptchaTypePage({ params }: Params) {
  const [{ t }, { slug }] = await Promise.all([getI18n(), params]);
  const captcha = captchaBySlug(slug);
  if (!captcha) notFound();
  const text = t.captchaGuides;
  const guide = text.types[captcha.id];
  const position = CAPTCHAS.indexOf(captcha);
  const previous = CAPTCHAS[position - 1];
  const next = CAPTCHAS[position + 1];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-4">
        <Link href="/captchas" className={buttonVariants({ variant: "ghost", size: "sm", className: "justify-self-start" })}>
          <ArrowLeft /> {t.captchas.allCaptchas}
        </Link>
        <div className="grid max-w-3xl gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-brand text-hero font-semibold tracking-tight text-foreground">
              {challengeTypeLabel(captcha.id, t.challengeTypes)}
            </h1>
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-overline text-muted-foreground">{captcha.id}</code>
          </div>
          <p className="text-prose text-muted-foreground">{guide.tagline}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
        <Figure caption={guide.caption}>
          <CaptchaIllustration captcha={captcha} text={text.types} />
        </Figure>
        <Card>
          <CardHeader>
            <CardTitle>{text.sections.facts}</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList
              columns={1}
              items={[
                { label: text.facts.media, value: guide.media },
                { label: text.facts.answer, value: guide.answer },
                { label: text.facts.lifetime, value: text.facts.lifetimeValue },
                { label: text.facts.behavior, value: <Link href="/captchas/behavior" className="text-link hover:text-link-hover">{text.facts.behaviorValue}</Link> },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <section className="grid content-start gap-3">
          <SubHeading>{text.sections.does}</SubHeading>
          <Steps items={guide.does} />
        </section>
        <section className="grid content-start gap-3">
          <SubHeading>{text.sections.why}</SubHeading>
          <Bullets items={guide.why} />
        </section>
      </div>

      <section className="grid gap-3">
        <SubHeading>{text.sections.choose}</SubHeading>
        <Alert tone={captcha.id === "slide_puzzle" ? "warning" : "neutral"}>{guide.choose}</Alert>
      </section>

      <section className="grid gap-3">
        <SubHeading>{text.sections.use}</SubHeading>
        <Prose>{text.sections.useBody}</Prose>
        <CodeBlock code={usage(captcha, docsBaseUrl())} />
      </section>

      <nav aria-label={t.captchas.allCaptchas} className="flex flex-wrap justify-between gap-3 border-t border-border pt-6">
        {previous ? (
          <Link href={`/captchas/${previous.slug}`} className={buttonVariants({ variant: "outline" })}>
            <ArrowLeft /> {text.previous}: {challengeTypeLabel(previous.id, t.challengeTypes)}
          </Link>
        ) : (
          <span />
        )}
        <Link href={next ? `/captchas/${next.slug}` : "/captchas/behavior"} className={buttonVariants({ variant: "outline" })}>
          {text.next}: {next ? challengeTypeLabel(next.id, t.challengeTypes) : text.behavior.title} <ArrowRight />
        </Link>
      </nav>
    </div>
  );
}
