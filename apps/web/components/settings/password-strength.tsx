"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface PasswordScore {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  checks: { label: string; ok: boolean }[];
}

export function evaluatePassword(password: string): PasswordScore {
  const checks = [
    { label: "Mínimo de 8 caracteres", ok: password.length >= 8 },
    { label: "Letra maiúscula e minúscula", ok: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "Pelo menos um número", ok: /\d/.test(password) },
    { label: "Caractere especial", ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const passed = checks.filter((check) => check.ok).length;
  const score = (password.length === 0 ? 0 : Math.max(1, passed)) as PasswordScore["score"];
  const labels = ["", "Fraca", "Razoável", "Boa", "Forte"];

  return { score, label: labels[score], checks };
}

const BAR_COLORS = ["bg-muted", "bg-danger", "bg-warning", "bg-info", "bg-success"];
const TEXT_COLORS = [
  "text-muted-foreground",
  "text-danger",
  "text-warning",
  "text-info",
  "text-success",
];

export function PasswordStrength({ password }: { password: string }) {
  const result = useMemo(() => evaluatePassword(password), [password]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex h-1.5 flex-1 gap-1">
          {[1, 2, 3, 4].map((bar) => (
            <span
              key={bar}
              className={cn(
                "flex-1 rounded-full transition-colors",
                bar <= result.score ? BAR_COLORS[result.score] : "bg-muted"
              )}
            />
          ))}
        </div>
        <span className={cn("text-xs font-medium tabular-nums", TEXT_COLORS[result.score])}>
          {result.label}
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {result.checks.map((check) => (
          <li
            key={check.label}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              check.ok ? "text-success" : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "inline-block size-1.5 rounded-full",
                check.ok ? "bg-success" : "bg-muted-foreground/40"
              )}
            />
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
