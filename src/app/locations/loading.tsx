import { Skeleton } from "@/components/ui/skeleton";
import { LocationListSkeleton } from "@/components/locations/location-card";

export default function Loading() {
  return (
    <>
      <div className="mb-5 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-40" />
      </div>
      <Skeleton className="mb-6 h-[88px] rounded-card" />
      <LocationListSkeleton count={12} />
    </>
  );
}
