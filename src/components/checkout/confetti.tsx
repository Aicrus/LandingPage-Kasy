"use client";

import { Check } from "lucide-react";
import { useEffect, useRef } from "react";

import { motion } from "@/lib/motion";

const COLORS = ["#3b9bff", "#7c5cff", "#22c55e", "#f59e0b", "#ec4899", "#e5e7eb"];
const COUNT = 140;
const MAX_MS = 5200;

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  round: boolean;
};

/** Confete em canvas (sem dependência). Respeita "reduzir movimento" e limpa sozinho. */
export function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Duas rajadas, saindo de cima para os lados do centro.
    const pieces: Piece[] = Array.from({ length: COUNT }, (_, i) => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.5,
      y: -20 - Math.random() * h * 0.35,
      vx: (Math.random() - 0.5) * 6 + (i % 2 ? 1.5 : -1.5),
      vy: 1.5 + Math.random() * 3.5,
      size: 6 + Math.random() * 7,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[i % COLORS.length],
      round: Math.random() < 0.25,
    }));

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of pieces) {
        p.vy += 0.07;
        p.vx *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y < h + 30) alive += 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - Math.max(0, elapsed - 3800) / (MAX_MS - 3800));
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, (p.size * 2) / 3);
        }
        ctx.restore();
      }
      if (alive > 0 && elapsed < MAX_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}

/** Selo de "pago": o check entra com uma mola. */
export function SuccessBadge() {
  return (
    <motion.span
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
      className="mb-5 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_28px_-8px_var(--primary)]"
    >
      <Check className="size-7" strokeWidth={3} />
    </motion.span>
  );
}
