type PortLike = {
  port_number: number;
  service_name?: string | null;
  service_product?: string | null;
  service_version?: string | null;
};

/** Rótulo de uma porta com serviço e versão quando disponíveis. */
export function formatPortLabel(port: PortLike): string {
  const base = port.service_name
    ? `${port.port_number}/${port.service_name}`
    : String(port.port_number);

  const version = [port.service_product, port.service_version].filter(Boolean).join(" ").trim();
  return version ? `${base} (${version})` : base;
}

/** Formatação de portas e SO para tabelas do dashboard/inventário. */
export function formatPortsSummary(ports: PortLike[], maxVisible = 4): string {
  if (ports.length === 0) return "—";

  const visible = ports.slice(0, maxVisible).map(formatPortLabel);
  const extra = ports.length - maxVisible;
  return extra > 0 ? `${visible.join(", ")} +${extra}` : visible.join(", ");
}

/** Formata SO detectado pelo Nmap. */
export function formatOsLabel(
  osName?: string | null,
  osAccuracy?: number | null,
  osFamily?: string | null
): string {
  if (!osName) return "—";
  const family = osFamily ? `${osFamily} · ` : "";
  const accuracy = osAccuracy != null ? ` (${osAccuracy}%)` : "";
  return `${family}${osName}${accuracy}`;
}
