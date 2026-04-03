import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../lib/cn";

type SectionEyebrowProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function SectionEyebrow({ children, className, ...rest }: SectionEyebrowProps) {
  return (
    <div
      className={cn("text-sm uppercase tracking-[0.24em] text-pine", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

