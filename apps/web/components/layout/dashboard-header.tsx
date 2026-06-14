"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  email: string;
  displayName?: string | null;
}

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  inventory: "Inventário",
  scans: "Scans",
  risks: "Riscos",
  agents: "Agentes",
  settings: "Configurações",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => ({
    label: SEGMENT_LABELS[segment] ?? segment,
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }));
}

export function DashboardHeader({ email, displayName }: DashboardHeaderProps) {
  const router = useRouter();
  const crumbs = useBreadcrumbs();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Atalho ⌘K / Ctrl+K para focar a busca global.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/inventory?search=${encodeURIComponent(value)}` : "/inventory");
  }

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 flex h-14 items-center gap-3 border-b px-4 backdrop-blur-md md:px-6">
      <nav aria-label="Trilha de navegação" className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground hidden font-medium transition-colors sm:block"
        >
          NetAtlas
        </Link>
        {crumbs.map((crumb) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight className="text-muted-foreground/50 hidden size-3.5 shrink-0 sm:block" />
            {crumb.isLast ? (
              <span className="text-foreground truncate font-semibold">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground truncate transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <form onSubmit={onSearch} className="relative hidden lg:block">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar dispositivos…"
            aria-label="Busca global"
            className={cn(
              "border-input bg-muted/40 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/40 h-8 w-56 rounded-lg border py-1 pr-12 pl-9 text-sm transition-all outline-none focus-visible:w-72 focus-visible:ring-3"
            )}
          />
          <kbd className="text-muted-foreground border-border bg-background pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 font-mono text-[10px] xl:block">
            ⌘K
          </kbd>
        </form>

        <NetworkStatus />
        <ThemeToggle />

        <div className="bg-border mx-1 hidden h-6 w-px sm:block" />

        <ProfileMenu email={email} displayName={displayName} />
      </div>
    </header>
  );
}

/** Indicador discreto de status: a sessão está conectada à plataforma. */
function NetworkStatus() {
  return (
    <span
      title="Plataforma operacional"
      className="border-success/30 bg-success/10 hidden items-center gap-1.5 rounded-full border px-2.5 py-1 sm:inline-flex"
    >
      <span className="relative flex size-2">
        <span className="bg-success/60 absolute inline-flex size-full animate-ping rounded-full opacity-75" />
        <span className="bg-success relative inline-flex size-2 rounded-full" />
      </span>
      <span className="text-success text-xs font-medium">Operacional</span>
    </span>
  );
}
