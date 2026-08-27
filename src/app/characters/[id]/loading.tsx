import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr]">
      <Skeleton className="aspect-square rounded-card" />
      <div>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 h-9 w-2/3" />
        <Skeleton className="mt-4 h-4 w-40" />
        <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
