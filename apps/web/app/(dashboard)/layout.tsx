import { cache } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/brand/logo";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agents", label: "Agentes" },
  { href: "/inventory", label: "Inventário" },
] as const;

const getLayoutUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLayoutUser();

  return (
    <div className="flex min-h-full flex-1">
      <aside className="border-border bg-sidebar hidden w-60 flex-col border-r md:flex">
        <div className="border-sidebar-border px-4 py-5">
          <Logo href="/dashboard" variant="full" />
        </div>
        <nav className="flex flex-col gap-1 p-3 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md px-3 py-2 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        {user?.email ? <DashboardHeader email={user.email} /> : null}
        {children}
      </div>
    </div>
  );
}
