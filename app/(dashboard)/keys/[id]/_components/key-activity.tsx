"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { ApiKeyEvent } from "@/lib/api/types";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { useI18n } from "@/lib/i18n/client";

type Text = Dictionary["keyActivity"];

/** What an event did, in words, and a second line with its details when it has any. */
function describe(event: ApiKeyEvent, text: Text, number: (value: number) => string): { what: string; more?: string } {
  const detail = event.detail ?? {};
  const word = (key: string) => (typeof detail[key] === "string" ? (detail[key] as string) : "");
  const list = (key: string) =>
    Array.isArray(detail[key]) ? (detail[key] as unknown[]).filter((item) => typeof item === "string").join(", ") : "";
  const counts = () => text.counts(number(Number(detail.issued ?? 0)), number(Number(detail.answered ?? 0)));
  const note = word("note") ? text.note(word("note")) : undefined;
  const actions = text.actions;

  switch (event.action) {
    case "renamed":
      return { what: actions.renamed(word("from"), word("to")) };
    case "allowed_ips_changed":
      return { what: actions.allowed_ips_changed(list("ip_addresses")) };
    case "allowed_domains_changed":
      return { what: actions.allowed_domains_changed(list("domains")) };
    case "require_behavior_changed":
      return { what: detail.require_behavior === true ? actions.require_behavior_on : actions.require_behavior_off };
    case "flagged":
      return { what: actions.flagged, more: counts() };
    case "suspended":
      return word("reason") === "SCRAPING" ? { what: actions.suspended_scraping, more: counts() } : { what: actions.suspended };
    case "appeal_approved":
    case "appeal_rejected":
      return { what: actions[event.action], more: note };
    case "created":
    case "activated":
    case "paused":
    case "secret_rotated":
    case "previous_secret_revoked":
    case "unsuspended":
    case "appeal_created":
    case "deleted":
      return { what: actions[event.action] };
    default:
      return { what: event.action };
  }
}

/** The activity log of a key: who changed what, newest first. */
export function KeyActivity({ events }: { events: ApiKeyEvent[] }) {
  const { t, format } = useI18n();
  const text = t.keyActivity;

  const columns: DataTableColumn<ApiKeyEvent>[] = [
    {
      id: "time",
      header: text.time,
      width: "12rem",
      cell: (event) => <span className="tabular-nums text-muted-foreground">{format.dateTime(event.create_date)}</span>,
    },
    { id: "who", header: text.who, width: "10rem", cell: (event) => text.actors[event.actor] ?? event.actor },
    {
      id: "what",
      header: text.what,
      cell: (event) => {
        const { what, more } = describe(event, text, format.number);
        return (
          <span className="grid gap-0.5">
            <span className="text-foreground">{what}</span>
            {more && <span className="text-overline text-muted-foreground">{more}</span>}
          </span>
        );
      },
    },
  ];

  return (
    <Card id="activity">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{text.title}</CardTitle>
          <CardDescription>{text.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable aria-label={text.title} columns={columns} data={events} getRowId={(event) => event.id} emptyState={text.empty} />
      </CardContent>
    </Card>
  );
}
