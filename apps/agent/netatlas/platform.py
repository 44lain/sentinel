"""Envio de resultados para a plataforma NetAtlas."""

import json
import urllib.error
import urllib.request

from netatlas.models import DeviceResult, ScanResult


class PlatformError(Exception):
    """Erro ao comunicar com a API da plataforma."""


def _request(
    method: str,
    url: str,
    token: str | None,
    body: dict | None = None,
) -> dict:
    headers = {"Accept": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if body is not None:
        headers["Content-Type"] = "application/json"

    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers=headers)

    try:
        with urllib.request.urlopen(req, timeout=300) as response:
            payload = response.read().decode("utf-8")
            if not payload:
                return {}
            try:
                return json.loads(payload)
            except json.JSONDecodeError as exc:
                preview = payload.strip()[:200]
                raise PlatformError(
                    f"Resposta inválida da API (esperado JSON): {preview}"
                ) from exc
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise PlatformError(f"HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise PlatformError(f"Falha de conexão: {exc.reason}") from exc


def _api_base(api_url: str) -> str:
    return api_url.rstrip("/")


def check_health(api_url: str) -> None:
    payload = _request("GET", f"{_api_base(api_url)}/api/health", token=None)
    status = payload.get("data", {}).get("status")
    if status != "ok":
        raise PlatformError("Health check falhou.")


def upload_scan(
    api_url: str,
    token: str,
    agent_id: str,
    result: ScanResult,
) -> None:
    """Envia scan completo para a plataforma."""
    base = _api_base(api_url)

    check_health(api_url)

    created = _request(
        "POST",
        f"{base}/api/scans",
        token,
        {"agent_id": agent_id},
    )
    scan_id = created.get("data", {}).get("id")
    if not scan_id:
        raise PlatformError("API não retornou scan_id.")

    devices_payload = [_device_to_api(device) for device in result.devices]
    if devices_payload:
        _request(
            "POST",
            f"{base}/api/devices",
            token,
            {"scan_id": scan_id, "devices": devices_payload},
        )

    open_ports = sum(len(device.ports) for device in result.devices)
    _request(
        "PATCH",
        f"{base}/api/scans/{scan_id}",
        token,
        {
            "duration_seconds": int(result.duration_seconds),
            "device_count": len(result.devices),
            "open_port_count": open_ports,
        },
    )


def _device_to_api(device: DeviceResult) -> dict:
    return {
        "ip": device.ip,
        "hostname": device.hostname,
        "mac_address": device.mac_address,
        "vendor": device.vendor,
        "status": device.status,
        "os_name": device.os_name,
        "os_accuracy": device.os_accuracy,
        "os_family": device.os_family,
        "ports": [
            {
                "port_number": port.port_number,
                "protocol": port.protocol,
                "service_name": port.service_name,
                "service_product": port.service_product,
                "service_version": port.service_version,
                "service_extra": port.service_extra,
                "state": port.state,
            }
            for port in device.ports
        ],
    }
