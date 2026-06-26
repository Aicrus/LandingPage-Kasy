"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { FolderBack, FolderFront } from "@/components/folder/folder-graphics";
import { BRAND_LOGOS, type BrandId } from "@/components/logos/brand-logos";
import { HeroIntro } from "@/components/sections/hero-intro";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "@/lib/motion";

/* ----------------------------------------------------------------------------
 * Scroll contínuo — um único progresso (0→1) amarra TUDO:
 *   • descida do cluster (anchor)
 *   • convergência de cada ícone (spread → pasta)
 *
 * Sem pin, sem spring, sem “hold” no meio. Posição = f(scroll) — rápido ou
 * devagar, o ícone está sempre no lugar certo da jornada.
 * -------------------------------------------------------------------------- */
const STAGE_W = 700;
const STAGE_H = 560;
const CARD = 116;
const FOLDER_W = 300;
const FOLDER_H = 212;
const FOLDER_LEFT = (STAGE_W - FOLDER_W) / 2;
const FOLDER_TOP = STAGE_H - FOLDER_H - 18;
const ANCHOR_X = STAGE_W / 2;
const ANCHOR_Y = FOLDER_TOP + 24;
const CARD_COUNT = 11;
/** Fração da jornada do card em que o desfoque some (ease-out). */
const BLUR_FADE_PORTION = 0.42;
/**
 * Convergência tardia — mantém o spread quase até a pasta.
 * t^n com n>1: todos continuam descendo com o scroll; o colapso
 * visual só acelera no trecho final.
 */
const CONVERGE_LATE_POWER = 4.25;

const STAGE_SCALE =
  "scale-[0.46] sm:scale-[0.56] md:scale-[0.66] lg:scale-[0.74] xl:scale-[0.8]";

type Breakpoint = "mobile" | "tablet" | "desktop";

type MotionConfig = {
  /** Altura total da seção — define quanto scroll físico = jornada completa. */
  sectionVh: number;
  /** Onde a pasta mora no documento (vh). */
  folderVh: number;
  /** Onde o cluster de ícones começa (vh). */
  anchorStartVh: number;
  /**
   * Fração do progresso (0–1) em que os cards distantes “lideram” a convergência.
   * Todos terminam juntos em progress = 1.
   */
  cardLeadSpread: number;
};

const MOTION_CONFIG: Record<Breakpoint, MotionConfig> = {
  mobile: {
    sectionVh: 420,
    folderVh: 298,
    anchorStartVh: 52,
    cardLeadSpread: 0.075,
  },
  tablet: {
    sectionVh: 450,
    folderVh: 308,
    anchorStartVh: 54,
    cardLeadSpread: 0.068,
  },
  desktop: {
    sectionVh: 480,
    folderVh: 316,
    anchorStartVh: 56,
    cardLeadSpread: 0.06,
  },
};

function useMotionBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const tablet = window.matchMedia("(min-width: 768px)");
    const desktop = window.matchMedia("(min-width: 1024px)");

    const sync = () => {
      if (desktop.matches) setBp("desktop");
      else if (tablet.matches) setBp("tablet");
      else setBp("mobile");
    };

    sync();
    tablet.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    return () => {
      tablet.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, []);

  return bp;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Progresso individual do card: 0 no início da jornada, 1 na pasta. */
function cardProgress(
  journey: number,
  order: number,
  leadSpread: number,
): number {
  const start = (order / (CARD_COUNT - 1)) * leadSpread;
  const span = 1 - leadSpread;
  if (span <= 0) return journey;
  return Math.max(0, Math.min(1, (journey - start) / span));
}

/** Remapeia o progresso linear → fator de colapso (spread → pasta). */
function convergeFactor(t: number): number {
  return Math.pow(t, CONVERGE_LATE_POWER);
}

type Peek = { x: number; y: number; r: number };

type CardSpec = {
  key: string;
  id: BrandId;
  x: number;
  y: number;
  r: number;
  scale: number;
  depth: number;
  order: number;
  peek?: Peek;
};

