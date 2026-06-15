/** Snapshot mínimo de um dispositivo em um scan para comparação por IP. */
export interface ScanDeviceSnapshot {
  ip: string;
  hostname: string | null;
  vendor: string | null;
  status: string;
  ports: Array<{
    port_number: number;
    protocol: string;
    state: string;
    service_name: string | null;
  }>;
}

export interface ScanDeviceChange {
  ip: string;
  before: ScanDeviceSnapshot;
  after: ScanDeviceSnapshot;
  portChanges: { added: string[]; removed: string[] };
}

export interface ScanComparison {
  added: ScanDeviceSnapshot[];
  removed: ScanDeviceSnapshot[];
  changed: ScanDeviceChange[];
  unchanged: number;
}

function portKey(port: { port_number: number; protocol: string }): string {
  return `${port.port_number}/${port.protocol}`;
}

/** Compara dois scans pelo endereço IP (MVP — MAC como chave fica para v1.1). */
export function compareScans(
  current: ScanDeviceSnapshot[],
  previous: ScanDeviceSnapshot[] | null
): ScanComparison {
  if (!previous || previous.length === 0) {
    return {
      added: current,
      removed: [],
      changed: [],
      unchanged: 0,
    };
  }

  const prevMap = new Map(previous.map((device) => [device.ip, device]));
  const currMap = new Map(current.map((device) => [device.ip, device]));

  const added: ScanDeviceSnapshot[] = [];
  const removed: ScanDeviceSnapshot[] = [];
  const changed: ScanDeviceChange[] = [];
  let unchanged = 0;

  for (const device of currMap.values()) {
    const prev = prevMap.get(device.ip);
    if (!prev) {
      added.push(device);
      continue;
    }

    const prevPorts = new Set(prev.ports.map(portKey));
    const currPorts = new Set(device.ports.map(portKey));
    const portsAdded = [...currPorts].filter((key) => !prevPorts.has(key));
    const portsRemoved = [...prevPorts].filter((key) => !currPorts.has(key));
    const statusChanged = prev.status !== device.status;

    if (portsAdded.length === 0 && portsRemoved.length === 0 && !statusChanged) {
      unchanged += 1;
    } else {
      changed.push({
        ip: device.ip,
        before: prev,
        after: device,
        portChanges: { added: portsAdded, removed: portsRemoved },
      });
    }
  }

  for (const device of prevMap.values()) {
    if (!currMap.has(device.ip)) {
      removed.push(device);
    }
  }

  return { added, removed, changed, unchanged };
}
