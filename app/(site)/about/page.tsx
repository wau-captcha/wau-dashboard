import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { DescriptionList } from "@/components/ui/description-list";
import { MediaCard } from "@/components/ui/media-card";
import { PageHeader } from "@/components/ui/page-header";
import { CONTACT_EMAIL } from "@/lib/contact";
import { getI18n } from "@/lib/i18n/server";
import { Bullets, DocSection, Prose, SubHeading } from "../docs/_components/doc-section";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.trust.about.metaTitle, description: t.trust.about.metaDescription };
}

/** Where each part of the website lives, in the order the page lists them. */
const OFFERS = [
  { id: "captchas", href: "/captchas" },
  { id: "docs", href: "/docs" },
  { id: "samples", href: "/captchas/samples" },
  { id: "dashboard", href: "/overview" },
  { id: "pricing", href: "/pricing" },
  { id: "changelog", href: "/changelog" },
] as const;

/**
 * What WAU Captcha is and what this website offers, that bots solving its captchas for research
 * and testing are welcome and within which limits, and who runs it, since when and where.
 */
export default async function AboutPage() {
  const { t } = await getI18n();
  const text = t.trust.about;
  const footer = t.site.footer;
  const links = [
    { href: "/security", label: footer.security },
    { href: "/legal/privacy", label: footer.privacy },
    { href: "/legal/terms", label: footer.terms },
    { href: "/status", label: footer.status },
  ];

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-12 px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-4">
        <PageHeader title={text.title} description={text.description} />
        <Alert tone="warning">{text.demo}</Alert>
        {text.body.map((paragraph) => (
          <Prose key={paragraph}>{paragraph}</Prose>
        ))}
      </div>

      <DocSection id="website" title={text.offersTitle}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {OFFERS.map(({ id, href }) => (
            <li key={id}>
              <MediaCard href={href} title={text.offers[id].title} description={text.offers[id].body} action={text.offers[id].action} />
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="research" title={text.research.title}>
        <Alert tone="positive">{text.research.welcome}</Alert>
        <Prose>{text.research.body}</Prose>
        <SubHeading>{text.research.rulesTitle}</SubHeading>
        <Bullets items={text.research.rules} />
        <SubHeading>{text.research.expectTitle}</SubHeading>
        <Bullets items={text.research.expect} />
        <div className="flex flex-wrap gap-2">
          <Link href="/captchas/samples" className={buttonVariants({ variant: "outline", size: "sm" })}>
            {text.offers.samples.title}
          </Link>
          <Link href="/security" className={buttonVariants({ variant: "outline", size: "sm" })}>
            {footer.security}
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            {CONTACT_EMAIL}
          </a>
        </div>
      </DocSection>

      <DocSection id="facts" title={text.factsTitle}>
        <DescriptionList
          columns={1}
          items={[
            { label: text.facts.operator, value: text.facts.operatorValue },
            { label: text.facts.since, value: text.facts.sinceValue },
            { label: text.facts.hosting, value: text.facts.hostingValue },
            {
              label: text.facts.contact,
              value: (
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-link hover:text-link-hover">
                  {CONTACT_EMAIL}
                </a>
              ),
            },
          ]}
        />
      </DocSection>

      <DocSection id="more" title={text.linksTitle}>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
              {link.label}
            </Link>
          ))}
        </div>
      </DocSection>
    </div>
  );
}
