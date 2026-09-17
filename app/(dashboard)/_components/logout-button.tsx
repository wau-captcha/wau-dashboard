"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/client";
import { logoutAction } from "../actions";

export function LogoutButton() {
  const text = useI18n().t.common.user;
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      startIcon={<LogOut />}
      loading={pending}
      onClick={() => startTransition(() => void logoutAction())}
    >
      {text.signOut}
    </Button>
  );
}
