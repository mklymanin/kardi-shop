"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useCart } from "@/components/cart/cart-provider";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import type { LineType, Product } from "@/lib/site-data";

const LABEL_TRANSITION = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

function IdleLabel({
  compact,
  lineType,
}: {
  compact: boolean;
  lineType: LineType;
}) {
  const verb = lineType === "rent" ? "Аренда" : "В корзину";
  const verbFull =
    lineType === "rent" ? "Аренда в корзину" : "Добавить в корзину";
  return (
    <>
      <ShoppingCart
        strokeWidth={2}
        className={compact ? undefined : "size-5"}
      />
      {compact ? verb : verbFull}
    </>
  );
}

function GoToCartLabel({ compact }: { compact: boolean }) {
  return (
    <>
      <ShoppingCart
        strokeWidth={2}
        className={compact ? undefined : "size-5"}
      />
      Перейти в корзину
    </>
  );
}

export function AddToCartButton({
  product,
  compact = false,
  lineType = "purchase",
  variant = "default",
  className,
}: {
  product: Product;
  compact?: boolean;
  lineType?: LineType;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [goToCart, setGoToCart] = useState(false);
  const addCommittedRef = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setGoToCart(false);
    addCommittedRef.current = false;
  }, [lineType]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (goToCart) {
      router.push("/cart");
      return;
    }
    if (addCommittedRef.current) {
      return;
    }
    addCommittedRef.current = true;
    const ok = addItem(product, 1, lineType);
    if (!ok) {
      addCommittedRef.current = false;
      return;
    }
    setGoToCart(true);
  };

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleClick}
      aria-label={goToCart ? "Перейти в корзину" : undefined}
      className={cn(
        compact
          ? "h-9 rounded-xl px-3 text-xs"
          : "mt-6 h-11 w-full rounded-xl text-base",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={goToCart ? "cart" : "idle"}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 3 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -3 }}
          transition={LABEL_TRANSITION}
          className="inline-flex items-center gap-1.5"
        >
          {goToCart ? (
            <GoToCartLabel compact={compact} />
          ) : (
            <IdleLabel compact={compact} lineType={lineType} />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
