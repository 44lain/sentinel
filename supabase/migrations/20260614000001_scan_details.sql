-- Detalhes enriquecidos do scan Nmap (OS + versões de serviço)

ALTER TABLE devices
  ADD COLUMN os_name text,
  ADD COLUMN os_accuracy integer CHECK (os_accuracy BETWEEN 0 AND 100),
  ADD COLUMN os_family text;

ALTER TABLE ports
  ADD COLUMN service_product text,
  ADD COLUMN service_version text,
  ADD COLUMN service_extra text;
