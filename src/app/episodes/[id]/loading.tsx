import { Skeleton } from "@/components/ui/skeleton";
import { CharacterGridSkeleton } from "@/components/characters/character-grid";

export default function Loading() {
  return (
    <>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-9 w-1/2" />
      <Skeleton className="mt-4 h-4 w-64" />
      <div className="mt-12 mb-5 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-52" />
      </div>
      <CharacterGridSkeleton count={8} />
    </>
  );
}
