"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, History, LayoutDashboard, Package, Settings, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventário", icon: Package },
  { href: "/scans", label: "Scans", icon: History },
  { href: "/risks", label: "Riscos", icon: ShieldAlert },
  { href: "/agents", label: "Agentes", icon: Bot },
  { href: "/settings", label: "Configurações", icon: Settings },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-sidebar hidden w-64 flex-col border-r md:flex">
      <div className="border-sidebar-border flex justify-center px-4 py-4">
        <Logo href="/dashboard" variant="full" className="w-44" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3 text-sm">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium transition-colors",
                active
                  ? "text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="sidebar-active"
                  className="bg-sidebar-accent absolute inset-0 rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              ) : null}
              {active ? (
                <span className="bg-primary absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full" />
              ) : null}
              <Icon className="relative z-10 size-4 shrink-0" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-sidebar-border text-caption border-t p-4">
        NetAtlas · Observabilidade de rede
      </div>
    </aside>
  );
}
