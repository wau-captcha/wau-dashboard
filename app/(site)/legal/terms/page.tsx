import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { LegalDocument } from "../_components/legal-document";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.legal.terms.metaTitle, description: t.legal.terms.metaDescription };
}

/** The terms of service; /terms redirects here. */
export default async function TermsPage() {
  const { t } = await getI18n();
  return <LegalDocument text={t.legal} document={t.legal.terms} />;
}
