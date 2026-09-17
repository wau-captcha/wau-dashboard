"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useI18n } from "@/lib/i18n/client";

export default function DashboardError({ retry }: { error: Error; retry: () => void }) {
  const text = useI18n().t.common.loadError;

  return (
    <EmptyState
      icon={<TriangleAlert />}
      title={text.title}
      description={text.description}
      action={<Button onClick={retry}>{text.retry}</Button>}
    />
  );
}
