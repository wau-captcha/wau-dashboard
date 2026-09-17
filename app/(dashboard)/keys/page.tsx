import { KeyRound } from "lucide-react";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listApiKeys } from "@/lib/api/api-keys";
import { getI18n } from "@/lib/i18n/server";
import { CreateKeyDialog } from "./_components/create-key-dialog";
import { KeysTable } from "./_components/keys-table";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.keys.list.metaTitle, description: t.keys.list.metaDescription };
}

export default async function KeysPage() {
  const [{ t }, { api_keys: keys, max_api_keys: limit }] = await Promise.all([getI18n(), listApiKeys()]);
  const text = t.keys.list;
  const atLimit = keys.length >= limit;

  return (
    <>
      <PageHeader
        title={text.title}
        description={text.description(keys.length, limit)}
        actions={<CreateKeyDialog disabled={atLimit} limit={limit} />}
      />

      {keys.length === 0 ? (
        <EmptyState
          icon={<KeyRound />}
          title={text.emptyTitle}
          description={text.emptyDescription}
          action={<CreateKeyDialog disabled={false} limit={limit} />}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <KeysTable keys={keys} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
