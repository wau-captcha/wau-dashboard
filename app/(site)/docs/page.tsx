import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { getI18n } from "@/lib/i18n/server";
import { docsBaseUrl } from "../_components/base-url";
import { IntegrationSections } from "./_components/integration-sections";
import { BindingSections, LimitationsSection } from "./_components/protection-sections";
import { ReferenceSections } from "./_components/reference-sections";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.docs.metaTitle, description: t.docs.metaDescription };
}

/** The integration guide: one page, with a table of contents that stays in view. */
export default async function DocsPage() {
  const { t } = await getI18n();
  const text = t.docs;
  const sections = text.sections;
  const baseUrl = docsBaseUrl();
  const contents = [
    { id: "overview", title: sections.overview.title },
    { id: "quick-start", title: sections.quickStart.title },
    { id: "widget", title: sections.widget.title },
    { id: "react", title: sections.react.title },
    { id: "client", title: sections.client.title },
    { id: "node", title: sections.node.title },
    { id: "verify-package", title: sections.verifyPackage.title },
    { id: "java", title: sections.java.title },
    { id: "other-languages", title: sections.otherLanguages.title },
    { id: "site-binding", title: sections.siteBinding.title },
    { id: "sdk-versions", title: sections.sdkVersions.title },
    { id: "rest-api", title: sections.api.title },
    { id: "challenge-types", title: sections.challengeTypes.title },
    { id: "security", title: sections.security.title },
    { id: "errors", title: sections.errors.title },
    { id: "limitations", title: sections.limitations.title },
  ];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-x-10 gap-y-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-y-12">
      <div className="grid min-w-0 gap-4 lg:col-start-2">
        <PageHeader title={text.title} description={text.description} />
        <Alert tone="info">{text.baseUrlNote(baseUrl)}</Alert>
      </div>
      {/* Under the header on phones; beside the content, and in view while it scrolls, from lg up. */}
      <TableOfContents
        items={contents}
        label={text.toc}
        className="lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start"
      />
      <div className="grid min-w-0 gap-12 lg:col-start-2">
        <IntegrationSections text={sections} baseUrl={baseUrl} />
        <BindingSections text={sections} />
        <ReferenceSections text={sections} baseUrl={baseUrl} />
        <LimitationsSection text={sections} />
      </div>
    </div>
  );
}
