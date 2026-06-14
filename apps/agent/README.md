# NetAtlas Agent

CLI Python para descoberta de dispositivos e scan de portas na rede local.

## Pré-requisitos

- Python 3.11+
- [Nmap](https://nmap.org/) instalado no sistema
- Linux: comando `ip` (iproute2)

## Instalação

```bash
cd apps/agent
pip install -e ".[dev]"
```

## Uso

```bash
netatlas scan --help

# Máximo detalhe (recomendado): scripts NSE, UDP, SO, versões de serviço
netatlas scan --token SEU_TOKEN --agent-id ID --api https://netatlas.vercel.app \
  --profile deep --include-localhost

# Scan local em JSON
netatlas scan --profile standard --include-localhost -o resultado.json
```

## Perfis de scan (`--profile`)

| Perfil | O que faz | Tempo |
|--------|-----------|-------|
| `quick` | Top-1000 TCP + detecção leve de serviço nas portas abertas | Rápido |
| `standard` | + `-sV` intensidade 5 e scripts padrão (`-sC`) nas portas abertas | Médio |
| `deep` | + scripts extras (banner, http-title, ssl-cert…) nas portas abertas | Lento |

**Importante:** a descoberta de portas usa sempre `-sT` (como `nmap <host>`), funciona **sem root**.
Detecção de SO (`-O`) e scan UDP (`-sU`) só rodam com **root** — sem isso, o agente omite
essas etapas mas **continua encontrando todas as portas TCP**.

## Portas escaneadas

Padrão: **`--top-ports 1000`** (as 1000 portas mais comuns do Nmap), incluindo PostgreSQL (5432),
Redis (6379), HTTP alt (8080), Node (3000), etc.

Saída processada via **XML do Nmap** com: produto/versão do serviço, scripts NSE, SO estimado,
hostname e MAC quando disponíveis.

## Flags úteis

```bash
--include-localhost   # inclui 127.0.0.1 (Docker/serviços locais)
--no-service-detect   # desativa -sV
--ports 22,80,443     # portas customizadas
--no-ports            # apenas descoberta de hosts
```

## Testes

```bash
pytest
```
