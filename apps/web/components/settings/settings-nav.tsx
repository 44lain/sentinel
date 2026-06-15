"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, User } from "lucide-react";

const TABS = [
  { href: "/settings/account", label: "Conta", icon: User },
  { href: "/settings/preferences", label: "Configurações", icon: Settings },
] as const;

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Configurações" className="border-border flex gap-1 rounded-lg border p-1">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