const CARDS: CardSpec[] = [
  {
    key: "l1",
    id: "google",
    x: -781,
    y: -313,
    r: -7,
    scale: 0.88,
    depth: 1,
    order: 0,
  },
  {
    key: "r1",
    id: "openai",
    x: 781,
    y: -313,
    r: 7,
    scale: 0.88,
    depth: 1,
    order: 1,
  },
  {
    key: "tl",
    id: "stripe",
    x: -681,
    y: -538,
    r: -9,
    scale: 0.9,
    depth: 0.8,
    order: 2,
  },
  {
    key: "tr",
    id: "apple",
    x: 681,
    y: -538,
    r: 9,
    scale: 0.9,
    depth: 0.8,
    order: 3,
  },
  {
    key: "l2",
    id: "supabase",
    x: -606,
    y: -88,
    r: -5,
    scale: 0.95,
    depth: 0.55,
    order: 4,
  },
  {
    key: "r2",
    id: "firebase",
    x: 606,
    y: -88,
    r: 5,
    scale: 0.95,
    depth: 0.55,
    order: 5,
  },
  {
    key: "b1",
    id: "openai",
    x: -200,
    y: 87,
    r: -6,
    scale: 0.94,
    depth: 0.3,
    order: 6,
    peek: { x: -92, y: 40, r: -7 },
  },
  {
    key: "b2",
    id: "apple",
    x: 200,
    y: 87,
    r: 6,
    scale: 0.94,
    depth: 0.3,
    order: 7,
    peek: { x: 96, y: 30, r: 8 },
  },
  {
    key: "b3",
    id: "google",
    x: 0,
    y: 50,
    r: 3,
    scale: 0.96,
    depth: 0.18,
    order: 8,
    peek: { x: 2, y: 54, r: 2 },
  },
  {
    key: "c1",
    id: "flutter",
    x: -181,
    y: -38,
    r: -2,
    scale: 1.02,
    depth: 0,
    order: 9,
  },
  {
    key: "c2",
    id: "github",
    x: 181,
    y: -38,
    r: 3,
    scale: 1,
    depth: 0.08,
    order: 10,
  },
];

function FolderStage({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex justify-center ${className ?? ""}`}>
      <div
        className={`relative origin-bottom ${STAGE_SCALE}`}
        style={{ width: STAGE_W, height: STAGE_H }}
      >
        {children}
      </div>
    </div>
  );
}

export function SetupFolder() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const breakpoint = useMotionBreakpoint();
  const config = MOTION_CONFIG[breakpoint];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Jornada = scroll, 1:1 — descida e convergência compartilham o mesmo relógio.
  const anchorTop = useTransform(scrollYProgress, (j) => {
    const vh = lerp(config.anchorStartVh, config.folderVh, j);
    return `${vh}vh`;
  });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${config.sectionVh}vh` }}
    >
      <div className="relative z-20 flex min-h-screen flex-col items-center px-page-x pt-[calc(var(--spacing-hero-inset-top)+var(--header-height-mobile))] sm:pt-hero-inset-top">
        <HeroIntro />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 z-10"
        style={{ top: `${config.folderVh}vh` }}
      >
        <FolderStage>
          <div
            aria-hidden
            className="absolute rounded-[50%] bg-[#c98b5e]/25 blur-2xl"
            style={{
              left: FOLDER_LEFT + 10,
              top: FOLDER_TOP + FOLDER_H - 26,
              width: FOLDER_W - 20,
              height: 60,
            }}
          />
          <div
            className="absolute"
            style={{
              left: FOLDER_LEFT,
              top: FOLDER_TOP,
              width: FOLDER_W,
              height: FOLDER_H,
            }}
          >
            <FolderBack className="h-full w-full" />
          </div>
        </FolderStage>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 z-20"
        style={reduced ? { top: `${config.folderVh}vh` } : { top: anchorTop }}
      >
        <FolderStage>
          {CARDS.map((c) => (
            <FolderCard
              key={c.key}
              spec={c}
              journey={scrollYProgress}
              leadSpread={config.cardLeadSpread}
              reduced={!!reduced}
            />
          ))}
        </FolderStage>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 z-30"
        style={{ top: `${config.folderVh}vh` }}
      >
        <FolderStage>
          <div
            className="absolute"
            style={{
              left: FOLDER_LEFT,
              top: FOLDER_TOP,
              width: FOLDER_W,
              height: FOLDER_H,
            }}
          >
            <FolderFront className="absolute inset-0 h-full w-full" />
            <span
              className="absolute inset-x-0 bottom-[14%] text-center font-rounded text-[15px] font-semibold tracking-wide text-[#9c6a45]"
              style={{ textShadow: "0 1px 0 rgba(255,255,255,0.35)" }}
            >
              Seu projeto
            </span>
          </div>
        </FolderStage>
      </div>
    </section>
  );
}

