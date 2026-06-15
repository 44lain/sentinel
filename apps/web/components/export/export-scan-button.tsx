"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportScanButtonProps {
  scanId: string;
  format?: "json" | "csv";
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function ExportScanButton({
  scanId,
  format = "json",
  label,
  variant = "outline",
  size = "sm",
}: ExportScanButtonProps) {
  const displayLabel = label ?? (format === "csv" ? "Exportar CSV" : "Exportar JSON");

  function onExport() {
    const url = `/api/export/scans/${scanId}?format=${format}`;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  return (
    <Button type="button" variant={variant} size={size} onClick={onExport}>
      <Download className="size-4" />
      {displayLabel}
    </Button>
  );
}
