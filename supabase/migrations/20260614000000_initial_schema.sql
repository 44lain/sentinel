-- Schema inicial NetAtlas — Sprint 2
-- Tabelas: agents, scans, devices, ports, risks

-- agents
CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name text NOT NULL,
  token text NOT NULL UNIQUE,
  last_scan_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- scans
CREATE TABLE scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents (id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  duration_seconds integer,
  device_count integer,
  open_port_count integer
);

-- devices
CREATE TABLE devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid NOT NULL REFERENCES scans (id) ON DELETE CASCADE,
  ip text NOT NULL,
  hostname text,
  mac_address text,
  vendor text,
  status text NOT NULL CHECK (status IN ('online', 'offline')),
  first_seen_at timestamptz NOT NULL DEFAULT now()
);

-- ports
CREATE TABLE ports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices (id) ON DELETE CASCADE,
  port_number integer NOT NULL CHECK (port_number BETWEEN 1 AND 65535),
  protocol text NOT NULL CHECK (protocol IN ('tcp', 'udp')),
  service_name text,
  state text NOT NULL CHECK (state IN ('open', 'filtered'))
);

-- risks
CREATE TABLE risks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices (id) ON DELETE CASCADE,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  title text NOT NULL,
  description text NOT NULL,
  recommendation text NOT NULL,
  port_number integer
);

-- Índices
CREATE INDEX idx_agents_user_id ON agents (user_id);
CREATE INDEX idx_scans_agent_id ON scans (agent_id);
CREATE INDEX idx_scans_started_at ON scans (started_at DESC);
CREATE INDEX idx_devices_scan_id ON devices (scan_id);
CREATE INDEX idx_devices_ip ON devices (ip);
CREATE INDEX idx_ports_device_id ON ports (device_id);
CREATE INDEX idx_risks_device_id ON risks (device_id);
CREATE INDEX idx_risks_severity ON risks (severity);

-- RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

-- agents: usuário vê apenas os próprios agentes
CREATE POLICY agents_select_own ON agents
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY agents_insert_own ON agents
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY agents_update_own ON agents
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY agents_delete_own ON agents
  FOR DELETE USING (user_id = auth.uid());

-- scans: via cadeia agent → user
CREATE POLICY scans_select_own ON scans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = scans.agent_id AND agents.user_id = auth.uid()
    )
  );

-- devices: via scan → agent → user
CREATE POLICY devices_select_own ON devices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM scans
      JOIN agents ON agents.id = scans.agent_id
      WHERE scans.id = devices.scan_id AND agents.user_id = auth.uid()
    )
  );

-- ports: via device → scan → agent → user
CREATE POLICY ports_select_own ON ports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM devices
      JOIN scans ON scans.id = devices.scan_id
      JOIN agents ON agents.id = scans.agent_id
      WHERE devices.id = ports.device_id AND agents.user_id = auth.uid()
    )
  );

-- risks: via device → scan → agent → user
CREATE POLICY risks_select_own ON risks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM devices
      JOIN scans ON scans.id = devices.scan_id
      JOIN agents ON agents.id = scans.agent_id
      WHERE devices.id = risks.device_id AND agents.user_id = auth.uid()
    )
  );
