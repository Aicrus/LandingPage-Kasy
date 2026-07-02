"use client";

import {
  Bell,
  CreditCard,
  KeyRound,
  LayoutGrid,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { AnimatePresence, fadeIn, motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { BrandTile } from "./brand-icons";

type TaglineCopy = {
  emphasis: string;
  rest?: string;
};

type FeatureBullet = {
  label: string;
  detail?: string;
};

type FeatureTab = {
  key: string;
  icon: LucideIcon;
  label: string;
  /** Cor de assinatura da categoria — cada aba tem a sua, não um azul genérico repetido. */
  accent: string;
  tagline: TaglineCopy;
  /** `null` = sem número fixo (ex.: categoria "Mais", que é uma mistura). */
  saved: string | null;
  providers: string[];
  bullets?: FeatureBullet[];
  moreItems?: { label: string; desc: string }[];
};

const FEATURE_TABS: FeatureTab[] = [
  {
    key: "auth",
    icon: KeyRound,
    label: "Autenticação",
    accent: "#2563eb",
    tagline: {
      emphasis: "Todo método de login",
      rest: ", configurado e pronto.",
    },
    saved: "12h",
    providers: ["Google", "Apple", "Facebook"],
    bullets: [
      { label: "Login com Google", detail: "iOS + Android + Web" },
      { label: "Login com Apple", detail: "iOS + Android + Web" },
      { label: "Login com Facebook", detail: "iOS + Android + Web" },
      { label: "Email e senha" },
      { label: "Telefone", detail: "SMS OTP" },
      {
        label: "Auth anônimo com vinculação de conta",
        detail: "sem perder dados",
      },
      { label: "Recuperação de senha" },
    ],
  },
  {
    key: "subs",
    icon: CreditCard,
    label: "Assinaturas",
    accent: "#7c3aed",
    tagline: {
      emphasis: "Monetize desde o dia um",
      rest: " com RevenueCat e Stripe.",
    },
    saved: "15h",
    providers: ["RevenueCat", "Stripe"],
    bullets: [
      { label: "Integração RevenueCat", detail: "iOS + Android + Web" },
      {
        label: "4 estilos de paywall",
        detail: "Minimal, Grid, Row, Toggle",
      },
      { label: "Tabela comparativa", detail: "componente incluído" },
      {
        label: "Testes A/B via RevenueCat Experiments",
        detail: "sem rebuild",
      },
      {
        label: "Estado da assinatura em tempo real",
        detail: "sincronizado via webhook",
      },
      { label: "Troque o paywall pelo dashboard", detail: "sem rebuild" },
      {
        label: "Guard de paywall",
        detail: "redireciona conteúdo premium",
      },
      { label: "Suporte a trial gratuito" },
    ],
  },
  {
    key: "notif",
    icon: Bell,
    label: "Notificações",
    accent: "#f59e0b",
    tagline: {
      emphasis: "Push, in-app",
      rest: " e lembretes locais.",
    },
    saved: "10h",
    providers: ["iOS", "Android"],
    bullets: [
      { label: "Push via Firebase Cloud Messaging", detail: "FCM" },
      {
        label: "Lista de notificações in-app",
        detail: "com timestamps",
      },
      { label: "Contador de badge", detail: "não lidas" },
      {
        label: "Deep link",
        detail: "toque na notificação, abre a tela certa",
      },
      {
        label: "Gerenciamento de tokens",
        detail: "dispositivo e limpeza",
      },
      { label: "Cloud Function", detail: "entrega via webhook" },
      {
        label: "Lembretes locais",
        detail: "diários, semanais ou únicos, sem servidor",
      },
    ],
  },
  {
    key: "ui",
    icon: LayoutGrid,
    label: "Componentes",
    accent: "#059669",
    tagline: {
      emphasis: "60+ componentes, 95+ variantes",
      rest: ", totalmente customizáveis.",
    },
    saved: "semanas",
    providers: ["iOS", "Android", "Web"],
    bullets: [
      {
        label: "60+ componentes prontos para produção",
        detail: "95+ variantes",
      },
      { label: "Testados em iOS, Android e Web" },
      {
        label: "Modo escuro e claro",
        detail: "automático ou trocado pelo usuário",
      },
      {
        label: "Biblioteca completa",
        detail:
          "Accordion, Alert, AppBar, Avatar, Badge, BottomSheet, Button, Card, Checkbox, Chip, Dialog, Input, OTP, Skeleton, Sidebar, SwipeAction, TextArea, TextField, Toast",
      },
      { label: "Animações customizadas", detail: "transições de rota" },
      { label: "Feedback háptico integrado" },
      {
        label: "Galeria no navegador",
        detail: "copie qualquer nome pra IA",
      },
    ],
  },
  {
    key: "sec",
    icon: ShieldCheck,
    label: "Segurança",
    accent: "#0d9488",
    tagline: {
      emphasis: "Regras de nível produção",
      rest: ", sem surpresas.",
    },
    saved: "8h",
    providers: ["Firebase", "Supabase", "REST API"],
    bullets: [
      {
        label: "Regras de segurança Firestore",
        detail: "prontas para produção",
      },
      {
        label: "Row Level Security (Supabase)",
        detail: "pronto para produção",
      },
      {
        label: "Regras de Firebase Storage",
        detail: "isolamento por usuário",
      },
      {
        label: "Permissões App Store e Play Store",
        detail: "tratadas, sem rejeição",
      },
      {
        label: "Dart-defines",
        detail: "separam dev de produção, sem segredo no código",
      },
    ],
  },
  {
    key: "widget",
    icon: Smartphone,
    label: "Widget nativo",
    accent: "#db2777",
    tagline: {
      emphasis: "Widgets nativos na tela inicial",
      rest: ", sincronizados.",
    },
    saved: "6h",
    providers: ["iOS", "Android"],
    bullets: [
      { label: "Widget de tela inicial", detail: "iOS e Android" },
      { label: "Atualização automática", detail: "em segundo plano" },
      {
        label: "Sincroniza com o estado do app",
        detail: "assinatura, dados do usuário",
      },
      { label: "Configurável", detail: "pelo painel admin do app" },
      {
        label: "Suporte a App Groups (iOS)",
        detail: "compartilha dados com a extensão",
      },
    ],
  },
  {
    key: "ai",
    icon: MessageSquare,
    label: "Chat com IA",
    accent: "#9333ea",
    tagline: {
      emphasis: "Chat integrado",
      rest: " com OpenAI ou Gemini.",
    },
    saved: "8h",
    providers: ["Firebase", "Supabase", "REST API"],
    bullets: [
      {
        label: "Interface de chat",
        detail: "OpenAI ou Google Gemini",
      },
      {
        label: "Histórico de conversas",
        detail: "contexto completo",
      },
      { label: "API key no servidor", detail: "nunca no app" },
      {
        label: "Proxy seguro",
        detail: "Cloud Function (Firebase) ou Edge Function (Supabase)",
      },
      {
        label: "UI completa",
        detail: "balões, loading, input de envio",
      },
    ],
  },
  {
    key: "more",
    icon: PlusCircle,
    label: "Mais",
    accent: "#64748b",
    tagline: {
      emphasis: "Todo o resto.",
      rest: " Nenhum recurso fica de fora.",
    },
    saved: null,
    providers: ["Firebase", "Supabase", "REST API"],
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

function TabTagline({ copy }: { copy: TaglineCopy }) {
  return (
    <p className="text-pretty text-[0.9375rem] leading-snug text-muted-foreground">
      <span className="font-bold text-inherit">{copy.emphasis}</span>
      {copy.rest}
    </p>
  );
}

function FeatureBulletText({ bullet }: { bullet: FeatureBullet }) {
  if (!bullet.detail) {
    return <span className="font-bold text-inherit">{bullet.label}</span>;
  }

  return (
    <>
      <span className="font-bold text-inherit">{bullet.label}</span>
      <span className="text-muted-foreground">, {bullet.detail}</span>
    </>
  );
}

function TabPanelCard({
  tab,
  fillHeight = false,
}: {
  tab: FeatureTab;
  fillHeight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-5 sm:p-6",
        CARD_SHADOW_CLASS,
        fillHeight && "min-h-full",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <TabTagline copy={tab.tagline} />
          <div
            className={cn(
              "mt-2.5 flex flex-nowrap items-center gap-1.5 overflow-x-auto",
              "max-sm:-mx-0.5 max-sm:px-0.5",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {tab.providers.map((name) => (
              <motion.span
                key={name}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-muted/70 py-0.5 pr-2.5 pl-0.5 text-[0.6875rem] font-medium text-muted-foreground"
              >
                <BrandTile name={name} size="size-5" iconSize={11} />
                {name}
              </motion.span>
            ))}
          </div>
        </div>
        {tab.saved ? (
          <span className="w-fit shrink-0 rounded-md bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {savedLabel(tab.saved)}
          </span>
        ) : tab.moreItems ? (
          <span className="w-fit shrink-0 rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
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
                <p className="text-sm font-bold text-foreground">{item.label}</p>
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
                key={`${bullet.label}-${bullet.detail ?? ""}`}
                className="group -mx-2 flex items-start gap-3 rounded-lg border-b border-border/50 px-2 py-3 text-sm text-foreground/90 transition-colors duration-200 last:border-b-0 hover:bg-muted/50"
              >
                <span
                  aria-hidden
                  className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-foreground/30 transition-colors duration-200 group-hover:bg-foreground/50"
                />
                <FeatureBulletText bullet={bullet} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TabPanel({ tab }: { tab: FeatureTab }) {
  return (
    <motion.div
      role="tabpanel"
      id={`what-you-get-panel-${tab.key}`}
      aria-labelledby={`what-you-get-tab-${tab.key}`}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
      className="min-h-full"
    >
      <TabPanelCard tab={tab} fillHeight />
    </motion.div>
  );
}

function tabListMaskStyle(edgeFade: { left: boolean; right: boolean }) {
  const fade = "2.75rem";

  if (!edgeFade.left && !edgeFade.right) return undefined;

  const gradient = (() => {
    if (edgeFade.left && edgeFade.right) {
      return `linear-gradient(to right, transparent, black ${fade}, black calc(100% - ${fade}), transparent)`;
    }
    if (edgeFade.right) {
      return `linear-gradient(to right, black calc(100% - ${fade}), transparent)`;
    }
    return `linear-gradient(to right, transparent, black ${fade})`;
  })();

  return {
    maskImage: gradient,
    WebkitMaskImage: gradient,
  } as const;
}

export function WhatYouGet() {
  const [activeKey, setActiveKey] = useState(FEATURE_TABS[0].key);
  const [edgeFade, setEdgeFade] = useState({ left: false, right: false });
  const [panelMinHeight, setPanelMinHeight] = useState<number>();
  const tabListRef = useRef<HTMLDivElement>(null);
  const panelShellRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const measurePanelRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const activeTab =
    FEATURE_TABS.find((tab) => tab.key === activeKey) ?? FEATURE_TABS[0];

  const measurePanelHeights = useCallback(() => {
    let max = 0;

    measurePanelRefs.current.forEach((panel) => {
      max = Math.max(max, panel.offsetHeight);
    });

    if (max > 0) {
      setPanelMinHeight(Math.ceil(max));
    }
  }, []);

  useLayoutEffect(() => {
    measurePanelHeights();
  }, [measurePanelHeights]);

  useEffect(() => {
    const shell = panelShellRef.current;
    if (!shell) return;

    const resizeObserver = new ResizeObserver(measurePanelHeights);
    resizeObserver.observe(shell);

    measurePanelRefs.current.forEach((panel) => {
      resizeObserver.observe(panel);
    });

    document.fonts?.ready.then(measurePanelHeights);

    return () => resizeObserver.disconnect();
  }, [measurePanelHeights]);

  const updateEdgeFade = useCallback(() => {
    const el = tabListRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 1) {
      setEdgeFade({ left: false, right: false });
      return;
    }

    const tolerance = 4;
    setEdgeFade({
      left: el.scrollLeft > tolerance,
      right: el.scrollLeft < maxScroll - tolerance,
    });
  }, []);

  const scrollActiveTabIntoView = useCallback(
    (key: string, behavior: ScrollBehavior = "smooth") => {
      const list = tabListRef.current;
      const button = tabButtonRefs.current.get(key);
      if (!list || !button) return;

      const listRect = list.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const delta =
        buttonRect.left +
        buttonRect.width / 2 -
        (listRect.left + listRect.width / 2);

      if (Math.abs(delta) < 1) {
        updateEdgeFade();
        return;
      }

      list.scrollBy({ left: delta, behavior });

      if (behavior === "smooth") {
        window.setTimeout(updateEdgeFade, 320);
      } else {
        updateEdgeFade();
      }
    },
    [updateEdgeFade],
  );

  useEffect(() => {
    const el = tabListRef.current;
    if (!el) return;

    updateEdgeFade();

    el.addEventListener("scroll", updateEdgeFade, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdgeFade);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateEdgeFade);
      resizeObserver.disconnect();
    };
  }, [updateEdgeFade]);

  useEffect(() => {
    scrollActiveTabIntoView(activeKey);
  }, [activeKey, scrollActiveTabIntoView]);

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
        <Reveal className="flex flex-col gap-3.5">
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
            <span className="text-primary">Nada além.</span>
          </h2>
          <p className="text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
            Cada categoria já vem{" "}
            <span className="text-copy-emphasis">pronta pra publicar</span>.
            Clique numa aba e{" "}
            <span className="text-copy-mark">veja o que está incluído</span>.
          </p>
          <span className="font-mono text-[0.8125rem] text-muted-foreground/70">
            8 categorias · {TOTAL_FEATURE_COUNT}+ recursos
          </span>
        </Reveal>

        <Reveal delay={0.05} className="flex min-w-0 flex-col gap-4">
          <div
            className={cn(
              "relative",
              "max-sm:-mx-[clamp(1rem,3.25vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
            )}
          >
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Categorias de recursos"
              style={tabListMaskStyle(edgeFade)}
              className={cn(
                "flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain touch-pan-x pb-0.5",
                "transition-[mask-image,-webkit-mask-image] duration-300",
                "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              )}
            >
              {FEATURE_TABS.map((tab) => {
                const isActive = tab.key === activeKey;
                return (
                  <button
                    key={tab.key}
                    ref={(node) => {
                      if (node) tabButtonRefs.current.set(tab.key, node);
                      else tabButtonRefs.current.delete(tab.key);
                    }}
                    id={`what-you-get-tab-${tab.key}`}
                    aria-controls={`what-you-get-panel-${tab.key}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={(event) => {
                      setActiveKey(tab.key);
                      event.currentTarget.focus({ preventScroll: true });
                    }}
                    style={
                      isActive ? { backgroundColor: tab.accent } : undefined
                    }
                    className={cn(
                      "inline-flex shrink-0 scroll-mx-4 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap transition-all duration-200",
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
          </div>

          <div
            ref={panelShellRef}
            className="relative"
            style={panelMinHeight ? { minHeight: panelMinHeight } : undefined}
          >
            <div aria-hidden className="pointer-events-none invisible absolute inset-x-0 top-0 -z-10">
              {FEATURE_TABS.map((tab) => (
                <div
                  key={tab.key}
                  ref={(node) => {
                    if (node) measurePanelRefs.current.set(tab.key, node);
                    else measurePanelRefs.current.delete(tab.key);
                  }}
                  className="absolute inset-x-0 top-0"
                >
                  <TabPanelCard tab={tab} />
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <TabPanel key={activeTab.key} tab={activeTab} />
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
