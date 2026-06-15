# Screenshots — NetAtlas v1.0.0

Assets para divulgação (GitHub README, LinkedIn).

## Telas prioritárias

| Arquivo sugerido          | Rota             | Modo  |
| ------------------------- | ---------------- | ----- |
| `landing-dark.png`        | `/`              | dark  |
| `landing-light.png`       | `/`              | light |
| `login-dark.png`          | `/login`         | dark  |
| `demo-dashboard-dark.png` | `/demo`          | dark  |
| `demo-inventory-dark.png` | `/demo` (scroll) | dark  |
| `demo-risks-dark.png`     | `/demo` (scroll) | dark  |

Telas autenticadas (dashboard, inventário real, scans, settings) requerem conta com dados — capture manualmente após login ou use seed de staging.

## Screenshots capturados (v1.0)

| Arquivo                   | Status         |
| ------------------------- | -------------- |
| `landing-dark.png`        | ✅             |
| `landing-light.png`       | ✅             |
| `login-dark.png`          | ✅             |
| `demo-dashboard-dark.png` | ✅ (full page) |

Telas autenticadas: capturar manualmente após login com dados reais.

```bash
cd apps/web
npm run build && npm run start &
npx playwright install chromium
node ../../scripts/capture-screenshots.mjs
```

## Requisitos

- Resolução: 1440×900 (desktop)
- Sem dados sensíveis reais — use `/demo` ou tenant de teste
- Preferir tema dark para materiais de divulgação (identidade cyberpunk sóbria)
