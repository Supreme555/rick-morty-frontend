import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pt-6 sm:pt-12">
      <Skeleton className="h-3 w-48" />
      <Skeleton className="mt-4 h-12 w-2/3" />
      <Skeleton className="mt-4 h-4 w-1/2" />
      <Skeleton className="mt-8 h-14 rounded-full sm:h-16" />
    </div>
  );
}
