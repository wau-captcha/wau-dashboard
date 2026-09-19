"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Admin } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { adminLogoutAction } from "../actions";

export function AdminMenu({ admin }: { admin: Admin }) {
  const text = useI18n().t.common.user;
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" endIcon={<ChevronDown />} loading={pending} />}>
        <span className="max-w-32 truncate">{admin.username}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{admin.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => startTransition(() => void adminLogoutAction())}>
            <LogOut /> {text.signOut}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
