"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { ApiKey } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { createAppealAction } from "../../actions";

/**
 * Why a suspended or throttled key is held back, with today's counters of the scraping check, and
 * the review its owner can ask an administrator for. Renders nothing for a key in good standing.
 */
export function KeyReview({ apiKey }: { apiKey: ApiKey }) {
  const { t, format } = useI18n();
  const text = t.keyProtection.review;
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const flagged = Boolean(apiKey.scraping_flagged) && !apiKey.is_suspended;
  if (!apiKey.is_suspended && !flagged) return null;

  const scraping = flagged || apiKey.suspend_reason === "SCRAPING";
  const today = apiKey.today;
  const appeal = apiKey.latest_appeal;
  const waiting = appeal?.status === "pending";

  function send() {
    startTransition(async () => {
      const { error } = await createAppealAction(apiKey.id, message);
      if (error) {
        toast.error(error);
        return;
      }
      setMessage("");
      toast.success(text.sent);
    });
  }

  return (
    <>
      <Alert tone={flagged ? "warning" : "negative"} title={flagged ? text.flaggedTitle : t.keyDetail.suspended.title}>
        <p>{flagged ? text.flagged : apiKey.suspend_reason === "SCRAPING" ? t.keyDetail.suspended.scraping : t.keyDetail.suspended.admin}</p>
        {today && (
          <p className="tabular-nums">
            {text.numbers(format.number(today.challenges), format.number(today.answers), format.number(today.solved), format.number(today.automated))}
          </p>
        )}
        {scraping && <p>{text.prefetch}</p>}
      </Alert>

      <Card id="review">
        <CardHeader>
          <div className="min-w-0">
            <CardTitle>{text.request}</CardTitle>
            <CardDescription>{text.requestHint}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {appeal && (
            <Alert tone={appeal.status === "approved" ? "positive" : appeal.status === "rejected" ? "neutral" : "info"}>
              <p>
                {appeal.status === "pending"
                  ? text.pending(format.dateTime(appeal.create_date))
                  : (appeal.status === "approved" ? text.approved : text.rejected)(format.dateTime(appeal.decided_at ?? appeal.create_date))}
              </p>
              {appeal.admin_note && <p>{text.note(appeal.admin_note)}</p>}
            </Alert>
          )}
          {!waiting && (
            <>
              <Field label={text.messageLabel}>
                <Textarea
                  value={message}
                  onValueChange={setMessage}
                  placeholder={text.messagePlaceholder}
                  maxLength={2000}
                  rows={4}
                  disabled={pending}
                />
              </Field>
              <div className="flex justify-end">
                <Button size="sm" loading={pending} disabled={!message.trim()} onClick={send}>
                  {text.submit}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
