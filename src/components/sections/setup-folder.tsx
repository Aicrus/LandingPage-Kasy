"use client";

import { useRef } from "react";

import { BlurReveal } from "@/components/motion/blur-reveal";
import {
  FolderBack,
  FolderFront,
} from "@/components/folder/folder-graphics";
import { BRAND_LOGOS, type BrandId } from "@/components/logos/brand-logos";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "@/lib/motion";

/* ----------------------------------------------------------------------------
 * Stage — caixa de design fixa, escalada de forma responsiva.
 * Cards são ancorados na "boca" da pasta (ANCHOR) e deslocados por (x, y).
 * -------------------------------------------------------------------------- */
const STAGE_W = 680;
const STAGE_H = 720;
const CARD = 116;
const FOLDER_W = 300;
const FOLDER_H = 212;
const FOLDER_LEFT = (STAGE_W - FOLDER_W) / 2; // 190
const FOLDER_TOP = STAGE_H - FOLDER_H - 30; // 478
const ANCHOR_X = STAGE_W / 2; // 340
const ANCHOR_Y = FOLDER_TOP + 24; // 502 — logo dentro da boca

type CardSpec = {
  id: BrandId;
  /** Posição final (espalhada) relativa à boca da pasta. */
  x: number;
  y: number;
  /** Rotação e escala no estado espalhado. */
  r: number;
  scale: number;
  /** 0 (perto) → 1 (longe): controla blur/deriva na saída. */
  depth: number;
  /** Ordem de emergência (centro → fora). */
  order: number;
};

const CARDS: CardSpec[] = [
  { id: "flutter", x: 5, y: -358, r: -2, scale: 1.06, depth: 0.2, order: 0 },
  { id: "openai", x: 20, y: -200, r: 2, scale: 1.0, depth: 0.35, order: 1 },
  { id: "firebase", x: 212, y: -300, r: 6, scale: 0.99, depth: 0.55, order: 2 },
  { id: "stripe", x: -226, y: -288, r: -6, scale: 0.99, depth: 0.55, order: 3 },
  { id: "supabase", x: 245, y: -150, r: 4, scale: 0.95, depth: 0.8, order: 4 },
  { id: "google", x: -250, y: -132, r: -5, scale: 0.95, depth: 0.8, order: 5 },
  { id: "apple", x: 165, y: -42, r: 4, scale: 0.92, depth: 1, order: 6 },
  { id: "github", x: -150, y: -36, r: -4, scale: 0.92, depth: 1, order: 7 },
];

