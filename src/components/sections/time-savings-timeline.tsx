"use client";

import {
  BellRing,
  Blocks,
  Brain,
  CreditCard,
  Equal,
  LayoutTemplate,
  LogIn,
  Moon,
  Rocket,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import {
  animate,
  fadeInUp,
  motion,
  staggerContainer,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type PainItem = {
  icon: LucideIcon;
  /** Horas conservadoras; `null` = tarefa sem teto (∞). */
  hours: number | null;
  title: string;
  description: string;
};

const PAIN_ITEMS: PainItem[] = [
  {
    icon: LogIn,
    hours: 8,
    title: "Login Google, Apple & Facebook",
    description:
      "Fluxos de autenticação nativos, tokens seguros e SDKs configurados nas três plataformas.",
  },
  {
    icon: CreditCard,
    hours: 15,
    title: "Assinaturas: iOS, Android & Web",
    description:
      "RevenueCat, App Store, Play Store e Stripe Web sincronizados, com paywall e restauração de compra.",
  },
  {
    icon: BellRing,
    hours: 10,
    title: "Push notifications & deep links",
    description:
      "Firebase Cloud Messaging, permissões e links que abrem a tela certa dentro do app.",
  },
  {
    icon: ShieldCheck,
    hours: 8,
    title: "Regras de banco de dados & segurança",
    description:
      "Regras de acesso e validação revisadas com calma, sem abrir brecha de segurança.",
  },
  {
    icon: Moon,
    hours: 6,
    title: "Modo escuro & sistema de temas",
    description:
      "Paleta clara e escura com troca automática conforme o sistema do usuário.",
  },
  {
    icon: LayoutTemplate,
    hours: 4,
    title: "Telas de onboarding",
    description:
      "Sequência de boas-vindas com indicadores de progresso e transições suaves.",
  },
  {
    icon: Rocket,
    hours: 6,
    title: "Configuração App Store & Play Store",
    description:
      "Certificados, ícones e metadados prontos para o primeiro envio às duas lojas.",
  },
  {
    icon: Blocks,
    hours: null,
    title: "60+ componentes pixel-perfect (95+ variantes)",
    description:
      "Botões, inputs, cards e modais construídos do zero e testados em cada tamanho de tela.",
  },
  {
    icon: Brain,
    hours: null,
    title: "Pensando demais...",
    description:
      "Decisão de arquitetura, pesquisa de bibliotecas e o eterno “será que existe um jeito melhor?”",
  },
];

const KASY_GREEN_STRONG = "#16a34a";
const PAIN_RED = "#e11d48";

const CARD_SHADOW_CLASS = cn(
  "shadow-[0_1px_2px_rgba(26,30,44,0.04),0_6px_16px_-10px_rgba(26,30,44,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

function PainCard({ item }: { item: PainItem }) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        "flex flex-col gap-3.5 rounded-2xl border border-border/70 bg-card p-5",
        CARD_SHADOW_CLASS,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <item.icon className="size-5" strokeWidth={1.75} />
        </span>
        <span className="shrink-0 rounded-md bg-rose-500/10 px-2 py-0.5 font-mono text-[0.75rem] font-semibold tabular-nums text-rose-600 dark:text-rose-400">
          {item.hours === null ? "∞" : `${item.hours}h`}
        </span>
      </div>
      <div>
        <h3 className="text-[0.9375rem] font-semibold text-foreground">
          {item.title}
        </h3>
        <p className="mt-1 text-pretty text-sm text-muted-foreground">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

/** Número que sobe suavemente até o valor alvo quando entra em vista, em vez de trocar seco. */
function CountUp({
  value,
  active,
  duration = 1,
  delay = 0,
  reducedMotion,
  className,
}: {
  value: number;
  active: boolean;
  duration?: number;
  delay?: number;
  reducedMotion: boolean;
  className?: string;
}) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(count, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    if (!active) return;
    if (reducedMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [active, value, duration, delay, reducedMotion, count]);

  return (
    <span className={cn("tabular-nums", className)}>{display}</span>
  );
}

function ComparisonRow({
  label,
  sublabel,
  days,
  maxDays,
  tone,
  active,
  delay = 0,
  reducedMotion,
}: {
  label: string;
  sublabel: string;
  days: number;
  maxDays: number;
  tone: "pain" | "win";
  active: boolean;
  delay?: number;
  reducedMotion: boolean;
}) {
  const isWin = tone === "win";
  const accent = isWin ? KASY_GREEN_STRONG : PAIN_RED;
  const pct = Math.round((days / maxDays) * 100);
  const scaleX = useMotionValue(0);

  useEffect(() => {
    if (!active) return;
    if (reducedMotion) {
      scaleX.set(1);
      return;
    }
    const controls = animate(scaleX, 1, {
      duration: 1,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [active, delay, reducedMotion, scaleX]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <span
          className="font-heading text-2xl font-bold tabular-nums sm:text-[1.75rem]"
          style={{ color: accent }}
        >
          <CountUp
            value={days}
            active={active}
            delay={delay}
            reducedMotion={reducedMotion}
          />{" "}
          <span className="text-sm font-medium text-muted-foreground">
            dias
          </span>
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full origin-left rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: accent,
            scaleX: reducedMotion ? 1 : scaleX,
          }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{sublabel}</span>
    </div>
  );
}

export function TimeSavingsTimeline() {
  const reducedMotion = !!useReducedMotion();

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  const comparisonRef = useRef<HTMLDivElement>(null);
  const comparisonInView = useInView(comparisonRef, {
    once: true,
    margin: "-80px",
  });

  const totalKnownHours = PAIN_ITEMS.reduce(
    (sum, item) => sum + (item.hours ?? 0),
    0,
  );

  return (
    <section
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <Reveal
        className={cn(
          "flex w-full flex-col items-center text-center",
          "gap-[clamp(0.75rem,1vw+0.25rem,1.125rem)]",
          "mb-[clamp(2.5rem,4.5vw,3.5rem)] px-[clamp(1.25rem,4vw,3.5rem)]",
        )}
      >
        <h2
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
            "leading-[1.12] tracking-[-0.02em]",
          )}
        >
          2+ meses de dor de cabeça. Ou{" "}
          <span className="text-[#16a34a] dark:text-[#4ade80]">7 dias.</span>
        </h2>
        <p className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          Horas reais e conservadoras para um dev experiente. Mobile é mais
          difícil que web.
        </p>
      </Reveal>

      <Reveal
        variants={staggerContainer}
        className={cn(
          "grid w-full max-w-5xl grid-cols-1 gap-3",
          "sm:grid-cols-2 sm:gap-3.5",
          "lg:grid-cols-3",
        )}
      >
        {PAIN_ITEMS.map((item) => (
          <PainCard key={item.title} item={item} />
        ))}
      </Reveal>

      <div
        ref={statsRef}
        className="mt-8 flex items-center gap-2 font-mono text-[0.8125rem] text-muted-foreground sm:mt-10"
      >
        <Equal className="size-4" strokeWidth={2} />
        <span>
          <CountUp
            value={totalKnownHours}
            active={statsInView}
            reducedMotion={reducedMotion}
          />
          h conhecidas{" "}
          <span className="text-muted-foreground/60">
            + o que ninguém prevê
          </span>
        </span>
      </div>

      <Reveal
        className="mt-8 w-full max-w-xl sm:mt-10"
        transition={{ delay: 0.05 }}
      >
        <div
          ref={comparisonRef}
          className={cn(
            "rounded-2xl border border-border/70 bg-card p-6 sm:p-8",
            CARD_SHADOW_CLASS,
          )}
        >
          <div className="flex flex-col gap-6">
            <ComparisonRow
              label="Sem o Kasy"
              sublabel="pesquisa, tentativa e erro"
              days={62}
              maxDays={62}
              tone="pain"
              active={comparisonInView}
              reducedMotion={reducedMotion}
            />
            <ComparisonRow
              label="Com o Kasy"
              sublabel="do zero à loja, sem dor de cabeça"
              days={7}
              maxDays={62}
              tone="win"
              active={comparisonInView}
              delay={0.35}
              reducedMotion={reducedMotion}
            />
          </div>
          <p
            className="mt-7 text-center font-heading text-[clamp(1.125rem,0.9rem+0.8vw,1.375rem)] font-bold"
            style={{ color: KASY_GREEN_STRONG }}
          >
            Com o Kasy: 7 dias. Dor de cabeça: 0.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
