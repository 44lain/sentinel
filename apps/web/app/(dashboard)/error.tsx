"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <main className="flex flex-1 flex-col p-6 md:p-8">
      <EmptyState
        icon={AlertTriangle}
        title="Algo deu errado"
        description={
          error.message ||
          "Não foi possível carregar esta página. Tente novamente ou volte ao dashboard."
        }
      >
        <Button type="button" onClick={reset}>
          Tentar novamente
        </Button>
      </EmptyState>
    </main>
  );
}
