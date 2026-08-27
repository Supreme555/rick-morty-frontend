import type { Metadata } from "next";
import { api } from "@/lib/api";
import { pageParam, param, plural, type SearchParams } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { EpisodeFilters } from "@/components/episodes/episode-filters";
import { EpisodeList } from "@/components/episodes/episode-card";

export const metadata: Metadata = { title: "Эпизоды" };

export default async function EpisodesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const filters = { name: param(sp, "name"), episode: param(sp, "episode") };
  const page = pageParam(sp);
  const data = await api.episodes.list({ ...filters, page });

  return (
    <>
      <SectionHeading
        eyebrow="Каталог"
        title="Эпизоды"
        aside={data.total > 0 ? plural(data.total, "эпизод", "эпизода", "эпизодов") : undefined}
      />
      <EpisodeFilters values={filters} />
      {data.items.length > 0 ? (
        <EpisodeList items={data.items} />
      ) : (
        <EmptyState
          title="Эпизодов не нашли"
          hint={page > 1 ? "Такой страницы нет." : "Проверьте название или код вида S01E01."}
          resetHref="/episodes"
        />
      )}
      <Pagination data={data} basePath="/episodes" params={filters} />
    </>
  );
}
