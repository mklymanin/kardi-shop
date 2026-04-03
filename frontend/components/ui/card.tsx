import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../lib/cn";

type CardVariant = "default" | "soft" | "inverted";
type CardPadding = "sm" | "md" | "lg";
type CardRadius = "lg" | "xl";

type CardProps = PropsWithChildren<
  {
    variant?: CardVariant;
    padding?: CardPadding;
    radius?: CardRadius;
  } & HTMLAttributes<HTMLDivElement>
>;

export function Card({
  children,
  variant = "default",
  padding = "md",
  radius = "xl",
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "border",
        radius === "lg" && "rounded-3xl",
        radius === "xl" && "rounded-[30px]",
        variant === "default" && "border-border-subtle bg-surface",
        variant === "soft" && "border-border-subtle bg-surface-soft",
        variant === "inverted" && "border-white/10 bg-surface-strong text-white",
        padding === "sm" && "p-5",
        padding === "md" && "p-6",
        padding === "lg" && "p-8",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

