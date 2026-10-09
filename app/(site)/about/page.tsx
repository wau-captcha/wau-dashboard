import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { DescriptionList } from "@/components/ui/description-list";
import { PageHeader } from "@/components/ui/page-header";
import { CONTACT_EMAIL } from "@/lib/contact";
import { getI18n } from "@/lib/i18n/server";
import { Prose, SubHeading } from "../docs/_components/doc-section";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.trust.about.metaTitle, description: t.trust.about.metaDescription };
}

/** Who runs WAU Captcha, since when, where it is hosted and how to reach them. */
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
    <div className="mx-auto grid w-full max-w-3xl gap-10 px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-4">
        <PageHeader title={text.title} description={text.description} />
        {text.body.map((paragraph) => (
          <Prose key={paragraph}>{paragraph}</Prose>
        ))}
      </div>
      <section className="grid gap-3">
        <SubHeading>{text.factsTitle}</SubHeading>
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
      </section>
      <section className="grid gap-3">
        <SubHeading>{text.linksTitle}</SubHeading>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
