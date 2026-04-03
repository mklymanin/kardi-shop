import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import Link from "next/link";

import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-pine text-white",
        variant === "secondary" && "border-pine/20 text-pine border",
        variant === "outline" && "border-border-strong text-ink border",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-5 py-3 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = BaseProps & {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition",
        variant === "primary" && "bg-pine text-white",
        variant === "secondary" && "border-pine/20 text-pine border",
        variant === "outline" && "border-border-strong text-ink border",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-5 py-3 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </Link>
  );
}
