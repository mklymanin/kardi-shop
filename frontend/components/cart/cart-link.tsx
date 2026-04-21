"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

export function CartLink({ className }: { className?: string }) {
  const { totalItems } = useCart();
  const reduce = useReducedMotion();

  return (
    <Link
      href="/cart"
      aria-label="Корзина"
      className={cn(
        "relative inline-flex items-center justify-center rounded-full p-2 text-white transition hover:text-white",
        className
      )}
    >
      <p className="font-nav text-sm">Корзина</p>
      <AnimatePresence initial={false}>
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            transition={{
              type: "spring",
              stiffness: 520,
              damping: 24,
              mass: 0.5,
            }}
            className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[10px] leading-none font-bold text-[#63567A] shadow-sm"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
