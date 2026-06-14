# NetAtlas

**Network Discovery & Monitoring Platform**

Plataforma open source para descoberta, inventário e monitoramento de redes locais. Combine uma web app moderna com um agente coletor local para obter visibilidade sobre dispositivos conectados, portas abertas e riscos básicos de segurança.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Supabase%20%7C%20Python-000?style=flat)](https://github.com)

---

## Projeto

### Nome

**NetAtlas** — Network Discovery & Monitoring Platform

### Descrição

O NetAtlas é uma plataforma self-hosted composta por uma aplicação web (Next.js + Supabase) e um agente coletor local em Python/Nmap. Juntos, eles descobrem dispositivos na rede, escaneiam portas abertas, classificam riscos de segurança e mantêm um inventário histórico acessível via dashboard.

### Objetivo

Oferecer visibilidade prática sobre redes domésticas e de pequenas empresas — quem está conectado, o que está exposto e quais riscos merecem atenção — sem depender de soluções proprietárias ou complexas.

### Motivação

Redes locais frequentemente carecem de observabilidade. Roteadores não mostram o quadro completo; ferramentas enterprise são caras ou excessivas para homelabs e PMEs. O NetAtlas preenche essa lacuna com uma stack moderna, código aberto e fluxo de uso simples: instalar o agente, executar um scan, visualizar resultados no dashboard.

---

## Features

### Atuais (v0.4.0-beta — Sprints 1–4)

| Área | Status |
|------|--------|
| **Autenticação** | Cadastro, login, logout, recuperação de senha (Supabase Auth) |
| **Dashboard** | Métricas, dispositivos recentes com portas e SO, empty state |
| **NetAtlas Agent** | CLI Python, discovery ARP/ping, scan Nmap em duas fases, perfis quick/standard/deep |
| **Inventário** | Listagem com busca, filtros, portas abertas e versões de serviço |
| **Riscos** | Motor server-side (FTP, SSH, SMB, MySQL, PostgreSQL, Redis, MongoDB…) |
| **Agentes** | Registro com token único, listagem, revogação |
| **Branding** | Logos NetAtlas na landing, auth e sidebar do dashboard |
| **Deploy** | Vercel (web) + Supabase (banco/auth) em produção |

### Planejadas (Sprints 5–7)

### Futuras (pós-MVP)

- Alertas e notificações em tempo real
- Agendamento de scans recorrentes
- Integração com ferramentas de SIEM
- Suporte expandido cross-platform (Windows/macOS)
- CLI de instalação one-liner (`curl | bash` / `pip install`)
- Badge live de status no README (GitHub Actions + Shields.io)

---

## Arquitetura

```
┌─────────────────┐         HTTPS / REST          ┌──────────────────────┐
│  NetAtlas Agent │  ───────────────────────────►   │   Web App (Next.js)  │
│  Python + Nmap  │   Bearer Token (agente)       │   Vercel             │
│  Rede local     │                               │   Route Handlers     │
└─────────────────┘                               └──────────┬───────────┘
                                                               │
                                                               ▼
                                                    ┌──────────────────────┐
                                                    │      Supabase        │
                                                    │  Auth · Postgres ·   │
                                                    │  RLS · Realtime      │
                                                    └──────────────────────┘
```

### Web App

Aplicação Next.js 16 (App Router) hospedada na Vercel. Responsável pela interface do usuário, autenticação via Supabase SSR, APIs REST para o agente e processamento do motor de riscos no backend.

### NetAtlas Agent

CLI Python que roda na rede local do usuário. Executa descoberta de hosts (ARP + ping sweep), scan de portas via Nmap e envia resultados autenticados para a plataforma.

### Supabase

Backend-as-a-Service: autenticação de usuários, banco PostgreSQL com Row Level Security, e opcionalmente Realtime para atualização do dashboard.

### Fluxo de dados

1. Usuário registra um agente no dashboard e recebe um token Bearer (exibido uma única vez).
2. Agente executa `netatlas scan --token TOKEN --agent-id ID --api URL --profile deep --include-localhost`.
3. Agente valida conectividade (`GET /api/health`), cria scan (`POST /api/scans`).
4. Discovery identifica hosts; Nmap descobre portas TCP (`-sT`) e enriquece com versões/scripts.
5. Agente envia dispositivos, portas e metadados de SO (`POST /api/devices`).
6. Backend classifica riscos automaticamente.
7. Agente finaliza scan (`PATCH /api/scans/:id`).
8. Dashboard atualiza via polling (30s) ou Supabase Realtime.

---

## Stack

| Camada       | Tecnologias                                        |
| ------------ | -------------------------------------------------- |
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS, shadcn/ui    |
| **Backend**  | Next.js Route Handlers, Supabase (Auth + Postgres) |
| **Agente**   | Python 3.11+, Nmap, subprocess / nmap3             |
| **Infra**    | Vercel, Supabase, GitHub Actions                   |
| **Testes**   | Vitest, pytest, Playwright                         |
| **Monorepo** | Turborepo                                          |

---

## Roadmap

| Sprint | Semanas | Objetivo                                     | Versão       |
| ------ | ------- | -------------------------------------------- | ------------ |
| **1**  | 1–2     | Fundação: setup, auth, layout, dark mode, CI | v0.1.0-alpha |
| **2**  | 3–4     | Dashboard, métricas, APIs REST do agente     | v0.2.0-alpha |
| **3**  | 5–6     | NetAtlas Agent: CLI, ARP, Nmap, MAC/hostname | v0.3.0-alpha |
| **4**  | 7–8     | Integração agente ↔ plataforma, inventário   | v0.4.0-beta  |
| **5**  | 9–10    | Histórico de scans, motor de riscos          | v0.5.0-beta  |
| **6**  | 11–12   | Comparação de scans, gráficos, export, demo  | v0.6.0-rc    |
| **7**  | 13–14   | E2E, documentação, CI/CD, produção           | v1.0.0       |

**Estimativa total:** 14 semanas · ~196h · sprints de 2 semanas

---

## Instalação

### Pré-requisitos

- Node.js 20+
- npm (monorepo com Turborepo)
- Conta Supabase + Vercel
- Python 3.11+ e Nmap (agente)

### Web App

```bash
git clone https://github.com/44lain/netatlas.git
cd netatlas
cp .env.example apps/web/.env.local
# Preencher NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev          # Turbopack (padrão Next 16)
npm run dev:clean    # limpa .next e reinicia (se cache corromper)
```

### NetAtlas Agent

```bash
cd apps/agent
pip install -e ".[dev]"
netatlas scan --token SEU_TOKEN --agent-id UUID --api https://netatlas.vercel.app \
  --profile deep --include-localhost
```

Perfis: `quick` (rápido), `standard` (padrão), `deep` (scripts NSE). Detecção de SO e UDP
requerem `sudo`; portas TCP funcionam sem root.

### Supabase

1. Criar projeto em [supabase.com](https://supabase.com)
2. `supabase db push` (migrations em `supabase/migrations/`)
3. Configurar env vars na Vercel e em `apps/web/.env.local`

---

## Contribuição

Contribuições são bem-vindas! Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para:

- Conventional Commits (em português)
- Convenção de branches (`feature/*`, `fix/*`, `docs/*`, `chore/*`)
- Template de Pull Request
- Padrões de código TypeScript e Python
- Organização de componentes, páginas, APIs e tabelas Supabase

Antes de abrir um PR:

1. Crie uma issue descrevendo a mudança
2. Siga as convenções do projeto
3. Garanta que CI passa (lint, typecheck, build)
4. Atualize documentação quando aplicável

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

<p align="center">
  <strong>Desenvolvido por <a href="https://github.com/44lain" target="_blank" rel="noopener noreferrer">-lain</a></strong>
</p>
