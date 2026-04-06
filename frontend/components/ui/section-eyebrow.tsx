import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type SectionEyebrowProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function SectionEyebrow({
  children,
  className,
  ...rest
}: SectionEyebrowProps) {
  return (
    <div
      className={cn("text-pine text-sm uppercase tracking-[0.24em]", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
