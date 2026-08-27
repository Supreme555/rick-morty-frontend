import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { EpisodeDetail } from "@/lib/types";
import { plural } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { CharacterGrid } from "@/components/characters/character-grid";

type Props = { params: Promise<{ id: string }> };

async function load(id: string): Promise<EpisodeDetail> {
  if (!/^\d+$/.test(id)) notFound();
  try {
    return await api.episodes.get(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // Same fetch as the page (deduplicated by Next); unknown ids render the not-found UI.
  const e = await load(id);
  try {
    return { title: `${e.episode} — ${e.name}` };
  } catch {
    return { title: "Эпизод" };
  }
}

export default async function EpisodePage({ params }: Props) {
  const { id } = await params;
  const e = await load(id);

  return (
    <article>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Эпизод · {e.episode}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">{e.name}</h1>
      <p className="mt-3 text-sm text-muted">
        В эфире {e.airDate} · {plural(e.characters.length, "персонаж", "персонажа", "персонажей")}
      </p>

      <section className="mt-12">
        <SectionHeading eyebrow="В кадре" title="Персонажи эпизода" />
        <CharacterGrid items={e.characters} />
      </section>
    </article>
  );
}
