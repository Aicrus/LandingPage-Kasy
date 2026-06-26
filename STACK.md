# Stack do Projeto — Landing Page

Documento de referência com todas as tecnologias, pacotes npm e agent skills configurados neste repositório.

---

## Visão geral

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 |
| Componentes | shadcn/ui (estilo `base-nova`) + Base UI |
| Animações | Motion (Framer Motion v12) |
| Ícones | Lucide React |
| Fontes | Geist Sans + Geist Mono (Google Fonts via `next/font`) |
| Qualidade | ESLint + eslint-config-next |

---

## Pacotes npm

### Dependências de produção

| Pacote | Versão | O que faz |
|---|---|---|
| **next** | 16.2.9 | Framework React com App Router, SSR, rotas e otimizações de build. |
| **react** | 19.2.4 | Biblioteca de interface. |
| **react-dom** | 19.2.4 | Renderização React no DOM. |
| **motion** | ^12.41.0 | Biblioteca de animação para React ([motion.dev](https://motion.dev/)). Usada para entradas, hover, scroll reveal, layout animation e `AnimatePresence`. |
| **tailwind-merge** | ^3.6.0 | Mescla classes Tailwind sem conflitos (ex.: `p-2` + `p-4`). |
| **clsx** | ^2.1.1 | Concatena classes CSS condicionalmente. |
| **class-variance-authority** | ^0.7.1 | Define variantes de componentes (tamanho, cor, estilo) de forma tipada. Usado pelos componentes shadcn. |
| **lucide-react** | ^1.21.0 | Ícones SVG como componentes React. Biblioteca padrão do shadcn neste projeto. |
| **@base-ui/react** | ^1.6.0 | Primitivos de UI acessíveis (headless). Base do shadcn no estilo `base-nova`. |
| **shadcn** | ^4.11.0 | CLI e sistema de componentes copiáveis para o projeto (não é uma lib npm tradicional — os componentes ficam em `src/components/ui/`). |
| **tw-animate-css** | ^1.4.0 | Animações CSS utilitárias compatíveis com Tailwind (fade, slide, etc.). |

### Dependências de desenvolvimento

| Pacote | Versão | O que faz |
|---|---|---|
| **typescript** | ^5 | Tipagem estática. |
| **tailwindcss** | ^4 | Framework CSS utilitário. Configuração via CSS (`globals.css`), sem `tailwind.config.js`. |
| **@tailwindcss/postcss** | ^4 | Plugin PostCSS do Tailwind v4. |
| **eslint** | ^9 | Linter de código. |
| **eslint-config-next** | 16.2.9 | Regras ESLint recomendadas para Next.js. |
| **@types/node** | ^20 | Tipos TypeScript para Node.js. |
| **@types/react** | ^19 | Tipos TypeScript para React. |
| **@types/react-dom** | ^19 | Tipos TypeScript para React DOM. |

### Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento (localhost:3000)
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # ESLint
```

---

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz (fontes, MotionProvider)
│   ├── page.tsx            # Página principal
│   └── globals.css         # Tailwind + tema + variáveis CSS
├── components/
│   ├── ui/                 # Componentes shadcn (Button, Card, Badge, Separator)
│   ├── motion/             # MotionProvider, Reveal
│   └── sections/           # Seções da landing (a serem criadas)
└── lib/
    ├── utils.ts            # cn() — merge de classes Tailwind
    └── motion.ts           # Re-exports Motion + variants e transições
```

---

## Componentes UI instalados

Componentes shadcn em `src/components/ui/` (estilo **base-nova**, cor base **neutral**):

| Componente | Arquivo | Uso |
|---|---|---|
| **Button** | `button.tsx` | CTAs, links de ação, botões primários e secundários. |
| **Card** | `card.tsx` | Blocos de conteúdo, features, depoimentos. |
| **Badge** | `badge.tsx` | Tags, labels, destaques curtos. |
| **Separator** | `separator.tsx` | Divisores visuais entre seções ou itens. |

Para adicionar mais componentes shadcn:

```bash
npx shadcn@latest add <nome-do-componente>
```

Configuração em `components.json` — aliases: `@/components`, `@/lib`, `@/components/ui`.

---

## Animações (Motion)

Integração configurada em:

| Arquivo | Função |
|---|---|
| `src/lib/motion.ts` | Exporta `motion`, hooks e variants (`fadeIn`, `fadeInUp`, `staggerContainer`, etc.) |
| `src/components/motion/motion-provider.tsx` | `LazyMotion` no layout (bundle menor) |
| `src/components/motion/reveal.tsx` | Componente `Reveal` — animação ao entrar na viewport |
| `src/app/layout.tsx` | App envolvido pelo `MotionProvider` |

**Motion** → micro-animações, entradas, hover, layout.  
**Cinematic Scroll** (skill) → scroll cinematográfico, parallax, capítulos fixos (GSAP quando necessário).

---

## Tema e design tokens

Definidos em `src/app/globals.css`:

- Paleta em **oklch** (light + dark via classe `.dark`)
- Tokens: `--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--radius`, etc.
- Fontes: `--font-sans` (Geist), `--font-mono` (Geist Mono)
- Border radius escalonado: `--radius-sm` até `--radius-4xl`

---

## Agent Skills instaladas

Skills são guias que o Cursor lê para produzir código com mais qualidade. Ficam em `.cursor/skills/` (e cópias em `.agents/skills/` para o CLI `skills`).

### Instalação

| Skill | Comando usado | Local |
|---|---|---|
| cinematic-scroll | `npx cinematic-scroll-skill --dir .cursor/skills` | `.cursor/skills/cinematic-scroll/` |
| Taste Skill (13 skills) | `npx skills add Leonxlnx/taste-skill` | `.agents/skills/` → symlinks em `.cursor/skills/` |
| frontend-design | Já presente (Anthropic) | `.cursor/skills/frontend-design/` |

### Skills de design e frontend

| Skill | Origem | O que faz |
|---|---|---|
| **frontend-design** | [Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Direção visual distintiva: tipografia, paleta, layout, processo criativo em duas passagens (planejar → codar). Evita os 3 “looks” padrão de IA. |
| **design-taste-frontend** | [Taste Skill](https://www.tasteskill.dev/) v2 | Skill principal anti-slop: lê o brief, infere direção visual, 3 dials (VARIANCE / MOTION / DENSITY), pre-flight check rigoroso. |
| **design-taste-frontend-v1** | Taste Skill | Versão estável anterior do taste-skill. |
| **gpt-taste** | Taste Skill | Regras mais rígidas orientadas a GPT/Codex. |
| **minimalist-ui** | Taste Skill | UI minimalista e arejada. |
| **industrial-brutalist-ui** | Taste Skill | Estética brutalista / industrial. |
| **high-end-visual-design** | Taste Skill | Visual premium e sofisticado. |
| **redesign-existing-projects** | Taste Skill | Redesign com auditoria do que já existe no projeto. |
| **full-output-enforcement** | Taste Skill | Garante que o agente entregue output completo, sem cortar código. |
| **stitch-design-taste** | Taste Skill | Ponte com Google Stitch para design. |

### Skills de geração de imagens / referências

| Skill | O que faz |
|---|---|
| **image-to-code** | Gera referências visuais e implementa em código. |
| **imagegen-frontend-web** | Frames de seções web para handoff ao dev. |
| **imagegen-frontend-mobile** | Frames mobile para handoff. |
| **brandkit** | Boards de identidade visual / brand kit. |

### Skill de scroll cinematográfico

| Skill | O que faz |
|---|---|
| **cinematic-scroll** | Sites scroll-driven: parallax, capítulos fixos, tilt 3D, release pages. Inclui exemplos HTML/GSAP e template Next.js. Modo audit para revisar URLs. |

### Skills de engenharia / tema

| Skill | O que faz |
|---|---|
| **mobile-theme-color** | Faz a barra do navegador mobile (status bar do iOS Safari, toolbar do Android Chrome — a meta `theme-color`) acompanhar os modos claro/escuro/sistema, batendo com o `--background`. Padrão correto (meta única, mutar `content`, sem `media`, um só atualizador) para não travar no iOS. |

### Como as skills se complementam

```
Brief do usuário
       │
       ▼
┌──────────────────┐     ┌─────────────────────┐
│ frontend-design  │     │ design-taste-frontend│  → Direção visual, anti-slop
│ (Anthropic)      │     │ (Taste Skill)        │
└──────────────────┘     └─────────────────────┘
       │
       ▼
┌──────────────────┐     ┌─────────────────────┐
│ Tailwind + shadcn│     │ Motion              │  → Implementação
└──────────────────┘     └─────────────────────┘
       │
       ▼
┌──────────────────┐
│ cinematic-scroll │  → Scroll longo, parallax, capítulos (quando aplicável)
└──────────────────┘
```

---

## Como atualizar

### Pacotes npm

```bash
npm update                    # Atualiza dentro dos ranges do package.json
npm install motion@latest     # Atualizar pacote específico
```

### Skills

```bash
# Cinematic Scroll
npx cinematic-scroll-skill --dir .cursor/skills

# Taste Skill (todas as 13)
npx skills add Leonxlnx/taste-skill

# Frontend Design (Anthropic)
npx skills add anthropics/skills --skill frontend-design
```

---

## Referências externas

- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Motion](https://motion.dev/)
- [Taste Skill](https://www.tasteskill.dev/)
- [Cinematic Scroll Skill](https://github.com/MustBeSimo/cinematic-scroll-skill)
- [Anthropic Skills — frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design)

---

*Última atualização: junho de 2026*
