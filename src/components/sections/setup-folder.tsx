"use client";

import { useRef } from "react";

import { HeroIntro } from "@/components/sections/hero-intro";
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
 * Seção-herói + "setup".
 *
 * Fluxo (ao scrollar para baixo):
 *   1. Os ícones nascem espalhados pelas BORDAS da tela, em volta do hero —
 *      nunca por cima do texto/botão. Centro nítido, cantos com leve desfoque.
 *   2. A pasta está escondida abaixo da dobra (surpresa). Ao rolar, ela SOBE
 *      e os ícones DESCEM, perdendo o desfoque, caindo dentro dela.
 *   3. Alguns ícones ficam espreitando para fora, bagunçados, e a próxima
 *      seção entra.
 *
 * Stage — caixa de design fixa, escalada de forma responsiva. Os cards podem
 * extrapolar a caixa (vão até as bordas da tela); o recorte fica por conta do
 * container sticky com overflow-hidden.
 * -------------------------------------------------------------------------- */
const STAGE_W = 700;
const STAGE_H = 560;
const CARD = 116;
const FOLDER_W = 300;
const FOLDER_H = 212;
const FOLDER_LEFT = (STAGE_W - FOLDER_W) / 2; // 200
const FOLDER_TOP = STAGE_H - FOLDER_H - 18; // 330
const ANCHOR_X = STAGE_W / 2; // 350
const ANCHOR_Y = FOLDER_TOP + 24; // 354 — logo dentro da boca

/** Deslocamento (em unidades de stage) com que a pasta começa escondida. */
const FOLDER_HIDE_Y = 380;

type Peek = { x: number; y: number; r: number };

type CardSpec = {
  key: string;
  id: BrandId;
  /** Posição inicial (espalhada nas bordas) relativa à boca da pasta. */
  x: number;
  y: number;
  /** Rotação e escala no estado espalhado. */
  r: number;
  scale: number;
  /** 0 (centro, nítido) → 1 (canto, desfocado) na origem. */
  depth: number;
  /** Ordem de "queda" para dentro da pasta. */
  order: number;
  /** Se definido, o card NÃO mergulha: fica espreitando (bagunçado). */
  peek?: Peek;
};

/* Posições espalhadas pelas bordas, evitando a coluna central (texto/botão).
 * x: ± para os lados; y negativo = para cima. */
/* Ordem de queda: as DISTANTES lideram (order baixo), as do centro entram por
 * último — todas quase juntas. */
const CARDS: CardSpec[] = [
  // Laterais altas (encostando nas bordas) — as mais distantes, vêm primeiro.
  { key: "l1", id: "google", x: -781, y: -313, r: -7, scale: 0.88, depth: 1, order: 0 },
  { key: "r1", id: "openai", x: 781, y: -313, r: 7, scale: 0.88, depth: 1, order: 1 },
  // Cantos superiores (bem nas pontas, desfocados).
  { key: "tl", id: "stripe", x: -681, y: -538, r: -9, scale: 0.9, depth: 0.8, order: 2 },
  { key: "tr", id: "apple", x: 681, y: -538, r: 9, scale: 0.9, depth: 0.8, order: 3 },
  // Laterais médias-baixas.
  { key: "l2", id: "supabase", x: -606, y: -88, r: -5, scale: 0.95, depth: 0.55, order: 4 },
  { key: "r2", id: "firebase", x: 606, y: -88, r: 5, scale: 0.95, depth: 0.55, order: 5 },
  // Baixos, perto da pasta — espreitam para fora (bagunçados).
  { key: "b1", id: "openai", x: -200, y: 87, r: -6, scale: 0.94, depth: 0.3, order: 6,
    peek: { x: -92, y: 40, r: -7 } },
  { key: "b2", id: "apple", x: 200, y: 87, r: 6, scale: 0.94, depth: 0.3, order: 7,
    peek: { x: 96, y: 30, r: 8 } },
  { key: "b3", id: "google", x: 0, y: 50, r: 3, scale: 0.96, depth: 0.18, order: 8,
    peek: { x: 2, y: 54, r: 2 } },
  // Centro (nítidos) — abaixo do botão; entram por último.
  { key: "c1", id: "flutter", x: -181, y: -38, r: -2, scale: 1.02, depth: 0, order: 9 },
  { key: "c2", id: "github", x: 181, y: -38, r: 3, scale: 1, depth: 0.08, order: 10 },
];

