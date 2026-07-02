"use client";

import {
  Bell,
  Check,
  CreditCard,
  KeyRound,
  LayoutGrid,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { AnimatePresence, fadeIn, motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { BrandTile } from "./brand-icons";

type FeatureTab = {
  key: string;
  icon: LucideIcon;
  label: string;
  /** Cor de assinatura da categoria — cada aba tem a sua, não um azul genérico repetido. */
  accent: string;
  tagline: string;
  /** `null` = sem número fixo (ex.: categoria "Mais", que é uma mistura). */
  saved: string | null;
  providers: string[];
  bullets?: string[];
  moreItems?: { label: string; desc: string }[];
};

const FEATURE_TABS: FeatureTab[] = [
  {
    key: "auth",
    icon: KeyRound,
    label: "Autenticação",
    accent: "#2563eb",
    tagline: "Todo método de login, configurado e pronto.",
    saved: "12h",
    providers: ["Google", "Apple", "Facebook"],
    bullets: [
      "Login com Google (iOS + Android)",
      "Login com Apple (iOS + Android)",
      "Login com Facebook (iOS + Android)",
      "Email e senha",
      "Telefone (SMS OTP)",
      "Auth anônimo com vinculação de conta, sem perder dados",
      "Recuperação de senha",
    ],
  },
  {
    key: "subs",
    icon: CreditCard,
    label: "Assinaturas",
    accent: "#7c3aed",
    tagline: "Monetize desde o dia um com RevenueCat e Stripe.",
    saved: "15h",
    providers: ["RevenueCat", "Stripe"],
    bullets: [
      "Integração RevenueCat (iOS + Android + Web)",
      "4 estilos de paywall: Minimal, Grid, Row, Toggle",
      "Componente de tabela comparativa incluído",
      "Testes A/B via RevenueCat Experiments, sem rebuild",
      "Estado da assinatura sincronizado em tempo real via webhook",
      "Troque o paywall pelo dashboard, sem rebuild",
      "Guard de paywall redireciona conteúdo premium",
      "Suporte a trial gratuito",
    ],
  },
  {
    key: "notif",
    icon: Bell,
    label: "Notificações",
    accent: "#f59e0b",
    tagline: "Push, in-app e lembretes locais.",
    saved: "10h",
    providers: ["Firebase Cloud Messaging"],
    bullets: [
      "Push via Firebase Cloud Messaging (FCM)",
      "Lista de notificações in-app com timestamps",
      "Contador de badge de não lidas",
      "Deep link: toque na notificação, abre a tela certa",
      "Gerenciamento de tokens de dispositivo e limpeza",
      "Cloud Function para entrega via webhook",
      "Lembretes locais diários, semanais ou únicos, sem servidor",
    ],
  },
  {
    key: "ui",
    icon: LayoutGrid,
    label: "Componentes",
    accent: "#059669",
    tagline: "60+ componentes, 95+ variantes, totalmente customizáveis.",
    saved: "semanas",
    providers: ["iOS", "Android", "Web"],
    bullets: [
      "60+ componentes prontos para produção, 95+ variantes",
      "Testados em iOS, Android e Web",
      "Modo escuro e claro, automático ou trocado pelo usuário",
      "Accordion, Alert, AppBar, Avatar, Badge, BottomSheet, Button, Card, Checkbox, Chip, Dialog, Input, OTP, Skeleton, Sidebar, SwipeAction, TextArea, TextField, Toast",
      "Animações customizadas e transições de rota",
      "Feedback háptico integrado",
      "Galeria de componentes no navegador, copie qualquer nome pra IA",
    ],
  },
  {
    key: "sec",
    icon: ShieldCheck,
    label: "Segurança",
    accent: "#0d9488",
    tagline: "Regras de nível produção, sem surpresas.",
    saved: "8h",
    providers: ["Firebase", "Supabase"],
    bullets: [
      "Regras de segurança Firestore prontas para produção",
      "Row Level Security (Supabase) pronto para produção",
      "Regras de Firebase Storage com isolamento por usuário",
      "Permissões App Store e Play Store tratadas, sem rejeição",
      "Dart-defines separam dev de produção, sem segredo no código",
    ],
  },
  {
    key: "widget",
    icon: Smartphone,
    label: "Widget nativo",
    accent: "#db2777",
    tagline: "Widgets nativos na tela inicial, sincronizados.",
    saved: "6h",
    providers: ["iOS", "Android"],
    bullets: [
      "Widget de tela inicial para iOS e Android",
      "Atualização automática em segundo plano",
      "Sincroniza com o estado do app: assinatura, dados do usuário",
      "Configurável pelo painel admin do app",
      "Suporte a App Groups (iOS) pra compartilhar dados com a extensão",
    ],
  },
  {
    key: "ai",
    icon: MessageSquare,
    label: "Chat com IA",
    accent: "#9333ea",
    tagline: "Chat integrado com OpenAI ou Gemini.",
    saved: "8h",
    providers: ["Firebase", "Supabase"],
    bullets: [
      "Interface de chat com OpenAI ou Google Gemini",
      "Histórico de conversas com contexto completo",
      "API key fica no servidor, nunca no app",
      "Proxy via Cloud Function (Firebase) ou Edge Function (Supabase)",
      "Balões de chat, estados de carregamento, input de envio",
    ],
  },
  {
    key: "more",
    icon: PlusCircle,
    label: "Mais",
    accent: "#64748b",
    tagline: "Todo o resto. Nenhum recurso fica de fora.",
    saved: null,
    providers: ["Codemagic", "Firebase", "Supabase"],
    moreItems: [
      {
        label: "Perfil",
        desc: "Atualize o nome, vincule ou desvincule contas, troque o avatar",
      },
      {
        label: "Anúncios",
        desc: "Banner, intersticial, recompensado e recompensado-intersticial",
      },
      {
        label: "Upload de arquivos",
        desc: "Progresso, uploads canceláveis e organização em pastas",
      },
      {
        label: "Configurações",
        desc: "Seleção de tema, cores, idioma e feedback háptico",
      },
      {
        label: "Onboarding",
        desc: "Experiência de primeiro acesso personalizável",
      },
      {
        label: "Analytics",
        desc: "Mixpanel com rastreamento de eventos e observer de navegação",
      },
      {
        label: "Crash reporting",
        desc: "Sentry pra monitorar erros em produção, com upload de source maps",
      },
      {
        label: "Localização",
        desc: "EN, PT e ES incluídos, fácil de estender",
      },
      {
        label: "Notas (exemplo CRUD)",
        desc: "Criar, ler, atualizar e deletar com sincronização em tempo real",
      },
      {
        label: "Serviço de log",
        desc: "Logging estruturado e com níveis, pronto pra uso",
      },
      {
        label: "Fuso horário",
        desc: "Agendamento com fuso horário que simplesmente funciona",
      },
      {
        label: "Abrir URLs",
        desc: "Abra URLs, emails e números de telefone nativamente",
      },
      {
        label: "Seletor de arquivos",
        desc: "Selecione arquivos e imagens direto do dispositivo",
      },
      {
        label: "Feedback háptico",
        desc: "Feedback háptico configurável em todo o app",
      },
      {
        label: "Verificador de atualizações",
        desc: "Checagens automáticas de versão com prompt de atualização",
      },
      {
        label: "Atualização forçada",
        desc: "Atualização obrigatória pra versões críticas",
      },
      {
        label: "CI/CD",
        desc: "Codemagic e GitHub Actions pra test, build e deploy",
      },
      {
        label: "Lint rigoroso",
        desc: "Regras de lint opinionadas pra qualidade de código consistente",
      },
      {
        label: "Acessibilidade",
        desc: "Leitores de tela, labels semânticos e boas práticas de a11y",
      },
      {
        label: "Suporte a editores de IA",
        desc: "Regras, agentes e skills pra Cursor, Claude Code e Windsurf",
      },
      { label: "Web (PWA)", desc: "Roda no navegador como PWA" },
      {
        label: "Feature requests",
        desc: "Usuários sugerem e votam em funcionalidades no app",
      },
    ],
  },
];

const TOTAL_FEATURE_COUNT = FEATURE_TABS.reduce(
  (sum, tab) => sum + (tab.bullets?.length ?? tab.moreItems?.length ?? 0),
  0,
);

const CARD_SHADOW_CLASS = cn(
  "shadow-[0_1px_2px_rgba(26,30,44,0.04),0_6px_16px_-10px_rgba(26,30,44,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

function savedLabel(saved: string) {
  return /^\d/.test(saved)
    ? `+${saved} economizadas`
    : `${saved.charAt(0).toUpperCase()}${saved.slice(1)} economizadas`;
}

function TabPanel({ tab }: { tab: FeatureTab }) {
  const tint = (opacity: number) =>
    `color-mix(in srgb, ${tab.accent} ${opacity}%, transparent)`;

  return (
    <motion.div
      layout
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-5 sm:p-6",
        CARD_SHADOW_CLASS,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: tint(15), color: tab.accent }}
          >
            <tab.icon className="size-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.9375rem] font-semibold text-foreground">
              {tab.tagline}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {tab.providers.map((name) => (
                <motion.span
                  key={name}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="flex items-center gap-1.5 rounded-full bg-muted/70 py-0.5 pr-2.5 pl-0.5 text-[0.6875rem] font-medium text-muted-foreground"
                >
                  <BrandTile name={name} size="size-5" iconSize={11} />
                  {name}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        {tab.saved ? (
          <span className="shrink-0 rounded-md bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {savedLabel(tab.saved)}
          </span>
        ) : tab.moreItems ? (
          <span className="shrink-0 rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
            {tab.moreItems.length} recursos
          </span>
        ) : null}
      </div>

      <div className="mt-5 border-t border-border/60">
        {tab.moreItems ? (
          <div className="grid grid-cols-1 gap-2.5 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            {tab.moreItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-muted/50 p-3.5 transition-colors duration-200 hover:bg-muted"
              >
                <p className="text-sm font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <ul>
            {tab.bullets?.map((bullet) => (
              <li
                key={bullet}
                className="group -mx-2 flex items-start gap-3 rounded-lg border-b border-border/50 px-2 py-3 text-sm text-foreground/90 transition-colors duration-200 last:border-b-0 hover:bg-muted/50"
              >
                <span
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: tint(16), color: tab.accent }}
                >
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export function WhatYouGet() {
  const [activeKey, setActiveKey] = useState(FEATURE_TABS[0].key);
  const activeTab =
    FEATURE_TABS.find((tab) => tab.key === activeKey) ?? FEATURE_TABS[0];

  return (
    <section
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-14">
        <Reveal className="flex flex-col gap-3.5 lg:sticky lg:top-28 lg:h-fit">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            O que você recebe
          </span>
          <h2
            className={cn(
              "text-balance font-heading font-bold text-foreground",
              "text-[clamp(1.625rem,1.15rem+1.6vw,2.25rem)]",
              "leading-[1.14] tracking-[-0.02em]",
            )}
          >
            Tudo que você precisa.{" "}
            <span className="text-[#16a34a] dark:text-[#4ade80]">
              Nada além.
            </span>
          </h2>
          <p className="text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
            Cada categoria já vem pronta pra publicar. Clique numa aba e veja
            o que está incluído.
          </p>
          <span className="font-mono text-[0.8125rem] text-muted-foreground/70">
            8 categorias · {TOTAL_FEATURE_COUNT}+ recursos
          </span>
        </Reveal>

        <Reveal delay={0.05} className="flex min-w-0 flex-col gap-4">
          <div role="tablist" className="flex flex-wrap gap-2">
            {FEATURE_TABS.map((tab) => {
              const isActive = tab.key === activeKey;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveKey(tab.key)}
                  style={isActive ? { backgroundColor: tab.accent } : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-all duration-200",
                    isActive
                      ? "text-white shadow-sm"
                      : "border border-border/70 bg-card text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  <tab.icon className="size-3.5" strokeWidth={2} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <TabPanel key={activeTab.key} tab={activeTab} />
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
