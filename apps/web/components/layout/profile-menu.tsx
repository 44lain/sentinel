"use client";

import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

interface ProfileMenuProps {
  email: string;
  displayName?: string | null;
}

function getInitials(email: string, displayName?: string | null): string {
  if (displayName?.trim()) {
    return displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }
  return email.slice(0, 2).toUpperCase();
}

export function ProfileMenu({ email, displayName }: ProfileMenuProps) {
  const initials = getInitials(email, displayName);
  const name = displayName?.trim() || email.split("@")[0];

  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          "group hover:bg-muted focus-visible:ring-ring/50 data-[popup-open]:bg-muted flex items-center gap-2 rounded-lg border border-transparent py-1 pr-1.5 pl-1 transition-colors focus-visible:ring-3 focus-visible:outline-none"
        )}
      >
        <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-full text-xs font-semibold">
          {initials}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block max-w-40 truncate text-sm font-medium">{name}</span>
        </span>
        <ChevronsUpDown className="text-muted-foreground hidden size-3.5 sm:block" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-50">
          <Menu.Popup
            className={cn(
              "bg-popover text-popover-foreground border-border w-60 origin-[var(--transform-origin)] rounded-xl border p-1.5 shadow-lg outline-none",
              "transition-[transform,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0"
            )}
          >
            <div className="px-2.5 py-2">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="text-muted-foreground truncate text-xs">{email}</p>
            </div>
            <Menu.Separator className="bg-border -mx-1.5 my-1 h-px" />

            <Menu.Item
              render={<Link href="/settings" />}
              className="data-[highlighted]:bg-muted flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none"
            >
              <User className="text-muted-foreground size-4" />
              Minha conta
            </Menu.Item>
            <Menu.Item
              render={<Link href="/settings" />}
              className="data-[highlighted]:bg-muted flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none"
            >
              <Settings className="text-muted-foreground size-4" />
              Configurações
            </Menu.Item>

            <Menu.Separator className="bg-border -mx-1.5 my-1 h-px" />

            <Menu.Item
              render={
                <form action={logout}>
                  <button type="submit" className="w-full" />
                </form>
              }
              className="text-danger data-[highlighted]:bg-danger/10 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none"
            >
              <LogOut className="size-4" />
              Sair
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
