"""Interface de linha de comando do NetAtlas Agent."""

import argparse
import sys
import time

from netatlas import __version__
from netatlas.discovery import DiscoveredHost, detect_local_network, discover_hosts
from netatlas.models import DeviceResult, ScanResult
from netatlas.platform import PlatformError, upload_scan
from netatlas.reporter import print_scan_result
from netatlas.scanner import DEFAULT_PORTS, get_scan_profile, is_root, scan_host


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="netatlas",
        description="NetAtlas Agent — descoberta e scan de rede local",
    )
    parser.add_argument("--version", action="version", version=f"NetAtlas Agent {__version__}")

    subparsers = parser.add_subparsers(dest="command", required=True)

    scan_parser = subparsers.add_parser("scan", help="Descobrir dispositivos e escanear portas")
    scan_parser.add_argument(
        "--network",
        help="Sub-rede CIDR (ex: 192.168.1.0/24). Padrão: detectar automaticamente",
    )
    scan_parser.add_argument(
        "--ports",
        default=DEFAULT_PORTS,
        help="Portas para scan (padrão: top-1000 = 1000 portas mais comuns)",
    )
    scan_parser.add_argument(
        "--profile",
        choices=["quick", "standard", "deep"],
        default="standard",
        help="Profundidade do scan Nmap (padrão: standard)",
    )
    scan_parser.add_argument(
        "--no-ports",
        action="store_true",
        help="Apenas descoberta, sem scan de portas",
    )
    scan_parser.add_argument(
        "--no-service-detect",
        action="store_true",
        help="Desativar detecção de serviço (-sV)",
    )
    scan_parser.add_argument(
        "--include-localhost",
        action="store_true",
        help="Incluir localhost (127.0.0.1) — útil para Docker/serviços locais",
    )
    scan_parser.add_argument(
        "--no-hostnames",
        action="store_true",
        help="Não resolver hostnames via DNS reverso",
    )
    scan_parser.add_argument(
        "-o",
        "--output",
        help="Salvar resultado JSON em arquivo",
    )
    scan_parser.add_argument(
        "-q",
        "--quiet",
        action="store_true",
        help="Suprimir mensagens de progresso no stderr",
    )
    scan_parser.add_argument(
        "--token",
        help="Token Bearer do agente (envia resultados à plataforma)",
    )
    scan_parser.add_argument(
        "--agent-id",
        help="UUID do agente registrado no dashboard",
    )
    scan_parser.add_argument(
        "--api",
        help="URL base da plataforma (ex: https://netatlas.vercel.app)",
    )

    return parser


def _log(message: str, quiet: bool) -> None:
    if not quiet:
        print(message, file=sys.stderr)


def _pick(preferred: str | None, fallback: str | None) -> str | None:
    return preferred or fallback


def run_scan(args: argparse.Namespace) -> int:
    network = args.network or detect_local_network()
    if not network:
        print("Erro: não foi possível detectar a rede local. Use --network.", file=sys.stderr)
        return 1

    profile = get_scan_profile(args.profile)
    started = time.monotonic()
    _log(f"Descobrindo hosts em {network}...", args.quiet)

    try:
        hosts = discover_hosts(network, resolve_hostnames=not args.no_hostnames)
    except RuntimeError as exc:
        print(f"Erro: {exc}", file=sys.stderr)
        return 1

    if args.include_localhost and not any(host.ip == "127.0.0.1" for host in hosts):
        hosts.append(
            DiscoveredHost(
                ip="127.0.0.1",
                hostname="localhost",
                mac_address=None,
                vendor=None,
                status="online",
            )
        )

    _log(f"{len(hosts)} host(s) encontrado(s).", args.quiet)
    if not args.no_ports:
        _log(f"Perfil de scan: {profile.name}", args.quiet)
        if not is_root() and (profile.os_detect or profile.include_udp):
            _log(
                "Aviso: sem root, detecção de SO e scan UDP são omitidos "
                "(portas TCP continuam com -sT).",
                args.quiet,
            )

    devices: list[DeviceResult] = []
    for index, host in enumerate(hosts, start=1):
        scan_detail = None
        if not args.no_ports:
            _log(f"[{index}/{len(hosts)}] Escaneando {host.ip}...", args.quiet)
            try:
                scan_detail = scan_host(
                    host.ip,
                    ports=args.ports,
                    profile=profile,
                    service_detect=not args.no_service_detect,
                )
                if not args.quiet and scan_detail.ports:
                    _log(
                        f"  → {len(scan_detail.ports)} porta(s) aberta(s) em {host.ip}",
                        args.quiet,
                    )
            except RuntimeError as exc:
                _log(f"Aviso: {exc}", args.quiet)

        devices.append(
            DeviceResult(
                ip=host.ip,
                hostname=_pick(scan_detail.hostname if scan_detail else None, host.hostname),
                mac_address=_pick(scan_detail.mac_address if scan_detail else None, host.mac_address),
                vendor=_pick(scan_detail.vendor if scan_detail else None, host.vendor),
                status=host.status,
                ports=scan_detail.ports if scan_detail else [],
                os_name=scan_detail.os_name if scan_detail else None,
                os_accuracy=scan_detail.os_accuracy if scan_detail else None,
                os_family=scan_detail.os_family if scan_detail else None,
            )
        )

    duration = round(time.monotonic() - started, 2)
    result = ScanResult(
        network=network,
        devices=devices,
        duration_seconds=duration,
        scan_profile=profile.name,
    )

    if args.token or args.api or args.agent_id:
        if not (args.token and args.api and args.agent_id):
            print(
                "Erro: --token, --agent-id e --api são obrigatórios juntos para envio.",
                file=sys.stderr,
            )
            return 1
        _log("Enviando resultados para a plataforma...", args.quiet)
        try:
            upload_scan(args.api, args.token, args.agent_id, result)
        except PlatformError as exc:
            print(f"Erro: {exc}", file=sys.stderr)
            return 2
        _log("Resultados enviados com sucesso.", args.quiet)

    if args.output or not (args.token and args.api):
        print_scan_result(result, output_file=args.output)

    _log(f"Scan concluído em {duration}s.", args.quiet)
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "scan":
        return run_scan(args)

    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
