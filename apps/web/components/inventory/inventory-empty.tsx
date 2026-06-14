import { Server } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function InventoryEmptyState() {
  return (
    <EmptyState
      icon={Server}
      title="Inventário vazio"
      description="Execute um scan com o agente na sua rede local para descobrir dispositivos, portas abertas e possíveis riscos."
      actionLabel="Registrar agente"
      actionHref="/agents"
    />
  );
}
