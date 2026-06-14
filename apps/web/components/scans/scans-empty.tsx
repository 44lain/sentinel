import { EmptyState } from "@/components/ui/empty-state";
import { Radar } from "lucide-react";

export function ScansEmptyState() {
  return (
    <EmptyState
      icon={Radar}
      title="Nenhum scan registrado"
      description="Execute um scan com o agente na sua rede local para começar a construir o histórico."
      actionLabel="Registrar agente"
      actionHref="/agents"
    />
  );
}
