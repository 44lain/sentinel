import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ScanNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-heading-2">Scan não encontrado</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        O scan solicitado não existe ou você não tem permissão para visualizá-lo.
      </p>
      <Link href="/scans" className={cn(buttonVariants())}>
        Voltar para scans
      </Link>
    </main>
  );
}
