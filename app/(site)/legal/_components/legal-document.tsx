import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { CONTACT_EMAIL } from "@/lib/contact";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { Bullets, DocSection, Prose } from "../../docs/_components/doc-section";

type LegalSection = { title: string; paragraphs?: readonly string[]; items?: readonly string[] };

export type LegalDocumentProps = {
  text: Dictionary["legal"];
  document: { title: string; description: string; sections: readonly LegalSection[] };
};

/**
 * A legal page: its title, the draft note while placeholders are left in it, its numbered
 * sections and the contact address.
 */
export function LegalDocument({ text, document }: LegalDocumentProps) {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-10 px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-4">
        <PageHeader title={document.title} description={document.description} />
        <p className="text-overline text-muted-foreground">{text.updated}</p>
        <Alert tone="warning" title={text.draft.title}>
          {text.draft.body}
        </Alert>
      </div>
      {document.sections.map((section, index) => (
        <DocSection key={section.title} id={`section-${index + 1}`} title={`${index + 1}. ${section.title}`}>
          {section.paragraphs?.map((paragraph) => <Prose key={paragraph}>{paragraph}</Prose>)}
          {section.items && <Bullets items={[...section.items]} />}
        </DocSection>
      ))}
      <DocSection id="contact" title={text.contact}>
        <Prose>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-link hover:text-link-hover">
            {CONTACT_EMAIL}
          </a>
        </Prose>
      </DocSection>
    </div>
  );
}
