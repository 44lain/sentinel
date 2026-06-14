# Contribuindo com o Sentinel

Obrigado por considerar contribuir com o Sentinel! Este guia resume as convenções do projeto.

---

## Git — Conventional Commits

Commits devem seguir [Conventional Commits](https://www.conventionalcommits.org/) **em português**:

| Tipo | Uso |
|------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação |
| `chore:` | Configuração, setup, dependências |
| `test:` | Testes |
| `refactor:` | Refatoração sem mudança de comportamento |
| `style:` | Formatação, sem mudança de lógica |
| `perf:` | Melhoria de performance |

**Exemplos:**

```
feat: adicionar tela de login com Supabase Auth
fix: corrigir redirect após logout
docs: atualizar README com instruções de instalação
chore: configurar ESLint e Prettier no monorepo
```

---

## Branches

| Padrão | Uso |
|--------|-----|
| `main` | Branch principal protegida — sem push direto |
| `feature/*` | Novas funcionalidades (`feature/auth-login`) |
| `fix/*` | Correções de bugs (`fix/session-persistence`) |
| `docs/*` | Apenas documentação (`docs/readme-setup`) |
| `chore/*` | Manutenção e tooling (`chore/ci-workflow`) |

Fluxo: branch a partir de `main` → PR → CI verde → merge.

---

## Pull Requests

Use o template em `.github/pull_request_template.md`. Todo PR deve:

- Referenciar issue relacionada (`Closes #N`)
- Descrever o que mudou e por quê
- Incluir passos de teste
- Manter escopo focado (uma feature ou fix por PR)

Proteções de branch:

- CI deve passar (lint, typecheck, build, testes)
- Revisão antes do merge (quando aplicável)

---

## Code Style

### Comentários

Todo comentário no código — inline, bloco, JSDoc, docstrings Python e SQL — deve estar **em português**.

- Preferir código autoexplicativo; comentar apenas lógica não óbvia
- Identificadores, tipos e códigos de erro convencionais podem permanecer em inglês (`UNAUTHORIZED`, `DeviceTable`)

### TypeScript

- Strict mode habilitado
- Preferir `interface` para objetos públicos, `type` para unions/utilitários
- Componentes React em PascalCase; arquivos em kebab-case
- Server Components por padrão; `"use client"` apenas quando necessário
- Imports ordenados: externos → internos → relativos
- Sem `any` — usar tipos explícitos ou `unknown`
- Comentários e JSDoc em português

### Python

- Python 3.11+
- Formatação com **Ruff** ou **Black** (a definir no Sprint 3)
- Type hints em funções públicas
- Docstrings em português, apenas onde a lógica não for óbvia
- CLI via `argparse` ou `click` — manter simples

---

## Organização do Projeto

### Componentes

```
apps/web/components/
├── ui/           # shadcn/ui — não editar manualmente sem necessidade
├── dashboard/    # MetricCard, ScanChart, EmptyState
├── devices/      # DeviceTable, DeviceDetail
└── risks/        # RiskBadge, RiskList, RiskDetail
```

- Um componente por arquivo
- Props tipadas com interface dedicada
- Composição sobre herança

### Páginas

```
apps/web/app/
├── (auth)/       # login, cadastro, recuperação — layout público
├── (dashboard)/  # rotas autenticadas com sidebar
└── demo/         # página pública sem login
```

- Server Components para fetch de dados
- Loading states com `loading.tsx` e skeletons
- Empty states com CTA claro

### APIs

```
apps/web/app/api/
├── health/       # GET — health check público
├── scans/        # CRUD de scans
├── devices/      # CRUD de dispositivos
├── agents/       # CRUD de agentes
├── risks/        # Listagem de riscos
└── export/       # Exportação JSON/CSV
```

- Route Handlers do Next.js App Router
- Autenticação dupla: JWT Supabase (usuário) ou Bearer token (agente)
- Respostas JSON padronizadas: `{ data }` ou `{ error, message }`
- Validação de input com Zod

### Tabelas Supabase

1. Criar migration em `supabase/migrations/`
2. Nomenclatura: `YYYYMMDDHHMMSS_descricao.sql`
3. Habilitar RLS em toda tabela com dados de usuário
4. Políticas baseadas em `auth.uid()` ou cadeia agent → scan → device
5. Executar localmente com Supabase CLI antes do PR
6. Documentar schema em `.ai/tech/database.md`

---

## Desenvolvimento Local

```bash
npm install          # instalar dependências
npm run dev          # web app
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest
npm run build        # build de produção
```

---

## Issues e Labels

Labels sugeridas: `setup`, `feature`, `bug`, `docs`, `QA`, `enhancement`, `future`

Milestones = Sprint N (1–7)

Funcionalidades pós-MVP devem receber label `future` — não implementar fora do sprint atual.

---

## Código de Conduta

Seja respeitoso e construtivo. Foco em qualidade, simplicidade e entregas incrementais.
