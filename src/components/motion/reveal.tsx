"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  fadeInUp,
  smoothTransition,
  type Variants,
} from "@/lib/motion";
import { useRef, type ComponentProps } from "react";

type RevealProps = ComponentProps<typeof motion.div> & {
  variants?: Variants;
  delay?: number;
  once?: boolean;
};

export function Reveal({
  children,
  variants = fadeInUp,
  delay = 0,
  once = true,
  transition,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={reducedMotion || isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        ...smoothTransition,
        delay,
        ...transition,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
