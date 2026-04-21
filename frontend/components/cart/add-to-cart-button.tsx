"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/site-data";

const LABEL_TRANSITION = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

function IdleLabel({ compact }: { compact: boolean }) {
  return (
    <>
      <ShoppingCart
        strokeWidth={2}
        className={compact ? undefined : "size-5"}
      />
      {compact ? "В корзину" : "Добавить в корзину"}
    </>
  );
}

function DoneLabel({ compact }: { compact: boolean }) {
  return (
    <>
      <Check strokeWidth={2.5} className={compact ? undefined : "size-5"} />
      {compact ? "Готово" : "Добавлено в корзину"}
    </>
  );
}

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const reduce = useReducedMotion();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      className={cn(
        compact
          ? "h-9 rounded-xl px-3 text-xs"
          : "mt-6 h-11 w-full rounded-xl text-base"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={added ? "done" : "idle"}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 3 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -3 }}
          transition={LABEL_TRANSITION}
          className="inline-flex items-center gap-1.5"
        >
          {added ? (
            <DoneLabel compact={compact} />
          ) : (
            <IdleLabel compact={compact} />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
