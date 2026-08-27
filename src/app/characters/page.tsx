import type { Metadata } from "next";
import { api } from "@/lib/api";
import { pageParam, param, plural, type SearchParams } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { CharacterFilters } from "@/components/characters/character-filters";
import { CharacterGrid } from "@/components/characters/character-grid";

export const metadata: Metadata = { title: "Персонажи" };

export default async function CharactersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const filters = {
    name: param(sp, "name"),
    status: param(sp, "status"),
    gender: param(sp, "gender"),
    species: param(sp, "species"),
  };
  const page = pageParam(sp);
  const data = await api.characters.list({ ...filters, page });

  return (
    <>
      <SectionHeading
        eyebrow="Каталог"
        title="Персонажи"
        aside={data.total > 0 ? plural(data.total, "запись", "записи", "записей") : undefined}
      />
      <CharacterFilters values={filters} />
      {data.items.length > 0 ? (
        <CharacterGrid items={data.items} />
      ) : (
        <EmptyState
          title="Никого не нашли"
          hint={page > 1 ? "Такой страницы нет." : "Попробуйте другое имя или снимите часть фильтров."}
          resetHref="/characters"
        />
      )}
      <Pagination data={data} basePath="/characters" params={filters} />
    </>
  );
}
