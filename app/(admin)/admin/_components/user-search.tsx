"use client";

import { Search } from "lucide-react";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { useI18n } from "@/lib/i18n/client";

/** Searches users through the URL (?q=), so a search can be shared and survives a reload. */
export function UserSearch({ query }: { query: string }) {
  const text = useI18n().t.admin.users;
  return (
    <Form action="/admin/users" role="search" aria-label={text.searchLabel} className="flex w-full gap-2 sm:w-80">
      <TextInput
        name="q"
        type="search"
        defaultValue={query}
        maxLength={100}
        placeholder={text.searchPlaceholder}
        aria-label={text.searchLabel}
        startAdornment={<Search />}
        className="flex-1"
      />
      <Button type="submit" variant="outline">
        {text.search}
      </Button>
    </Form>
  );
}
