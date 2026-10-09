"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInput } from "@/components/ui/text-input";
import { toast } from "@/components/ui/toast";
import type { AllowedDomain, ApiKey } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { setAllowedDomainsAction } from "../../actions";

type Row = AllowedDomain & { rowId: string };

const columns = "sm:grid-cols-[minmax(0,1fr)_9rem_auto]";

function toRows(domains: AllowedDomain[]): Row[] {
  return domains.map((domain, index) => ({ ...domain, rowId: `${domain.domain}-${index}` }));
}

const same = (rows: Row[], domains: AllowedDomain[]) =>
  rows.length === domains.length && rows.every((row, i) => row.domain === domains[i].domain);

/**
 * The websites allowed to use the site key, edited as a whole like the IP addresses. With none,
 * any website may use the key, which the card warns about.
 */
export function AllowedDomains({ apiKey }: { apiKey: ApiKey }) {
  const { t, format } = useI18n();
  const text = t.keyProtection.domains;
  const [saved, setSaved] = useState<AllowedDomain[]>(apiKey.allowed_domains ?? []);
  const [rows, setRows] = useState<Row[]>(() => toRows(apiKey.allowed_domains ?? []));
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const changed = !same(rows, saved);

  function save() {
    startTransition(async () => {
      const result = await setAllowedDomainsAction(
        apiKey.id,
        rows.map((row) => row.domain.trim()).filter(Boolean),
      );
      setError(result.error);
      if (!result.domains) return;
      setSaved(result.domains);
      setRows(toRows(result.domains));
      toast.success(text.saved);
    });
  }

  return (
    <Card id="allowed-domains">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{text.title}</CardTitle>
          <CardDescription>{text.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {error && (
          <Alert tone="negative" role="alert">
            {error}
          </Alert>
        )}
        {saved.length === 0 && <Alert tone="warning">{text.emptyWarning}</Alert>}
        {rows.length > 0 && (
          <>
            <div className={`hidden gap-3 px-1 text-overline uppercase tracking-wide text-muted-foreground sm:grid ${columns}`}>
              <span>{text.domain}</span>
              <span>{text.created}</span>
              <span className="w-8" />
            </div>
            {rows.map((row) => (
              <div key={row.rowId} className={`grid items-center gap-2 sm:gap-3 ${columns}`}>
                <TextInput
                  aria-label={text.domain}
                  value={row.domain}
                  onValueChange={(value) =>
                    setRows((current) => current.map((item) => (item.rowId === row.rowId ? { ...item, domain: value } : item)))
                  }
                  placeholder={text.placeholder}
                  maxLength={260}
                  disabled={pending}
                  inputClassName="font-mono"
                />
                <span className="text-overline text-muted-foreground tabular-nums">
                  {row.create_date ? format.date(row.create_date) : text.notSaved}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`${text.remove}: ${row.domain}`}
                  disabled={pending}
                  className="justify-self-end text-negative-text hover:text-negative-text"
                  onClick={() => setRows((current) => current.filter((item) => item.rowId !== row.rowId))}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            startIcon={<Plus />}
            disabled={pending || rows.length >= 50}
            onClick={() => setRows((current) => [...current, { rowId: `new-${Date.now()}`, domain: "" }])}
          >
            {text.add}
          </Button>
          {changed && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={() => {
                  setRows(toRows(saved));
                  setError(undefined);
                }}
              >
                {text.cancel}
              </Button>
              <Button size="sm" loading={pending} onClick={save}>
                {text.save}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
