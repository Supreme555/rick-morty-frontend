import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export interface EpisodeFilterValues {
  name: string;
  episode: string;
}

export function EpisodeFilters({ values }: { values: EpisodeFilterValues }) {
  const active = Object.values(values).some(Boolean);
  return (
    <form
      key={JSON.stringify(values)}
      action="/episodes"
      method="get"
      className="mb-6 grid gap-3 rounded-card border border-line bg-panel p-4 sm:grid-cols-[1.6fr_1fr_auto] sm:items-end"
    >
      <Field label="Название" htmlFor="f-name">
        <Input id="f-name" name="name" defaultValue={values.name} maxLength={100} placeholder="Pilot, Rixty Minutes…" />
      </Field>
      <Field label="Код эпизода" htmlFor="f-episode">
        <Input id="f-episode" name="episode" defaultValue={values.episode} maxLength={20} placeholder="S01E01 или S03" className="font-mono" />
      </Field>
      <div className="flex items-center gap-2">
        <Button type="submit">Применить</Button>
        {active && (
          <Link href="/episodes" className="text-sm text-muted underline underline-offset-4 hover:text-fg">
            Сбросить
          </Link>
        )}
      </div>
    </form>
  );
}
