import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { CONTACT_EMAIL } from "@/lib/contact";
import { getI18n } from "@/lib/i18n/server";
import { Bullets, DocSection, Prose } from "../docs/_components/doc-section";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.trust.security.metaTitle, description: t.trust.security.metaDescription };
}

/** How to report a vulnerability; /.well-known/security.txt points here. */
export default async function SecurityPage() {
  const { t } = await getI18n();
  const text = t.trust.security;

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-10 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={text.title} description={text.description} />
      <DocSection id="report" title={text.reportTitle}>
        <Prose>{text.report}</Prose>
        <a href={`mailto:${CONTACT_EMAIL}`} className="justify-self-start text-prose text-link hover:text-link-hover">
          {CONTACT_EMAIL}
        </a>
      </DocSection>
      <DocSection id="scope" title={text.scopeTitle}>
        <Bullets items={text.scope} />
      </DocSection>
      <DocSection id="out-of-scope" title={text.outOfScopeTitle}>
        <Bullets items={text.outOfScope} />
      </DocSection>
      <DocSection id="promise" title={text.promiseTitle}>
        <Bullets items={text.promise} />
      </DocSection>
      <a href="/.well-known/security.txt" className="justify-self-start text-body text-link hover:text-link-hover">
        {text.machineReadable}: /.well-known/security.txt
      </a>
    </div>
  );
}
