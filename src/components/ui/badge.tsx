import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-line bg-panel-2 px-2 py-0.5 font-mono text-[11px] tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
