"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInput } from "@/components/ui/text-input";
import { toast } from "@/components/ui/toast";
import type { AllowedOrigin, ApiKey } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { setAllowedOriginsAction } from "../../actions";

type Row = AllowedOrigin & { rowId: string };

const columns = "sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_9rem_auto]";

function toRows(origins: AllowedOrigin[]): Row[] {
  return origins.map((origin, index) => ({ ...origin, rowId: `${origin.ip_address}-${index}` }));
}

const same = (rows: Row[], origins: AllowedOrigin[]) =>
  rows.length === origins.length &&
  rows.every((row, i) => row.ip_address === origins[i].ip_address && (row.description ?? "") === (origins[i].description ?? ""));

/**
 * The addresses allowed to use the site key, edited as a whole: rows are added, changed or
 * removed, and saved together. With no rows, every address may use the key.
 */
export function AllowedOrigins({ apiKey }: { apiKey: ApiKey }) {
  const { t, format } = useI18n();
  const text = t.keyDetail.origins;
  const [saved, setSaved] = useState<AllowedOrigin[]>(apiKey.allowed_origins ?? []);
  const [rows, setRows] = useState<Row[]>(() => toRows(apiKey.allowed_origins ?? []));
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const changed = !same(rows, saved);

  function edit(rowId: string, patch: Partial<AllowedOrigin>) {
    setRows((current) => current.map((row) => (row.rowId === rowId ? { ...row, ...patch } : row)));
  }

  function save() {
    startTransition(async () => {
      const result = await setAllowedOriginsAction(
        apiKey.id,
        rows.map((row) => ({ ip_address: row.ip_address, description: row.description ?? "" })),
      );
      setError(result.error);
      if (!result.origins) return;
      setSaved(result.origins);
      setRows(toRows(result.origins));
      toast.success(text.saved);
    });
  }

  return (
    <Card id="allowed-origins">
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
        {rows.length === 0 ? (
          <p className="text-body text-muted-foreground">{text.empty}</p>
        ) : (
          <>
            <div className={`hidden gap-3 px-1 text-overline uppercase tracking-wide text-muted-foreground sm:grid ${columns}`}>
              <span>{text.source}</span>
              <span>{text.descriptionColumn}</span>
              <span>{text.created}</span>
              <span className="w-8" />
            </div>
            {rows.map((row) => (
              <div key={row.rowId} className={`grid items-center gap-2 sm:gap-3 ${columns}`}>
                <TextInput
                  aria-label={text.source}
                  value={row.ip_address}
                  onValueChange={(value) => edit(row.rowId, { ip_address: value })}
                  placeholder={text.sourcePlaceholder}
                  disabled={pending}
                  inputClassName="font-mono"
                />
                <TextInput
                  aria-label={text.descriptionColumn}
                  value={row.description ?? ""}
                  onValueChange={(value) => edit(row.rowId, { description: value })}
                  placeholder={text.descriptionPlaceholder}
                  maxLength={100}
                  disabled={pending}
                />
                <span className="text-overline text-muted-foreground tabular-nums">
                  {row.create_date ? format.date(row.create_date) : text.notSaved}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`${text.remove}: ${row.ip_address}`}
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
            disabled={pending}
            onClick={() => setRows((current) => [...current, { rowId: `new-${Date.now()}`, ip_address: "", description: "" }])}
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
