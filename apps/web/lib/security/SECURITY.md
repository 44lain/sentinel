# Segurança — NetAtlas

Documentação das medidas aplicadas na Sprint Final v1.0.0.

## Autenticação

| Fluxo             | Mecanismo                         |
| ----------------- | --------------------------------- |
| Usuário (browser) | Sessão Supabase via cookie SSR    |
| Agente (CLI)      | Bearer token + bcrypt no servidor |

## RLS (Supabase)

Todas as tabelas de dados (`agents`, `scans`, `devices`, `ports`, `risks`) têm RLS habilitado com políticas `SELECT` baseadas em `auth.uid()` ou cadeia agent → scan → device.

Migration `20260615000000_security_hardening.sql`: coluna `agents.token` não é mais legível pelo role `authenticated` — apenas service role.

## APIs

- Validação Zod em corpos POST/PATCH
- Limites de payload em `createDevicesSchema` (máx. 500 dispositivos, strings limitadas)
- `assertSameOrigin()` em rotas mutáveis do usuário (POST/DELETE agents)
- Sanitização de busca em filtros PostgREST (`lib/security/sanitize.ts`)
- Scans finalizados rejeitam novos POST de dispositivos e PATCH duplicado

## Headers HTTP

Configurados em `next.config.ts`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`.

## Pendências v1.1

- Rate limiting distribuído (Upstash / Vercel KV)
- CSP restritiva ajustada ao stack
- Políticas INSERT via RPC em vez de service role amplo
- Confirmação de e-mail obrigatória em produção
