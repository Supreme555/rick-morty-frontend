import type { CharacterSummary } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CharacterCard } from "./character-card";

const grid = "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

export function CharacterGrid({ items }: { items: CharacterSummary[] }) {
  return (
    <ul className={grid}>
      {items.map((c) => (
        <li key={c.id}>
          <CharacterCard character={c} />
        </li>
      ))}
    </ul>
  );
}

export function CharacterCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-panel">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2.5 p-3.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function CharacterGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={grid} aria-busy="true" aria-label="Загрузка персонажей">
      {Array.from({ length: count }, (_, i) => (
        <CharacterCardSkeleton key={i} />
      ))}
    </div>
  );
}
