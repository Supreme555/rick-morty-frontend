import { Suspense } from "react";
import { api } from "@/lib/api";
import { param, type SearchParams } from "@/lib/utils";
import { SearchBar } from "@/components/search/search-bar";
import { SearchResults, SearchResultsSkeleton } from "@/components/search/search-results";
import { CatalogLinks } from "@/components/search/catalog-links";
import { SectionHeading } from "@/components/ui/section-heading";
import { CharacterGrid, CharacterGridSkeleton } from "@/components/characters/character-grid";
import { HeroSceneLazy } from "@/components/three/hero-scene-lazy";

async function Popular() {
  const data = await api.characters.list({ page: 1 });
  return <CharacterGrid items={data.items.slice(0, 8)} />;
}

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const q = param(await searchParams, "q").trim();

  return (
    <>
      <section className="grid items-center gap-8 pt-6 pb-2 sm:pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Межпространственный поиск</p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.1] sm:text-5xl">
            Найти кого угодно <span className="text-accent">в любом</span> измерении
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted sm:text-base">
            Персонажи, эпизоды и локации «Рика и Морти» в одной базе. Начните вводить имя или название — результаты
            появятся по мере ввода.
          </p>
          <div className="mt-8">
            <SearchBar initialQuery={q} />
          </div>
        </div>
        {!q && <HeroSceneLazy />}
      </section>

      {q ? (
        <Suspense key={q} fallback={<SearchResultsSkeleton />}>
          <SearchResults query={q} />
        </Suspense>
      ) : (
        <>
          <section className="mt-12">
            <CatalogLinks />
          </section>
          <section className="mt-14">
            <SectionHeading eyebrow="С чего начать" title="Главные герои" />
            <Suspense fallback={<CharacterGridSkeleton count={8} />}>
              <Popular />
            </Suspense>
          </section>
        </>
      )}
    </>
  );
}
