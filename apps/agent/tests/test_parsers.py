from netatlas.discovery import _parse_nmap_grepable_hosts
from netatlas.oui import lookup_vendor, normalize_mac
from netatlas.scanner import (
    DEFAULT_PORTS,
    SCAN_PROFILES,
    _build_enrichment_args,
    _parse_nmap_ports_line,
    discover_ports,
    is_root,
)
from netatlas.models import PortResult


def test_parse_nmap_grepable_hosts() -> None:
    output = """
Host: 192.168.1.1 (AA:BB:CC:DD:EE:FF) Status: Up
Host: 192.168.1.2 () Status: Up
Host: 192.168.1.3 () Status: Down
"""
    hosts = _parse_nmap_grepable_hosts(output)
    assert hosts == {
        "192.168.1.1": "AA:BB:CC:DD:EE:FF",
        "192.168.1.2": None,
    }


def test_build_enrichment_args_sem_root_usa_apenas_st() -> None:
    profile = SCAN_PROFILES["deep"]
    ports = [
        PortResult(80, "tcp", "http", "open"),
        PortResult(443, "tcp", "https", "open"),
    ]
    args = _build_enrichment_args("10.0.0.1", ports, profile, service_detect=True)
    assert args[1] == "-sT"
    assert "-sSU" not in args
    if not is_root():
        assert "-O" not in args
        assert "-sU" not in args
    assert "-p" in args
    assert "80,443" in args


def test_build_enrichment_args_standard_inclui_scripts() -> None:
    profile = SCAN_PROFILES["standard"]
    ports = [PortResult(80, "tcp", "http", "open")]
    args = _build_enrichment_args("10.0.0.1", ports, profile, service_detect=True)
    assert "-sV" in args
    assert "-sC" in args


def test_parse_nmap_ports_line() -> None:
    line = "Host: 192.168.1.1 () Ports: 22/open/tcp//ssh///, 443/open/tcp//https///"
    ports = _parse_nmap_ports_line(line)
    assert len(ports) == 2
    assert ports[0].port_number == 22
    assert ports[1].port_number == 443


def test_discover_ports_localhost() -> None:
    ports = discover_ports("127.0.0.1", ports=DEFAULT_PORTS)
    assert isinstance(ports, list)


def test_normalize_mac() -> None:
    assert normalize_mac("aa-bb-cc-dd-ee-ff") == "AA:BB:CC:DD:EE:FF"


def test_lookup_vendor_unknown() -> None:
    assert lookup_vendor("FF:FF:FF:00:00:00") is None
