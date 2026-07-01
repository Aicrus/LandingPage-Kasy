"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

const CONTROLS_HIDE_DELAY_MS = 2200;

/** Poster do player — arte escura, substituível a qualquer momento. */
const VIDEO_POSTER_SRC =
  "https://framerusercontent.com/images/ONQIsStqeLWeki3a2HBJUTgVIII.png?scale-down-to=2048&width=2088&height=1600";

const VIDEO_SRC =
  "https://framerusercontent.com/assets/P3x9QvFGoxzu1AUq58rA1x2gNA.mp4";

const toggleButtonIconClass =
  "flex size-12 items-center justify-center rounded-xl sm:size-14 sm:rounded-2xl bg-white/15 backdrop-blur-md transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 motion-safe:group-active:scale-95";

export function VideoShowcase() {
  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    if (!isPlaying) return;
    setControlsVisible(true);
    scheduleHide();
  }

  function handleToggle() {
    const video = videoRef.current;

    if (!started) {
      setStarted(true);
      setIsPlaying(true);
      scheduleHide();
      return;
    }

    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
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
      <div
        onMouseMove={handleMouseMove}
        className={cn(
          "group relative aspect-[16/9.1] w-full max-w-[clamp(22rem,82vw,66rem)] overflow-hidden",
          "rounded-2xl sm:rounded-[1.75rem]",
          "bg-[#0b0d13]",
        )}
      >
        {started ? (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            autoPlay
            playsInline
            onPlay={() => {
              setIsPlaying(true);
              scheduleHide();
            }}
            onPause={() => {
              setIsPlaying(false);
              setControlsVisible(true);
              clearHideTimeout();
            }}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Image
            src={VIDEO_POSTER_SRC}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 76rem"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            priority={false}
          />
        )}

        <button
          type="button"
          aria-label={started && isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
          onClick={handleToggle}
          className={cn(
            "absolute inset-0 flex size-full items-center justify-center outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        >
          <span
            className={cn(
              toggleButtonIconClass,
              started && isPlaying && !controlsVisible ? "opacity-0" : "opacity-100",
            )}
          >
            {started && isPlaying ? (
              <Pause
                className="size-6 text-white sm:size-7"
                strokeWidth={1.75}
              />
            ) : (
              <Play
                className="size-6 translate-x-0.5 text-white sm:size-7"
                strokeWidth={1.75}
              />
            )}
          </span>
        </button>
      </div>
    </section>
  );
}
