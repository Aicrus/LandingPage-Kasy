"use client";

import {
  motion,
  blurIn,
  blurRevealTransition,
  fadeIn,
  smoothTransition,
  useReducedMotion,
  type Variants,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const motionTags = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  p: motion.p,
  span: motion.span,
} as const;

type BlurRevealTag = keyof typeof motionTags;

type BlurRevealProps = {
  as?: BlurRevealTag;
  delay?: number;
  variants?: Variants;
} & ComponentProps<typeof motion.div>;

export function BlurReveal({
  as = "div",
  children,
  className,
  delay = 0,
  variants,
  transition,
  ...props
}: BlurRevealProps) {
  const reducedMotion = useReducedMotion();
  const Component = motionTags[as];
  const activeVariants = reducedMotion ? fadeIn : (variants ?? blurIn);

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={activeVariants}
      transition={{
        ...(reducedMotion ? smoothTransition : blurRevealTransition),
        delay,
        ...transition,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
