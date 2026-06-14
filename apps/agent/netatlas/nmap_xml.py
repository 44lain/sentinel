"""Parser de saída XML do Nmap."""

import xml.etree.ElementTree as ET

from netatlas.models import HostScanResult, PortResult


def _text(value: str | None) -> str | None:
    if value is None:
        return None
    stripped = value.strip()
    return stripped or None


def _parse_port(port_elem: ET.Element) -> PortResult | None:
    state_elem = port_elem.find("state")
    if state_elem is None:
        return None

    state = state_elem.get("state", "open")
    if state not in ("open", "filtered"):
        return None

    try:
        port_number = int(port_elem.get("portid", "0"))
    except ValueError:
        return None

    protocol = port_elem.get("protocol", "tcp")
    if protocol not in ("tcp", "udp"):
        protocol = "tcp"

    service_elem = port_elem.find("service")
    service_name = None
    service_product = None
    service_version = None
    service_extra = None

    if service_elem is not None:
        service_name = _text(service_elem.get("name"))
        service_product = _text(service_elem.get("product"))
        service_version = _text(service_elem.get("version"))
        service_extra = _text(service_elem.get("extrainfo"))

    script_notes: list[str] = []
    for script_elem in port_elem.findall("script"):
        script_id = script_elem.get("id")
        script_output = _text(script_elem.get("output"))
        if script_id and script_output:
            script_notes.append(f"{script_id}: {script_output[:180]}")

    if script_notes:
        scripts_text = " | ".join(script_notes)
        service_extra = f"{service_extra} | {scripts_text}" if service_extra else scripts_text

    return PortResult(
        port_number=port_number,
        protocol=protocol,
        service_name=service_name,
        service_product=service_product,
        service_version=service_version,
        service_extra=service_extra,
        state=state,
    )


def _parse_os(host_elem: ET.Element) -> tuple[str | None, int | None, str | None]:
    os_elem = host_elem.find("os")
    if os_elem is None:
        return None, None, None

    best_name: str | None = None
    best_accuracy = -1
    best_family: str | None = None

    for match in os_elem.findall("osmatch"):
        name = _text(match.get("name"))
        if not name:
            continue
        try:
            accuracy = int(match.get("accuracy", "0"))
        except ValueError:
            accuracy = 0

        if accuracy >= best_accuracy:
            best_accuracy = accuracy
            best_name = name
            osclass = match.find("osclass")
            best_family = _text(osclass.get("osfamily")) if osclass is not None else None

    if best_name is None:
        return None, None, None

    return best_name, best_accuracy if best_accuracy >= 0 else None, best_family


def _host_ipv4(host_elem: ET.Element) -> str | None:
    for address in host_elem.findall("address"):
        if address.get("addrtype") == "ipv4":
            return address.get("addr")
    return None


def parse_host_scan_xml(xml_text: str, host_ip: str) -> HostScanResult:
    """Extrai detalhes de um host a partir do XML do Nmap."""
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return HostScanResult()

    for host_elem in root.findall("host"):
        if _host_ipv4(host_elem) != host_ip:
            continue

        status_elem = host_elem.find("status")
        if status_elem is not None and status_elem.get("state") == "down":
            return HostScanResult()

        hostname: str | None = None
        for name_elem in host_elem.findall("hostnames/hostname"):
            candidate = _text(name_elem.get("name"))
            if candidate:
                hostname = candidate
                if name_elem.get("type") in ("user", "PTR"):
                    break

        mac_address: str | None = None
        vendor: str | None = None
        for address in host_elem.findall("address"):
            if address.get("addrtype") != "mac":
                continue
            mac_address = _text(address.get("addr"))
            vendor = _text(address.get("vendor"))
            break

        ports: list[PortResult] = []
        ports_elem = host_elem.find("ports")
        if ports_elem is not None:
            for port_elem in ports_elem.findall("port"):
                parsed = _parse_port(port_elem)
                if parsed and parsed.state == "open":
                    ports.append(parsed)

        os_name, os_accuracy, os_family = _parse_os(host_elem)

        return HostScanResult(
            ports=ports,
            hostname=hostname,
            mac_address=mac_address,
            vendor=vendor,
            os_name=os_name,
            os_accuracy=os_accuracy,
            os_family=os_family,
        )

    return HostScanResult()
