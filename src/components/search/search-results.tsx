import Link from "next/link";
import type { ReactNode } from "react";
import { api } from "@/lib/api";
import { plural } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { CharacterGrid, CharacterGridSkeleton } from "@/components/characters/character-grid";
import { EpisodeList } from "@/components/episodes/episode-card";
import { LocationList } from "@/components/locations/location-card";

function Group({
  title,
  total,
  shown,
  allHref,
  noun,
  children,
}: {
  title: string;
  total: number;
  shown: number;
  allHref: string;
  noun: [string, string, string];
  children: ReactNode;
}) {
  if (total === 0) return null;
  return (
    <section className="mt-12">
      <SectionHeading
        title={title}
        aside={
          total > shown ? (
            <Link href={allHref} className="text-accent underline underline-offset-4">
              Все {plural(total, ...noun)} →
            </Link>
          ) : (
            plural(total, ...noun)
          )
        }
      />
      {children}
    </section>
  );
}

export async function SearchResults({ query }: { query: string }) {
  const r = await api.search(query);
  const total = r.characters.total + r.episodes.total + r.locations.total;
  const q = encodeURIComponent(query);

  if (total === 0) {
    return (
      <div className="mt-12">
        <EmptyState
          title={`По запросу «${query}» ничего нет`}
          hint="Поиск идёт по названиям на английском: попробуйте «Rick», «Pilot» или «Citadel»."
        />
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <p className="mt-8 font-mono text-xs text-muted">
        Найдено {plural(total, "запись", "записи", "записей")} по запросу «{query}»
      </p>
      <Group
        title="Персонажи"
        total={r.characters.total}
        shown={r.characters.items.length}
        allHref={`/characters?name=${q}`}
        noun={["персонаж", "персонажа", "персонажей"]}
      >
        <CharacterGrid items={r.characters.items} />
      </Group>
      <Group
        title="Эпизоды"
        total={r.episodes.total}
        shown={r.episodes.items.length}
        allHref={`/episodes?name=${q}`}
        noun={["эпизод", "эпизода", "эпизодов"]}
      >
        <EpisodeList items={r.episodes.items} />
      </Group>
      <Group
        title="Локации"
        total={r.locations.total}
        shown={r.locations.items.length}
        allHref={`/locations?name=${q}`}
        noun={["локация", "локации", "локаций"]}
      >
        <LocationList items={r.locations.items} />
      </Group>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="mt-8" aria-busy="true">
      <Skeleton className="h-3 w-56" />
      <div className="mt-12 mb-5">
        <Skeleton className="h-7 w-36" />
      </div>
      <CharacterGridSkeleton count={4} />
    </div>
  );
}
