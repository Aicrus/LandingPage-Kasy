export {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
  LazyMotion,
  domAnimation,
} from "motion/react";

export type { Transition, Variants } from "motion/react";

import type { Transition, Variants } from "motion/react";

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const smoothTransition: Transition = {
  type: "tween",
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};
