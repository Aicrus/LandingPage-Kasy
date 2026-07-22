"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

import { bunnyEmbedSrc } from "@/lib/bunny-stream";
import { loadPlayerJs, type PlayerJsPlayer } from "@/lib/playerjs";
import { cn } from "@/lib/utils";

export type BunnyEmbedHandle = {
  /** Sai do preview: vídeo do zero com som. */
  play: () => void;
  pause: () => void;
  toggleFullscreen: () => void;
};

type BunnyEmbedProps = {
  videoId: string;
  title: string;
  previewLoop?: boolean;
  interactive?: boolean;
  autoplay?: boolean;
  mute?: boolean;
  className?: string;
  onPlayingChange?: (playing: boolean) => void;
  onUserStarted?: () => void;
};

/**
 * Dois iframes desde o início:
 * - preview (visível): loop mudo
 * - active (por baixo, já carregando): mesmo vídeo mudo, buffer quente
 *
 * No play: seek(0) + unmute no active (já bufferizado).
 * Sem capa/poster, porque o iframe ativo não “nasce” no clique.
 */
export const BunnyEmbed = forwardRef<BunnyEmbedHandle, BunnyEmbedProps>(
  function BunnyEmbed(
    {
      videoId,
      title,
      previewLoop = false,
      interactive = true,
      autoplay = true,
      mute = false,
      className,
      onPlayingChange,
      onUserStarted,
    },
    ref,
  ) {
    const reactId = useId().replace(/:/g, "");
    const baseKey = `kasy-${reactId}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const activeIframeRef = useRef<HTMLIFrameElement>(null);
    const activePlayerRef = useRef<PlayerJsPlayer | null>(null);
    const readyRef = useRef(false);
    const userStartedRef = useRef(false);
    const pendingPlayRef = useRef(false);
    const onPlayingChangeRef = useRef(onPlayingChange);
    const onUserStartedRef = useRef(onUserStarted);
    onPlayingChangeRef.current = onPlayingChange;
    onUserStartedRef.current = onUserStarted;

    const [previewVisible, setPreviewVisible] = useState(Boolean(previewLoop));
    /** Fallback mobile: remonta com som se Player.js ainda não estiver ready no gesto. */
    const [liveUnmuted, setLiveUnmuted] = useState(false);

    const previewSrc = useMemo(
      () =>
        bunnyEmbedSrc(videoId, {
          autoplay: true,
          muted: true,
          loop: true,
          preload: true,
          compactControls: true,
          showSpeed: false,
          playsinline: true,
          rememberPosition: false,
          playerjs: false,
          instanceKey: `${baseKey}-preview`,
        }),
      [baseKey, videoId],
    );

    // Já montado no preview: mudo + preload. No clique só liga o som.
    const activeSrc = useMemo(
      () =>
        bunnyEmbedSrc(videoId, {
          autoplay: true,
          muted: !liveUnmuted,
          loop: true,
          preload: true,
          compactControls: true,
          showSpeed: false,
          playsinline: true,
          rememberPosition: false,
          playerjs: true,
          startAt: liveUnmuted ? "0s" : undefined,
          instanceKey: liveUnmuted ? `${baseKey}-live` : `${baseKey}-active`,
        }),
      [baseKey, liveUnmuted, videoId],
    );

    const startWithSoundRef = useRef(() => {});
    startWithSoundRef.current = () => {
      const player = activePlayerRef.current;
      if (!player || !readyRef.current) {
        // Mesmo gesto do toque: remonta com áudio (iOS não libera unmute depois).
        pendingPlayRef.current = true;
        flushSync(() => {
          setLiveUnmuted(true);
          setPreviewVisible(false);
        });
        userStartedRef.current = true;
        onUserStartedRef.current?.();
        onPlayingChangeRef.current?.(true);
        return;
      }

      const first = !userStartedRef.current;
      userStartedRef.current = true;

      if (first) player.setCurrentTime(0);
      if (player.supports("method", "unmute")) player.unmute();
      player.setVolume(100);
      player.play();
      if (player.supports("method", "unmute")) player.unmute();
      player.setVolume(100);

      if (first) onUserStartedRef.current?.();
      onPlayingChangeRef.current?.(true);

      if (!first) return;

      let revealed = false;
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        setPreviewVisible(false);
      };
      player.on("timeupdate", reveal);
      window.setTimeout(reveal, 600);
    };

    useImperativeHandle(ref, () => ({
      play() {
        startWithSoundRef.current();
      },
      pause() {
        activePlayerRef.current?.pause();
      },
      toggleFullscreen() {
        const el = containerRef.current;
        if (!el) return;

        const doc = document as Document & {
          webkitFullscreenElement?: Element | null;
          webkitExitFullscreen?: () => Promise<void> | void;
        };
        const active =
          document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;

        if (active) {
          if (document.exitFullscreen) void document.exitFullscreen();
          else void doc.webkitExitFullscreen?.();
          return;
        }

        const req =
          el.requestFullscreen?.bind(el) ??
          (
            el as HTMLElement & {
              webkitRequestFullscreen?: () => Promise<void> | void;
            }
          ).webkitRequestFullscreen?.bind(el);

        void req?.();
      },
    }));

    useEffect(() => {
      userStartedRef.current = false;
      pendingPlayRef.current = false;
      setPreviewVisible(Boolean(previewLoop));
      setLiveUnmuted(false);
    }, [videoId, previewLoop]);

    useEffect(() => {
      const iframe = activeIframeRef.current;
      if (!iframe) return;

      let cancelled = false;
      readyRef.current = false;
      activePlayerRef.current = null;

      void loadPlayerJs()
        .then(() => {
          if (cancelled || !window.playerjs?.Player || !activeIframeRef.current) {
            return;
          }

          const player = new window.playerjs.Player(activeIframeRef.current);
          activePlayerRef.current = player;

          player.on("ready", () => {
            if (cancelled) return;
            readyRef.current = true;

            if (liveUnmuted) {
              if (player.supports("method", "unmute")) player.unmute();
              player.setVolume(100);
              player.play();
              onPlayingChangeRef.current?.(true);
              return;
            }

            if (player.supports("method", "mute")) player.mute();

            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              startWithSoundRef.current();
            } else if (!previewLoop && autoplay && !mute) {
              startWithSoundRef.current();
            }
          });

          player.on("play", () => {
            if (cancelled) return;
            if (userStartedRef.current || !previewLoop || liveUnmuted) {
              onPlayingChangeRef.current?.(true);
            }
          });

          player.on("pause", () => {
            if (cancelled) return;
            if (userStartedRef.current || !previewLoop || liveUnmuted) {
              onPlayingChangeRef.current?.(false);
            }
          });

          player.on("ended", () => {
            if (cancelled) return;
            if (userStartedRef.current || !previewLoop || liveUnmuted) {
              onPlayingChangeRef.current?.(false);
            }
          });
        })
        .catch(() => {
          /* embed funciona sem Player.js */
        });

      return () => {
        cancelled = true;
        activePlayerRef.current = null;
        readyRef.current = false;
      };
    }, [activeSrc, autoplay, liveUnmuted, mute, previewLoop]);

    return (
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 overflow-hidden bg-black",
          "transform-gpu [backface-visibility:hidden]",
          className,
        )}
        aria-label={title}
      >
        <iframe
          ref={activeIframeRef}
          src={activeSrc}
          title={title}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className={cn(
            "absolute inset-0 z-0 size-full border-0 bg-black outline-none",
            // Escondido até o play: não mostra capa enquanto esquenta o buffer
            previewVisible && "invisible",
            !previewVisible && "z-[1]",
            !interactive && "pointer-events-none",
          )}
        />

        {previewLoop && previewVisible ? (
          <iframe
            src={previewSrc}
            title={title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="pointer-events-none absolute inset-0 z-[2] size-full border-0 bg-black outline-none"
          />
        ) : null}
      </div>
    );
  },
);
