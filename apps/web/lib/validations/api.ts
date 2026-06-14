import { z } from "zod";

export const createScanSchema = z.object({
  agent_id: z.string().uuid("agent_id inválido"),
});

export const finishScanSchema = z.object({
  finished_at: z.string().datetime().optional(),
  duration_seconds: z.number().int().min(0),
  device_count: z.number().int().min(0),
  open_port_count: z.number().int().min(0),
});

const portSchema = z.object({
  port_number: z.number().int().min(1).max(65535),
  protocol: z.enum(["tcp", "udp"]),
  service_name: z.string().nullable().optional(),
  service_product: z.string().nullable().optional(),
  service_version: z.string().nullable().optional(),
  service_extra: z.string().nullable().optional(),
  state: z.enum(["open", "filtered"]),
});

const deviceSchema = z.object({
  ip: z.string().min(1),
  hostname: z.string().nullable().optional(),
  mac_address: z.string().nullable().optional(),
  vendor: z.string().nullable().optional(),
  status: z.enum(["online", "offline"]),
  os_name: z.string().nullable().optional(),
  os_accuracy: z.number().int().min(0).max(100).nullable().optional(),
  os_family: z.string().nullable().optional(),
  ports: z.array(portSchema).default([]),
});

export const createDevicesSchema = z.object({
  scan_id: z.string().uuid("scan_id inválido"),
  devices: z.array(deviceSchema).min(1, "Informe ao menos um dispositivo"),
});

export type CreateDevicesInput = z.infer<typeof createDevicesSchema>;
