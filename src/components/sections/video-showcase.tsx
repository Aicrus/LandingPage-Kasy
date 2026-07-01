"use client";

import { Dialog } from "@base-ui/react/dialog";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { useState } from "react";

import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const DESKTOP_MEDIA = "(min-width: 1024px)";

/** Poster do player — arte escura, substituível a qualquer momento. */
const VIDEO_POSTER_SRC =
  "https://framerusercontent.com/images/ONQIsStqeLWeki3a2HBJUTgVIII.png?scale-down-to=2048&width=2088&height=1600";

/** Placeholder — troque pelo ID do vídeo final (YouTube ou qualquer link com embed). */
const YOUTUBE_VIDEO_ID = "aqz-KE-bpKQ";

function buildYoutubeEmbedSrc(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    fs: "0",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

function VideoDialogClose({ isDesktop }: { isDesktop: boolean }) {
  return (
    <Dialog.Close
      aria-label="Fechar vídeo"
      className={cn(
        "absolute z-10 inline-flex size-9 items-center justify-center rounded-full",
        "bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        /* Desktop: flutua fora do frame do vídeo — evita sobrepor os controles nativos do YouTube */
        isDesktop ? "-right-3 -top-3" : "right-3 top-3",
      )}
    >
      <X className="size-4" strokeWidth={2} />
    </Dialog.Close>
  );
}

export function VideoShowcase() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery(DESKTOP_MEDIA);

  return (
    <section
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-features-to-video)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          aria-label="Assistir ao vídeo"
          className={cn(
            "group relative aspect-[16/9.3] w-full overflow-hidden",
            "max-w-[clamp(20rem,78vw,60rem)]",
            "rounded-[1.25rem] sm:rounded-[2rem]",
            "bg-[#0b0d13] outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        >
          <Image
            src={VIDEO_POSTER_SRC}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 76rem"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            priority={false}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />

          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "inline-flex items-center gap-2.5 rounded-full pl-3 pr-5 py-2.5 sm:gap-3 sm:pl-3.5 sm:pr-6 sm:py-3",
                "bg-white/15 backdrop-blur-md ring-1 ring-white/40",
                "shadow-[0_8px_28px_-6px_rgba(0,0,0,0.5)]",
                "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:scale-105 motion-safe:group-active:scale-95",
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white sm:size-10">
                <Play
                  className="size-3.5 translate-x-0.5 fill-[#0b0d13] text-[#0b0d13] sm:size-4"
                  strokeWidth={0}
                />
              </span>
              <span className="font-heading text-sm font-semibold text-white sm:text-base">
                Veja o Kasy em ação
              </span>
            </span>
          </span>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Backdrop
            className={cn(
              "fixed inset-0 z-50 bg-black/35 backdrop-blur-xl",
              "transition-opacity duration-300",
              "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
            )}
          />
          <Dialog.Popup
            className={cn(
              "fixed z-50 bg-black outline-none",
              "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
              isDesktop
                ? cn(
                    "left-1/2 top-1/2 w-[min(85vw,68rem)] -translate-x-1/2 -translate-y-1/2",
                    "aspect-video rounded-2xl shadow-2xl",
                    "data-[starting-style]:scale-95 data-[ending-style]:scale-95",
                  )
                : "inset-0 flex items-center",
            )}
          >
            <VideoDialogClose isDesktop={isDesktop} />
            {open ? (
              <iframe
                key={YOUTUBE_VIDEO_ID}
                src={buildYoutubeEmbedSrc(YOUTUBE_VIDEO_ID)}
                title="Vídeo de demonstração do Kasy"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                className={cn(
                  isDesktop ? "size-full" : "aspect-video w-full",
                )}
              />
            ) : null}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
