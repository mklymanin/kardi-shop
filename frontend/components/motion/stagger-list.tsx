"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

type StaggerTag = "div" | "ul" | "ol" | "section";
type StaggerItemTag = "div" | "li" | "article";

type StaggerListProps = {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  as?: StaggerTag;
  stagger?: number;
  delay?: number;
};

export function StaggerList({
  children,
  className,
  amount = 0.15,
  as = "div",
  stagger,
  delay,
}: StaggerListProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  const variants: Variants =
    stagger !== undefined || delay !== undefined
      ? {
          hidden: {},
          visible: {
            transition: {
              staggerChildren: stagger ?? 0.06,
              delayChildren: delay ?? 0.05,
            },
          },
        }
      : containerVariants;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: StaggerItemTag;
};

export function StaggerItem({
  children,
  className,
  as = "div",
}: StaggerItemProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
