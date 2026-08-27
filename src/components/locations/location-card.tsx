import Link from "next/link";
import type { LocationSummary } from "@/lib/types";
import { code, plural } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function LocationCard({ location: l }: { location: LocationSummary }) {
  return (
    <Link
      href={`/locations/${l.id}`}
      className="group flex h-full flex-col rounded-card border border-line bg-panel p-4 transition-colors hover:border-accent"
    >
      <span className="font-mono text-[11px] text-muted">{code(l.id, 3)}</span>
      <span className="mt-1.5 font-display text-sm font-semibold leading-snug">{l.name}</span>
      <span className="mt-3 flex flex-wrap gap-1.5">
        <Badge>{l.type || "—"}</Badge>
        <Badge className="max-w-full truncate">{l.dimension || "—"}</Badge>
      </span>
      <span className="mt-auto pt-3 text-xs text-muted">
        {l.residentIds.length > 0 ? plural(l.residentIds.length, "житель", "жителя", "жителей") : "Жителей нет"}
      </span>
    </Link>
  );
}

const grid = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3";

export function LocationList({ items }: { items: LocationSummary[] }) {
  return (
    <ul className={grid}>
      {items.map((l) => (
        <li key={l.id}>
          <LocationCard location={l} />
        </li>
      ))}
    </ul>
  );
}

export function LocationListSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className={grid} aria-busy="true" aria-label="Загрузка локаций">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-card border border-line bg-panel p-4">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="mt-2.5 h-4 w-3/4" />
          <div className="mt-3 flex gap-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="mt-4 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
