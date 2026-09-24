"use client";

import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
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
import type { User } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { logoutAction } from "../actions";

export function UserMenu({ user }: { user: User }) {
  const text = useI18n().t.common.user;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            endIcon={<ChevronDown className="max-sm:hidden" />}
            loading={pending}
            className="max-sm:px-2"
          />
        }
      >
        <UserRound className="sm:hidden" />
        <span className="max-w-32 truncate max-sm:sr-only">{user.username}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <div className="px-2 pb-1.5">
            <Badge tone={user.tier_id === "premium" ? "primary" : "neutral"} size="sm">
              {user.tier_name}
            </Badge>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/account")}>
            <UserRound /> {text.account}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => startTransition(() => void logoutAction())}>
            <LogOut /> {text.signOut}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
