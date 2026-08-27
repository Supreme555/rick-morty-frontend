import { Skeleton } from "@/components/ui/skeleton";
import { CharacterGridSkeleton } from "@/components/characters/character-grid";

export default function Loading() {
  return (
    <>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-9 w-1/2" />
      <div className="mt-6 grid grid-cols-3 gap-8 border-t border-line pt-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
      <div className="mt-12 mb-5 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-40" />
      </div>
      <CharacterGridSkeleton count={8} />
    </>
  );
}
