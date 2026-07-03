"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { Reveal } from "@/components/motion/reveal";
import { animate, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CardItem = {
  imgUrl: string;
  alt: string;
};

const CARDS: CardItem[] = [
  { imgUrl: "/images/gallery/vertical-1.jpg", alt: "App criado com Kasy" },
  { imgUrl: "/images/gallery/vertical-2.jpg", alt: "App criado com Kasy" },
  { imgUrl: "/images/gallery/vertical-3.jpg", alt: "App criado com Kasy" },
  { imgUrl: "/images/gallery/vertical-4.jpg", alt: "App criado com Kasy" },
  { imgUrl: "/images/gallery/vertical-1.jpg", alt: "App criado com Kasy" },
  { imgUrl: "/images/gallery/vertical-2.jpg", alt: "App criado com Kasy" },
  { imgUrl: "/images/gallery/vertical-3.jpg", alt: "App criado com Kasy" },
  { imgUrl: "/images/gallery/vertical-4.jpg", alt: "App criado com Kasy" },
  { imgUrl: "/images/gallery/vertical-1.jpg", alt: "App criado com Kasy" },
];

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

/** Entrada/troca de fan — spring bounce se aproxima do "elastic.out" usado no GSAP original. */
const ENTER_SPRING = { type: "spring", stiffness: 170, damping: 13, mass: 0.85 } as const;
const HOVER_SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;

export function AppShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());
  const [inView, setInView] = useState(false);
  const reducedMotion = useReducedMotion();

  const totalCards = CARDS.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(
    needsPagination ? HALF : totalCards >> 1,
  );

  const getVisibleMap = useCallback(
    (center: number) => {
      const map = new Map<number, number>();
      if (!needsPagination) {
        CARDS.forEach((_, i) => map.set(i, i));
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set(
          (((center + slot - HALF) % totalCards) + totalCards) % totalCards,
          slot,
        );
      }
      return map;
    },
    [totalCards, needsPagination],
  );

  const cycle = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating.current || !needsPagination) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((prev) =>
        direction === "right"
          ? (prev + 1) % totalCards
          : (prev - 1 + totalCards) % totalCards,
      );
    },
    [totalCards, needsPagination],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(
      container.querySelectorAll<HTMLElement>(".fan-card"),
    );
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    const instant = (el: HTMLElement, target: Record<string, number | string>) =>
      animate(el, target, { duration: 0 });

    if (isFirstMount && !inView) {
      cardElements.forEach((card, cardIndex) => {
        const slot = visibleMap.get(cardIndex);
        if (slot !== undefined) {
          instant(card, { x: 0, y: `${12 * hMult}rem`, rotate: 0, scale: 0.5, opacity: 0 });
        } else {
          instant(card, { opacity: 0, scale: 0.3, x: 0, y: 0 });
          card.style.zIndex = "0";
        }
      });
      prevVisible.current = new Set(visibleMap.keys());
      return;
    }

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotate: rot,
          scale,
          opacity: 1,
        };
        card.style.zIndex = String(zIndex);

        if (reducedMotion) {
          instant(card, target);
          onCardDone();
        } else if (isFirstMount) {
          instant(card, { x: 0, y: `${12 * hMult}rem`, rotate: 0, scale: 0.5, opacity: 0 });
          animate(card, target, {
            ...ENTER_SPRING,
            delay: 0.2 + slot * 0.06,
          }).then(onCardDone);
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          instant(card, {
            x: `${enterX}rem`,
            y: `${y * hMult}rem`,
            rotate: direction === "right" ? 30 : -30,
            scale: 0.5,
            opacity: 0,
          });
          animate(card, target, { duration: 0.6, ease: "easeOut" }).then(
            onCardDone,
          );
        } else {
          animate(card, target, { duration: 0.5, ease: "easeOut" }).then(
            onCardDone,
          );
        }
      } else if (wasVisible && !reducedMotion) {
        const exitX = direction === "right" ? -40 : 40;
        animate(
          card,
          {
            x: `${exitX}rem`,
            opacity: 0,
            scale: 0.5,
            rotate: direction === "right" ? -30 : 30,
          },
          { duration: 0.4, ease: "easeIn" },
        );
        card.style.zIndex = "0";
      } else if (isFirstMount || wasVisible) {
        instant(card, { opacity: 0, scale: 0.3, x: 0, y: 0 });
        card.style.zIndex = "0";
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    if (reducedMotion) return;

    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized =
              centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength =
              8 * (1 - Math.abs(normalized)) *
              (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot)
              targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        animate(
          el,
          {
            x: `${targetX}rem`,
            y: `${targetY}rem`,
            rotate: targetRot,
            scale: targetScale,
          },
          { ...HOVER_SPRING, delay },
        );
        el.style.zIndex = String(base.zIndex);
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) =>
        el.removeEventListener("mouseenter", handler),
      );
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination, inView, reducedMotion]);

  const cardShellStyle: CSSProperties = {
    boxShadow:
      "0 24px 60px -16px rgba(0,0,0,0.35), 0 6px 16px -6px rgba(0,0,0,0.2)",
  };

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
          "mb-[clamp(2rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3.5rem)]",
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Feito com Kasy
        </span>
        <h2
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
            "leading-[1.12] tracking-[-0.02em]",
          )}
        >
          Construa o próximo grande app.
        </h2>
        <p className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          Nosso kit é mais do que código, é uma plataforma de lançamento. Veja
          o que é possível quando você pula a configuração.
        </p>
      </Reveal>

      <div className="flex w-full items-center justify-center overflow-visible">
        <div
          ref={containerRef}
          className={cn(
            "relative flex w-full max-w-[80rem] items-center justify-center",
            "h-[19rem] min-[480px]:h-[21rem] sm:h-[23rem] md:h-[27rem] lg:h-[29rem]",
          )}
        >
          {CARDS.map((card, index) => (
            <div
              key={index}
              className={cn(
                "fan-card absolute top-1/2 left-1/2 -ml-[6.5rem] -mt-[8.65rem] h-[17.3rem] w-[13rem] overflow-hidden rounded-[1.25rem] border border-border/70 bg-muted opacity-0 will-change-transform md:-ml-[7.5rem] md:-mt-[10rem] md:h-[20rem] md:w-[15rem]",
              )}
              style={cardShellStyle}
            >
              <Image
                src={card.imgUrl}
                alt={card.alt}
                fill
                sizes="(max-width: 768px) 13rem, 15rem"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {needsPagination ? (
        <div className="mt-20 flex items-center justify-center gap-4 sm:mt-16 md:mt-12 lg:mt-8">
          <button
            type="button"
            onClick={() => cycle("left")}
            aria-label="Anterior"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground active:opacity-70"
          >
            <ChevronLeft className="size-5" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-2">
            {CARDS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "size-2 rounded-full transition-all duration-300",
                  i === centerIndex
                    ? "scale-[1.3] bg-foreground"
                    : "bg-muted-foreground/40",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => cycle("right")}
            aria-label="Próximo"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground active:opacity-70"
          >
            <ChevronRight className="size-5" strokeWidth={2.5} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
