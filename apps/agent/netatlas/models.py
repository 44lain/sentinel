"""Modelos de dados do agente."""

from dataclasses import asdict, dataclass, field


@dataclass
class PortResult:
    port_number: int
    protocol: str
    service_name: str | None
    state: str
    service_product: str | None = None
    service_version: str | None = None
    service_extra: str | None = None


@dataclass
class HostScanResult:
    """Resultado enriquecido do scan de um host."""

    ports: list[PortResult] = field(default_factory=list)
    hostname: str | None = None
    mac_address: str | None = None
    vendor: str | None = None
    os_name: str | None = None
    os_accuracy: int | None = None
    os_family: str | None = None


@dataclass
class DeviceResult:
    ip: str
    hostname: str | None
    mac_address: str | None
    vendor: str | None
    status: str
    ports: list[PortResult] = field(default_factory=list)
    os_name: str | None = None
    os_accuracy: int | None = None
    os_family: str | None = None


@dataclass
class ScanResult:
    network: str
    devices: list[DeviceResult]
    duration_seconds: float
    scan_profile: str = "standard"

    def to_dict(self) -> dict:
        return asdict(self)
