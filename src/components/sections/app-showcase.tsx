"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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

const CARD_IMAGES = [
  "/images/gallery/app-screen-schedule.jpg",
  "/images/gallery/app-screen-finance.png",
  "/images/gallery/app-screen-food-home.png",
  "/images/gallery/app-screen-dreamsville.png",
  "/images/gallery/app-screen-homeapp.png",
  "/images/gallery/app-screen-card.png",
  "/images/gallery/app-screen-kasy.jpg",
  "/images/gallery/app-screen-football.jpg",
  "/images/gallery/app-screen-barber.png",
];

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -20, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -14, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -7, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 7, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 14, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 20, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

const FAN_MAX_OFFSET_REM = 20;
const FAN_EDGE_SAFETY_PX = 12;

/** Half-width of a rotated rectangle's axis-aligned bounding box. */
function getRotatedHalfWidth(
  widthPx: number,
  heightPx: number,
  rotationDeg: number,
  scale: number,
) {
  const w = widthPx * scale;
  const h = heightPx * scale;
  const rad = (Math.abs(rotationDeg) * Math.PI) / 180;
  return (Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad))) / 2;
}

/**
 * Cards use `overflow-visible` to bleed past the section on purpose (desktop hover pop),
 * but on narrow viewports that bleed can extend past the actual screen edge and trigger
 * horizontal scroll. Clamp the multiplier so the outermost rotated card stays inside
 * the viewport (rotation + x offset included).
 */
