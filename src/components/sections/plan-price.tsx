"use client";

import { useEffect, useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "@/lib/motion";
import { formatMoney, type Currency } from "@/lib/stripe/catalog";

type PlanPriceProps = {
  fullCents: number;
  discountedCents?: number;
  currency: Currency;
  per: string;
  delay?: number;
};

type Phase = "full" | "deal";

export function PlanPrice({
  fullCents,
  discountedCents,
  currency,
  per,
  delay = 0,
}: PlanPriceProps) {
  const shouldAnimate =
    typeof discountedCents === "number" && discountedCents < fullCents;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(shouldAnimate ? "full" : "deal");
  const [showStrike, setShowStrike] = useState(false);

  const fullLabel = formatMoney(fullCents, currency);
  const dealLabel = formatMoney(discountedCents ?? fullCents, currency);
  const sizerLabel = dealLabel.length >= fullLabel.length ? dealLabel : fullLabel;

  useEffect(() => {
    if (!shouldAnimate || discountedCents == null) return;

    if (reducedMotion) {
      setPhase("deal");
      setShowStrike(true);
      return;
    }

    if (!inView) return;

    const dropAt = Math.max(delay, 0) * 1000;
    const strikeAt = dropAt + 520;

    const dropTimer = window.setTimeout(() => setPhase("deal"), dropAt);
    const strikeTimer = window.setTimeout(() => setShowStrike(true), strikeAt);

    return () => {
      window.clearTimeout(dropTimer);
      window.clearTimeout(strikeTimer);
    };
  }, [shouldAnimate, discountedCents, inView, reducedMotion, delay]);

  if (!shouldAnimate) {
    return (
      <div className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
        <span className="font-heading text-[2.375rem] font-bold tracking-[-0.025em] tabular-nums text-foreground">
          {fullLabel}
        </span>
        <span className="text-sm text-muted-foreground">{per}</span>
      </div>
    );
  }

  return (
    <div ref={ref} className="mt-4">
      {/* Slot fixo: o riscado entra aqui sem empurrar o preço nem o botão. */}
      <div className="mb-0 flex h-[1.125rem] items-end">
        <AnimatePresence>
          {showStrike ? (
            <motion.span
              key="strike"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-[0.9375rem] font-medium tracking-tight text-muted-foreground/65 line-through"
            >
              {fullLabel}
            </motion.span>
          ) : (
            <span aria-hidden className="invisible text-[0.9375rem]">
              {fullLabel}
            </span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
        <span className="relative inline-grid overflow-hidden leading-none">
          <span
            aria-hidden
            className="invisible col-start-1 row-start-1 font-heading text-[2.375rem] font-bold tracking-[-0.025em] tabular-nums"
          >
            {sizerLabel}
          </span>
          <AnimatePresence mode="sync" initial={false}>
            {phase === "full" ? (
              <motion.span
                key="full"
                exit={{ y: "-105%", opacity: 0 }}
                transition={{ duration: 0.48, ease: [0.33, 1, 0.68, 1] }}
                className="col-start-1 row-start-1 font-heading text-[2.375rem] font-bold tracking-[-0.025em] tabular-nums text-foreground"
              >
                {fullLabel}
              </motion.span>
            ) : (
              <motion.span
                key="deal"
                initial={{ y: "105%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                className="col-start-1 row-start-1 font-heading text-[2.375rem] font-bold tracking-[-0.025em] tabular-nums text-foreground"
              >
                {dealLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="text-sm text-muted-foreground">{per}</span>
      </div>
    </div>
  );
}
