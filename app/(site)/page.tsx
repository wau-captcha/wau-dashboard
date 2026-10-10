import { Blocks, Clock, KeyRound, Network, ScanEye, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { MediaCard } from "@/components/ui/media-card";
import { CAPTCHAS } from "@/lib/captchas";
import { getI18n } from "@/lib/i18n/server";
import { CaptchaIllustration } from "@/app/_components/captcha-illustration";
import { docsBaseUrl } from "./_components/base-url";
import { SdkTabs } from "./_components/sdk-tabs";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.site.landing.metaTitle, description: t.site.landing.metaDescription };
}

const featureIcons = [KeyRound, Network, Clock, ScanEye, ShieldCheck, Blocks];

/** The public home page: what WAU Captcha is, how it works, and how to start. */
export default async function HomePage() {
  const { t } = await getI18n();
  const text = t.site.landing;
  const baseUrl = docsBaseUrl();

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-20 px-4 py-16 sm:px-6 sm:py-20">
      <section className="grid place-items-center">
        <div className="grid max-w-3xl justify-items-center gap-5 text-center">
          <h1 className="font-brand text-hero font-semibold tracking-tight text-foreground sm:text-[44px]">
            {text.title}
          </h1>
          <p className="max-w-xl text-prose text-muted-foreground">{text.description}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/login" className={buttonVariants({ size: "lg" })}>
              {text.start}
            </Link>
            <Link href="/docs" className={buttonVariants({ variant: "outline", size: "lg" })}>
              {text.docs}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <h2 className="font-brand text-display font-semibold tracking-tight text-foreground">{text.how.title}</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {text.how.steps.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full">
                <CardContent className="grid gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">
                    {index + 1}
                  </span>
                  <h3 className="text-heading font-medium text-foreground">{step.title}</h3>
                  <p className="text-body text-muted-foreground">{step.body}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-2">
            <h2 className="font-brand text-display font-semibold tracking-tight text-foreground">{text.challenges.title}</h2>
            <p className="max-w-2xl text-body text-muted-foreground">{text.challenges.description}</p>
          </div>
          <Link href="/captchas" className={buttonVariants({ variant: "outline", size: "sm" })}>
            {t.captchas.allCaptchas}
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPTCHAS.map((captcha) => {
            const kind = {
              image_distort: text.challenges.imageDistort,
              motion_noise: text.challenges.motionNoise,
              slide_puzzle: text.challenges.slidePuzzle,
              animal_jump: text.challenges.animalJump,
            }[captcha.id];
            return (
              <li key={captcha.id}>
                <MediaCard
                  href={`/captchas/${captcha.slug}`}
                  title={kind.name}
                  meta={<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-overline text-muted-foreground">{captcha.id}</code>}
                  description={kind.body}
                  media={<CaptchaIllustration captcha={captcha} text={t.captchaGuides.types} compact />}
                  action={t.captchas.learnMore}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid gap-6">
        <h2 className="font-brand text-display font-semibold tracking-tight text-foreground">{text.features.title}</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {text.features.items.map((feature, index) => {
            const Icon = featureIcons[index % featureIcons.length];
            return (
              <li key={feature.title}>
                <Card className="h-full">
                  <CardContent className="grid gap-2">
                    <Icon aria-hidden className="size-5 text-accent-foreground" />
                    <h3 className="text-heading font-medium text-foreground">{feature.title}</h3>
                    <p className="text-body text-muted-foreground">{feature.body}</p>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
        <div className="grid gap-2">
          <h2 className="font-brand text-display font-semibold tracking-tight text-foreground">{text.sdks.title}</h2>
          <p className="text-body text-muted-foreground">{text.sdks.description}</p>
          <Link href="/docs" className={buttonVariants({ variant: "link", className: "justify-self-start" })}>
            {text.docs}
          </Link>
        </div>
        <SdkTabs labels={text.sdks} />
      </section>

      <section>
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-6 py-8">
            <div className="grid gap-1">
              <h2 className="font-brand text-title font-semibold tracking-tight text-foreground">{text.cta.title}</h2>
              <p className="text-body text-muted-foreground">{text.cta.body}</p>
            </div>
            <Link href="/keys" className={buttonVariants({ size: "lg" })}>
              {text.cta.button}
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
