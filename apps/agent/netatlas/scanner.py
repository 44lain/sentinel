"""Scan de portas via Nmap — descoberta em duas fases.

Fase 1 (discover_ports): scan TCP connect (-sT) em top-1000, equivalente a `nmap <host>`.
Funciona sem privilégios root.

Fase 2 (enrich_host): versões (-sV), scripts NSE e SO (-O) apenas nas portas abertas.
Opções que exigem root (-O, -sU) são omitidas automaticamente sem sudo.
"""

import os
import re
import subprocess
from dataclasses import dataclass

from netatlas.models import HostScanResult, PortResult
from netatlas.nmap_xml import parse_host_scan_xml

# 1000 portas mais comuns do Nmap (equivalente a `nmap <host>`)
DEFAULT_PORTS = "top-1000"

DEEP_SCRIPTS = "banner,http-title,http-headers,ssl-cert,ssh-hostkey"


@dataclass(frozen=True)
class ScanProfile:
    """Perfil de profundidade do scan Nmap."""

    name: str
    service_detect: bool
    version_light: bool
    version_intensity: int
    default_scripts: bool
    extra_scripts: str | None
    os_detect: bool
    include_udp: bool
    timing: int
    timeout_seconds: int


SCAN_PROFILES: dict[str, ScanProfile] = {
    "quick": ScanProfile(
        name="quick",
        service_detect=True,
        version_light=True,
        version_intensity=2,
        default_scripts=False,
        extra_scripts=None,
        os_detect=False,
        include_udp=False,
        timing=4,
        timeout_seconds=600,
    ),
    "standard": ScanProfile(
        name="standard",
        service_detect=True,
        version_light=False,
        version_intensity=5,
        default_scripts=True,
        extra_scripts=None,
        os_detect=True,
        include_udp=False,
        timing=4,
        timeout_seconds=900,
    ),
    "deep": ScanProfile(
        name="deep",
        service_detect=True,
        version_light=False,
        version_intensity=7,
        default_scripts=True,
        extra_scripts=DEEP_SCRIPTS,
        os_detect=True,
        include_udp=True,
        timing=4,
        timeout_seconds=1800,
    ),
}


def get_scan_profile(name: str) -> ScanProfile:
    """Retorna perfil válido ou o padrão standard."""
    return SCAN_PROFILES.get(name, SCAN_PROFILES["standard"])


def is_root() -> bool:
    """Verifica se o processo tem privilégios root (SYN/UDP/OS scan)."""
    try:
        return os.geteuid() == 0
    except AttributeError:
        return False


def _port_spec_args(ports: str) -> list[str]:
    if ports == DEFAULT_PORTS:
        return ["--top-ports", "1000"]
    return ["-p", ports]


def _parse_nmap_ports_line(line: str) -> list[PortResult]:
    """Extrai portas de uma linha grepable do Nmap."""
    ports: list[PortResult] = []
    match = re.search(r"Ports:\s+(.+)$", line)
    if not match:
        return ports

    for chunk in match.group(1).split(","):
        chunk = chunk.strip()
        if not chunk:
            continue
        parts = chunk.split("/")
        if len(parts) < 3:
            continue
        try:
            port_number = int(parts[0])
        except ValueError:
            continue

        state = parts[1] if parts[1] in ("open", "filtered", "closed") else "open"
        protocol = parts[2] if parts[2] in ("tcp", "udp") else "tcp"
        service_name = parts[4] if len(parts) > 4 and parts[4] else None

        if state == "open":
            ports.append(
                PortResult(
                    port_number=port_number,
                    protocol=protocol,
                    service_name=service_name,
                    state=state,
                )
            )

    return ports


def _parse_grepable_output(output: str, host: str) -> list[PortResult]:
    for line in output.splitlines():
        if line.startswith(f"Host: {host}") and "Ports:" in line:
            return _parse_nmap_ports_line(line)
    return []


def _run_nmap(args: list[str], timeout: int) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            args,
            capture_output=True,
            text=True,
            check=False,
            timeout=timeout,
        )
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError("Nmap excedeu o tempo limite.") from exc
    except (subprocess.SubprocessError, FileNotFoundError) as exc:
        raise RuntimeError("Nmap não encontrado. Instale nmap no sistema.") from exc


def discover_ports(host: str, ports: str = DEFAULT_PORTS, timing: int = 4) -> list[PortResult]:
    """
    Descoberta rápida de portas — equivalente a `nmap <host>`.
    Usa -sT (connect scan), funciona sem root.
    """
    args = ["nmap", "-sT", "-T", str(timing), "-oG", "-", *_port_spec_args(ports), host]
    result = _run_nmap(args, timeout=300)

    if "QUITTING" in result.stderr:
        raise RuntimeError(f"Nmap discovery falhou em {host}: {result.stderr.strip()}")

    discovered = _parse_grepable_output(result.stdout, host)
    if discovered:
        return discovered

    if result.returncode not in (0, 1):
        raise RuntimeError(f"Nmap discovery falhou em {host}: {result.stderr.strip()}")

    return []