export function SetupFolder() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Linhas-guia tracejadas: aparecem quando os cards espalham, somem na saída.
  const guideOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 0.95],
    [0, 0.5, 0.5, 0],
  );

  return (
    <section ref={sectionRef} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-start overflow-hidden px-page-x pt-[calc(var(--header-height-mobile)+1.5rem)] sm:pt-page-y">
        {/* Cabeçalho */}
        <div className="mx-auto flex max-w-fluid-title flex-col items-center gap-4 text-center">
          <h2 className="text-balance font-heading text-fluid-display text-foreground">
            <BlurReveal as="span" className="block">
              Tudo que você precisa para lançar
            </BlurReveal>
            <BlurReveal
              as="span"
              className="block text-muted-foreground"
              delay={0.12}
            >
              já vem dentro do seu projeto.
            </BlurReveal>
          </h2>
          <BlurReveal
            as="p"
            delay={0.24}
            className="max-w-fluid-subtitle font-rounded text-pretty text-fluid-subtitle text-muted-foreground"
          >
            Firebase, Stripe, autenticação e UI — configurados e prontos no setup.
          </BlurReveal>
        </div>

        {/* Palco */}
        <div className="relative mt-2 flex flex-1 items-center justify-center">
          <div
            className="relative origin-center scale-[0.46] sm:scale-[0.62] md:scale-[0.78] lg:scale-95 xl:scale-100"
            style={{ width: STAGE_W, height: STAGE_H }}
          >
            {/* Sombra de contato sob a pasta */}
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

            {/* Linhas-guia + slots tracejados (atrás dos cards) */}
            <motion.svg
              aria-hidden
              viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
              className="absolute inset-0 h-full w-full"
              style={reduced ? { opacity: 0.4 } : { opacity: guideOpacity }}
            >
              {CARDS.map((c) => {
                const cx = ANCHOR_X + c.x;
                const cy = ANCHOR_Y + c.y;
                return (
                  <g key={c.id} stroke="#b9986f" strokeOpacity="0.55">
                    <path
                      d={`M${ANCHOR_X} ${ANCHOR_Y} C ${ANCHOR_X} ${ANCHOR_Y + c.y * 0.45}, ${cx - c.x * 0.35} ${cy + 34}, ${cx} ${cy + 30}`}
                      fill="none"
                      strokeWidth="1.25"
                      strokeDasharray="2 6"
                      strokeLinecap="round"
                    />
                    <rect
                      x={cx - CARD / 2}
                      y={cy - CARD / 2}
                      width={CARD}
                      height={CARD}
                      rx={26}
                      fill="none"
                      strokeWidth="1.25"
                      strokeDasharray="4 6"
                    />
                  </g>
                );
              })}
            </motion.svg>

            {/* Pasta — parede traseira */}
            <FolderBack
              className="absolute"
              style={{
                left: FOLDER_LEFT,
                top: FOLDER_TOP,
                width: FOLDER_W,
                height: FOLDER_H,
              }}
            />

            {/* Cards (entre traseira e frente da pasta) */}
            <div className="absolute inset-0">
              {CARDS.map((c) => (
                <FolderCard
                  key={c.id}
                  spec={c}
                  progress={scrollYProgress}
                  reduced={!!reduced}
                />
              ))}
            </div>

            {/* Pasta — bolso frontal + label */}
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
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Card individual — calcula seus próprios MotionValues a partir do progresso.
 * Estágios: empacotado (na pasta) → espalhado (foto-herói) → deriva + blur.
 * -------------------------------------------------------------------------- */
function FolderCard({
  spec,
  progress,
  reduced,
}: {
  spec: CardSpec;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const logo = BRAND_LOGOS[spec.id];

  // Stagger por ordem: cada card emerge num instante levemente diferente.
  const emerge = Math.min(spec.order * 0.022, 0.16);
  const spread = 0.4 + spec.order * 0.012;
  const hold = 0.6;
  const stops = [emerge, spread, hold, 1];

  const x = useTransform(progress, stops, [
    spec.x * 0.06,
    spec.x,
    spec.x,
    spec.x * 1.85,
  ]);
  const y = useTransform(progress, stops, [
    34,
    spec.y,
    spec.y,
    spec.y * 0.78 - 70,
  ]);
  const scale = useTransform(progress, stops, [
    0.55,
    spec.scale,
    spec.scale,
    spec.scale * 0.92,
  ]);
  const rotate = useTransform(progress, stops, [
    0,
    spec.r,
    spec.r,
    spec.r * 1.6,
  ]);
  const opacity = useTransform(
    progress,
    [emerge, spread, hold, 0.9, 1],
    [0, 1, 1, 0.9, 0],
  );
  const blurPx = useTransform(progress, stops, [
    3,
    0,
    0,
    8 + spec.depth * 16,
  ]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  const card = (
    <div className="flex h-full w-full items-center justify-center rounded-[26px] border border-black/[0.06] bg-white shadow-[0_18px_44px_-20px_rgba(20,24,44,0.32)] dark:border-white/10 dark:shadow-[0_18px_44px_-18px_rgba(0,0,0,0.6)]">
      <span title={logo.label}>{logo.node}</span>
    </div>
  );

  // Fallback reduced-motion: estado espalhado estático, sem blur.
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
          transform: `translate(${spec.x}px, ${spec.y}px) rotate(${spec.r}deg) scale(${spec.scale})`,
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
        opacity,
        filter,
      }}
    >
      {card}
    </motion.div>
  );
}
