import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { LegalDocument } from "../_components/legal-document";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.legal.privacy.metaTitle, description: t.legal.privacy.metaDescription };
}

/** What WAU Captcha collects, why, where, for how long and who sees it; /privacy redirects here. */
export default async function PrivacyPage() {
  const { t } = await getI18n();
  return <LegalDocument text={t.legal} document={t.legal.privacy} />;
}
