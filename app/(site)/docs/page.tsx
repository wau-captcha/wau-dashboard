import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { getI18n } from "@/lib/i18n/server";
import { docsBaseUrl } from "../_components/base-url";
import { IntegrationSections } from "./_components/integration-sections";
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
    { id: "client", title: sections.client.title },
    { id: "node", title: sections.node.title },
    { id: "java", title: sections.java.title },
    { id: "rest-api", title: sections.api.title },
    { id: "challenge-types", title: sections.challengeTypes.title },
    { id: "security", title: sections.security.title },
    { id: "errors", title: sections.errors.title },
  ];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <nav aria-label={text.toc} className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-overline font-medium uppercase tracking-wide text-muted-foreground">{text.toc}</p>
        <ul className="grid gap-1 border-l border-border">
          {contents.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className="-ml-px block border-l border-transparent py-1 pl-3 text-body text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                {entry.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid min-w-0 gap-12">
        <div className="grid gap-4">
          <PageHeader title={text.title} description={text.description} />
          <Alert tone="info">{text.baseUrlNote(baseUrl)}</Alert>
        </div>
        <IntegrationSections text={sections} baseUrl={baseUrl} />
        <ReferenceSections text={sections} baseUrl={baseUrl} />
      </div>
    </div>
  );
}
