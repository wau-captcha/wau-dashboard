import { ScanEye } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaCard } from "@/components/ui/media-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CAPTCHAS } from "@/lib/captchas";
import { challengeTypeDescription, challengeTypeLabel } from "@/lib/challenge-types";
import { getI18n } from "@/lib/i18n/server";
import { CaptchaIllustration } from "@/app/_components/captcha-illustration";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.captchas.metaTitle, description: t.captchas.metaDescription };
}

/** Every captcha type, side by side, and the behaviour check behind them. Introduction only. */
export default async function CaptchasPage() {
  const { t } = await getI18n();
  const text = t.captchas.index;
  const guides = t.captchaGuides.types;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-16 px-4 py-12 sm:px-6 sm:py-16">
      <section className="grid max-w-3xl gap-4">
        <h1 className="font-brand text-hero font-semibold tracking-tight text-foreground">{text.title}</h1>
        <p className="text-prose text-muted-foreground">{text.description}</p>
      </section>

      <section className="grid gap-6">
        <h2 className="font-brand text-display font-semibold tracking-tight text-foreground">{text.typesTitle}</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {CAPTCHAS.map((captcha) => (
            <li key={captcha.id}>
              <MediaCard
                href={`/captchas/${captcha.slug}`}
                title={challengeTypeLabel(captcha.id, t.challengeTypes)}
                meta={<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-overline text-muted-foreground">{captcha.id}</code>}
                description={challengeTypeDescription(captcha.id, t.challengeTypes)}
                media={<CaptchaIllustration captcha={captcha} text={guides} compact />}
                action={t.captchas.learnMore}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6">
        <h2 className="font-brand text-display font-semibold tracking-tight text-foreground">{text.compare.title}</h2>
        <Table aria-label={text.compare.tableLabel}>
          <TableHeader>
            <TableRow>
              <TableHead>{text.compare.type}</TableHead>
              <TableHead>{text.compare.task}</TableHead>
              <TableHead>{text.compare.media}</TableHead>
              <TableHead>{text.compare.keyboard}</TableHead>
              <TableHead>{text.compare.bestFor}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CAPTCHAS.map((captcha) => (
              <TableRow key={captcha.id}>
                <TableCell>
                  <Link href={`/captchas/${captcha.slug}`} className="font-medium text-foreground hover:text-link-hover">
                    {challengeTypeLabel(captcha.id, t.challengeTypes)}
                  </Link>
                </TableCell>
                <TableCell className="min-w-40 whitespace-normal">{guides[captcha.id].task}</TableCell>
                <TableCell className="min-w-40 whitespace-normal">{guides[captcha.id].media}</TableCell>
                <TableCell>
                  {captcha.id === "slide_puzzle" ? (
                    <Badge tone="warning">{text.compare.no}</Badge>
                  ) : (
                    <Badge tone="positive">{text.compare.yes}</Badge>
                  )}
                </TableCell>
                <TableCell className="min-w-40 whitespace-normal">{guides[captcha.id].bestFor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <Card>
          <CardContent className="grid gap-3 py-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-start md:gap-6">
            <ScanEye aria-hidden className="size-6 text-accent-foreground" />
            <div className="grid gap-2">
              <h2 className="font-brand text-title font-semibold tracking-tight text-foreground">{text.behaviorTitle}</h2>
              <p className="max-w-3xl text-body text-muted-foreground">{text.behaviorBody}</p>
              <Link href="/captchas/behavior" className={buttonVariants({ variant: "link", className: "justify-self-start px-0" })}>
                {text.behaviorLink}
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-6">
        <div className="grid gap-1">
          <h2 className="font-brand text-title font-semibold tracking-tight text-foreground">{text.startTitle}</h2>
          <p className="text-body text-muted-foreground">{text.startBody}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/keys" className={buttonVariants({ size: "lg" })}>
            {text.start}
          </Link>
          <Link href="/docs" className={buttonVariants({ variant: "outline", size: "lg" })}>
            {text.docs}
          </Link>
        </div>
      </section>
    </div>
  );
}
