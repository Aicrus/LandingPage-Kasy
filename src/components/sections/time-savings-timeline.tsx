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
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
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

const KASY_GREEN = "#22c55e";
const KASY_GREEN_STRONG = "#16a34a";
const PAIN_RED = "#f43f5e";

/**
 * Offset do eixo central — mobile: perto da borda direita · sm+: centralizado.
 * `-translate-x-1/2` centraliza qualquer elemento (linha, bolinha pequena, bolinha
 * grande) exatamente no mesmo x, não importa a largura de cada um — por isso fica
 * junto de `left-[...]` em vez de `right-[...]`, que alinharia só a borda.
 */
const SPINE_X_CLASS = "left-[calc(100%-1.375rem)] -translate-x-1/2 sm:left-1/2";
/** Espaço reservado pro eixo — mobile: uma coluna encostada à direita · sm+: metade da largura. Bem justo, pro conteúdo ficar perto da linha. */
const BRANCH_W_CLASS = "w-[calc(100%-2rem)] sm:w-[calc(50%-1.5rem)]";
/** Fração do scroll reservada só pra linha preenchendo, antes do primeiro item aparecer. */
const TIMELINE_RUNWAY = 0.04;
/**
 * Defasagem (em "itens") entre o card aparecer e a cor primária pintá-lo.
 * O card entra neutro primeiro; a cor só alcança ele um pouco depois, como se
 * estivesse "passando" por cada um conforme o scroll avança.
 */
const COLOR_CATCH_UP = 0.6;

