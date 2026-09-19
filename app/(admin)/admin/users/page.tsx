import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { listUsers } from "@/lib/api/admin";
import { getI18n } from "@/lib/i18n/server";
import { UserSearch } from "../_components/user-search";
import { UsersTable } from "../_components/users-table";

const PAGE_SIZE = 20;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.users.metaTitle };
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(params.page ?? "", 10) || 1);
  const [{ t }, result] = await Promise.all([getI18n(), listUsers({ query, page, pageSize: PAGE_SIZE })]);
  const text = t.admin.users;

  return (
    <>
      <PageHeader title={text.title} description={text.description} actions={<UserSearch query={query} />} />
      <UsersTable users={result.users} total={result.total_size} page={page} pageSize={PAGE_SIZE} />
    </>
  );
}
