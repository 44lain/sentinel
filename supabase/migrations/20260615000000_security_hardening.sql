-- Hardening de segurança — Sprint Final v1.0.0
-- Impede que clientes autenticados leiam o hash do token do agente via SELECT direto.

REVOKE SELECT ON agents FROM authenticated;
GRANT SELECT (id, user_id, name, last_scan_at, created_at) ON agents TO authenticated;

-- Service role (admin) mantém acesso total para validação de Bearer token.
