import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { TabNav, TabNavLink } from "@/components/ui/tab-nav";
import { getI18n } from "@/lib/i18n/server";

/** Plans & billing: the plans, and the payment history with a page per payment. */
export default async function BillingLayout({ children }: { children: ReactNode }) {
  const { t } = await getI18n();
  const text = t.billing;

  return (
    <>
      <div className="grid gap-4">
        <PageHeader title={text.title} description={text.description} />
        <TabNav aria-label={text.tabs.label}>
          <TabNavLink href="/billing" exact>
            {text.tabs.plans}
          </TabNavLink>
          <TabNavLink href="/billing/history">{text.tabs.history}</TabNavLink>
        </TabNav>
      </div>
      {children}
    </>
  );
}
