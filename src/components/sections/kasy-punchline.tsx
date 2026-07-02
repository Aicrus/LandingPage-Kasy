"use client";

import { Check } from "lucide-react";
import { useRef } from "react";

import {
  blurRevealTransition,
  motion,
  smoothTransition,
  useInView,
  useReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Respiro proposital entre a economia (números) e o catálogo de recursos
 * (detalhe): um "7" gigante e translúcido no fundo dá profundidade, o
 * título entra com blur em cascata, e um selo de aprovação bate por cima
 * do "zero." como golpe final — sem card, sem lista, sem firula.
 */
export function KasyPunchline() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const active = reducedMotion || isInView;

  const lineTransition = (delay: number) =>
    reducedMotion ? smoothTransition : { ...blurRevealTransition, delay };

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

      <div
        ref={ref}
        className="relative flex flex-col items-center gap-4 py-[clamp(1rem,4vw,2.5rem)] text-center sm:gap-5"
      >
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.8, rotate: -14 }}
          animate={
            active
              ? { opacity: 1, scale: 1, rotate: -8 }
              : { opacity: 0, scale: 0.8, rotate: -14 }
          }
          transition={
            reducedMotion
              ? smoothTransition
              : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
          }
          className={cn(
            "pointer-events-none absolute left-1/2 top-[-12%] -z-10 -translate-x-1/2 select-none",
            "font-heading text-foreground/60 dark:text-foreground/60",
            "text-[clamp(16rem,38vw,32rem)] leading-none",
          )}
        >
          7
        </motion.span>

        <div className="relative">
          <p
            className={cn(
              "text-balance font-heading font-bold text-foreground",
              "text-[clamp(2.5rem,1.4rem+5.5vw,5.5rem)]",
              "leading-[1.02] tracking-[-0.03em]",
            )}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 22, filter: "blur(14px)" }}
              animate={
                active
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 22, filter: "blur(14px)" }
              }
              transition={lineTransition(0.05)}
            >
              Sete dias.
            </motion.span>
            <motion.span
              className="block text-[#16a34a] dark:text-[#4ade80]"
              initial={{ opacity: 0, y: 22, filter: "blur(14px)" }}
              animate={
                active
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 22, filter: "blur(14px)" }
              }
              transition={lineTransition(0.2)}
            >
              Dor de cabeça zero.
            </motion.span>
          </p>

          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 2.4, rotate: 18 }}
            animate={
              active
                ? { opacity: 1, scale: 1, rotate: -10 }
                : { opacity: 0, scale: 2.4, rotate: 18 }
            }
            transition={
              reducedMotion
                ? smoothTransition
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 14,
                    delay: 0.95,
                  }
            }
            className={cn(
              "absolute bottom-0 left-full ml-1.5 -translate-y-1 sm:ml-3",
              "flex size-[clamp(2.5rem,1.8rem+2.8vw,4rem)] items-center justify-center rounded-full",
              "bg-[#16a34a] text-white shadow-[0_6px_18px_-4px_rgba(22,163,74,0.55)]",
              "dark:bg-[#4ade80] dark:text-[#052e12] dark:shadow-[0_6px_18px_-4px_rgba(74,222,128,0.4)]",
            )}
          >
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 1 }}
              animate={
                active
                  ? { opacity: [0.55, 0], scale: [1, 2.2] }
                  : { opacity: 0, scale: 1 }
              }
              transition={{ duration: 0.7, delay: 1.05, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[#16a34a] dark:bg-[#4ade80]"
            />
            <Check className="relative size-[55%]" strokeWidth={3} />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={
            reducedMotion ? smoothTransition : { ...smoothTransition, delay: 1.15 }
          }
          className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground"
        >
          Do primeiro commit à App Store, sem os dois meses de fricção no
          meio.
        </motion.p>
      </div>
    </section>
  );
}
