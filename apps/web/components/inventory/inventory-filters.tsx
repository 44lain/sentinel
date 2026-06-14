"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { InventoryGroupBy, InventoryView } from "@/lib/inventory/queries";

interface InventoryFiltersProps {
  search: string;
  statusFilter: string;
  view: InventoryView;
  groupBy: InventoryGroupBy;
}

function buildHref(
  base: Record<string, string | undefined>,
  overrides: Record<string, string | undefined>
) {
  const params = new URLSearchParams();
  const merged = { ...base, ...overrides };

  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `/inventory?${query}` : "/inventory";
}

export function InventoryFilters({ search, statusFilter, view, groupBy }: InventoryFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const base = {
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    view: searchParams.get("view") ?? undefined,
    group: searchParams.get("group") ?? undefined,
  };

  if (pathname !== "/inventory") return null;

  return (
    <form className="space-y-4" method="get">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="search"
              name="search"
              defaultValue={search}
              placeholder="IP, hostname ou fabricante"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={statusFilter}
            className="border-input bg-background h-9 w-full min-w-36 rounded-md border px-3 text-sm"
          >
            <option value="">Todos</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="group">Agrupar por</Label>
          <select
            id="group"
            name="group"
            defaultValue={groupBy}
            className="border-input bg-background h-9 w-full min-w-40 rounded-md border px-3 text-sm"
          >
            <option value="none">Nenhum</option>
            <option value="vendor">Fabricante</option>
            <option value="status">Status</option>
          </select>
        </div>
        <input type="hidden" name="view" value={view} />
        <Button type="submit">Aplicar</Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-caption">Visualização:</span>
        <Link
          href={buildHref(base, { view: "table" })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
            view === "table"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          )}
        >
          <List className="size-3.5" />
          Tabela
        </Link>
        <Link
          href={buildHref(base, { view: "cards" })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
            view === "cards"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          )}
        >
          <LayoutGrid className="size-3.5" />
          Cards
        </Link>
      </div>
    </form>
  );
}