export function SetupFolder() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Pasta sobe da base (escondida → posição final) — a "surpresa".
  const folderY = useTransform(scrollYProgress, [0, 0.32], [FOLDER_HIDE_Y, 0]);

  return (
    <section ref={sectionRef} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden px-page-x pt-[calc(var(--spacing-hero-inset-top)+var(--header-height-mobile))] sm:pt-hero-inset-top">
        {/* Hero — título, subtítulo e botão "Obter Kasy" */}
        <HeroIntro />

        {/* Palco — folder + cards, ancorado à base e transbordando para cima.
            (o scale do CSS não muda o tamanho de layout, por isso posicionamos
            de forma absoluta pela base, para a pasta nunca cair fora da tela.) */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-[1vh] flex justify-center">
          <div
            className="relative origin-bottom scale-[0.46] sm:scale-[0.56] md:scale-[0.66] lg:scale-[0.74] xl:scale-[0.8]"
            style={{ width: STAGE_W, height: STAGE_H }}
          >
            {/* Sombra de contato sob a pasta (sobe junto) */}
            <motion.div
              aria-hidden
              className="absolute rounded-[50%] bg-[#c98b5e]/25 blur-2xl"
              style={{
                left: FOLDER_LEFT + 10,
                top: FOLDER_TOP + FOLDER_H - 26,
                width: FOLDER_W - 20,
                height: 60,
                y: reduced ? 0 : folderY,
              }}
            />

            {/* Pasta — parede traseira (sobe) */}
            <motion.div
              className="absolute"
              style={{
                left: FOLDER_LEFT,
                top: FOLDER_TOP,
                width: FOLDER_W,
                height: FOLDER_H,
                y: reduced ? 0 : folderY,
              }}
            >
              <FolderBack className="h-full w-full" />
            </motion.div>

            {/* Cards (entre traseira e frente da pasta) */}
            <div className="absolute inset-0">
              {CARDS.map((c) => (
                <FolderCard
                  key={c.key}
                  spec={c}
                  progress={scrollYProgress}
                  reduced={!!reduced}
                />
              ))}
            </div>

            {/* Pasta — bolso frontal + label (sobe) */}
            <motion.div
              className="absolute"
              style={{
                left: FOLDER_LEFT,
                top: FOLDER_TOP,
                width: FOLDER_W,
                height: FOLDER_H,
                y: reduced ? 0 : folderY,
              }}
            >
              <FolderFront className="absolute inset-0 h-full w-full" />
              <span
                className="absolute inset-x-0 bottom-[14%] text-center font-rounded text-[15px] font-semibold tracking-wide text-[#9c6a45]"
                style={{ textShadow: "0 1px 0 rgba(255,255,255,0.35)" }}
              >
                Seu projeto
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Card individual — calcula seus próprios MotionValues a partir do progresso.
 * Estágios: espalhado (bordas) → desce perdendo desfoque → na pasta.
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

  // Janela de "queda": espalhada ao longo de QUASE todo o scroll (distantes
  // liderando, centro por último), terminando perto do fim — assim não há
  // trecho preso "parado": as coisas vão descendo até emendar na próxima seção.
  const fallStart = 0.03 + spec.order * 0.05;
  const fallEnd = Math.min(fallStart + 0.42, 0.98);
  const stops = [0, fallStart, fallEnd, 1];
  // Blur desacoplado da queda: some logo no início do scroll (revela rápido),
  // muito antes do card mergulhar.
  const blurClear = 0.05 + spec.order * 0.016;

  // Alvo dentro da pasta. Os "peek" param espreitando (bagunçados); os demais
  // mergulham fundo, escondidos pelo bolso frontal.
  const packedX = spec.peek ? spec.peek.x : spec.x * 0.05;
  const packedY = spec.peek ? spec.peek.y : 122;
  const packedScale = spec.peek ? 0.66 : 0.46;
  const packedR = spec.peek ? spec.peek.r : 0;
  const initialBlur = spec.depth * 12;

  const x = useTransform(progress, stops, [spec.x, spec.x, packedX, packedX]);
  const y = useTransform(progress, stops, [spec.y, spec.y, packedY, packedY]);
  const scale = useTransform(progress, stops, [
    spec.scale,
    spec.scale,
    packedScale,
    packedScale,
  ]);
  const rotate = useTransform(progress, stops, [
    spec.r,
    spec.r,
    packedR,
    packedR,
  ]);
  const blurPx = useTransform(
    progress,
    [0, fallStart, blurClear, 1],
    [initialBlur, initialBlur, 0, 0],
  );
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  const card = (
    <div className="flex h-full w-full items-center justify-center rounded-[26px] border border-black/[0.06] bg-white shadow-[0_18px_44px_-20px_rgba(20,24,44,0.32)] dark:border-white/10 dark:shadow-[0_18px_44px_-18px_rgba(0,0,0,0.6)]">
      <span title={logo.label}>{logo.node}</span>
    </div>
  );

  // Fallback reduced-motion: estado final estático (cards guardados na pasta).
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
