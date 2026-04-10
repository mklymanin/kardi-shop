import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("max-w-site mx-auto w-full px-6", className)} {...props}>
      {children}
    </div>
  );
}