function IconBubble({ icon: Icon, isColored }: { icon: LucideIcon; isColored: boolean }) {
  return (
    <span
      className={cn(
        "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
        isColored
          ? "border-transparent bg-primary/15 text-primary"
          : "border-border/70 bg-card text-muted-foreground/70",
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}

function TimelineItem({
  item,
  index,
  isVisible,
  isColored,
  reducedMotion,
}: {
  item: PainItem;
  index: number;
  isVisible: boolean;
  isColored: boolean;
  reducedMotion: boolean;
}) {
  /** Alternância só existe em telas sm+; no mobile tudo fica à esquerda do eixo. */
  const isLeft = index % 2 === 0;

  /**
   * Dispara um "pop" no título na primeira vez que a linha alcança o item —
   * um pulso rápido de escala, não um loop. Só acontece uma vez por item
   * (mesmo que o usuário suba e desça o scroll depois), pra não ficar
   * "piscando" toda hora que o scroll cruza o limiar de cor nos dois sentidos.
   */
  const hasPoppedRef = useRef(false);
  const [justActivated, setJustActivated] = useState(false);

  useEffect(() => {
    if (reducedMotion || hasPoppedRef.current || !isColored) return;
    hasPoppedRef.current = true;
    setJustActivated(true);
    const timeout = setTimeout(() => setJustActivated(false), 550);
    return () => clearTimeout(timeout);
  }, [isColored, reducedMotion]);

  return (
    <div
      className={cn(
        "relative pb-12 last:pb-0 sm:pb-20",
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        isVisible ? "opacity-100" : "pointer-events-none opacity-0",
        !isVisible && (isLeft ? "-translate-x-2 sm:translate-x-0 sm:-translate-y-2" : "translate-x-2 sm:translate-x-0 sm:-translate-y-2"),
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-[1.375rem] z-10 size-2.5 -translate-y-1/2 rounded-full border-2 transition-colors duration-500",
          SPINE_X_CLASS,
          isColored ? "border-primary bg-primary" : "border-border bg-background",
        )}
      />

      <div
        className={cn(
          BRANCH_W_CLASS,
          "text-left",
          isLeft ? "sm:mr-auto sm:text-left" : "sm:ml-auto sm:text-right",
        )}
      >
        <div className={cn("flex items-center gap-0", !isLeft && "sm:flex-row-reverse")}>
          <IconBubble icon={item.icon} isColored={isColored} />
          <span aria-hidden className="h-px flex-1 border-t border-dashed border-border" />
        </div>

        <div
          className={cn(
            "mt-3.5 flex flex-wrap items-center gap-2 sm:mt-4",
            !isLeft && "sm:justify-end",
          )}
        >
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-0.5 font-mono text-[0.75rem] font-semibold tabular-nums transition-colors duration-500",
              isColored ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            {item.hours === null ? "∞" : `${item.hours}h`}
          </span>
        </div>

        <motion.h3
          animate={{ scale: justActivated ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 16 }}
          className={cn(
            "mt-1.5 origin-left text-[0.9375rem] font-semibold transition-colors duration-500 sm:text-base",
            !isLeft && "sm:origin-right",
            isColored ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {item.title}
        </motion.h3>
        <p className="mt-1.5 text-pretty text-sm text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
}

function DigitalDaysPanel({
  label,
  sublabel,
  to,
  duration,
  tone,
  active,
  reducedMotion,
}: {
  label: string;
  sublabel: string;
  to: number;
  duration: number;
  tone: "pain" | "win";
  active: boolean;
  reducedMotion: boolean;
}) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(count, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    if (!active) return;

    if (reducedMotion) {
      count.set(to);
      return;
    }

    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [active, to, duration, reducedMotion, count]);

  const isWin = tone === "win";
  const accent = isWin ? KASY_GREEN : PAIN_RED;

  return (
    <div className="relative flex flex-1 flex-col items-center gap-1.5 overflow-hidden rounded-[1.75rem] bg-[#0b0d13] px-6 py-8 sm:py-10">
      <span className="font-mono text-[0.6875rem] font-semibold tracking-[0.18em] text-white/45 uppercase">
        {label}
      </span>
      <span
        className="font-mono text-[clamp(3.25rem,6vw+1.25rem,5.25rem)] leading-none font-bold tabular-nums"
        style={{
          color: accent,
          textShadow: `0 0 30px ${accent}66, 0 0 10px ${accent}aa`,
        }}
      >
        {String(display).padStart(2, "0")}
      </span>
      <span className="font-mono text-xs font-medium text-white/50">dias</span>
      <span className="mt-1 max-w-[14rem] text-center text-[0.8125rem] text-white/35">
        {sublabel}
      </span>
    </div>
  );
}

/** Número que sobe suavemente até o valor alvo, em vez de trocar seco — reforça a sensação de horas se acumulando. */
function AnimatedHours({ hours, reducedMotion }: { hours: number; reducedMotion: boolean }) {
  const count = useMotionValue(hours);
  const [display, setDisplay] = useState(hours);

  useMotionValueEvent(count, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    if (reducedMotion) {
      count.set(hours);
      return;
    }
    const controls = animate(count, hours, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [hours, reducedMotion, count]);

  return <span className="tabular-nums">{display}</span>;
}

export function TimeSavingsTimeline() {
  const reducedMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const finaleInView = useInView(finaleRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.4", "end 0.6"],
  });

  // Posição contínua do scroll, em "unidades de item" (0 = corredor, 1 = item 0
  // alcançado, 2 = item 1 alcançado, ...). Um card fica visível assim que a
  // linha chega nele; a cor primária só o alcança um pouco depois (COLOR_CATCH_UP).
  const [progressUnits, setProgressUnits] = useState(() =>
    reducedMotion ? PAIN_ITEMS.length : 0,
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reducedMotion) return;
    const clamped = Math.max(0, Math.min(1, latest));
    // Reserva os primeiros TIMELINE_RUNWAY do scroll só pra linha preenchendo,
    // antes do primeiro item aparecer — dá aquele respiro antes da economia começar.
    const pastRunway = Math.max(0, (clamped - TIMELINE_RUNWAY) / (1 - TIMELINE_RUNWAY));
    setProgressUnits(Math.min(1, pastRunway) * PAIN_ITEMS.length);
  });

  const coloredCount = Math.max(
    0,
    Math.min(PAIN_ITEMS.length, Math.floor(progressUnits - COLOR_CATCH_UP) + 1),
  );

  const runningTotal = PAIN_ITEMS.slice(0, coloredCount).reduce(
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

      <div ref={timelineRef} className="relative w-full max-w-2xl sm:max-w-3xl">
        <span
          aria-hidden
          className={cn(
            SPINE_X_CLASS,
            "absolute top-0 z-10 size-3.5 -translate-y-1/2 rounded-full border-2 border-border bg-background",
          )}
        />
        <div aria-hidden className={cn(SPINE_X_CLASS, "absolute top-0 bottom-0 w-0.5 bg-white dark:bg-black")} />
        <motion.div
          aria-hidden
          className={cn(SPINE_X_CLASS, "absolute top-0 bottom-0 w-0.5 origin-top bg-primary")}
          style={reducedMotion ? { scaleY: 1 } : { scaleY: scrollYProgress }}
        />
        <span
          aria-hidden
          className={cn(
            SPINE_X_CLASS,
            "absolute bottom-0 z-10 size-3.5 translate-y-1/2 rounded-full border-2 border-border bg-background",
          )}
        />

        <div className="flex flex-col pt-6 pb-2">
          {/* Corredor — só a linha preenchendo antes do primeiro item aparecer. */}
          <div aria-hidden className="h-8 sm:h-10" />

          {PAIN_ITEMS.map((item, index) => (
            <TimelineItem
              key={item.title}
              item={item}
              index={index}
              isVisible={progressUnits > index}
              isColored={progressUnits > index + COLOR_CATCH_UP}
              reducedMotion={!!reducedMotion}
            />
          ))}
        </div>
      </div>

      <Reveal
        className={cn(
          "mt-2 flex w-full max-w-2xl flex-col items-center gap-2 border-t border-border/60 pt-7 text-center",
          "sm:mt-4 sm:pt-9",
        )}
      >
        <div className="flex items-center gap-2 font-mono text-[0.8125rem] text-muted-foreground">
          <Equal className="size-4" strokeWidth={2} />
          <span>
            <AnimatedHours hours={runningTotal} reducedMotion={!!reducedMotion} />h conhecidas{" "}
            <span className="text-muted-foreground/60">+ o que ninguém prevê</span>
          </span>
        </div>
        <p className="font-heading text-[clamp(1.375rem,1rem+1.2vw,1.875rem)] font-bold text-foreground">
          2+ meses de dor de cabeça
        </p>
        <p
          className="font-heading text-[clamp(1.375rem,1rem+1.2vw,1.875rem)] font-bold"
          style={{ color: KASY_GREEN_STRONG }}
        >
          Com o Kasy: 7 dias. Dor de cabeça: 0.
        </p>
      </Reveal>

      <div
        ref={finaleRef}
        className="relative mt-10 flex w-full max-w-2xl flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-4"
      >
        <DigitalDaysPanel
          label="Sem o Kasy"
          sublabel="pesquisa, tentativa e erro"
          to={62}
          duration={2.4}
          tone="pain"
          active={finaleInView}
          reducedMotion={!!reducedMotion}
        />

        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 left-1/2 z-20 hidden size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:flex",
            "border border-border/70 bg-card text-[0.6875rem] font-semibold text-muted-foreground shadow-sm",
          )}
        >
          vs
        </span>

        <DigitalDaysPanel
          label="Com o Kasy"
          sublabel="do zero à loja, sem dor de cabeça"
          to={7}
          duration={0.9}
          tone="win"
          active={finaleInView}
          reducedMotion={!!reducedMotion}
        />
      </div>
    </section>
  );
}
