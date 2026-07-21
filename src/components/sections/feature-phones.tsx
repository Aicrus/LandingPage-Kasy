"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PhoneCopy = {
  title: string;
  description: string;
};

type PhoneMeta = {
  key: string;
  video: string;
};

const PHONES_META: PhoneMeta[] = [
  {
    key: "drive",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/a2787388-4456-4446-88fb-c0de05d10517/play_720p.mp4",
  },
  {
    key: "paywall",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/45b7d167-c2df-4537-9dbf-9bf57744b875/play_720p.mp4",
  },
  {
    key: "supportChat",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/adfa5e78-6f50-4850-853e-5971f6435eeb/play_720p.mp4",
  },
  {
    key: "featureRequests",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/fc7f031f-04a3-47bd-88e9-7c917b87e202/play_720p.mp4",
  },
  {
    key: "kanban",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/5a1557ed-ed95-43e4-b8c3-448f6771aa9a/play_720p.mp4",
  },
  {
    key: "fullReview",
    video:
      "https://vz-fc29a166-b94.b-cdn.net/72a27566-4fa5-4054-879c-e2ca652d0a99/play_720p.mp4",
  },
];

/** Corpo do aparelho na moldura 1080×1920 (sem alterar o PNG). */
const PHONE_BODY_INSET = {
  top: "2.5%",
  right: "9.5%",
  bottom: "2.5%",
  left: "9.5%",
} as const;

const IPHONE_FRAME = "/assets/iphone-frame.png";

function PhoneScreen({ video, title }: { video: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const inViewRef = useRef(false);

  const tryPlay = useCallback(() => {
    const node = videoRef.current;
    if (!node || reducedMotion || !inViewRef.current) return;

    node.defaultMuted = true;
    node.muted = true;
    node.playsInline = true;

    if (node.paused) {
      void node.play().catch(() => {
        /* autoplay bloqueado: tenta de novo no próximo gesto/visibilidade */
      });
    }
  }, [reducedMotion]);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        const node = videoRef.current;
        if (!node) return;

        if (!entry.isIntersecting || reducedMotion) {
          node.pause();
          return;
        }

        tryPlay();
      },
      { rootMargin: "20% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, tryPlay]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", tryPlay);
    window.addEventListener("pointerdown", tryPlay, { once: true });

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", tryPlay);
      window.removeEventListener("pointerdown", tryPlay);
    };
  }, [tryPlay]);

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative mx-auto w-full max-w-[11.5rem] sm:max-w-[13rem] lg:max-w-[14.75rem]",
        "aspect-[1080/1920]",
      )}
    >
      {/* Mesmo tamanho do iPhone; a moldura original recorta a tela. */}
      <div
        className="absolute z-0 overflow-hidden rounded-[14%/7%] bg-black"
        style={{
          top: PHONE_BODY_INSET.top,
          right: PHONE_BODY_INSET.right,
          bottom: PHONE_BODY_INSET.bottom,
          left: PHONE_BODY_INSET.left,
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={title}
          onCanPlay={tryPlay}
          onLoadedData={tryPlay}
          onPlaying={tryPlay}
        />
      </div>

      <Image
        src={IPHONE_FRAME}
        alt=""
        fill
        unoptimized
        sizes="(max-width: 640px) 46vw, (max-width: 1024px) 24vw, 15rem"
        className="pointer-events-none z-10 object-contain drop-shadow-[0_18px_36px_rgba(4,43,89,0.22)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
        aria-hidden
        priority={false}
      />
    </div>
  );
}

export function FeaturePhones() {
  const t = useTranslations("featurePhones");
  const phonesCopy = t.raw("items") as Record<string, PhoneCopy>;
  const phones = PHONES_META.map((meta) => ({
    ...meta,
    ...phonesCopy[meta.key],
  }));

  return (
    <section
      id="feature-phones"
      aria-label={t("ariaLabel")}
      className={cn(
        "mx-auto flex w-full flex-col",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[clamp(2.5rem,5vw,4rem)] pb-[clamp(3rem,6vw,5rem)]",
        "gap-[clamp(2.75rem,5.5vw,4rem)]",
      )}
    >
      <Reveal className="text-center">
        <p className="text-pretty font-rounded text-[0.9375rem] text-muted-foreground sm:text-base">
          {t("monthlyNote")}
        </p>
      </Reveal>

      <div
        className={cn(
          "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10",
          "lg:grid-cols-3 lg:gap-x-8",
          "max-sm:-mx-[clamp(0.25rem,1vw,0.75rem)]",
        )}
      >
        {phones.map((phone, index) => (
          <Reveal key={phone.key} delay={0.04 * index} className="min-w-0">
            <figure className="flex flex-col items-center gap-3.5 sm:gap-4">
              <PhoneScreen video={phone.video} title={phone.title} />
              <figcaption className="w-full max-w-[14.5rem] text-center">
                <h3
                  className={cn(
                    "text-pretty font-heading font-bold text-foreground",
                    "text-[0.9375rem] leading-snug tracking-[-0.01em] sm:text-base",
                  )}
                >
                  {phone.title}
                </h3>
                <p className="mt-1 text-pretty text-[0.8125rem] leading-snug text-muted-foreground sm:text-sm">
                  {phone.description}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
