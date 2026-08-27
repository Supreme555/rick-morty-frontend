import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { LocationDetail } from "@/lib/types";
import { code, plural } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { CharacterGrid } from "@/components/characters/character-grid";

type Props = { params: Promise<{ id: string }> };

async function load(id: string): Promise<LocationDetail> {
  if (!/^\d+$/.test(id)) notFound();
  try {
    return await api.locations.get(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // Same fetch as the page (deduplicated by Next); unknown ids render the not-found UI.
  const l = await load(id);
  try {
    return { title: l.name };
  } catch {
    return { title: "Локация" };
  }
}

export default async function LocationPage({ params }: Props) {
  const { id } = await params;
  const l = await load(id);

  const facts = [
    ["Тип", l.type || "—"],
    ["Измерение", l.dimension || "—"],
    ["Жителей", String(l.residents.length)],
  ] as const;

  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Локация · {code(l.id, 3)}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">{l.name}</h1>

      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line pt-6 text-sm sm:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{label}</dt>
            <dd className="mt-1">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Население"
          title={`Жители (${l.residents.length})`}
          aside={l.residents.length > 0 ? plural(l.residents.length, "персонаж", "персонажа", "персонажей") : undefined}
        />
        {l.residents.length > 0 ? (
          <CharacterGrid items={l.residents} />
        ) : (
          <EmptyState title="Здесь никто не живёт" hint="В базе нет персонажей, привязанных к этой локации." />
        )}
      </section>
    </article>
  );
}
