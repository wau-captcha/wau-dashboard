"use client";

import { useLayoutEffect } from "react";
import { applyTheme, readTheme } from "@/components/theme/theme-toggle";
import DashboardError from "./(dashboard)/error";

/**
 * Catches what the error boundary of a segment cannot: failures in its own layout, such as the
 * dashboard layout finding wau-services unreachable or WAU_SERVICES_URL unset. There is no page
 * frame around it then, so the message is centred on its own.
 */
export default function RootError(props: { error: Error; retry: () => void }) {
  // When the server could not render the page, the browser builds it without the theme script.
  useLayoutEffect(() => applyTheme(readTheme()), []);

  return (
    <main className="grid flex-1 place-items-center px-4 py-10">
      <DashboardError {...props} />
    </main>
  );
}