function FolderCard({
  spec,
  journey,
  leadSpread,
  reduced,
}: {
  spec: CardSpec;
  journey: MotionValue<number>;
  leadSpread: number;
  reduced: boolean;
}) {
  const logo = BRAND_LOGOS[spec.id];

  const packedX = spec.peek ? spec.peek.x : spec.x * 0.05;
  const packedY = spec.peek ? spec.peek.y : 122;
  const packedScale = spec.peek ? 0.66 : 0.46;
  const packedR = spec.peek ? spec.peek.r : 0;

  const x = useTransform(journey, (j) => {
    const t = convergeFactor(cardProgress(j, spec.order, leadSpread));
    return lerp(spec.x, packedX, t);
  });
  const y = useTransform(journey, (j) => {
    const t = convergeFactor(cardProgress(j, spec.order, leadSpread));
    return lerp(spec.y, packedY, t);
  });
  const scale = useTransform(journey, (j) => {
    const t = convergeFactor(cardProgress(j, spec.order, leadSpread));
    return lerp(spec.scale, packedScale, t);
  });
  const rotate = useTransform(journey, (j) => {
    const t = convergeFactor(cardProgress(j, spec.order, leadSpread));
    return lerp(spec.r, packedR, t);
  });

  const staticBlur = spec.depth > 0.35 ? 8 : spec.depth > 0.12 ? 4 : 0;

  const filter = useTransform(journey, (j) => {
    if (staticBlur === 0) return "none";
    const t = cardProgress(j, spec.order, leadSpread);
    const fadeT = Math.min(1, t / BLUR_FADE_PORTION);
    const eased = fadeT * (2 - fadeT);
    const blurPx = staticBlur * (1 - eased);
    return blurPx < 0.05 ? "none" : `blur(${blurPx}px)`;
  });

  const card = (
    <div className="flex h-full w-full items-center justify-center rounded-[26px] border border-black/[0.06] bg-white shadow-[0_18px_44px_-20px_rgba(20,24,44,0.32)] dark:border-white/10 dark:shadow-[0_18px_44px_-18px_rgba(0,0,0,0.6)]">
      <span title={logo.label}>{logo.node}</span>
    </div>
  );

  if (reduced) {
    return (
      <div
        className="absolute"
        style={{
          left: ANCHOR_X,
          top: ANCHOR_Y,
          width: CARD,
          height: CARD,
          marginLeft: -CARD / 2,
          marginTop: -CARD / 2,
          transform: `translate(${packedX}px, ${packedY}px) rotate(${packedR}deg) scale(${packedScale})`,
        }}
      >
        {card}
      </div>
    );
  }

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{
        left: ANCHOR_X,
        top: ANCHOR_Y,
        width: CARD,
        height: CARD,
        marginLeft: -CARD / 2,
        marginTop: -CARD / 2,
        x,
        y,
        scale,
        rotate,
        filter,
      }}
    >
      {card}
    </motion.div>
  );
}
