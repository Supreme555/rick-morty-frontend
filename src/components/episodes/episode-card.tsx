import Link from "next/link";
import type { EpisodeSummary } from "@/lib/types";
import { plural } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function EpisodeCard({ episode: e }: { episode: EpisodeSummary }) {
  return (
    <Link
      href={`/episodes/${e.id}`}
      className="group flex items-center gap-4 rounded-card border border-line bg-panel px-4 py-3.5 transition-colors hover:border-accent"
    >
      <span className="shrink-0 rounded-md bg-accent-soft px-2 py-1 font-mono text-xs font-medium text-accent">
        {e.episode}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-sm font-semibold">{e.name}</span>
        <span className="mt-0.5 block text-xs text-muted">
          {e.airDate} · {plural(e.characterIds.length, "персонаж", "персонажа", "персонажей")}
        </span>
      </span>
      <span aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent">
        →
      </span>
    </Link>
  );
}

const grid = "grid grid-cols-1 gap-3 md:grid-cols-2";

export function EpisodeList({ items }: { items: EpisodeSummary[] }) {
  return (
    <ul className={grid}>
      {items.map((e) => (
        <li key={e.id}>
          <EpisodeCard episode={e} />
        </li>
      ))}
    </ul>
  );
}

export function EpisodeListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className={grid} aria-busy="true" aria-label="Загрузка эпизодов">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-card border border-line bg-panel px-4 py-3.5">
          <Skeleton className="h-6 w-14" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
