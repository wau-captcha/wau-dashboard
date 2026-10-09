import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { CHANGES, type Change } from "@/lib/changelog";
import { getI18n } from "@/lib/i18n/server";
import { SubHeading } from "../docs/_components/doc-section";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.trust.changelog.metaTitle, description: t.trust.changelog.metaDescription };
}

/** CHANGES grouped by day, newest first, as they are listed. */
function byDay(changes: readonly Change[]): [string, Change[]][] {
  const days = new Map<string, Change[]>();
  for (const change of changes) days.set(change.date, [...(days.get(change.date) ?? []), change]);
  return [...days.entries()];
}

/** Notable changes of the service, the website and the SDKs, from lib/changelog.ts. */
export default async function ChangelogPage() {
  const { t, locale, format } = await getI18n();
  const text = t.trust.changelog;

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-10 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={text.title} description={text.description} />
      {byDay(CHANGES).map(([date, changes]) => (
        <section key={date} className="grid gap-3">
          <SubHeading>
            <time dateTime={date}>{format.date(date)}</time>
          </SubHeading>
          <ul className="grid gap-3">
            {changes.map((change) => (
              <li key={change.en} className="flex flex-wrap items-start gap-x-3 gap-y-1 text-prose text-muted-foreground">
                <Badge tone="neutral" size="sm" className="mt-0.5 shrink-0">
                  {text.scopes[change.scope]}
                </Badge>
                <span className="min-w-0 flex-1 basis-64">{change[locale]}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