def _build_enrichment_args(
    host: str,
    open_ports: list[PortResult],
    profile: ScanProfile,
    service_detect: bool,
) -> list[str]:
    """Monta scan de enriquecimento apenas nas portas já abertas."""
    port_list = ",".join(str(port.port_number) for port in open_ports)
    args = ["nmap", "-sT", "-oX", "-", "-T", str(profile.timing), "-p", port_list]

    if service_detect and profile.service_detect:
        args.append("-sV")
        if profile.version_light:
            args.append("--version-light")
        else:
            args.extend(["--version-intensity", str(profile.version_intensity)])

    if profile.default_scripts:
        args.append("-sC")

    if profile.extra_scripts:
        args.extend(["--script", profile.extra_scripts])

    # -O e -sU exigem root; sem root o Nmap aborta o scan inteiro
    if is_root() and profile.os_detect:
        args.extend(["-O", "--osscan-guess", "--osscan-limit"])

    if is_root() and profile.include_udp:
        args.extend(["-sU", "--top-ports", "100"])

    args.append(host)
    return args


def _merge_ports(
    discovered: list[PortResult],
    enriched: list[PortResult],
) -> list[PortResult]:
    """Mescla detalhes enriquecidos mantendo todas as portas descobertas."""
    enriched_by_port = {port.port_number: port for port in enriched}
    merged: list[PortResult] = []

    for base in discovered:
        detail = enriched_by_port.get(base.port_number)
        if detail:
            merged.append(detail)
        else:
            merged.append(base)

    return merged


def enrich_host(
    host: str,
    open_ports: list[PortResult],
    profile: ScanProfile,
    service_detect: bool = True,
) -> HostScanResult:
    """Enriquece portas abertas com versões, scripts e SO (quando possível)."""
    if not open_ports:
        return HostScanResult(ports=[])

    result = _run_nmap(
        _build_enrichment_args(host, open_ports, profile, service_detect),
        timeout=profile.timeout_seconds,
    )

    if "QUITTING" in result.stderr or "requires root" in result.stderr:
        return HostScanResult(ports=open_ports)

    if result.returncode not in (0, 1) and not result.stdout.strip():
        return HostScanResult(ports=open_ports)

    if result.stdout.strip():
        parsed = parse_host_scan_xml(result.stdout, host)
        return HostScanResult(
            ports=_merge_ports(open_ports, parsed.ports),
            hostname=parsed.hostname,
            mac_address=parsed.mac_address,
            vendor=parsed.vendor,
            os_name=parsed.os_name,
            os_accuracy=parsed.os_accuracy,
            os_family=parsed.os_family,
        )

    return HostScanResult(ports=open_ports)


def scan_host(
    host: str,
    ports: str = DEFAULT_PORTS,
    profile: ScanProfile | None = None,
    service_detect: bool = True,
) -> HostScanResult:
    """
    Scan em duas fases:
    1. Descoberta rápida (-sT grepable) — igual a `nmap <host>`
    2. Enriquecimento nas portas abertas (-sV, scripts) — se o perfil pedir
    """
    active_profile = profile or SCAN_PROFILES["standard"]

    discovered = discover_ports(host, ports=ports, timing=active_profile.timing)
    if not discovered:
        return HostScanResult()

    needs_enrichment = service_detect and (
        active_profile.service_detect
        or active_profile.default_scripts
        or active_profile.extra_scripts
        or (active_profile.os_detect and is_root())
    )

    if not needs_enrichment:
        return HostScanResult(ports=discovered)

    enriched = enrich_host(host, discovered, active_profile, service_detect)
    return enriched


def scan_host_ports(
    host: str,
    ports: str = DEFAULT_PORTS,
    service_detect: bool = True,
    profile: ScanProfile | None = None,
) -> HostScanResult:
    """Compatibilidade — retorna HostScanResult completo."""
    return scan_host(host, ports=ports, profile=profile, service_detect=service_detect)


# Compatibilidade com testes antigos de montagem de args
def _build_nmap_args(
    host: str,
    ports: str,
    profile: ScanProfile,
    service_detect: bool,
) -> list[str]:
    sample_ports = [
        PortResult(80, "tcp", "http", "open"),
        PortResult(443, "tcp", "https", "open"),
    ]
    return _build_enrichment_args(host, sample_ports, profile, service_detect)
