import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";

export interface CharacterFilterValues {
  name: string;
  status: string;
  gender: string;
  species: string;
}

const STATUSES = [
  ["", "Любой"],
  ["alive", "Жив"],
  ["dead", "Мёртв"],
  ["unknown", "Неизвестно"],
] as const;

const GENDERS = [
  ["", "Любой"],
  ["female", "Женский"],
  ["male", "Мужской"],
  ["genderless", "Бесполый"],
  ["unknown", "Неизвестно"],
] as const;

/** Plain GET form: works without JS, state lives in the URL. */
export function CharacterFilters({ values }: { values: CharacterFilterValues }) {
  const active = Object.values(values).some(Boolean);
  return (
    <form
      key={JSON.stringify(values)}
      action="/characters"
      method="get"
      className="mb-6 grid gap-3 rounded-card border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end"
    >
      <Field label="Имя" htmlFor="f-name">
        <Input id="f-name" name="name" defaultValue={values.name} maxLength={100} placeholder="Rick, Morty, Birdperson…" />
      </Field>
      <Field label="Статус" htmlFor="f-status">
        <Select id="f-status" name="status" defaultValue={values.status}>
          {STATUSES.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Пол" htmlFor="f-gender">
        <Select id="f-gender" name="gender" defaultValue={values.gender}>
          {GENDERS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Вид" htmlFor="f-species">
        <Input id="f-species" name="species" defaultValue={values.species} maxLength={100} placeholder="Human, Alien…" />
      </Field>
      <div className="flex items-center gap-2">
        <Button type="submit">Применить</Button>
        {active && (
          <Link href="/characters" className="text-sm text-muted underline underline-offset-4 hover:text-fg">
            Сбросить
          </Link>
        )}
      </div>
    </form>
  );
}
