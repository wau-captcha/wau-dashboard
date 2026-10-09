import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { listAppeals } from "@/lib/api/admin";
import { APPEAL_FILTERS, type AppealFilter } from "@/lib/appeal-filters";
import { getI18n } from "@/lib/i18n/server";
import { AppealStatusTabs } from "../_components/appeal-status-tabs";
import { AppealsTable } from "../_components/appeals-table";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.appeals.metaTitle };
}

export default async function AdminAppealsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const requested = (await searchParams).status;
  const status: AppealFilter = APPEAL_FILTERS.find((filter) => filter === requested) ?? "pending";
  const [{ t }, appeals] = await Promise.all([getI18n(), listAppeals(status)]);
  const text = t.appeals;

  return (
    <>
      <PageHeader title={text.title} description={text.description} actions={<AppealStatusTabs value={status} />} />
      <AppealsTable appeals={appeals} />
    </>
  );
}
