"use client";

import * as React from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

const DEFAULT_TRANSITION: Transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

type FadeInSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  y?: number;
  x?: number;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer";
};

export function FadeInSection({
  children,
  className,
  delay = 0,
  amount = 0.2,
  y = 12,
  x = 0,
  as = "div",
}: FadeInSectionProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ ...DEFAULT_TRANSITION, delay }}
    >
      {children}
    </MotionTag>
  );
}
