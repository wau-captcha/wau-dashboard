"use client";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/client";

/**
 * The state of an API key, worst first: suspended, throttled today by the scraping check,
 * active or paused. Shared by the key list, the key page and the admin console.
 */
export function KeyStatusBadge({ apiKey }: { apiKey: { is_suspended: boolean; is_active: boolean; scraping_flagged?: boolean } }) {
  const status = useI18n().t.common.status;
  if (apiKey.is_suspended) {
    return (
      <Badge tone="negative" dot className="w-fit">
        {status.suspended}
      </Badge>
    );
  }
  if (apiKey.scraping_flagged) {
    return (
      <Badge tone="warning" dot className="w-fit">
        {status.throttled}
      </Badge>
    );
  }
  return apiKey.is_active ? (
    <Badge tone="positive" dot className="w-fit">
      {status.active}
    </Badge>
  ) : (
    <Badge tone="warning" dot className="w-fit">
      {status.paused}
    </Badge>
  );
}
