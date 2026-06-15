import { z } from "zod";

export const uuidParamSchema = z.string().uuid("Identificador inválido.");

const boundedString = (max: number) => z.string().max(max).nullable().optional();

export const createScanSchema = z.object({
  agent_id: z.string().uuid("agent_id inválido"),
});

export const finishScanSchema = z.object({
  finished_at: z.string().datetime().optional(),
  duration_seconds: z.number().int().min(0).max(86_400),
  device_count: z.number().int().min(0).max(10_000),
  open_port_count: z.number().int().min(0).max(100_000),
});

const portSchema = z.object({
  port_number: z.number().int().min(1).max(65535),
  protocol: z.enum(["tcp", "udp"]),
  service_name: boundedString(128),
  service_product: boundedString(128),
  service_version: boundedString(64),
  service_extra: boundedString(256),
  state: z.enum(["open", "filtered"]),
});

const deviceSchema = z.object({
  ip: z.string().min(1).max(45),
  hostname: boundedString(255),
  mac_address: boundedString(32),
  vendor: boundedString(128),
  status: z.enum(["online", "offline"]),
  os_name: boundedString(128),
  os_accuracy: z.number().int().min(0).max(100).nullable().optional(),
  os_family: boundedString(64),
  ports: z.array(portSchema).max(500).default([]),
});

export const createDevicesSchema = z.object({
  scan_id: z.string().uuid("scan_id inválido"),
  devices: z
    .array(deviceSchema)
    .min(1, "Informe ao menos um dispositivo")
    .max(500, "Máximo de 500 dispositivos por requisição"),
});

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).max(10_000).default(0),
});

export const deviceListQuerySchema = z.object({
  status: z.enum(["online", "offline"]).optional(),
  search: z.string().max(100).optional(),
});

export type CreateDevicesInput = z.infer<typeof createDevicesSchema>;
