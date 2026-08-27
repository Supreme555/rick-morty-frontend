import type { Metadata } from "next";
import { api } from "@/lib/api";
import { pageParam, param, plural, type SearchParams } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { LocationFilters } from "@/components/locations/location-filters";
import { LocationList } from "@/components/locations/location-card";

export const metadata: Metadata = { title: "Локации" };

export default async function LocationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const filters = { name: param(sp, "name"), type: param(sp, "type"), dimension: param(sp, "dimension") };
  const page = pageParam(sp);
  const data = await api.locations.list({ ...filters, page });

  return (
    <>
      <SectionHeading
        eyebrow="Каталог"
        title="Локации"
        aside={data.total > 0 ? plural(data.total, "локация", "локации", "локаций") : undefined}
      />
      <LocationFilters values={filters} />
      {data.items.length > 0 ? (
        <LocationList items={data.items} />
      ) : (
        <EmptyState
          title="Локаций не нашли"
          hint={page > 1 ? "Такой страницы нет." : "Попробуйте другое название, тип или измерение."}
          resetHref="/locations"
        />
      )}
      <Pagination data={data} basePath="/locations" params={filters} />
    </>
  );
}
