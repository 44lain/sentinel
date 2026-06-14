import { EmptyState } from "@/components/ui/empty-state";
import { Package } from "lucide-react";

export default function DeviceNotFound() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <EmptyState
        icon={Package}
        title="Dispositivo não encontrado"
        description="Este IP não foi encontrado nos seus scans. Verifique o inventário ou execute um novo scan."
        actionLabel="Voltar ao inventário"
        actionHref="/inventory"
      />
    </main>
  );
}
