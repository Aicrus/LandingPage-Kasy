"use client";

import { useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import {
  blurIn,
  fadeInUp,
  motion,
  staggerContainer,
  useInView,
  useReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const DAY_COUNT = 7;
const TRACK_WIDTH = 248;
const TRACK_HEIGHT = 20;
const TRACK_INSET = 12;
const STEP = (TRACK_WIDTH - TRACK_INSET * 2) / (DAY_COUNT - 1);
const CY = TRACK_HEIGHT / 2;
const LAST_CX = TRACK_INSET + STEP * (DAY_COUNT - 1);

/**
 * Trilha de 7 pontos que "resolve" no último — versão vetorial e literal
 * do "sete dias" do título. Dispara sozinha ao entrar em viewport, para
 * não depender da orquestração de stagger do Reveal ao redor.
 */
function DayProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  const active = reducedMotion || isInView;

  return (
    <div ref={ref} aria-hidden className="flex items-center justify-center">
      <svg
        width={TRACK_WIDTH}
        height={TRACK_HEIGHT}
        viewBox={`0 0 ${TRACK_WIDTH} ${TRACK_HEIGHT}`}
        fill="none"
        className="overflow-visible"
      >
        <motion.line
          x1={TRACK_INSET}
          y1={CY}
          x2={TRACK_WIDTH - TRACK_INSET}
          y2={CY}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="text-border"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            active
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        />

        {Array.from({ length: DAY_COUNT - 1 }).map((_, index) => (
          <motion.circle
            key={index}
            cx={TRACK_INSET + STEP * index}
            cy={CY}
            r={2.5}
            className="fill-border"
            initial={{ scale: 0 }}
            animate={active ? { scale: 1 } : { scale: 0 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 22,
              delay: 0.15 + index * 0.07,
            }}
          />
        ))}

        <motion.circle
          cx={LAST_CX}
          cy={CY}
          r={5}
          className="fill-[#16a34a] dark:fill-[#4ade80]"
          initial={{ scale: 0 }}
          animate={active ? { scale: 1 } : { scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 20,
            delay: 0.15 + (DAY_COUNT - 1) * 0.07,
          }}
        />
        <motion.path
          d={`M ${LAST_CX - 2} ${CY} L ${LAST_CX - 0.4} ${CY + 1.7} L ${LAST_CX + 2.3} ${CY - 2.1}`}
          className="stroke-background"
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            active
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: 0.3,
            ease: "easeOut",
            delay: 0.15 + (DAY_COUNT - 1) * 0.07 + 0.25,
          }}
        />
      </svg>
    </div>
  );
}

/**
 * Respiro proposital entre a economia (números) e o catálogo de recursos
 * (detalhe). Tipografia grande + uma trilha vetorial de 7 pontos — sem
 * card, sem lista, sem firula.
 */
export function KasyPunchline() {
  return (
    <section
      className={cn(
        "relative mx-auto flex w-full flex-col items-center justify-center overflow-hidden",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 -z-10",
          "size-[clamp(18rem,40vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-full",
          "bg-[#16a34a]/10 blur-[100px] dark:bg-[#4ade80]/10",
        )}
      />

      <Reveal
        variants={staggerContainer}
        className="flex flex-col items-center gap-5 py-[clamp(1rem,4vw,2.5rem)] text-center sm:gap-6"
      >
        <motion.div variants={fadeInUp}>
          <DayProgress />
        </motion.div>

        <p
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(2.5rem,1.4rem+5.5vw,5.5rem)]",
            "leading-[1.02] tracking-[-0.03em]",
          )}
        >
          <motion.span variants={blurIn} className="block">
            Sete dias.
          </motion.span>
          <motion.span
            variants={blurIn}
            className="block text-[#16a34a] dark:text-[#4ade80]"
          >
            Dor de cabeça zero.
          </motion.span>
        </p>

        <motion.p
          variants={fadeInUp}
          className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground"
        >
          Do primeiro commit à App Store, sem os dois meses de fricção no
          meio.
        </motion.p>
      </Reveal>
    </section>
  );
}
