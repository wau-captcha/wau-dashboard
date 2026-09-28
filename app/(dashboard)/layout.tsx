import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/dal";
import { DashboardHeader } from "@/app/_components/dashboard-header";

/** Every page below this layout is behind the session check in getCurrentUser. */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-dvh">
      <DashboardHeader user={user} />
      <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
