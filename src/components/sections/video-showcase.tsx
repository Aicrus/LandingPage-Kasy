"use client";

import { Pause, Play, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const LG_MEDIA = "(min-width: 1024px)";

const CONTROLS_HIDE_DELAY_MS = 2200;

/** Loop de fundo — toca mudo até a pessoa dar play; volta quando pausa. */
const LOOP_VIDEO_SRC =
  "https://framerusercontent.com/assets/t3oWwHTiHPdqvISgXglF9dJecA.mp4";

const VIDEO_SRC =
  "https://framerusercontent.com/assets/P3x9QvFGoxzu1AUq58rA1x2gNA.mp4";

const toggleButtonIconClass =
  "flex size-12 items-center justify-center rounded-xl sm:size-14 sm:rounded-2xl bg-white/15 backdrop-blur-md transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 motion-safe:group-active:scale-95";

export function VideoShowcase() {
  const t = useTranslations("videoShowcase");
  const [playing, setPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isLgUp = useMediaQuery(LG_MEDIA);

  // Contínuo — amarrado direto na posição de scroll da seção, sem travar a rolagem.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const width = useTransform(scrollYProgress, [0, 1], ["70vw", "97vw"]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const groupY = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const groupOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // Desktop: o vídeo sobe e cobre o texto conforme cresce.
  const videoOverlapMarginTop = useTransform(scrollYProgress, [0, 0.55], [44, -160]);
  // Mobile/tablet: texto some no scroll; vídeo só alarga — sem scale nem overlap
  // (evita cortar topo/baixo no overflow-hidden do wrapper).
  const textOpacityMobile = useTransform(scrollYProgress, [0.22, 0.55], [1, 0]);
  const textYMobile = useTransform(scrollYProgress, [0.22, 0.55], [0, -14]);
  const widthMobile = useTransform(scrollYProgress, [0, 1], ["82vw", "94vw"]);
  const videoGapMobile = useTransform(scrollYProgress, [0, 0.55], [24, 10]);

  function clearHideTimeout() {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  }

  function scheduleHide() {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(
      () => setControlsVisible(false),
      CONTROLS_HIDE_DELAY_MS,
    );
  }

  function handleMouseMove() {
    if (!playing) return;
    setControlsVisible(true);
    scheduleHide();
  }

  function handleToggle() {
    if (playing) {
      // Pausar volta para o loop de fundo, em vez de congelar num frame do vídeo.
      setPlaying(false);
      setControlsVisible(true);
      clearHideTimeout();
    } else if (!isLgUp) {
      // Mobile/tablet: o play abre o vídeo em tela cheia em vez de tocar inline.
      setPlaying(true);
      setFullscreenOpen(true);
    } else {
      setPlaying(true);
      setControlsVisible(true);
      scheduleHide();
    }
  }

  const closeFullscreen = useCallback(() => {
    setFullscreenOpen(false);
    setPlaying(false);
    setControlsVisible(true);
    clearHideTimeout();
  }, []);

  useEffect(() => {
    if (!fullscreenOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeFullscreen();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenOpen, closeFullscreen]);

  return (
    <>
    <div
      ref={sectionRef}
      className={cn(
        "relative flex w-full flex-col items-center",
        "overflow-hidden max-lg:overflow-visible",
        "mt-[clamp(-3.5rem,-4vw,-2rem)]",
      )}
    >
      <motion.div
        style={
          reducedMotion
            ? undefined
            : { y: groupY, opacity: groupOpacity }
        }
        className="flex w-full flex-col items-center"
      >
        <motion.p
          aria-hidden
          style={
            reducedMotion || isLgUp
              ? undefined
              : { opacity: textOpacityMobile, y: textYMobile }
          }
          className={cn(
            "pointer-events-none relative z-0 select-none whitespace-nowrap uppercase",
            "bg-gradient-to-r from-primary to-primary/25 bg-clip-text text-transparent",
            "font-[family-name:var(--font-syne)] font-bold leading-none tracking-tight",
            "text-[clamp(2.75rem,10vw,8rem)]",
          )}
        >
          {t("bigLabel")}
        </motion.p>

        <motion.div
          onMouseMove={handleMouseMove}
          style={
            reducedMotion
              ? { width: "min(94vw, 66rem)" }
              : isLgUp
                ? { width, scale, marginTop: videoOverlapMarginTop }
                : { width: widthMobile, marginTop: videoGapMobile }
          }
          className={cn(
            "group relative z-10 aspect-[16/7.5] overflow-hidden",
            "rounded-[1.5rem] sm:rounded-[2rem]",
            "bg-[#0b0d13]",
          )}
        >
          {playing && !fullscreenOpen ? (
            <video
              src={VIDEO_SRC}
              autoPlay
              playsInline
              onPlay={scheduleHide}
              onEnded={() => {
                setPlaying(false);
                setControlsVisible(true);
                clearHideTimeout();
              }}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <video
              src={LOOP_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 size-full object-cover"
            />
          )}

          <button
            type="button"
            aria-label={playing ? t("pause") : t("play")}
            onClick={handleToggle}
            className={cn(
              "absolute inset-0 flex size-full items-center justify-center outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <span
              className={cn(
                toggleButtonIconClass,
                playing && !controlsVisible ? "opacity-0" : "opacity-100",
              )}
            >
              {playing ? (
                <Pause className="size-6 text-white sm:size-7" strokeWidth={1.75} />
              ) : (
                <Play
                  className="size-6 translate-x-0.5 text-white sm:size-7"
                  strokeWidth={1.75}
                />
              )}
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>

    {fullscreenOpen ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black lg:hidden"
        onMouseMove={handleMouseMove}
      >
        <video
          src={VIDEO_SRC}
          autoPlay
          playsInline
          onPlay={scheduleHide}
          onEnded={closeFullscreen}
          className="size-full object-contain"
        />

        <button
          type="button"
          aria-label={playing ? t("pause") : t("play")}
          onClick={handleToggle}
          className="absolute inset-0 flex size-full items-center justify-center outline-none"
        >
          <span
            className={cn(
              toggleButtonIconClass,
              playing && !controlsVisible ? "opacity-0" : "opacity-100",
            )}
          >
            {playing ? (
              <Pause className="size-6 text-white sm:size-7" strokeWidth={1.75} />
            ) : (
              <Play
                className="size-6 translate-x-0.5 text-white sm:size-7"
                strokeWidth={1.75}
              />
            )}
          </span>
        </button>

        <button
          type="button"
          aria-label={t("close")}
          onClick={closeFullscreen}
          className={cn(
            "absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))]",
            "flex size-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md",
            "transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            playing && !controlsVisible ? "opacity-0" : "opacity-100",
          )}
        >
          <X className="size-5 text-white" strokeWidth={1.75} />
        </button>
      </div>
    ) : null}
    </>
  );
}
