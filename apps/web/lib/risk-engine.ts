import type { Severity } from "@/types";

export type RiskRule = {
  ports: number[];
  service?: string;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
};

export const RISK_RULES: RiskRule[] = [
  {
    ports: [21],
    service: "ftp",
    severity: "high",
    title: "FTP exposto",
    description: "Serviço FTP detectado com porta aberta.",
    recommendation: "Desative FTP ou migre para SFTP/FTPS.",
  },
  {
    ports: [23],
    service: "telnet",
    severity: "high",
    title: "Telnet exposto",
    description: "Telnet transmite credenciais em texto claro.",
    recommendation: "Substitua Telnet por SSH.",
  },
  {
    ports: [22],
    service: "ssh",
    severity: "medium",
    title: "SSH acessível",
    description: "Porta SSH aberta na rede.",
    recommendation: "Restrinja acesso por firewall e use chaves SSH.",
  },
  {
    ports: [3389],
    service: "rdp",
    severity: "high",
    title: "RDP exposto",
    description: "Área de trabalho remota acessível na rede.",
    recommendation: "Exponha RDP apenas via VPN.",
  },
  {
    ports: [80],
    service: "http",
    severity: "medium",
    title: "HTTP sem criptografia",
    description: "Serviço web em HTTP detectado.",
    recommendation: "Redirecione para HTTPS ou restrinja à rede interna.",
  },
  {
    ports: [443],
    service: "https",
    severity: "low",
    title: "HTTPS ativo",
    description: "Serviço web criptografado detectado.",
    recommendation: "Mantenha certificados atualizados.",
  },
  {
    ports: [137, 138, 139, 445],
    service: "smb",
    severity: "high",
    title: "SMB exposto",
    description: "Compartilhamento SMB acessível na rede.",
    recommendation: "Desative SMBv1 e restrinja compartilhamentos.",
  },
  {
    ports: [3306],
    service: "mysql",
    severity: "high",
    title: "MySQL exposto",
    description: "Banco de dados MySQL acessível na rede.",
    recommendation: "Não exponha MySQL publicamente; use firewall.",
  },
];

export type PortInput = {
  port_number: number;
  protocol: string;
  service_name?: string | null;
  state: string;
};

export type DetectedRisk = {
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  port_number: number;
};

export function detectRisks(ports: PortInput[]): DetectedRisk[] {
  const detected: DetectedRisk[] = [];
  const seen = new Set<string>();

  for (const port of ports) {
    if (port.state !== "open") continue;

    for (const rule of RISK_RULES) {
      if (!rule.ports.includes(port.port_number)) continue;

      const key = `${port.port_number}-${rule.severity}`;
      if (seen.has(key)) continue;
      seen.add(key);

      detected.push({
        severity: rule.severity,
        title: rule.title,
        description: rule.description,
        recommendation: rule.recommendation,
        port_number: port.port_number,
      });
    }
  }

  return detected;
}
