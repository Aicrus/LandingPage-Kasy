"use client";

import { LazyMotion, domAnimation } from "@/lib/motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
