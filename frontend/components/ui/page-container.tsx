import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../lib/cn";

type PageContainerSize = "sm" | "md" | "lg";

type PageContainerProps = PropsWithChildren<
  {
    size?: PageContainerSize;
  } & HTMLAttributes<HTMLDivElement>
>;

export function PageContainer({ children, size = "md", className, ...rest }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6",
        size === "sm" && "max-w-4xl py-10 md:py-12",
        size === "md" && "max-w-5xl py-10 md:py-12",
        size === "lg" && "max-w-6xl py-8 md:py-10",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

