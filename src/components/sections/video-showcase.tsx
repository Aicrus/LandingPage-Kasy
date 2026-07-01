"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const CONTROLS_HIDE_DELAY_MS = 2200;

/** Loop de fundo — toca mudo até a pessoa dar play; volta quando pausa. */
const LOOP_VIDEO_SRC =
  "https://framerusercontent.com/assets/t3oWwHTiHPdqvISgXglF9dJecA.mp4";

const VIDEO_SRC =
  "https://framerusercontent.com/assets/P3x9QvFGoxzu1AUq58rA1x2gNA.mp4";

const toggleButtonIconClass =
  "flex size-12 items-center justify-center rounded-xl sm:size-14 sm:rounded-2xl bg-white/15 backdrop-blur-md transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 motion-safe:group-active:scale-95";

export function VideoShowcase() {
  const [playing, setPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Contínuo — amarrado direto na posição de scroll da seção, sem travar a rolagem.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const width = useTransform(scrollYProgress, [0, 1], ["70vw", "97vw"]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const groupY = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const groupOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // A distância até o texto encolhe conforme o vídeo cresce, até ele cobrir o texto.
  const videoOverlapMarginTop = useTransform(scrollYProgress, [0, 1], [44, -160]);

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
    } else {
      setPlaying(true);
      setControlsVisible(true);
      scheduleHide();
    }
  }

  return (
    <div
      ref={sectionRef}
      className={cn(
        "relative flex w-full flex-col items-center overflow-hidden",
        "mt-[clamp(0.5rem,1.5vw,1.5rem)] pb-[clamp(4rem,8vw,7rem)]",
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
        <p
          aria-hidden
          className={cn(
            "pointer-events-none relative z-0 select-none whitespace-nowrap uppercase",
            "bg-gradient-to-r from-primary to-primary/25 bg-clip-text text-transparent",
            "font-[family-name:var(--font-syne)] font-bold leading-none tracking-tight",
            "text-[clamp(2.75rem,10vw,8rem)]",
          )}
        >
          Velocidade
        </p>

        <motion.div
          onMouseMove={handleMouseMove}
          style={
            reducedMotion
              ? { width: "min(94vw, 66rem)" }
              : { width, scale, marginTop: videoOverlapMarginTop }
          }
          className={cn(
            "group relative z-10 aspect-[16/7.3] overflow-hidden",
            "rounded-[1.5rem] sm:rounded-[2rem]",
            "bg-[#0b0d13]",
          )}
        >
          {playing ? (
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
            aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
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
  );
}