function getFanMultiplier(
  rawMultiplier: number,
  viewportWidth: number,
  cardWidthPx: number,
  cardHeightPx: number,
) {
  const remPx = 16;
  const outer = FAN_POSITIONS[0];
  const rotatedHalf = getRotatedHalfWidth(
    cardWidthPx,
    cardHeightPx,
    outer.rot,
    outer.scale,
  );
  const maxAllowedPx = viewportWidth / 2 - rotatedHalf - FAN_EDGE_SAFETY_PX;
  if (maxAllowedPx <= 0) return 0;
  return Math.min(rawMultiplier, maxAllowedPx / (FAN_MAX_OFFSET_REM * remPx));
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 36 * 16;
  else idealPx = 40 * 16;

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
    x: distance * 20,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

/** Entrada/troca de fan — spring bounce se aproxima do "elastic.out" usado no GSAP original. */
const ENTER_SPRING = { type: "spring", stiffness: 170, damping: 13, mass: 0.85 } as const;
const HOVER_SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;
const AUTOPLAY_INTERVAL_MS = 4_500;
const AUTOPLAY_START_DELAY_MS = 800;

export function AppShowcase() {
  const t = useTranslations("appShowcase");
  const cardAlt = t("cardAlt");
  const CARDS = CARD_IMAGES.map((imgUrl) => ({ imgUrl, alt: cardAlt }));
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const autoplayPausedRef = useRef(false);
  const prevVisible = useRef<Set<number>>(new Set());
  const [inView, setInView] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
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
    (direction: "left" | "right", options?: { userInitiated?: boolean }) => {
      if (isAnimating.current || !needsPagination) return;
      if (options?.userInitiated) autoplayPausedRef.current = true;
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

  const goToCenter = useCallback(
    (targetIndex: number) => {
      if (!needsPagination || isAnimating.current) return;

      setCenterIndex((prev) => {
        if (targetIndex === prev) return prev;

        autoplayPausedRef.current = true;
        isAnimating.current = true;

        const forward = (targetIndex - prev + totalCards) % totalCards;
        directionRef.current =
          forward <= totalCards / 2 ? "right" : "left";

        return targetIndex;
      });
    },
    [totalCards, needsPagination],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!needsPagination || reducedMotion || !isInViewport) return;

    const tick = () => {
      if (
        autoplayPausedRef.current ||
        isAnimating.current ||
        !hasEntered.current
      ) {
        return;
      }
      cycle("right");
    };

    let intervalId: number | undefined;

    const startTimer = window.setTimeout(() => {
      tick();
      intervalId = window.setInterval(tick, AUTOPLAY_INTERVAL_MS);
    }, AUTOPLAY_START_DELAY_MS);

    return () => {
      window.clearTimeout(startTimer);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [needsPagination, reducedMotion, isInViewport, cycle]);

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
    const cardWidthPx = cardElements[0].offsetWidth;
    const cardHeightPx = cardElements[0].offsetHeight;
    const multiplier = getFanMultiplier(
      getResponsiveMultiplier(window.innerWidth),
      window.innerWidth,
      cardWidthPx,
      cardHeightPx,
    );
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
      const cardWidthPx = cardElements[0].offsetWidth;
      const cardHeightPx = cardElements[0].offsetHeight;
      const mult = getFanMultiplier(
        getResponsiveMultiplier(window.innerWidth),
        window.innerWidth,
        cardWidthPx,
        cardHeightPx,
      );
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
        "mt-[clamp(3.5rem,5.5vw+1rem,5.5rem)] pb-[clamp(1.25rem,2vw,2rem)]",
      )}
    >
      <Reveal
        className={cn(
          "flex w-full flex-col items-center text-center",
          "gap-[clamp(0.75rem,1vw+0.25rem,1.125rem)]",
          "mb-[clamp(1.5rem,2.5vw,2.25rem)] px-[clamp(1.25rem,4vw,3.5rem)]",
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("eyebrow")}
        </span>
        <h2
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
            "leading-[1.12] tracking-[-0.02em]",
          )}
        >
          {t("heading")}
        </h2>
        <p className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          {t("subtitle")}
        </p>
      </Reveal>

      <div className="flex w-screen [margin-inline:calc(50%-50vw)] items-center justify-center overflow-visible px-[clamp(0.5rem,1.5vw,1rem)] pt-1 max-md:-translate-y-5 max-md:pb-8 md:-translate-y-1 lg:pt-2">
        <div
          ref={containerRef}
          className={cn(
            "relative flex w-full max-w-[80rem] items-center justify-center",
            "h-[21rem] min-[480px]:h-[23rem] sm:h-[25rem] md:h-[33rem] lg:h-[37rem]",
            "max-md:origin-center max-md:scale-[0.94]",
          )}
        >
          {CARDS.map((card, index) => {
            const isAppScreen = !card.imgUrl.includes("/vertical-");
            const visibleMap = getVisibleMap(centerIndex);
            const slot = visibleMap.get(index);
            const isVisible = slot !== undefined;
            const isCenter = slot === HALF;
            const isSelectable = needsPagination && isVisible && !isCenter;

            return (
            <div
              key={index}
              role={isSelectable ? "button" : undefined}
              tabIndex={isSelectable ? 0 : -1}
              aria-label={isSelectable ? t("centerCard") : undefined}
              onClick={() => {
                if (isSelectable) goToCenter(index);
              }}
              onKeyDown={(event) => {
                if (
                  isSelectable &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  goToCenter(index);
                }
              }}
              className={cn(
                "fan-card absolute top-1/2 left-1/2 -ml-[4.625rem] -mt-[10rem] h-[20rem] w-[9.25rem] overflow-hidden rounded-[1rem] border border-border/70 bg-muted opacity-0 will-change-transform md:top-[41%] md:-ml-[5.625rem] md:-mt-[12.25rem] md:h-[24.5rem] md:w-[11.25rem] md:rounded-[1.15rem] lg:top-[39.5%] lg:-ml-[6rem] lg:-mt-[13rem] lg:h-[26rem] lg:w-[12rem] lg:rounded-[1.2rem]",
                !isVisible && "pointer-events-none",
                isSelectable &&
                  "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
              style={cardShellStyle}
            >
              <Image
                src={card.imgUrl}
                alt={card.alt}
                fill
                quality={95}
                unoptimized={isAppScreen}
                sizes="(max-width: 768px) 9.25rem, (max-width: 1024px) 11.25rem, 12rem"
                className="object-cover object-center"
              />
            </div>
            );
          })}
        </div>
      </div>

      {needsPagination ? (
        <div className="flex items-center justify-center gap-4 max-md:mt-16 sm:mt-5 md:mt-3 lg:mt-2">
          <button
            type="button"
            onClick={() => cycle("left", { userInitiated: true })}
            aria-label={t("prev")}
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
            onClick={() => cycle("right", { userInitiated: true })}
            aria-label={t("next")}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground active:opacity-70"
          >
            <ChevronRight className="size-5" strokeWidth={2.5} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
