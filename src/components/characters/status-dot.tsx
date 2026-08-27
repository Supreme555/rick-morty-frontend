import type { CharacterStatus } from "@/lib/types";
import { cn, STATUS_LABEL } from "@/lib/utils";

const color: Record<CharacterStatus, string> = {
  Alive: "bg-alive dot-alive",
  Dead: "bg-dead",
  unknown: "bg-unknown",
};

export function StatusDot({ status, className }: { status: CharacterStatus; className?: string }) {
  return (
    <span
      role="img"
      aria-label={STATUS_LABEL[status]}
      className={cn("inline-block size-2 shrink-0 rounded-full", color[status], className)}
    />
  );
}
