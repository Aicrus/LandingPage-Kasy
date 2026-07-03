# Landing Page Kasy

Landing pública em [kasy.dev](https://kasy.dev) (`/pt`, `/en`, `/es`).

Repositório: [github.com/Aicrus/LandingPage-Kasy](https://github.com/Aicrus/LandingPage-Kasy)

## Onde evoluir o quê

| O quê | Onde trabalhar | Git |
|---|---|---|
| Landing (UI, i18n, skills, assets) | **Este repo** (`/Users/paulomorales/LandingPage`) | `LandingPage-Kasy` |
| Documentação (`/docs`) | `kit/site/kasy-v3/content/docs/` | repo `kasy-v3` (gitignored no kit) |
| Instalador CLI (`/install`) | `kit/cli/install/` | monorepo `kit` |
| Scripts de deploy | `kit/site/` (`sync-landing.sh`, `deploy.sh`) | monorepo `kit` |

**Regra:** landing e skills evoluem **aqui**. O `kit/site` só orquestra deploy (copia este projeto + docs + instalador e publica na Vercel).

## Dev local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Publicar em kasy.dev

Depois de commitar e dar push neste repo:

```bash
cd /Users/paulomorales/kit
bash site/sync-landing.sh
bash site/deploy.sh
```

## Stack

Ver `STACK.md` (Next.js 16, Tailwind v4, shadcn, Motion, next-intl).

## Favicon

Esfera com gradiente da paleta da landing (`globals.css`):

- Light: `#f2f4fa` → `#4a5270`
- Dark: `#0f1218` → `#8ba4e8`

Fonte: `src/lib/brand-icon.ts` + `src/app/icon.svg`.
