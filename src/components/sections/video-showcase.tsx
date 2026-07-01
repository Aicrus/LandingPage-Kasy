"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

import { Reveal } from "@/components/motion";
import { growReveal } from "@/lib/motion";
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
    <section
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-features-to-video)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <Reveal
        variants={growReveal}
        transition={{ duration: 0.85 }}
        className={cn(
          "w-full max-w-[clamp(22rem,82vw,66rem)]",
          "rounded-[1.3rem] p-0.5 sm:rounded-[2rem] sm:p-1",
          "border border-[0.5px] border-solid border-black/[0.14] bg-background shadow-none",
          "dark:border-white/[0.16]",
        )}
      >
        <div
          onMouseMove={handleMouseMove}
          className={cn(
            "group relative aspect-[16/9.1] w-full overflow-hidden",
            "rounded-2xl sm:rounded-[1.75rem]",
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
        </div>
      </Reveal>
    </section>
  );
}
