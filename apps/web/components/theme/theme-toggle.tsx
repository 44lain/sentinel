"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ThemePreference } from "./theme-provider";
import { useTheme } from "./theme-provider";

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const ICONS: Record<ThemePreference, typeof Sun> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};
const LABELS: Record<ThemePreference, string> = {
  system: "Sistema",
  light: "Claro",
  dark: "Escuro",
};

/** Botão compacto que alterna system → light → dark (uso no header). */
export function ThemeToggle({ className }: { className?: string }) {
  const { preference, setPreference } = useTheme();
  const Icon = ICONS[preference];

  function cycle() {
    const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
    setPreference(next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      title={`Tema: ${LABELS[preference]}`}
      aria-label={`Alternar tema (atual: ${LABELS[preference]})`}
      className={cn(
        "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 inline-flex size-8 items-center justify-center rounded-lg border border-transparent transition-colors focus-visible:ring-3 focus-visible:outline-none",
        className
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
