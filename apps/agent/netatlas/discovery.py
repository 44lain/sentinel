"""Descoberta de dispositivos na rede local (ping sweep + ARP)."""

import re
import socket
import subprocess
from dataclasses import dataclass

from netatlas.oui import lookup_vendor


@dataclass
class DiscoveredHost:
    ip: str
    hostname: str | None
    mac_address: str | None
    vendor: str | None
    status: str


def detect_local_network() -> str | None:
    """Detecta a sub-rede local via `ip route`."""
    try:
        result = subprocess.run(
            ["ip", "-4", "route"],
            capture_output=True,
            text=True,
            check=True,
            timeout=10,
        )
    except (subprocess.SubprocessError, FileNotFoundError):
        return None

    for line in result.stdout.splitlines():
        if "scope link" not in line:
            continue
        match = re.match(r"^(\d+\.\d+\.\d+\.\d+/\d+)", line.strip())
        if match:
            return match.group(1)

    return None


def _parse_nmap_grepable_hosts(output: str) -> dict[str, str | None]:
    """Extrai hosts ativos e MAC (quando disponível) do output grepable."""
    hosts: dict[str, str | None] = {}
    for line in output.splitlines():
        if not line.startswith("Host:"):
            continue
        if "Status: Up" not in line:
            continue
        match = re.search(
            r"Host:\s+(\d+\.\d+\.\d+\.\d+)\s*(?:\(([0-9A-Fa-f:]{17})\))?",
            line,
        )
        if match:
            hosts[match.group(1)] = match.group(2).upper() if match.group(2) else None
    return hosts


def _load_arp_table() -> dict[str, str]:
    """Lê tabela ARP/neighbor para mapear IP → MAC."""
    table: dict[str, str] = {}
    try:
        result = subprocess.run(
            ["ip", "neigh", "show"],
            capture_output=True,
            text=True,
            check=True,
            timeout=10,
        )
    except (subprocess.SubprocessError, FileNotFoundError):
        return table

    for line in result.stdout.splitlines():
        parts = line.split()
        if len(parts) < 5:
            continue
        ip, mac = parts[0], parts[4]
        if re.match(r"^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$", mac):
            table[ip] = mac.upper()

    return table


def _resolve_hostname(ip: str, timeout: float = 1.0) -> str | None:
    original_timeout = socket.getdefaulttimeout()
    try:
        socket.setdefaulttimeout(timeout)
        hostname, _, _ = socket.gethostbyaddr(ip)
        return hostname
    except OSError:
        return None
    finally:
        socket.setdefaulttimeout(original_timeout)


def discover_hosts(network: str, resolve_hostnames: bool = True) -> list[DiscoveredHost]:
    """Executa ping sweep com Nmap e enriquece com MAC, hostname e fabricante."""
    try:
        result = subprocess.run(
            ["nmap", "-sn", "-PR", "-R", "-oG", "-", network],
            capture_output=True,
            text=True,
            check=False,
            timeout=300,
        )
    except (subprocess.SubprocessError, FileNotFoundError) as exc:
        raise RuntimeError("Nmap não encontrado. Instale nmap no sistema.") from exc

    if result.returncode not in (0, 1):
        stderr = result.stderr.strip() or "falha desconhecida"
        raise RuntimeError(f"Nmap discovery falhou: {stderr}")

    host_map = _parse_nmap_grepable_hosts(result.stdout)
    arp_table = _load_arp_table()

    discovered: list[DiscoveredHost] = []
    for ip in sorted(host_map.keys(), key=lambda value: tuple(map(int, value.split(".")))):
        mac = host_map.get(ip) or arp_table.get(ip)
        hostname = _resolve_hostname(ip) if resolve_hostnames else None
        discovered.append(
            DiscoveredHost(
                ip=ip,
                hostname=hostname,
                mac_address=mac,
                vendor=lookup_vendor(mac),
                status="online",
            )
        )

    return discovered
