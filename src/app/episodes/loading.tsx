import { Skeleton } from "@/components/ui/skeleton";
import { EpisodeListSkeleton } from "@/components/episodes/episode-card";

export default function Loading() {
  return (
    <>
      <div className="mb-5 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-40" />
      </div>
      <Skeleton className="mb-6 h-[88px] rounded-card" />
      <EpisodeListSkeleton count={12} />
    </>
  );
}
