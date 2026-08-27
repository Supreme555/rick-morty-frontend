import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { api, ApiError } from "@/lib/api";
import type { CharacterDetail } from "@/lib/types";
import { code, GENDER_LABEL, plural, STATUS_LABEL } from "@/lib/utils";
import { StatusDot } from "@/components/characters/status-dot";
import { SectionHeading } from "@/components/ui/section-heading";
import { EpisodeList } from "@/components/episodes/episode-card";
import { AiDescription } from "@/components/ai/ai-description";

type Props = { params: Promise<{ id: string }> };

async function load(id: string): Promise<CharacterDetail> {
  if (!/^\d+$/.test(id)) notFound();
  try {
    return await api.characters.get(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // Same fetch as the page (deduplicated by Next); unknown ids render the not-found UI.
  const c = await load(id);
  try {
    return {
      title: c.name,
      description: `${c.species}, ${STATUS_LABEL[c.status].toLowerCase()} · ${c.location.name}`,
    };
  } catch {
    return { title: "Персонаж" };
  }
}

function RefLink({ name, id }: { name: string; id: number | null }) {
  if (id === null) return <span>{name}</span>;
  return (
    <Link href={`/locations/${id}`} className="underline decoration-line underline-offset-4 hover:text-accent">
      {name}
    </Link>
  );
}

export default async function CharacterPage({ params }: Props) {
  const { id } = await params;
  const c = await load(id);

  const facts: Array<[string, ReactNode]> = [
    ["Вид", c.species],
    ...(c.type ? ([["Тип", c.type]] as Array<[string, ReactNode]>) : []),
    ["Пол", GENDER_LABEL[c.gender]],
    ["Происхождение", <RefLink key="o" {...c.origin} />],
    ["Последняя локация", <RefLink key="l" {...c.location} />],
    ["Появлений", plural(c.episodes.length, "эпизод", "эпизода", "эпизодов")],
  ];

  return (
    <article>
      <div className="grid gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-card border border-line bg-panel-2">
          <Image
            src={c.image}
            alt={c.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 340px"
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Персонаж · {code(c.id)}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">{c.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <StatusDot status={c.status} className="size-2.5" />
            <span className="font-medium">{STATUS_LABEL[c.status]}</span>
            <span className="text-muted">· {c.species}</span>
          </p>

          <dl className="mt-7 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{label}</dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <AiDescription characterId={c.id} name={c.name} />
          </div>
        </div>
      </div>

      <section className="mt-14">
        <SectionHeading eyebrow="Появления" title={`Эпизоды (${c.episodes.length})`} />
        <EpisodeList items={c.episodes} />
      </section>
    </article>
  );
}
